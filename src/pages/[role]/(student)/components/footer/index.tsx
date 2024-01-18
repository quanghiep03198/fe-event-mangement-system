import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Box } from '@/components/ui'
import React from 'react'
import tw from 'tailwind-styled-components'

const Footer: React.FunctionComponent = () => {
   const { theme } = useTheme()

   return (
      <Box as='footer' className='relative z-10 border-t bg-background'>
         <Box className='mx-auto flex max-w-7xl flex-col items-center justify-center space-y-6 p-6'>
            <Image src={theme === Theme.LIGHT ? '/logo.png' : '/logo.webp'} />

            <Box className='mt-8 md:order-1 md:mt-0'>
               <p className='text-center text-xs leading-5 text-gray-500'>&copy; 2023 FPT Polytechnic, Inc. All rights reserved.</p>
            </Box>
         </Box>
      </Box>
   )
}

const Image = tw.img`max-w-[9rem] object-cover object-center`

export default Footer
