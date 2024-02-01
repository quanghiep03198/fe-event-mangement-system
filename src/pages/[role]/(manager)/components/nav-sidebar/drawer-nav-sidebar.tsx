import { cn } from '@/common/utils/cn'
import PrivateComponent from '@/components/shared/private-component'
import { Icon, Sheet, SheetContent, buttonVariants } from '@/components/ui'
import { breadcrumbs } from '@/configs/breadcrumbs.config'
import React from 'react'
import { NavLink, matchPath, useLocation } from 'react-router-dom'
import tw from 'tailwind-styled-components'

type DrawerSidebarProps = {
   open: boolean
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
   navigation: Array<MenuNavigationItem>
}

const DrawerNavSidebar: React.FC<DrawerSidebarProps> = (props) => {
   const { pathname } = useLocation()

   return (
      <Sheet open={props.open} onOpenChange={props.onOpenStateChange}>
         <SheetContent className='w-full max-w-xs' side='left'>
            <Menu className='mt-10'>
               <Menu>
                  {props.navigation.map((item) => {
                     const isAlsoActive = !!breadcrumbs[matchPath(item.path, pathname) as unknown as keyof typeof breadcrumbs]
                     return (
                        <PrivateComponent key={item.id} roles={item.roles}>
                           <MenuItem onClick={() => props.onOpenStateChange(false)}>
                              <NavLink
                                 to={item.path}
                                 className={({ isActive }) =>
                                    cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start gap-x-2 text-base font-normal', {
                                       'text-primary hover:text-primary': isActive || isAlsoActive,
                                       'hover:text-foreground': !isActive
                                    })
                                 }
                              >
                                 <Icon name={item.icon!} size={18} /> {item.name}
                              </NavLink>
                           </MenuItem>{' '}
                        </PrivateComponent>
                     )
                  })}
               </Menu>
            </Menu>
         </SheetContent>
      </Sheet>
   )
}

const Menu = tw.ul`flex flex-col space-y-2`
const MenuItem = tw.li`whitespace-nowrap font-normal`

export default DrawerNavSidebar
