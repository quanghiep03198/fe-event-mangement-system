import useQueryParams from '@/common/hooks/use-query-params'
import { FeedbackInterface } from '@/common/types/entities'
import { Avatar, AvatarFallback, AvatarImage, Box, Button, Icon, ScrollArea, Separator, Textarea, Toggle } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteFeedbackMutation, useGetFeedbackDetailsQuery } from '@/redux/apis/feedback.api'
import { format } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

const FeedbackDetails: React.FunctionComponent = () => {
   const [deleteFeedback] = useDeleteFeedbackMutation()
   const [open, setOpen] = useState<boolean>(false)
   const [params] = useQueryParams('feedback')

   const { data } = useGetFeedbackDetailsQuery(params.feedback)
   console.log(data)

   const handleDeleteFeedback = () => {
      toast.promise(deleteFeedback(data?.id).unwrap, {
         loading: 'Đang xóa feedback này ...',
         success: 'Feedback đã được xóa',
         error: 'Xóa feedback thất bại'
      })
   }

   return (
      <>
         <Box className='flex w-full flex-col items-stretch divide-y divide-border sm:hidden md:hidden'>
            <Box className='flex w-full basis-[4rem] items-center justify-end gap-x-1 p-4'>
               <Tooltip content='Đánh dấu là đã đọc'>
                  <Toggle size='sm'>
                     <Icon name='MailCheck' />
                  </Toggle>
               </Tooltip>
               <Tooltip content='Reply'>
                  <Toggle size='sm'>
                     <Icon name='Reply' />
                  </Toggle>
               </Tooltip>
               <Tooltip content='Reply all'>
                  <Toggle size='sm'>
                     <Icon name='ReplyAll' />
                  </Toggle>
               </Tooltip>
               <Separator orientation='vertical' />
               <Tooltip content='Xóa'>
                  <Button
                     size='icon'
                     variant='ghost'
                     className='aspect-square h-8 w-8'
                     onClick={() => {
                        setOpen(true)
                     }}
                  >
                     <Icon name='Trash2' className='text-destructive' />
                  </Button>
               </Tooltip>
            </Box>

            {data && (
               <Box className='flex w-full items-start justify-between p-4'>
                  <Box className='flex basis-1/2 space-x-4'>
                     <Avatar>
                        <AvatarImage src={data?.user?.avatar} />
                        <AvatarFallback>A</AvatarFallback>
                     </Avatar>
                     <Box className='space-y-2'>
                        <Paragraph className='font-medium'>{data?.user?.name}</Paragraph>
                        <Paragraph className='text-xs'>{data?.user?.email}</Paragraph>
                     </Box>
                  </Box>
                  <Time className=''>{format(data?.created_at ?? new Date(), 'MMM, d, yyyy, h:mm:ss a')}</Time>
               </Box>
            )}

            <Box className='flex-1 p-3'>
               <ScrollArea className='h-[calc(55vh-4.75rem)]'>
                  <Paragraph>{data?.content}</Paragraph>
               </ScrollArea>
            </Box>

            <Box className='flex flex-col space-y-4 p-3'>
               <Textarea rows={3} placeholder='Reply ...' />
               <Button size='sm' className='gap-x-2 self-start'>
                  <Icon name='Send' />
                  Send
               </Button>
            </Box>
         </Box>
         <ConfirmDialog
            open={open}
            onOpenStateChange={setOpen}
            title='Bạn chắc chắn muốn tiếp tục?'
            description='Hành động này không thể khôi phục. Feedback này sẽ bị xóa vĩnh viễn khỏi hệ thống.'
            onConfirm={handleDeleteFeedback}
         />
      </>
   )
}

const Paragraph = tw.p`text-sm`
const Time = tw.time`text-xs capitalize text-muted-foreground`

export default FeedbackDetails

{
   /* <List>
   <ListItem>
   </ListItem>
   <ListItem>
      <Typography className='text-base'>Đề xuất</Typography>
      <Paragraph>
        {data}
      </Paragraph>
   </ListItem>
   <ListItem>
      <Typography className='text-base'>Đồng ý giới thiệu cho bạn bè tham gia</Typography>
      <RadioGroup defaultValue='comfortable' className='flex space-x-6'>
         <Box className='flex items-center space-x-2'>
            <RadioGroupItem value='default' id='r1' />
            <Label htmlFor='r1'>Có</Label>
         </Box>
         <Box className='flex items-center space-x-2'>
            <RadioGroupItem value='comfortable' id='r2' />
            <Label htmlFor='r2'>Không</Label>
         </Box>
      </RadioGroup>
   </ListItem>
</List> */
}
