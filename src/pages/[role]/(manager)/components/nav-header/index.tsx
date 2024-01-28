import { Box, Button, Icon } from '@/components/ui'
import React from 'react'
import ThemeSelect from '../../../../components/theme-select'
import UserActions from '../../../../components/user-actions'
import NavbarBreadscrumb from './breadcrumbs'

type NavbarProps = {
   openState: boolean
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const NavHeader: React.FC<NavbarProps> = (props) => {
   return (
      <Box
         as='header'
         className='sticky top-0 z-50 flex h-16 w-full max-w-full items-center justify-between border-b bg-background/50 bg-opacity-50 px-6 py-2 backdrop-blur sm:px-2 md:px-4'
      >
         <Box className='flex items-center space-x-3'>
            <Box className='hidden pr-2 sm:block md:block'>
               <Button variant='ghost' size='icon' onClick={() => props.onOpenStateChange(!props.openState)}>
                  <Icon name='Menu' />
               </Button>
            </Box>
            <Box className='pl-2 sm:hidden md:hidden lg:pl-0 xl:pl-0'>
               <NavbarBreadscrumb />
            </Box>
         </Box>
         <Box className='flex items-center space-x-2'>
            <ThemeSelect />
            <UserActions />
         </Box>
      </Box>
   )
}

export default NavHeader
