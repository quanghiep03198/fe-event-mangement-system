import { UserInterface } from '@/common/types/entities'
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Form, Icon, InputFieldControl } from '@/components/ui'
import { useUpdateUserMutation } from '@/redux/apis/user.api'
import { UpdateUserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query'
import _ from 'lodash'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type AddAttendeeFormModalProps = {
   defaultValue: Partial<UserInterface>
   open: boolean
   onAfterUpdate: () => QueryActionCreatorResult<any>
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof UpdateUserSchema>

const UpdateAttendeeFormModal: React.FC<AddAttendeeFormModalProps> = (props) => {
   const form = useForm<FormValue>({ resolver: zodResolver(UpdateUserSchema) })
   const [updateAttendeeInfo, { isLoading }] = useUpdateUserMutation()

   useEffect(() => {
      form.reset(_.pick(props.defaultValue, ['name', 'email', 'phone']))
   }, [props.defaultValue])

   const handleAddAttendee = (data: Required<FormValue>) => {
      toast.promise(updateAttendeeInfo({ id: props.defaultValue?.id!, payload: data }).unwrap(), {
         loading: 'Đang cập nhật thông tin người tham gia ...',
         success: () => {
            form.reset()
            props.onOpenChange(false)
            props.onAfterUpdate()
            return 'Cập nhật thông tin thành công'
         },
         error: (error) => {
            const errorResponse = error as ErrorResponse
            return errorResponse.data.message
         }
      })
   }

   return (
      <Dialog {...props}>
         <DialogContent>
            <DialogHeader className='text-left'>
               <DialogTitle>Cập nhật thông tin người tham gia</DialogTitle>
               <DialogDescription>Nhập các thông tin phía dưới để cập nhật sinh viên tham gia</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <DialogForm onSubmit={form.handleSubmit(handleAddAttendee)}>
                  <InputFieldControl name='name' control={form.control} label='Họ tên' />
                  <InputFieldControl
                     name='email'
                     type='email'
                     control={form.control}
                     label='Email'
                     description='Email này là email của sinh viên bạn muốn mời tham gia'
                  />
                  <InputFieldControl name='phone' control={form.control} label='Số điện thoại' />
                  <Button type='submit' className='gap-x-2'>
                     {isLoading ? <Icon name='ArrowUpCircle' className='animate-spin' /> : <Icon name='CheckCircle' />} Lưu
                  </Button>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default UpdateAttendeeFormModal
