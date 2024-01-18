import { Button, Form, Input, InputFieldControl } from '@/components/ui'
import { useSignupMutation } from '@/redux/apis/auth.api'
import { RegisterSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as _ from 'lodash'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { StyledForm } from './styled'

type FormValue = z.infer<typeof RegisterSchema>

const SignupForm: React.FunctionComponent = () => {
   const form = useForm<FormValue>({
      resolver: zodResolver(RegisterSchema)
   })
   const inputRef = useRef<typeof Input.prototype>(null)
   const [mutateAsync, { isLoading }] = useSignupMutation()

   const handleSignup = async (data: FormValue) => {
      try {
         const payload = _.omit(data, ['confirmPassword']) as Omit<Required<FormValue>, 'confirmPassword'>
         const response = await mutateAsync(payload).unwrap()
         if (response) toast.success('Đăng ký thành công')
      } catch (error) {
         const errorResponse = error as ErrorResponse
         toast.error(errorResponse.data?.message)
      }
   }

   return (
      <Form {...form}>
         <StyledForm onSubmit={form.handleSubmit(handleSignup)}>
            <InputFieldControl name='name' type='text' placeholder='Nguyễn Y Vân' label='Họ tên' ref={inputRef} control={form.control} />
            <InputFieldControl
               name='email'
               type='email'
               placeholder='user@fpt.edu.vn'
               label='Email'
               description='Email đăng nhập sử dụng "@gmail" hoặc "@fpt"'
               control={form.control}
            />
            <InputFieldControl name='phone' type='text' label='Số điện thoại' ref={inputRef} control={form.control} />
            <InputFieldControl name='password' type='password' label='Mật khẩu' placeholder='******' control={form.control} />
            <InputFieldControl name='confirmPassword' type='password' label='Xác nhận mật khẩu' placeholder='******' control={form.control} />
            <Button type='submit' variant='default' disabled={isLoading}>
               Đăng ký
            </Button>
         </StyledForm>
      </Form>
   )
}

export default SignupForm
