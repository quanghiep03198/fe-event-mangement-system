import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Form, Icon } from '@/components/ui'

import { useAddAttendanceMutation } from '@/redux/apis/attendance.api'
import { AddUserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import UserComboboxFieldControl from '../../../components/user-combobox-field-control'
import { UserRoleEnum } from '@/common/constants/enums'

type AddAttendeeFormModalProps = {
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof AddUserSchema>

const AddAttendeeFormModal: React.FC<AddAttendeeFormModalProps> = (props) => {
   const form = useForm<FormValue>({ resolver: zodResolver(AddUserSchema) })
   const { id } = useParams()
   const [addAttendee, { isLoading }] = useAddAttendanceMutation()

   const handleAddAttendee = async (data: Required<FormValue>) => {
      toast.promise(addAttendee({ ...data, event_id: id! }).unwrap(), {
         loading: 'Vui lòng chờ trong giây lát ...',
         success: () => {
            form.reset()
            props.onOpenChange(false)
            return 'Đã thêm người dùng vào sự kiện'
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
               <DialogTitle>Thêm người tham gia</DialogTitle>
               <DialogDescription>Nhập các thông tin phía dưới để thêm sinh viên tham gia</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <DialogForm onSubmit={form.handleSubmit(handleAddAttendee)}>
                  <UserComboboxFieldControl
                     path='email'
                     name='email'
                     form={form}
                     control={form.control}
                     label='Người tham gia'
                     roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF, UserRoleEnum.STUDENT]}
                     placeholder='Chọn người tham gia'
                     description='Người dùng được chọn sau khi thêm sẽ tham gia vào sự kiện'
                  />
                  <Button type='submit' className='gap-x-2'>
                     {isLoading ? <Icon name='ArrowUpCircle' className='animate-spin' /> : <Icon name='PlusCircle' />} Thêm
                  </Button>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default AddAttendeeFormModal
