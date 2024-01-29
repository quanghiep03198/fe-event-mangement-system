import { Theme } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import PrivateComponent from '@/components/shared/private-component'
import { Box, Icon, buttonVariants } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { Link, NavLink, matchPath, useLocation } from 'react-router-dom'
import tw from 'tailwind-styled-components'

type StaticNavSidebarProps = {
   navigation: Array<MenuNavigationItem>
   isCollapsed: boolean
}

const getLogoImageSource = (theme: Theme, isCollapsed: boolean) => {
   switch (true) {
      case theme === Theme.LIGHT && isCollapsed:
         return '/logo-sm.png'
      case theme === Theme.DARK && isCollapsed:
         return '/logo-sm-mono.png'
      case theme === Theme.LIGHT && !isCollapsed:
         return '/logo.png'
      case theme === Theme.DARK && !isCollapsed:
         return '/logo.webp'
   }
}

const StaticNavSidebar: React.FC<StaticNavSidebarProps> = ({ navigation, isCollapsed }) => {
   const { theme } = useTheme()
   const logo = getLogoImageSource(theme, isCollapsed)
   const { pathname } = useLocation()

   return (
      <Box
         as='aside'
         className={cn('relative left-0 top-0 flex h-full w-[inherit] flex-col space-y-8 sm:hidden md:hidden', {
            'items-center px-2 py-6': isCollapsed,
            'p-6': !isCollapsed
         })}
      >
         <Link to={Paths.HOME} className='translate-x-3'>
            <Image
               src={logo}
               className={cn('w-full object-cover object-center', {
                  'max-w-[48px] -translate-x-3': isCollapsed,
                  'max-w-[144px]': !isCollapsed
               })}
            />
         </Link>
         <Menu>
            {navigation.map((item) => {
               const isAlsoActive = !!matchPath(item.path, pathname)
               return (
                  <PrivateComponent key={item.id} roles={item.roles}>
                     <MenuItem>
                        {
                           <Tooltip asChild={false} content={item.name} side='right' key={item.id}>
                              <NavLink
                                 to={item.path}
                                 className={({ isActive }) =>
                                    cn(
                                       'flex w-[inherit] !text-base !font-normal',
                                       buttonVariants({ variant: 'ghost', size: isCollapsed ? 'icon' : 'default' }),
                                       {
                                          'text-primary hover:text-primary': isActive || isAlsoActive,
                                          'hover:text-foreground': !isActive,
                                          'justify-start gap-x-3': !isCollapsed
                                       }
                                    )
                                 }
                              >
                                 <Icon name={item.icon!} size={18} />
                                 <span className={cn({ hidden: isCollapsed })}>{item.name}</span>
                              </NavLink>
                           </Tooltip>
                        }
                     </MenuItem>
                  </PrivateComponent>
               )
            })}
         </Menu>
      </Box>
   )
}

const Image = tw.img`object-cover object-center`
const Menu = tw.ul`flex flex-col space-y-2 mt-10 items-stretch`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`

export default StaticNavSidebar
