import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Box, Label, RadioGroup, RadioGroupItem, Typography } from '@/components/ui'
import React from 'react'

const AppearanceSetingsPage: React.FunctionComponent = () => {
   const { theme, setTheme } = useTheme()

   return (
      <Box className='min-h-[50vh] space-y-6'>
         <Box className='border-b pb-4'>
            <Typography variant='h6'>Hiển thị</Typography>
            <Typography variant='p' color='muted'>
               Cập nhật giao diện ứng dùng. Tự động chọn chế độ nền
            </Typography>
         </Box>

         <Box className='space-y-1'>
            <Typography>Theme</Typography>
            <Typography variant='small' color='muted'>
               Chọn chế độ hiển thị
            </Typography>

            <RadioGroup onValueChange={(value) => setTheme(value as Theme)} defaultValue={theme} className='grid max-w-md grid-cols-2 gap-8 pt-2'>
               <Box>
                  <Label className='[&:has([data-state=checked])>div]:border-primary'>
                     <RadioGroupItem checked={theme === Theme.LIGHT} value={Theme.LIGHT} className='sr-only' />
                     <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                        <div className='space-y-2 rounded-sm bg-neutral-200 p-2'>
                           <div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
                              <div className='h-2 w-[80px] rounded-lg bg-neutral-200' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
                           </div>
                           <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                              <div className='h-4 w-4 rounded-full bg-neutral-200' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
                           </div>
                           <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                              <div className='h-4 w-4 rounded-full bg-neutral-200' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
                           </div>
                        </div>
                     </div>
                     <span className='block w-full p-2 text-center font-normal'>Chế độ nền sáng</span>
                  </Label>
               </Box>
               <Box>
                  <Label className='[&:has([data-state=checked])>div]:border-primary'>
                     <RadioGroupItem checked={theme === Theme.DARK} value={Theme.DARK} className='sr-only' />

                     <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-neutral-200 hover:text-accent-foreground'>
                        <div className='space-y-2 rounded-sm bg-neutral-950 p-2'>
                           <div className='space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
                              <div className='h-2 w-[80px] rounded-lg bg-neutral-600' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-600' />
                           </div>
                           <div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
                              <div className='h-4 w-4 rounded-full bg-neutral-600' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-600' />
                           </div>
                           <div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
                              <div className='h-4 w-4 rounded-full bg-neutral-600' />
                              <div className='h-2 w-[100px] rounded-lg bg-neutral-600' />
                           </div>
                        </div>
                     </div>
                     <span className='block w-full p-2 text-center font-normal'>Chế độ nền tối</span>
                  </Label>
               </Box>
            </RadioGroup>
         </Box>
      </Box>
   )
}

export default AppearanceSetingsPage
