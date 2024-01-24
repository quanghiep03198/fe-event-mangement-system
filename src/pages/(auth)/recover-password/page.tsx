import { Paths } from '@/common/constants/pathnames'
import useQueryParams from '@/common/hooks/use-query-params'
import { Box, Button, Typography } from '@/components/ui'
import { StepItem, Steps } from '@/pages/(auth)/recover-password/components/step'
import ThemeSelect from '@/pages/components/theme-select'
import * as qs from 'qs'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResetPasswordForm from './components/reset-password-form'
import VerifyEmailForm from './components/verify-email-form'
import { toast } from 'sonner'

const RecoverPasswordPage: React.FunctionComponent = () => {
   const [steps, setSteps] = useState<Array<StepItem>>([
      { index: 1, name: 'Lấy mã xác thực', href: { search: qs.stringify({ step: 1 }) }, status: 'current' },
      { index: 2, name: 'Reset mật khẩu', href: { search: qs.stringify({ step: 2 }) }, status: 'upcoming' }
   ])
   const [params, setParam] = useQueryParams('step', 'status')
   const [isCompleted, setIsCompleted] = useState<boolean>(false)
   const navigate = useNavigate()

   useEffect(() => {
      if (!params.step && !params.status) {
         setParam('step', 1)
         setParam('status', 'current')
      }

      if (steps.map((item) => String(item.index)).includes(params.step)) {
         setSteps((prev) =>
            prev.map((item) => {
               switch (true) {
                  case item.index < +params.step:
                     return { ...item, status: 'completed' }
                  case item.index === +params.step && !isCompleted:
                     return { ...item, status: 'current' }
                  case item.index === +params.step && isCompleted:
                     return { ...item, status: 'completed' }
                  default:
                     return item
               }
            })
         )
      }

      if (isCompleted) {
         toast('Đăng nhập ngay bây giờ', {
            description: 'Bạn có thể đăng nhập với mật khẩu đã đổi ngay bây giờ',
            duration: 30000,
            action: {
               label: 'Ok',
               onClick: () => navigate(Paths.LOGIN)
            },
            cancel: {
               label: 'Để sau'
            }
         })
      }
   }, [params.step, isCompleted])

   return (
      <Box className='relative flex h-screen items-center justify-center p-4'>
         <Box className='absolute top-0 flex w-full items-center justify-between p-4'>
            <Button variant='ghost' asChild className='text-foreground'>
               <Link to={Paths.LOGIN}>Đăng nhập</Link>
            </Button>
            <ThemeSelect />
         </Box>
         <Box className='mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-y-6'>
            <Box className='space-y-1 text-center'>
               <Typography variant='h5'>Lấy lại mật khẩu</Typography>
               <Typography variant='p' color='muted'>
                  Thực hiện theo các bước sau để lấy lại mật khẩu
               </Typography>
            </Box>

            <Box className='mb-6 w-full'>
               <Steps data={steps} />
            </Box>

            <Box className='w-full'>
               {params.step === '1' ? <VerifyEmailForm /> : params.step === '2' ? <ResetPasswordForm onCompleted={setIsCompleted} /> : null}
            </Box>

            <Box as='footer' className='absolute bottom-0 p-4 text-center text-xs text-muted-foreground sm:hidden'>
               ©2023 FPT Polytechic College, Inc. All rights reserved.
            </Box>
         </Box>
      </Box>
   )
}

export default RecoverPasswordPage
