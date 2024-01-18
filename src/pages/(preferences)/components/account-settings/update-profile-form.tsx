import { Button, Form, InputFieldControl } from '@/components/ui'
import { useUpdateUserInfoMutation } from '@/redux/apis/auth.api'
import { useAppSelector } from '@/redux/hook'
import { UpdateUserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof UpdateUserSchema>

const UpdateProfileForm = () => {
   const user = useAppSelector((state) => state.auth.user)
   const [updateUser, { isLoading }] = useUpdateUserInfoMutation()
   const form = useForm<FormValue>({
      resolver: zodResolver(UpdateUserSchema)
   })

   useEffect(() => {
      form.reset({
         name: user?.name,
         email: user?.email,
         phone: user?.phone
      })
   }, [])

   const handleUpdateUserInfo = (data: FormValue) => {
      toast.promise(updateUser(data).unwrap(), {
         loading: 'Đang cập nhật thông tin',
         success: 'Cập nhật thông tin thành công',
         error: 'Cập nhật thông tin thất bại'
      })
   }

   return (
      <Form {...form}>
         <StyledForm onSubmit={form.handleSubmit(handleUpdateUserInfo)}>
            <InputFieldControl name='name' control={form.control} type='text' label='Tên hiển thị' description='Tên hiển thị của bạn trên ứng dụng' />
            <InputFieldControl name='email' disabled control={form.control} type='email' label='Email' description='Email được sử dụng để nhận các thông báo' />
            <InputFieldControl name='phone' control={form.control} type='text' label='Số điện thoại' description='Số điện thoại liên hệ với bạn' />

            <Button type='submit' className='w-fit sm:w-full' disabled={isLoading}>
               Cập nhật
            </Button>
         </StyledForm>
      </Form>
   )
}

const StyledForm = tw.form`flex flex-col gap-y-6 w-full h-full flex-1 sm:px-4 px-8 sm:py-4`

export default UpdateProfileForm
