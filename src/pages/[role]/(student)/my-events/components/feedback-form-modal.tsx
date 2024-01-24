import useQueryParams from '@/common/hooks/use-query-params'
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
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Icon,
   Input,
   Label,
   RadioGroup,
   RadioGroupItem,
   TextareaFieldControl
} from '@/components/ui'
import { eventApi } from '@/redux/apis/event.api'
import { useCreateFeedbackMutation } from '@/redux/apis/feedback.api'
import { FeedbackSchema } from '@/schemas/feedback.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnyAction } from '@reduxjs/toolkit'
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
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

const ratingValues = [
   { id: 'rate-1', value: '1' },
   { id: 'rate-2', value: '2' },
   { id: 'rate-3', value: '3' },
   { id: 'rate-4', value: '4' },
   { id: 'rate-5', value: '5' }
]

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = (props) => {
   const dispatch = useDispatch()
   const [params] = useQueryParams('page')

   const form = useForm<FormValue>({
      resolver: zodResolver(FeedbackSchema)
   })

   const [createFeedback, { isLoading }] = useCreateFeedbackMutation()

   const handleSendFeedback = async (data: FormValue) => {
      toast.promise(createFeedback({ ...data, event_id: props.eventId }), {
         loading: 'Đang gửi feedback ...',
         success: () => {
            props.onAfterFeedback()
            return 'Feedback của bạn đã được gửi đi'
         },
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
                  <FormField
                     name='rating'
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className='block'>Đánh giá</FormLabel>
                           <FormControl>
                              <RadioGroup
                                 className='relative inline-flex items-center gap-x-1'
                                 onValueChange={(value) => {
                                    field.onChange(value)
                                 }}
                              >
                                 {ratingValues.map((item) => (
                                    <FormItem>
                                       <FormControl>
                                          <RadioGroupItem value={item.value} className='hidden' />
                                       </FormControl>
                                       <FormLabel>
                                          <Icon
                                             stroke='hsl(var(--primary))'
                                             name='Star'
                                             fill={+field.value! >= +item.value ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                                          />
                                       </FormLabel>
                                    </FormItem>
                                 ))}
                              </RadioGroup>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <TextareaFieldControl name='content' control={form.control} label='Nội dung' rows={5} />
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

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default FeedbackFormModal
