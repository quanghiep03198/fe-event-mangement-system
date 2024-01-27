import { BreakPoints, Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import useTheme from '@/common/hooks/use-theme'
import { Box, Button, Icon, Input } from '@/components/ui'
import ThemeSelect from '@/pages/components/theme-select'
import UserActions from '@/pages/components/user-actions'
import { debounce, isEmpty } from 'lodash'
import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

type HeaderProps = { open: boolean; onOpenChange: React.Dispatch<React.SetStateAction<boolean>> } & React.PropsWithRef<typeof Box.prototype>

const Header: React.FC<HeaderProps> = (props) => {
   const [_, setParams, removeParam] = useQueryParams('search', 'sort', 'status', 'area')
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
      <Box as='header' className='sticky top-0 z-50 max-h-24 border-b bg-background/50 backdrop-blur' ref={props.ref}>
         <Box className='mx-auto flex max-w-7xl items-center justify-between p-3'>
            <Fragment>
               <Link to={Paths.EVENTS_BOARD} className='sm:hidden md:hidden lg:hidden'>
                  <Image src={logo} className='max-w-[9rem] sm:max-w-[3rem]' />
               </Link>
               <Button
                  variant='outline'
                  size='icon'
                  className='hidden sm:inline-flex md:inline-flex lg:inline-flex'
                  onClick={() => props.onOpenChange(!props.open)}
               >
                  <Icon name='Menu' />
               </Button>
            </Fragment>

            <Box className='relative flex h-fit basis-1/3 flex-col place-content-center place-items-center items-center justify-center sm:col-span-4 sm:basis-1/2'>
               <Input
                  className='relative h-9 bg-background pl-8'
                  type='search'
                  placeholder='Tìm kiếm ...'
                  onChange={debounce((e) => {
                     setParams('search', e.target.value)
                     if (isEmpty(e.target.value)) removeParam('search')
                  }, 500)}
               />
               <Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50' />
            </Box>

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
