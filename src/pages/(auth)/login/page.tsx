import { Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { useLocalStorage } from '@/common/hooks/use-storage'
import useTheme from '@/common/hooks/use-theme'
import { parseJSON } from '@/common/utils/json'
import { Box, Button, Checkbox, Form as FormProvider, Icon, Image, InputFieldControl, Label, Typography } from '@/components/ui'
import { GoogleIcon } from '@/components/ui/@custom/icons'
import ThemeSelect from '@/pages/components/theme-select'
import { useLoginMutation } from '@/redux/apis/auth.api'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { loginWithGoogle } from '@/redux/slices/auth.slice'
import { LoginSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGoogleLogin } from '@react-oauth/google'
import { AnyAction } from '@reduxjs/toolkit'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import { Divider } from '../../../components/ui/@custom/divider'

type FormValue = z.infer<typeof LoginSchema>

const LoginPage: React.FunctionComponent = () => {
   const form = useForm<FormValue>({
      resolver: zodResolver(LoginSchema)
   })
   const { theme } = useTheme()
   const [loginWithEmail, { isLoading }] = useLoginMutation()
   const [savedAccount, setAccountToSave, removeSavedAccount] = useLocalStorage<string | null>('account', parseJSON(localStorage.getItem('account')))
   const authenticated = useAppSelector((state) => state.auth.user)
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   useEffect(() => {
      if (authenticated) navigate(Paths.HOME)
      if (savedAccount) form.setValue('email', savedAccount)
   }, [])

   const handleLoginWithGoogle = useGoogleLogin({
      onSuccess: async (response) => {
         toast.promise(dispatch(loginWithGoogle(`${response.token_type} ${response.access_token}`) as unknown as AnyAction).unwrap(), {
            loading: 'Đang xác thực thông tin ...',
            success: 'Đăng nhập thành công'
         })
      },
      onError: () => toast.error('Đăng nhập thất bại')
   })

   const handleLoginWithEmail = (data: Required<FormValue>) => {
      toast.promise(loginWithEmail(data).unwrap(), {
         loading: 'Đang đăng nhập...',
         success: ({ message }) => {
            navigate(Paths.HOME)
            return message
         },
         error: ({ data }) => {
            return data?.message
         }
      })
   }

   const handleToggleSaveAccount = useCallback((checked: boolean) => {
      if (checked) {
         if (form.getValues('email')) setAccountToSave(form.getValues('email'))
      } else removeSavedAccount()
   }, [])

   return (
      <Box className='flex h-screen w-full flex-col items-center justify-center overflow-y-auto bg-background px-4 py-10 scrollbar-none'>
         <Box className='fixed right-4 top-4'>
            <ThemeSelect />
         </Box>
         <Box className='mb-10 flex flex-col items-center justify-center gap-y-6 sm:w-full md:w-full md:max-w-md'>
            <Image src={theme === Theme.LIGHT ? '/logo.png' : 'logo.webp'} className='mb-10 max-w-[10rem]' />
            <Typography variant='h5' className='mb-6'>
               Đăng nhập vào tài khoản
            </Typography>
            <Box className='flex w-full flex-col items-stretch gap-y-6 rounded-xl border bg-background p-8 sm:p-4'>
               <FormProvider {...form}>
                  <Form onSubmit={form.handleSubmit(handleLoginWithEmail)}>
                     <InputFieldControl
                        name={'email'}
                        type='email'
                        placeholder='user@fpt.edu.vn'
                        label='Email'
                        description='Email đăng nhập sử dụng "gmail" hoặc "fpt"'
                        control={form.control}
                     />
                     <InputFieldControl name='password' type='password' label='Mật khẩu' placeholder='******' control={form.control} />
                     <Box className='flex items-center justify-between'>
                        <Box className='flex items-center space-x-2'>
                           <Checkbox type='button' id='remember-checkbox' defaultChecked={Boolean(savedAccount)} onCheckedChange={handleToggleSaveAccount} />
                           <Label htmlFor='remember-checkbox'>Ghi nhớ tôi</Label>
                        </Box>
                        <Button variant='link' asChild className='px-0'>
                           <Link to={Paths.RECOVER_PASSOWRD}>Quên mật khẩu?</Link>
                        </Button>
                     </Box>
                     <Button type='submit' variant='outline' className='inline-flex items-center gap-x-3' disabled={isLoading}>
                        <Icon name='LogIn' />
                        Đăng nhập
                     </Button>
                  </Form>
               </FormProvider>
               <Divider>hoặc đăng nhập với</Divider>
               <Button variant='default' className='w-full gap-x-2' onClick={() => handleLoginWithGoogle()}>
                  <GoogleIcon />
                  Google
               </Button>
            </Box>
         </Box>
         <Box as='footer' className=' text-center text-xs text-muted-foreground sm:hidden'>
            ©2023 FPT Polytechic College, Inc. All rights reserved.
         </Box>
      </Box>
   )
}

export const Form = tw.form`flex flex-col gap-6 w-[28rem] sm:w-full md:w-full mx-auto`

export default LoginPage
