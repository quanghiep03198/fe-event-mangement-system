import { Paths } from '@/common/constants/pathnames'
import { Button, Icon } from '@/components/ui'
import { Box } from '@/components/ui/@custom/box'
import { Typography } from '@/components/ui/@custom/typography'
import React from 'react'
import { Link } from 'react-router-dom'

const PermissionDenied: React.FunctionComponent = () => {
   return (
      <Box className='relative mx-auto flex h-screen w-full max-w-full flex-col items-center justify-center gap-y-6'>
         <Typography color='destructive' className='text-xl font-semibold'>
            403
         </Typography>
         <Typography variant='h3' className='block text-center'>
            Permission Denied
         </Typography>
         <Typography color='muted' className='text-lg'>
            Xin lỗi, trang bạn truy cập yêu cầu được cấp quyền.
         </Typography>
         <Box className='flex items-center justify-center space-x-1'>
            <Button asChild variant='default' className='inline-flex items-center gap-x-2'>
               <Link to={Paths.REDIRECT}>
                  <Icon name='Home' />
                  Về trang chủ
               </Link>
            </Button>
            <Link to={Paths.HOME}>
               <Button variant='ghost' className='inline-flex items-center gap-x-2'>
                  <Icon name='ArrowRight' />
                  Liên hệ hỗ trợ
               </Button>
            </Link>
         </Box>
      </Box>
   )
}

export default PermissionDenied
