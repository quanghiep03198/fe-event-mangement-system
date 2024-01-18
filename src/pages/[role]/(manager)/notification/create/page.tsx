import { Paths } from '@/common/constants/pathnames'
import { EventInterface, NotificationInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   ComboboxFieldControl,
   Editor,
   Form,
   FormDescription,
   FormMessage,
   Icon,
   InputFieldControl,
   Label,
   Switch,
   Typography,
   buttonVariants
} from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { useGetEventsQuery } from '@/redux/apis/event.api'
import { useCreateNotificationMutation } from '@/redux/apis/notification.api'
import { NotificationSchema } from '@/schemas/notification.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addHours, addMinutes, format, formatRelative } from 'date-fns'
import { vi } from 'date-fns/locale'
import _, { debounce } from 'lodash'
import React, { useEffect, useId, useMemo, useState } from 'react'
import { Path, PathValue, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import ScheduleFormDialog from '../components/schedule-form-dialog'
import { useAppSelector } from '@/redux/hook'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'

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
   const selectedEvent = useWatch({ name: 'event_id', control: form.control })
   const { data: events } = useGetEventsQuery({ page: 1, limit: 10, search: eventSearchTerm }, { refetchOnMountOrArgChange: true })

   const defaultEventOptions = useMemo(() => {
      const data = events as Pagination<EventInterface>
      return Array.isArray(data?.docs) ? data.docs.map((item) => ({ label: item.name, value: String(item.id) as PathValue<FormValue, Path<FormValue>> })) : []
   }, [events])

   const handleCreateNotification = (data: FormValue) => {
      toast.promise(
         createNotification({
            ...data,
            time_send: timeSend ?? format(addMinutes(new Date(), 5), 'yyyy-MM-dd HH:mm:ss')
         } as unknown as Omit<NotificationInterface, 'id'>).unwrap(),
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
            <Form {...form}>
               <form
                  className='grid grid-cols-2 items-stretch gap-y-10 sm:grid-cols-1 lg:gap-x-4 xl:gap-x-6'
                  onSubmit={form.handleSubmit(handleCreateNotification)}
               >
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
                        description='Thông báo sẽ được gửi đến tất cả thành viên tham gia sự kiện'
                     />
                  </Box>
                  {/* Time send */}
                  <Box className='col-span-full flex justify-between rounded-lg border p-4'>
                     <Box className='space-y-2'>
                        <Label htmlFor='schedule-switch'>Nhắc hẹn</Label>
                        <FormDescription>Thông báo sẽ được gửi với thời gian đã đặt</FormDescription>
                     </Box>
                     <Tooltip content={_.capitalize(formatRelative(new Date(timeSend!), new Date(), { locale: vi }))} hidden={!timeSend}>
                        <Switch id='schedule-switch' checked={Boolean(timeSend)} onCheckedChange={handleToggleSetSchedule} />
                     </Tooltip>
                  </Box>
                  {/* Content */}
                  <Box className='col-span-full space-y-2'>
                     <EditorFieldControl form={form} name='content' label='Nội dung' />
                  </Box>
                  <Button id={id} type='submit' disabled={isLoading} className='hidden w-fit gap-x-2 sm:inline-flex sm:w-full'>
                     <Icon name='BellPlus' /> Tạo thông báo
                  </Button>
               </form>
            </Form>
         </Box>
         {/*  */}
         <ScheduleFormDialog
            openState={scheduleDialogOpen}
            onOpenStateChange={setScheduleDialogOpen}
            onValueChange={setTimeSend}
            timeEnd={(events as Pagination<EventInterface>)?.docs?.find(({ id }) => id === +selectedEvent)?.end_time as string}
         />
      </>
   )
}

export default CreateNotificationPage
