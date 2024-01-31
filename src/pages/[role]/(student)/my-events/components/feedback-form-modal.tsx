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
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Icon,
   TextareaFieldControl
} from '@/components/ui'
import StarRatingRadioGroup from '@/components/ui/@custom/star-rating'
import { useCreateFeedbackMutation } from '@/redux/apis/feedback.api'
import { FeedbackSchema } from '@/schemas/feedback.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query'
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
   onAfterFeedback: () => QueryActionCreatorResult<any>
}

type FormValue = z.infer<typeof FeedbackSchema>

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(FeedbackSchema),
      defaultValues: {
         rating: 4
      }
   })

   const [createFeedback, { isLoading }] = useCreateFeedbackMutation()

   const handleSendFeedback = async (data: FormValue) => {
      toast.promise(createFeedback({ ...data, event_id: props.eventId }), {
         loading: 'Đang gửi feedback ...',
         success: () => {
            props.onAfterFeedback()
            form.reset()
            return 'Feedback của bạn đã được gửi đi'
         },
         error: 'Lỗi không gửi được feedback'
      })
      props.onOpenChange(!props.open)
   }

   return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange} defaultOpen={false}>
         <DialogContent className='max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto scrollbar-none sm:max-w-full'>
            <DialogHeader className='text-start'>
               <DialogTitle>Feedback sự kiện</DialogTitle>
               <DialogDescription>Đóng góp ý kiến để chúng tôi cải thiện chất lượng sự kiện tốt hơn</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <DialogForm onSubmit={form.handleSubmit(handleSendFeedback)}>
                  <FormField
                     name='rating'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className='block'>Đánh giá</FormLabel>
                           <StarRatingRadioGroup name='rating' field={field} />
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <TextareaFieldControl name='content' control={form.control} label='Nội dung' rows={5} />
                  <TextareaFieldControl name='recommend' control={form.control} label='Đề xuất' rows={5} />
                  <Box className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                     <Button type='submit' className='gap-x-2' disabled={isLoading}>
                        <Icon name='Send' /> Gửi
                     </Button>
                  </Box>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6 mt-6`

export default FeedbackFormModal
