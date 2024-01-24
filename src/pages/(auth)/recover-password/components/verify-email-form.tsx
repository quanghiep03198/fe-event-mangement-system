import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Form as FormProvider, Icon, InputFieldControl } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { recoverPasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError, AxiosResponse } from 'axios'
import * as qs from 'qs'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type FormValue = z.infer<typeof recoverPasswordSchema>

const VerifyEmailForm: React.FunctionComponent = () => {
   const form = useForm<FormValue>({ resolver: zodResolver(recoverPasswordSchema) })
   const [params, setParam] = useQueryParams('step')
   const navigate = useNavigate()

   const handleResetPassword = async (data: Required<FormValue>) => {
      toast.promise(axiosInstance.post('/reset-password', data), {
         loading: 'Đang xử lý yêu cầu ...',
         success: (response: AxiosResponse['data']) => {
            setParam('step', +params.step + 1)
            return response?.message
         },
         error: (error: AxiosError<HttpResponse<unknown>>) => {
            return error.response.data?.message
         }
      })
   }

   return (
      <FormProvider {...form}>
         <Form onSubmit={form.handleSubmit(handleResetPassword)}>
            <InputFieldControl
               label='Email đăng ký'
               name='email'
               control={form.control}
               type='email'
               placeholder='example@email.com'
               description='Mật khẩu mới sẽ được gửi về địa chỉ email của bạn'
            />
            <Button type='submit' className='gap-x-2'>
               <Icon name='CheckCircle' /> Xác nhận
            </Button>
         </Form>
      </FormProvider>
   )
}

const Form = tw.form`flex flex-col gap-y-6 w-full`

export default VerifyEmailForm
