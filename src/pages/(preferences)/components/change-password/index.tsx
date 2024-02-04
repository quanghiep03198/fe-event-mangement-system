import { Box, Button, Form, InputFieldControl, Typography } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { useUpdateUserInfoMutation } from '@/redux/apis/auth.api'
import { useAppSelector } from '@/redux/hook'
import { ChangePasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { debounce, isEmpty, pick } from 'lodash'
import * as qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof ChangePasswordSchema>

const ChangePasswordPanel: React.FunctionComponent = () => {
   const user = useAppSelector((state) => state.auth.user)
   const [checkPasswordError, setCheckPasswordError] = useState<string | null>(null)
   const navigate = useNavigate()
   const form = useForm<FormValue>({
      resolver: zodResolver(ChangePasswordSchema),
      shouldUnregister: true
   })
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)
   const currentPassword = useWatch({ name: 'currentPassword', control: form.control })
   const [changePassword, { isLoading }] = useUpdateUserInfoMutation()

   const handleChangePassword = (data: FormValue) => {
      if (checkPasswordError) return

      toast.promise(changePassword(pick(data, ['password'])).unwrap(), {
         loading: 'Đang cập nhật mật khẩu ...',
         success: () => {
            navigate({ search: qs.stringify({ tab: 'account-settings' }) })
            return 'Cập nhật mật khẩu thành công'
         },
         error: 'Đổi mật khẩu thất bại'
      })
   }

   useEffect(() => {
      timeoutRef.current = setTimeout(() => {
         if ((form.formState.isSubmitting || form.formState.isSubmitted) && !isEmpty(currentPassword)) {
            axiosInstance
               .post<Record<'email' | 'password', string>, HttpResponse<boolean>>('/check-password', {
                  email: user.email,
                  password: currentPassword
               })
               .then(() => {
                  setCheckPasswordError(null)
                  form.clearErrors('currentPassword')
               })
               .catch((error) => {
                  setCheckPasswordError(error.response.data.message)
                  form.setError('currentPassword', { message: error.response.data.message })
               })
         }
      }, 200)

      return () => {
         clearTimeout(timeoutRef.current)
      }
   }, [currentPassword, form.formState.isSubmitted, form.formState.isSubmitting])

   return (
      <Box className='min-h-[75vh] space-y-6 rounded-lg border p-6'>
         <Box className='border-b pb-4'>
            <Typography variant='h6'>Đổi mật khẩu</Typography>
            <Typography variant='p' color='muted'>
               Cập nhật mật khẩu đăng nhập vào ứng dụng
            </Typography>
         </Box>
         <Form {...form}>
            <StyledForm onSubmit={form.handleSubmit(handleChangePassword)}>
               <InputFieldControl
                  name='currentPassword'
                  type='password'
                  control={form.control}
                  label='Mật khẩu hiện tại'
                  placeholder='******'
                  description='Mật khẩu hiện tại của bạn đang sử dụng'
               />
               <InputFieldControl
                  name='password'
                  type='password'
                  control={form.control}
                  label='Mật khẩu mới'
                  placeholder='******'
                  description='Chọn mật khẩu đủ mạnh để bảo mật tốt hơn'
                  onChange={debounce(async () => await form.trigger('password'), 200)}
               />
               <InputFieldControl
                  name='confirmPassword'
                  type='password'
                  control={form.control}
                  label='Xác nhận mật khẩu'
                  placeholder='******'
                  description='Xác nhận bạn đang nhập đúng mật khẩu mới'
                  onChange={debounce(async () => await form.trigger('confirmPassword'), 200)}
               />
               <Button type='submit' className='w-fit sm:w-full' disabled={isLoading}>
                  Xác nhận
               </Button>
            </StyledForm>
         </Form>
      </Box>
   )
}

const StyledForm = tw.form`flex flex-col gap-y-6 max-w-xl`

export default ChangePasswordPanel
