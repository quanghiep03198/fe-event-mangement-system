import { Button, Form as FormProvider, Input, InputFieldControl } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { RegisterSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as _ from 'lodash'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Form } from './styled'
import { useNavigate } from 'react-router-dom'
import { Paths } from '@/common/constants/pathnames'

type FormValue = z.infer<typeof RegisterSchema>

const RegisterForm: React.FunctionComponent = () => {
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const form = useForm<FormValue>({
      resolver: zodResolver(RegisterSchema)
   })
   const navigate = useNavigate()

   const handleSignup = (data: FormValue) => {
      const payload = _.omit(data, ['confirmPassword']) as Omit<Required<FormValue>, 'confirmPassword'>
      setIsLoading(true)
      toast.promise(axiosInstance.post('', payload), {
         loading: 'Đang xử lý yêu cầu ...',
         success: () => {
            setIsLoading(false)
            navigate(Paths.LOGIN)
            return 'Đăng ký thành công'
         },
         error: (error) => {
            setIsLoading(false)
            return error.data?.message
         }
      })
   }

   return (
      <FormProvider {...form}>
         <Form onSubmit={form.handleSubmit(handleSignup)}>
            <InputFieldControl name='name' type='text' placeholder='Nguyễn Y Vân' label='Họ tên' control={form.control} />
            <InputFieldControl
               name='email'
               type='email'
               placeholder='user@fpt.edu.vn'
               label='Email'
               description='Email đăng nhập sử dụng "@gmail" hoặc "@fpt"'
               control={form.control}
            />
            <InputFieldControl name='phone' type='text' label='Số điện thoại' control={form.control} />
            <InputFieldControl name='password' type='password' label='Mật khẩu' placeholder='******' control={form.control} />
            <InputFieldControl name='confirmPassword' type='password' label='Xác nhận mật khẩu' placeholder='******' control={form.control} />
            <Button type='submit' variant='default' disabled={isLoading}>
               Đăng ký
            </Button>
         </Form>
      </FormProvider>
   )
}

export default RegisterForm
