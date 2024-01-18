import { Paths } from '@/common/constants/pathnames'
import { Box, Button, Form, InputFieldControl, Typography } from '@/components/ui'
import { useUpdateUserInfoMutation } from '@/redux/apis/auth.api'
import { ChangePasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'lodash'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof ChangePasswordSchema>

const ChangePasswordPanel: React.FunctionComponent = () => {
   const form = useForm<FormValue>({
      resolver: zodResolver(ChangePasswordSchema)
   })
   const [changePassword, { isLoading }] = useUpdateUserInfoMutation()
   const navigate = useNavigate()

   const handleChangePassword = (data: FormValue) => {
      toast.promise(changePassword(pick(data, ['password'])).unwrap(), {
         loading: 'Đang cập nhật mật khẩu ...',
         success: () => {
            navigate(Paths.ACCOUNT_SETTINGS)
            return 'Cập nhật mật khẩu thành công'
         },
         error: 'Đổi mật khẩu thất bại'
      })
   }

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
