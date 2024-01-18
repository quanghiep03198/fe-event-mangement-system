import { BreakPoints, Theme } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import ThemeSelect from '@/pages/components/theme-select'
import { Box, Icon, Image, buttonVariants } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import UserActions from '@/pages/components/user-actions'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

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
      <Box className='sticky top-0 z-20 border-b bg-background/50 bg-opacity-50 py-2 backdrop-blur'>
         <Box className='mx-auto flex max-w-7xl items-center justify-between px-4'>
            <Image src={logo} className='max-h-16 max-w-[9rem] object-contain sm:max-w-[3rem]' width='100%' height='100%' />
            <Box className='flex items-center gap-x-2'>
               <Tooltip content='Trở về màn hình chính'>
                  <Link to='/' className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
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

export default Header
