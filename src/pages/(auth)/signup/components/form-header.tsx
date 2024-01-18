import React from 'react'
import { Description, Logo } from './styled'
import { Box, Typography } from '@/components/ui'
import useTheme from '@/common/hooks/use-theme'
import { Theme } from '@/common/constants/enums'

const FormHeader: React.FunctionComponent = () => {
   const { theme } = useTheme()

   return (
      <Box className='flex flex-col items-center gap-6'>
         <Logo src={theme === Theme.LIGHT ? '/logo.png' : '/logo.webp'} className='block xl:hidden' />
         <Box className='flex flex-col items-center justify-center space-y-2'>
            <Typography variant='h5'>Đăng ký tài khoản</Typography>
            <Description>Nhập các thông tin phía dưới để đăng ký</Description>
         </Box>
      </Box>
   )
}

export default FormHeader
