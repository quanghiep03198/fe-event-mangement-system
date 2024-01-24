import { Paths } from '@/common/constants/pathnames'
import { Box, Button, Form, InputFieldControl, Typography } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { useUpdateUserInfoMutation } from '@/redux/apis/auth.api'
import { useAppSelector } from '@/redux/hook'
import { ChangePasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { debounce, pick } from 'lodash'
import * as qs from 'qs'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof ChangePasswordSchema>

const ChangePasswordPanel: React.FunctionComponent = () => {
   const user = useAppSelector((state) => state.auth.user)
   const form = useForm<FormValue>({
      resolver: zodResolver(ChangePasswordSchema),
      mode: 'onChange'
   })
   const [changePassword, { isLoading }] = useUpdateUserInfoMutation()
   const navigate = useNavigate()

   const handleChangePassword = (data: FormValue) => {
      toast.promise(changePassword(pick(data, ['password'])).unwrap(), {
         loading: 'Đang cập nhật mật khẩu ...',
         success: () => {
            navigate({ pathname: Paths.ACCOUNT_SETTINGS, search: qs.stringify({ tab: 'account-settings' }) })
            return 'Cập nhật mật khẩu thành công'
         },
         error: 'Đổi mật khẩu thất bại'
      })
   }

   const handleCheckCurrentPassword: React.ChangeEventHandler<HTMLInputElement> = debounce(async (e) => {
      try {
         const response = (await axiosInstance.post('/check-password', { email: user.email, password: e.target.value })) as HttpResponse<boolean>
         if (response.status === 'success') form.clearErrors('currentPassword')
      } catch (error) {
         form.setError('currentPassword', { message: error.response.data.message })
      }
   }, 500)

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
                  onChange={handleCheckCurrentPassword}
               />
               <InputFieldControl
                  name='password'
                  type='password'
                  control={form.control}
                  label='Mật khẩu mới'
                  placeholder='******'
                  description='Chọn mật khẩu đủ mạnh để bảo mật tốt hơn'
               />
               <InputFieldControl
                  name='confirmPassword'
                  type='password'
                  control={form.control}
                  label='Xác nhận mật khẩu'
                  placeholder='******'
                  description='Xác nhận bạn đang nhập đúng mật khẩu mới'
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
