import { BreakPoints, Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useMediaQuery from '@/common/hooks/use-media-query'
import useTheme from '@/common/hooks/use-theme'
import { Box, Button, Icon } from '@/components/ui'
import ThemeSelect from '@/pages/components/theme-select'
import UserActions from '@/pages/components/user-actions'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

type HeaderProps = { open: boolean; onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

const Header: React.FC<HeaderProps> = (props) => {
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
            <Link to={Paths.EVENTS_BOARD} className='sm:hidden md:hidden'>
               <Image src={logo} className='max-w-[9rem] sm:max-w-[3rem]' />
            </Link>
            <Button variant='outline' size='icon' className='hidden sm:inline-flex md:inline-flex' onClick={() => props.onOpenChange(!props.open)}>
               <Icon name='Menu' />
            </Button>

            <Box className='flex items-center justify-end gap-x-2'>
               <ThemeSelect />
               <UserActions />
            </Box>
         </Box>
      </Box>
   )
}

const Image = tw.img`max-w-[10rem] object-cover object-center sm:max-w-[8rem]`

export default Header
