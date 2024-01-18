import { UserRoleValues } from '@/common/constants/constants'
import { UserRoleEnum } from '@/common/constants/enums'
import { UserInterface } from '@/common/types/entities'
import ErrorBoundary from '@/components/shared/error-boundary'
import { Box, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, Form, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { useUpdateUserMutation } from '@/redux/apis/user.api'
import { UpdateUserSchema, UserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof UpdateUserSchema>

type UpdateUserFormModalProps = {
   openState: boolean
   defaultValue: Partial<UserInterface>
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateUserFormModal: React.FC<UpdateUserFormModalProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(UpdateUserSchema)
   })
   const [updateParticipant, { isLoading }] = useUpdateUserMutation()

   useEffect(() => {
      form.reset(props.defaultValue)
   }, [props.defaultValue])

   console.log(form.formState.errors)

   const handleUpdateParticipant = async (data: Required<FormValue>) => {
      toast.promise(updateParticipant({ id: props.defaultValue?.id!, payload: data }).unwrap(), {
         loading: 'Đang cập nhật thông tin người dùng',
         success: () => {
            props.onOpenStateChange(!props.openState)
            form.reset()
            return 'Đã cập nhật thông tin người dùng'
         },
         error: () => 'Cập nhật thông tin cộng tác viên thất bại'
      })
   }
   return (
      <Dialog open={props.openState} onOpenChange={props.onOpenStateChange}>
         <DialogContent>
            <Box className='max-h-[80vh] overflow-y-auto scrollbar-none'>
               <DialogHeader className='text-left'>Cập nhật</DialogHeader>
               <DialogDescription>Nhập các thông tin dưới đây để cập nhật thông tin người dùng</DialogDescription>
               <ErrorBoundary>
                  <Form {...form}>
                     <DialogForm onSubmit={form.handleSubmit(handleUpdateParticipant)} encType='multipart/form-data'>
                        <InputFieldControl name='name' control={form.control} label='Họ tên' />
                        <InputFieldControl name='email' control={form.control} label='Email' />
                        <InputFieldControl name='phone' control={form.control} label='Số điện thoại' />
                        <DialogFooter className='mt-6 flex flex-row items-center justify-end space-x-2'>
                           <Button type='button' variant='outline' onClick={() => props.onOpenStateChange(!props.openState)}>
                              Hủy
                           </Button>
                           <Button type='submit' disabled={isLoading}>
                              Cập nhật
                           </Button>
                        </DialogFooter>
                     </DialogForm>
                  </Form>
               </ErrorBoundary>
            </Box>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col gap-4 py-4`

export default UpdateUserFormModal
