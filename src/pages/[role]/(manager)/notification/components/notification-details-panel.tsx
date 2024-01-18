import { Paths } from '@/common/constants/pathnames'
import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { Avatar, AvatarFallback, AvatarImage, Box, Button, Icon, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteNotificationMutation } from '@/redux/apis/notification.api'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { NotificationContext } from '../context/notification-context'

const NotificationDetailsPanel: React.FunctionComponent = () => {
   const { selectedNotification } = useContext(NotificationContext)
   const [deleteNotification, { isLoading }] = useDeleteNotificationMutation()
   const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)

   const handleDeleteNotification = () => {
      if (selectedNotification)
         toast.promise(deleteNotification({ id: selectedNotification.id!, params: { softDel: false } }).unwrap(), {
            loading: 'Đang xóa thông báo ...',
            success: 'Thông báo đã được xóa',
            error: 'Xóa thông báo thất bại'
         })
   }

   return (
      <>
         <Box className='flex h-full flex-col items-stretch'>
            <Box className='flex h-16 items-center justify-end gap-x-1 border-b p-4'>
               <Tooltip content='Cập nhật'>
                  <Button asChild size='icon' variant='outline' className='h-8 w-8' disabled={!selectedNotification}>
                     <Link
                        to={Paths.EDIT_NOTIFICATION.replace(':id', String(selectedNotification?.id))}
                        className={cn({ 'pointer-events-none opacity-50': !selectedNotification || isLoading || selectedNotification.sent_at })}
                     >
                        <Icon name='Pencil' />
                     </Link>
                  </Button>
               </Tooltip>

               <Tooltip content='Xóa'>
                  <Button
                     size='icon'
                     disabled={!selectedNotification || isLoading}
                     variant='outline'
                     className='h-8 w-8'
                     onClick={() => {
                        if (!selectedNotification?.deleted_at) handleDeleteNotification()
                        else setOpenConfirmDialog(true)
                     }}
                  >
                     <Icon name='Trash2' className='text-destructive' />
                  </Button>
               </Tooltip>
            </Box>
            {selectedNotification ? (
               <>
                  <Box className='flex justify-between divide-y divide-border border-b p-4'>
                     <Box className='flex space-x-4'>
                        <Avatar className='h-8 w-8'>
                           <AvatarImage src={selectedNotification?.create_by?.avatar} />
                           <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <Box className='space-y-1'>
                           <Typography className='text-sm capitalize'>{selectedNotification?.create_by?.name}</Typography>
                           <Typography variant='small' className='text-xs'>
                              {selectedNotification?.create_by?.email}
                           </Typography>
                        </Box>
                     </Box>
                     <Typography variant='small' color='muted' className='border-none text-xs'>
                        {format(selectedNotification?.created_at ?? new Date(), `HH:mm 'Thứ' d 'tháng' M`, { locale: vi })}
                     </Typography>
                  </Box>
                  <Box className='px-6 py-4'>
                     <Typography variant='small' className='font-bold leading-snug'>
                        {selectedNotification?.title}
                     </Typography>
                     <br />
                     <Typography
                        variant='small'
                        className='font-normal leading-snug'
                        dangerouslySetInnerHTML={{ __html: selectedNotification?.content ?? '' }}
                     />
                  </Box>
               </>
            ) : (
               <Box className='flex h-full items-center justify-center text-xs text-muted-foreground'>Chưa có thông báo nào được chọn</Box>
            )}
         </Box>
         <ConfirmDialog
            open={openConfirmDialog}
            onOpenStateChange={setOpenConfirmDialog}
            title='Bạn chắc chắn chứ?'
            description='Thông báo này sẽ được xóa vĩnh viễn khỏi hệ thống và không thể khôi phục'
            onConfirm={handleDeleteNotification}
         />
      </>
   )
}

export default NotificationDetailsPanel
