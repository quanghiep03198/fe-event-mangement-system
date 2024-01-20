import { BreakPoints } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Box, Button, Icon, Typography } from '@/components/ui'
import React from 'react'
import { Link } from 'react-router-dom'

const NotificationHeader: React.FunctionComponent = () => {
   const isSmallScreen = useMediaQuery(BreakPoints.SMALL)

   return (
      <Box className='flex items-start justify-between'>
         <Box className='space-y-1'>
            <Typography variant='h6'>Thông báo</Typography>
            <Typography variant='small' color='muted'>
               Thông báo trong các sự kiện
            </Typography>
         </Box>
         <Button variant='outline' size={isSmallScreen ? 'icon' : 'sm'} className='gap-x-2' asChild>
            <Link to={Paths.CREATE_NOTIFICATION}>
               <Icon name='BellPlus' /> <span className='sm:hidden'>Tạo thông báo</span>
            </Link>
         </Button>
      </Box>
   )
}

export default NotificationHeader
