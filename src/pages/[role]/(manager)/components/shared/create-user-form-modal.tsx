import { UserRoleValues } from '@/common/constants/constants'
import { UserRoleEnum } from '@/common/constants/enums'
import { UserInterface } from '@/common/types/entities'
import ErrorBoundary from '@/components/shared/error-boundary'
import { Box, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, Form, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { useAddUserMutation } from '@/redux/apis/user.api'
import { UserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof UserSchema>

export type CreateFormModalProps = {
   openState: boolean
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
   createForRole?: UserRoleEnum
}

const CreateUserFormModal: React.FC<CreateFormModalProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(UserSchema)
   })
   const [addUser, { isLoading }] = useAddUserMutation()

   useEffect(() => {
      form.reset({ role: props.createForRole })
   }, [props.createForRole])

   const handleCreateEvent = (data: Required<FormValue>) => {
      toast.promise(addUser(data).unwrap(), {
         loading: 'Đang thêm người dùng vào hệ thống ...',
         success: () => {
            form.reset()
            props.onOpenStateChange(!props.openState)
            return 'Đã thêm người dùng vào hệ thống'
         },
         error: 'Thêm cộng tác viên thất bại'
      })
   }

   return (
      <Dialog open={props.openState} onOpenChange={props.onOpenStateChange}>
         <DialogContent>
            <Box className='max-h-[80vh] overflow-y-auto scrollbar-none'>
               <DialogHeader className='text-left'>Thêm mới</DialogHeader>
               <DialogDescription>Nhập các thông tin dưới đây để invite thêm cộng tác viên</DialogDescription>
               <ErrorBoundary>
                  <Form {...form}>
                     <DialogForm onSubmit={form.handleSubmit(handleCreateEvent)} encType='multipart/form-data'>
                        <InputFieldControl name='name' control={form.control} label='Họ tên' />
                        <InputFieldControl name='email' control={form.control} label='Email' />
                        <InputFieldControl name='phone' control={form.control} label='Số điện thoại' />
                        <DialogFooter className='mt-6 flex flex-row items-center justify-end space-x-2'>
                           <Button type='button' variant='outline' onClick={() => props.onOpenStateChange(!props.openState)}>
                              Hủy
                           </Button>
                           <Button type='submit' disabled={isLoading}>
                              Tạo mới
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

export default memo(CreateUserFormModal)
