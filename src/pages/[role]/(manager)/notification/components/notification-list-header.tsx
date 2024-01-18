import { Paths } from '@/common/constants/pathnames'
import { Box, Button, Icon, Typography } from '@/components/ui'
import React from 'react'
import { Link } from 'react-router-dom'

const NotificationHeader: React.FunctionComponent = () => {
   return (
      <Box className='flex items-start justify-between sm:flex-col sm:justify-start sm:gap-y-6'>
         <Box className='space-y-1'>
            <Typography variant='h6'>Thông báo</Typography>
            <Typography variant='small' color='muted'>
               Thông báo trong các sự kiện
            </Typography>
         </Box>
         <Button variant='outline' className='gap-x-2' asChild>
            <Link to={Paths.CREATE_NOTIFICATION}>
               <Icon name='BellPlus' /> Tạo thông báo
            </Link>
         </Button>
      </Box>
   )
}

export default NotificationHeader
