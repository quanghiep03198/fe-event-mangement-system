import { Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { useLocalStorage } from '@/common/hooks/use-storage'
import useTheme from '@/common/hooks/use-theme'
import { parseJSON } from '@/common/utils/json'
import { Box, Button, Checkbox, Form, FormLabel, Icon, InputFieldControl, Typography } from '@/components/ui'
import { GoogleIcon } from '@/components/ui/@custom/icons'
import ThemeSelect from '@/pages/components/theme-select'
import { useSigninMutation } from '@/redux/apis/auth.api'
import { useAppDispatch } from '@/redux/hook'
import { signinWithGoogle } from '@/redux/slices/auth.slice'
import { SigninSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGoogleLogin } from '@react-oauth/google'
import { AnyAction } from '@reduxjs/toolkit'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Divider } from '../../../components/ui/@custom/divider'
import { Image, StyledForm } from './components/styled'

type FormValue = z.infer<typeof SigninSchema>

const Signin: React.FunctionComponent = () => {
   const form = useForm<FormValue>({
      resolver: zodResolver(SigninSchema)
   })
   const { theme } = useTheme()
   const [signinWithEmail, { isLoading }] = useSigninMutation()
   const [savedAccount, setAccountToSave, removeSavedAccount] = useLocalStorage<string | null>('account', parseJSON(localStorage.getItem('account')))
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const handleSigninWithGoogle = useGoogleLogin({
      onSuccess: async (response) => {
         try {
            const data = (await dispatch(
               signinWithGoogle(`${response.token_type} ${response.access_token}`) as unknown as AnyAction
            ).unwrap()) as unknown as SuccessResponse<any>
            window.localStorage.setItem('access_token', `Bearer ${data?.metadata?.access_token}`)
            toast.success('Đăng nhập thành công')
            navigate(Paths.HOME)
         } catch (error) {
            toast.error('Failed to login!')
         }
      },
      onError: () => toast.error('Đăng nhập thất bại')
   })

   const handleSigninWithEmail = (data: Required<FormValue>) => {
      toast.promise(signinWithEmail(data).unwrap(), {
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

   useEffect(() => {
      if (savedAccount) form.reset({ email: savedAccount ?? '' })
   }, [savedAccount])

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
         <Box className='flex flex-col items-center justify-center sm:w-full md:w-full md:max-w-md'>
            <Image src={theme === Theme.LIGHT ? '/logo.png' : 'logo.webp'} className='mb-10' />
            <Typography variant='h5' className='mb-6'>
               Đăng nhập vào tài khoản
            </Typography>
            <Box className='flex w-full flex-col items-stretch gap-y-6 rounded-xl border bg-background p-8 sm:p-4'>
               <Form {...form}>
                  <StyledForm onSubmit={form.handleSubmit(handleSigninWithEmail)}>
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
                           <FormLabel htmlFor='rememeber-checkbox'>Ghi nhớ tôi</FormLabel>
                        </Box>
                        <Link to={Paths.RECOVER_PASSOWRD} className='font-medium text-primary'>
                           Quên mật khẩu?
                        </Link>
                     </Box>
                     <Button type='submit' variant='outline' className='inline-flex items-center gap-x-3' disabled={isLoading}>
                        <Icon name='LogIn' />
                        Đăng nhập
                     </Button>
                  </StyledForm>
               </Form>
               <Divider>hoặc đăng nhập với</Divider>
               <Button variant='default' className='w-full gap-x-2' onClick={() => handleSigninWithGoogle()}>
                  <GoogleIcon />
                  Google
               </Button>
            </Box>
         </Box>
      </Box>
   )
}

export default Signin
