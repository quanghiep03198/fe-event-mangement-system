import { Paths } from '@/common/constants/pathnames'
import { Button, Form as FormProvider, Icon, InputFieldControl } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { resetPasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError, AxiosResponse } from 'axios'
import { pick } from 'lodash'
import React, { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type ResetPasswordFormProps = { onCompleted: React.Dispatch<React.SetStateAction<boolean>> }

type FormValue = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onCompleted }) => {
   const form = useForm<FormValue>({ resolver: zodResolver(resetPasswordSchema) })
   const tokenValue = useWatch({ name: 'token', control: form.control })
   const navigate = useNavigate()

   const handleResetPassword = async (data: Required<FormValue>) => {
      toast.promise(axiosInstance.put(`/reset-password/${tokenValue}`, pick(data, ['password'])), {
         loading: 'Đang xử lý yêu cầu ...',
         success: (response: AxiosResponse['data']) => {
            onCompleted(true)
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
            <InputFieldControl name='token' control={form.control} type='text' placeholder='Mã xác thực' />
            <InputFieldControl name='password' control={form.control} type='password' placeholder='******' />
            <InputFieldControl name='confirmPassword' control={form.control} type='password' placeholder='******' />
            <Button type='submit' className='gap-x-2'>
               <Icon name='CheckCircle' /> Xác nhận
            </Button>
         </Form>
      </FormProvider>
   )
}

const Form = tw.form`flex flex-col gap-y-6 w-full`

export default ResetPasswordForm
