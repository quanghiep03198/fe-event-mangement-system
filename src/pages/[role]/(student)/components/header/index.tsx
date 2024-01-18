import { BreakPoints, Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useMediaQuery from '@/common/hooks/use-media-query'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import ThemeSelect from '@/pages/components/theme-select'
import { Box, Icon, buttonVariants } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import UserActions from '@/pages/components/user-actions'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const Header: React.FunctionComponent = () => {
   const { theme } = useTheme()
   const isSmallScreen = useMediaQuery(BreakPoints.SMALL)
   const logo = useMemo(() => {
      switch (true) {
         case isSmallScreen && theme === Theme.LIGHT:
            return '/logo-sm.png'
         case !isSmallScreen && theme === Theme.LIGHT:
            return '/logo.png'
         case !isSmallScreen && theme === Theme.DARK:
            return '/logo.webp'
         case isSmallScreen && theme === Theme.DARK:
            return '/logo-sm-mono.png'
      }
   }, [theme, isSmallScreen])

   return (
      <Box as='header' className='sticky top-0 z-50 max-h-24 border-b bg-background/50 backdrop-blur'>
         <Box className='mx-auto flex max-w-7xl items-center justify-between p-3'>
            <Link to={Paths.EVENTS_BOARD}>
               <Image src={logo} className='max-w-[9rem] sm:max-w-[3rem]' />
            </Link>

            <Box className='flex items-center justify-end gap-x-2'>
               <Tooltip content='Trang chủ'>
                  <Link to={Paths.EVENTS_BOARD} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}>
                     <Icon name='Home' />
                  </Link>
               </Tooltip>
               <Tooltip content='Sự kiện của tôi'>
                  <Link to={Paths.MY_EVENTS} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}>
                     <Icon name='Navigation' />
                  </Link>
               </Tooltip>
               <ThemeSelect />
               <UserActions />
            </Box>
         </Box>
      </Box>
   )
}

const Image = tw.img`max-w-[10rem] object-cover object-center sm:max-w-[8rem]`

export default Header
