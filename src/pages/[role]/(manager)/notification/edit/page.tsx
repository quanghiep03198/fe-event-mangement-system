import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatRelative, isEqual } from 'date-fns'
import { vi } from 'date-fns/locale'
import _ from 'lodash'
import { Path, PathValue, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Paths } from '@/common/constants/pathnames'
import { EventInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   ComboboxFieldControl,
   Form,
   FormDescription,
   FormItem,
   Icon,
   InputFieldControl,
   Label,
   Switch,
   Typography,
   buttonVariants
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import { useGetEventsQuery } from '@/redux/apis/event.api'
import { useEditNotificationMutation, useGetNotificationDetailsQuery } from '@/redux/apis/notification.api'
import { NotificationSchema } from '@/schemas/notification.schema'
import ScheduleFormDialog from '../components/schedule-form-dialog'

type FormValue = z.infer<typeof NotificationSchema>

const EditNotificationPage: React.FunctionComponent = () => {
   const form = useForm<FormValue>({ resolver: zodResolver(NotificationSchema) })
   const { id: notificationId } = useParams()
   const navigate = useNavigate()
   // State declaration
   const [scheduleDialogOpen, setScheduleDialogOpen] = useState<boolean>(false)
   const [timeSend, setTimeSend] = useState<string | null>(null)
   const [eventSearchTerm, setEventSearchTerm] = useState<string>('')
   // Fetching data
   const { data: events } = useGetEventsQuery({ pagination: false, limit: 5, search: eventSearchTerm })
   const [editNotification, { isLoading }] = useEditNotificationMutation()
   const { data: notificationDetails } = useGetNotificationDetailsQuery(notificationId!)

   const defaultEventOptions = useMemo(() => {
      const data = events as EventInterface[]
      return Array.isArray(data) ? data.map((item) => ({ label: item.name, value: item.id as PathValue<FormValue, Path<FormValue>> })) : []
   }, [events])

   useEffect(() => {
      if (notificationDetails) {
         form.reset({
            title: notificationDetails.title,
            content: notificationDetails.content,
            event_id: notificationDetails.event_id
         })
         setTimeSend(notificationDetails?.time_send as string)
      }
   }, [notificationDetails])

   const handleEditNotification = (data: FormValue) => {
      // If time to send notification already existed, does not update it, otherwise, update new time to send notification
      data.time_send = isEqual(new Date(timeSend), new Date(notificationDetails?.time_send)) ? undefined : timeSend

      toast.promise(
         editNotification({
            id: notificationId!,
            payload: data
         }).unwrap(),
         {
            loading: 'Đang cập nhật thông báo ...',
            success: () => {
               navigate(Paths.NOTIFICATION_LIST)
               return 'Cập nhật thông báo thành công'
            },
            error: (error) => {
               console.error(error)
               return 'Cập nhật thất bại'
            }
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
                  <Typography variant='h6'>Cập nhật thông báo</Typography>
                  <Typography variant='small' color='muted'>
                     Nhập các thông tin phía dưới để cập nhật thông báo
                  </Typography>
               </Box>
               <Label
                  htmlFor='submit'
                  className={cn(buttonVariants({ variant: 'default', size: 'sm', className: 'gap-x-2 sm:hidden' }), {
                     'pointer-events-none opacity-50': isLoading
                  })}
               >
                  <Icon name='CheckCircle' /> Lưu
               </Label>
            </Box>
            <Form {...form}>
               <form
                  className='grid grid-cols-2 items-stretch gap-y-10 sm:grid-cols-1 lg:gap-x-4 xl:gap-x-6'
                  onSubmit={form.handleSubmit(handleEditNotification)}
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
                        options={defaultEventOptions}
                        onInput={_.debounce((value) => setEventSearchTerm(value), 500)}
                        description='Thông báo sẽ được gửi đến tất cả thành viên tham gia sự kiện'
                     />
                  </Box>
                  {/* Time send */}
                  <Box className='col-span-full flex justify-between rounded-lg border p-4'>
                     <FormItem className='space-y-1'>
                        <Label htmlFor='schedule-switch'>Nhắc hẹn</Label>
                        <FormDescription>Thông báo sẽ được gửi với thời gian đã đặt</FormDescription>
                     </FormItem>
                     <Box className='flex flex-col items-end gap-y-1'>
                        <Switch id='schedule-switch' checked={Boolean(timeSend)} onCheckedChange={handleToggleSetSchedule} />
                        {timeSend && (
                           <FormDescription className='text-foreground'>
                              {_.capitalize(formatRelative(new Date(timeSend!), new Date(), { locale: vi }))}
                           </FormDescription>
                        )}
                     </Box>
                  </Box>
                  {/* Content */}
                  <Box className='col-span-full'>
                     <EditorFieldControl defaultValue={notificationDetails?.content} form={form} name='content' label='Nội dung' />
                  </Box>
                  <Button id='submit' type='submit' disabled={isLoading} className='hidden w-fit gap-x-2 sm:inline-flex sm:w-full'>
                     <Icon name='BellPlus' /> Tạo thông báo
                  </Button>
               </form>
            </Form>
         </Box>
         {/* Schedule form dialog */}
         <ScheduleFormDialog
            openState={scheduleDialogOpen}
            onOpenStateChange={setScheduleDialogOpen}
            onValueChange={setTimeSend}
            maxValue={notificationDetails?.event?.end_time as string}
         />
      </>
   )
}

export default EditNotificationPage
