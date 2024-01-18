import { UserInterface } from '@/common/types/entities'
import {
   Box,
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   Form,
   FormItem,
   Icon,
   Input,
   Label,
   TextareaFieldControl
} from '@/components/ui'
import { useCreateFeedbackMutation } from '@/redux/apis/feedback.api'
import { FeedbackSchema } from '@/schemas/feedback.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FeedbackFormModalProps = {
   sender: Partial<UserInterface>
   eventId: string
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof FeedbackSchema>

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(FeedbackSchema)
   })

   const [createFeedback] = useCreateFeedbackMutation()

   const handleSendFeedback = async (data: FormValue) => {
      toast.promise(createFeedback({ ...data, event_id: props.eventId }), {
         loading: 'Đang gửi feedback ...',
         success: 'Feedback của bạn đã được gửi đi',
         error: 'Lỗi không gửi được feedback'
      })
      props.onOpenChange(!props.open)
   }

   return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange} defaultOpen={false}>
         <DialogContent>
            <DialogHeader className='text-start'>
               <DialogTitle>Feedback sự kiện</DialogTitle>
               <DialogDescription>Đóng góp ý kiến để chúng tôi cải thiện chất lượng sự kiện tốt hơn</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <DialogForm onSubmit={form.handleSubmit(handleSendFeedback)}>
                  <FormItem>
                     <Label>Họ tên</Label>
                     <Input defaultValue={props.sender.name} />
                  </FormItem>
                  <FormItem>
                     <Label>Email</Label>
                     <Input defaultValue={props.sender.email} />
                  </FormItem>
                  <TextareaFieldControl name='content' control={form.control} label='Nội dung' rows={5} />
                  <Box className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                     <Button type='submit' className='gap-x-2'>
                        <Icon name='Send' /> Gửi
                     </Button>
                  </Box>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default FeedbackFormModal
