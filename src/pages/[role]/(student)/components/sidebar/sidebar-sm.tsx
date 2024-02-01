import { Box, Image, Sheet, SheetContent, SheetHeader } from '@/components/ui'
import React, { useMemo } from 'react'
import Sidebar from '.'
import { Link } from 'react-router-dom'
import { Paths } from '@/common/constants/pathnames'
import useTheme from '@/common/hooks/use-theme'
import useMediaQuery from '@/common/hooks/use-media-query'
import { BreakPoints, Theme } from '@/common/constants/enums'

type DrawerSidebarProps = { open: boolean; onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

const DrawerSidebar: React.FC<DrawerSidebarProps> = (props) => {
   const { theme } = useTheme()
   const isSmallScreen = useMediaQuery(BreakPoints.SMALL)

   const logo = useMemo(() => {
      switch (true) {
         case theme === Theme.LIGHT:
            return '/logo-sm.png'
         case theme === Theme.DARK:
            return '/logo-sm-mono.png'
      }
   }, [theme])

   return (
      <Sheet open={props.open} onOpenChange={props.onOpenChange}>
         <SheetContent className='flex max-w-sm flex-col items-stretch gap-y-6 lg:max-w-md' side='left'>
            <SheetHeader>
               <Link to={Paths.EVENTS_BOARD}>
                  <Image src={logo} className='max-w-[3rem]' />
               </Link>
            </SheetHeader>
            <Box className='flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary'>
               <Sidebar />
            </Box>
         </SheetContent>
      </Sheet>
   )
}

export default DrawerSidebar
