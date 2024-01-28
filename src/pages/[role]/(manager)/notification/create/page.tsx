import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { EventInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   ComboboxFieldControl,
   FormDescription,
   Form as FormProvider,
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
   Icon,
   InputFieldControl,
   Label,
   Switch,
   Typography,
   buttonVariants
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import Tooltip from '@/components/ui/@override/tooltip'
import { useGetEventDetailsQuery, useGetEventsQuery } from '@/redux/apis/event.api'
import { useCreateNotificationMutation } from '@/redux/apis/notification.api'
import { NotificationSchema } from '@/schemas/notification.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, addMinutes, format, formatRelative } from 'date-fns'
import { vi } from 'date-fns/locale'
import _, { debounce } from 'lodash'
import React, { useId, useMemo, useState } from 'react'
import { Path, PathValue, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import ScheduleFormDialog from '../components/schedule-form-dialog'

type FormValue = z.infer<typeof NotificationSchema>

const CreateNotificationPage: React.FunctionComponent = () => {
   const form = useForm<FormValue>({ resolver: zodResolver(NotificationSchema) })
   const id = useId()
   const navigate = useNavigate()
   // States declaration
   const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false)
   const [timeSend, setTimeSend] = useState<string | null>(null)
   const [eventSearchTerm, setEventSearchTerm] = useState<string>('')
   const [createNotification, { isLoading }] = useCreateNotificationMutation()
   const selectedEventId = useWatch({ name: 'event_id', control: form.control })
   const { data: selectedEvent } = useGetEventDetailsQuery(String(selectedEventId), { skip: !selectedEventId })
   const { data: events } = useGetEventsQuery(
      { page: 1, limit: 10, search: eventSearchTerm },
      {
         selectFromResult: ({ data }) => {
            const responseData = data as Pagination<EventInterface>
            return { data: responseData?.docs ?? [] }
         }
      }
   )

   const defaultEventOptions = useMemo(() => {
      return Array.isArray(events) ? events.map((item) => ({ label: item.name, value: String(item.id) as PathValue<FormValue, Path<FormValue>> })) : []
   }, [events])

   const maxTimeSendValue = useMemo(() => {
      const maxValue = Array.isArray(events) ? events?.find(({ id }) => id === +selectedEventId)?.end_time : new Date()
      return addDays(maxValue, 1)
   }, [selectedEventId])

   const handleCreateNotification = (data: FormValue) => {
      toast.promise(
         createNotification({
            ...data,
            status: selectedEvent.status,
            time_send: timeSend ?? format(addMinutes(new Date(), 5), 'yyyy-MM-dd HH:mm:ss')
         }).unwrap(),
         {
            loading: 'Đang tạo thông báo ...',
            success: () => {
               navigate(Paths.NOTIFICATION_LIST)
               return 'Tạo thông báo thành công'
            },
            error: 'Tạo thông báo thất bại'
         }
      )
   }

   const handleToggleSetSchedule = (checked: boolean) => {
      if (checked) setScheduleDialogOpen(true)
      else setTimeSend(null)
   }

   return (
      <>
         <Box className='max-w-4xl space-y-10'>
            <Box className='flex items-start justify-between border-b pb-4'>
               <Box className='space-y-1'>
                  <Typography variant='h6'>Tạo thông báo</Typography>
                  <Typography variant='small' color='muted'>
                     Nhập các thông tin phía dưới để tạo thông báo
                  </Typography>
               </Box>
               <Label
                  htmlFor={id}
                  className={cn(buttonVariants({ variant: 'default', size: 'sm', className: 'gap-x-2 sm:hidden' }), {
                     'pointer-events-none opacity-50': isLoading
                  })}
               >
                  <Icon name='BellPlus' /> Tạo thông báo
               </Label>
            </Box>
            <FormProvider {...form}>
               <Form onSubmit={form.handleSubmit(handleCreateNotification)}>
                  {/* Subject */}
                  <Box className='sm:cols-span-full col-span-1 md:col-span-full'>
                     <InputFieldControl
                        name='title'
                        control={form.control}
                        label='Tiêu đề'
                        placeholder='Tiêu đề ...'
                        description='Tiêu đề hiển thị thông báo'
                     />
                  </Box>
                  {/* Event */}
                  <Box className='sm:cols-span-full col-span-1 md:col-span-full'>
                     <ComboboxFieldControl
                        name='event_id'
                        form={form}
                        control={form.control}
                        label='Sự kiện'
                        placeholder='Chọn sự kiện ...'
                        onInput={debounce((value) => setEventSearchTerm(value), 500)}
                        options={defaultEventOptions}
                        description={!selectedEventId && 'Thông báo sẽ được gửi đến tất cả thành viên tham gia sự kiện'}
                     />
                     {selectedEventId && (
                        <HoverCard openDelay={2} closeDelay={2}>
                           <HoverCardTrigger asChild>
                              <Button variant='link' size='sm' className='h-fit w-fit gap-x-2 p-0 text-[0.8rem] text-muted-foreground'>
                                 Thông tin sự kiện đã chọn
                              </Button>
                           </HoverCardTrigger>
                           <HoverCardContent align='start' className='max-w-[16rem] space-y-2'>
                              <Box className='inline-flex items-center gap-x-2'>
                                 <Icon name='CalendarDays' className='basis-4' />
                                 <Typography variant='small' className='whitespace-nowrap text-xs font-semibold'>
                                    {format(selectedEvent?.start_time ?? new Date(), 'dd/MM/yyyy')} -{' '}
                                    {format(selectedEvent?.end_time ?? new Date(), 'dd/MM/yyyy')}{' '}
                                 </Typography>
                              </Box>
                              <Box className='inline-flex items-center gap-x-2'>
                                 <Icon name='Users' className='basis-4' />

                                 <Typography variant='small' className='text-xs'>
                                    {Intl.NumberFormat().format(selectedEvent?.attendances?.length ?? 0)} thành viên
                                 </Typography>
                              </Box>
                              <Box className='flex items-center gap-x-2 text-xs'>
                                 <Box className='flex basis-4 items-center justify-center'>
                                    <Box
                                       className={cn('aspect-square h-2 w-2 rounded-full bg-success ring-2 ring-border', {
                                          'bg-success': selectedEvent?.status === EventStatus.ACTIVE,
                                          'bg-yellow-500': selectedEvent?.status === EventStatus.UPCOMING,
                                          'bg-destructive': selectedEvent?.status === EventStatus.INACTIVE
                                       })}
                                    />
                                 </Box>
                                 {EventStatusValues.get(selectedEvent?.status ?? 2)}
                              </Box>
                           </HoverCardContent>
                        </HoverCard>
                     )}
                  </Box>
                  {/* Time send */}
                  <Box className='col-span-full flex justify-between rounded-lg border p-4'>
                     <Box className='space-y-2'>
                        <Label htmlFor='schedule-switch'>Nhắc hẹn</Label>
                        <FormDescription>Thông báo sẽ được gửi với thời gian đã đặt</FormDescription>
                     </Box>
                     <Tooltip content={_.capitalize(formatRelative(new Date(timeSend!), new Date(), { locale: vi }))} hidden={!timeSend}>
                        <Switch id='schedule-switch' disabled={!selectedEventId} checked={Boolean(timeSend)} onCheckedChange={handleToggleSetSchedule} />
                     </Tooltip>
                  </Box>

                  {/* Content */}
                  <Box className='col-span-full space-y-2'>
                     <EditorFieldControl form={form} name='content' label='Nội dung' />
                  </Box>
                  <Button id={id} type='submit' disabled={isLoading} className='hidden w-fit gap-x-2 sm:inline-flex sm:w-full'>
                     <Icon name='BellPlus' /> Tạo thông báo
                  </Button>
               </Form>
            </FormProvider>
         </Box>
         {/*  */}
         <ScheduleFormDialog openState={scheduleDialogOpen} onOpenStateChange={setScheduleDialogOpen} onValueChange={setTimeSend} maxValue={maxTimeSendValue} />
      </>
   )
}

const Form = tw.form`grid grid-cols-2 items-stretch gap-y-10 sm:grid-cols-1 lg:gap-x-4 xl:gap-x-6`

export default CreateNotificationPage
