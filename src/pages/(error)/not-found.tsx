import { Paths } from '@/common/constants/pathnames'
import { Button, Icon } from '@/components/ui'
import { Box } from '@/components/ui/@custom/box'
import { Typography } from '@/components/ui/@custom/typography'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FunctionComponent = () => {
   return (
      <Box className='relative mx-auto flex h-screen w-full max-w-full flex-col items-center justify-center gap-y-6'>
         <Typography color='destructive' className='text-xl font-semibold'>
            404
         </Typography>
         <Typography variant='h3' className='block text-center'>
            Page not found
         </Typography>
         <Typography color='muted' className='text-lg'>
            Xin lỗi, chúng tôi không tìm thấy trang bạn yêu cầu.
         </Typography>
         <Box className='flex items-center justify-center space-x-1'>
            <Button asChild variant='default' className='gap-x-2'>
               <Link to={Paths.REDIRECT}>
                  <Icon name='Home' />
                  Về trang chủ
               </Link>
            </Button>

            <Button variant='ghost' className=' gap-x-2'>
               <Icon name='ArrowRight' />
               Liên hệ hỗ trợ
            </Button>
         </Box>
      </Box>
   )
}

export default NotFound
