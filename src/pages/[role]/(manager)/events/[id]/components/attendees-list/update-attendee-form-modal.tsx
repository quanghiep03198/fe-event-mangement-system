import { UserRoleValues } from '@/common/constants/constants'
import { UserInterface } from '@/common/types/entities'
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Form, Icon, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { useUpdateAttendeeInfoMutation } from '@/redux/apis/attendance.api'
import { UpdateUserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type AddAttendeeFormModalProps = {
   defaultValue: Partial<UserInterface>
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof UpdateUserSchema>

const UpdateAttendeeFormModal: React.FC<AddAttendeeFormModalProps> = (props) => {
   const form = useForm<FormValue>({ resolver: zodResolver(UpdateUserSchema) })
   const [updateAttendeeInfo, { isLoading }] = useUpdateAttendeeInfoMutation()

   useEffect(() => {
      form.reset(props.defaultValue)
   }, [props.defaultValue])

   const handleAddAttendee = async (data: Required<FormValue>) => {
      try {
         await updateAttendeeInfo({ id: props.defaultValue?.id!, payload: data }).unwrap()
         toast.success('Add sinh viên tham gia thành công')
      } catch (error) {
         const errorResponse = error as ErrorResponse
         toast.error(errorResponse.data.message)
      }
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
                  <InputFieldControl name='phone' control={form.control} label='Số điện thoại' />
                  <InputFieldControl
                     name='email'
                     type='email'
                     control={form.control}
                     label='Email'
                     description='Email này là email của sinh viên bạn muốn mời tham gia'
                  />
                  <SelectFieldControl
                     name='role'
                     control={form.control}
                     options={Array.from(UserRoleValues, ([value, label]) => ({ value: value.toString(), label }))}
                     label='Vai trò'
                     placeholder='Vai trò'
                  />
                  <Button type='submit' className='gap-x-2'>
                     {isLoading ? <Icon name='ArrowUpCircle' className='animate-spin' /> : <Icon name='PlusCircle' />} Lưu
                  </Button>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default UpdateAttendeeFormModal
