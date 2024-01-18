import { Box, Button, Icon, Input, Popover, PopoverTrigger } from '@/components/ui'
import { PopoverContent } from '@radix-ui/react-popover'
import React from 'react'

export const SearchBox: React.FunctionComponent = () => {
   return (
      <Box className='w- relative block rounded-lg border sm:hidden'>
         <Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
         <Input className='border-none pl-8' />
      </Box>
   )
}

export const SearchPopover: React.FunctionComponent = () => {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant='outline' size='icon' className='hidden h-8 w-8 sm:inline-flex'>
               <Icon name='Search' />
            </Button>
         </PopoverTrigger>
         <PopoverContent side='left' className='p-0'>
            <Input className='border-none' placeholder='TÌm kiếm' />
         </PopoverContent>
      </Popover>
   )
}
