import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Box, Button, HoverCard, HoverCardContent, HoverCardTrigger, Icon, Image, Typography } from '@/components/ui'
import { FacebookIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/@custom/icons'
import { useGetAllAreasQuery } from '@/redux/apis/area.api'
import React from 'react'
import tw from 'tailwind-styled-components'

const Footer: React.FunctionComponent = () => {
   const { theme } = useTheme()
   const { data: areas } = useGetAllAreasQuery({ pagination: false })

   return (
      <Box as='footer' className='divide-y-border relative z-10 divide-y border-t bg-background'>
         <Box className='mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-10 p-6 lg:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_3fr]'>
            <Box className='flex flex-col gap-y-10 md:flex-row md:items-center md:justify-between'>
               <Image className='block max-w-[144px]' src={theme === Theme.LIGHT ? '/logo.png' : '/logo.webp'} />
               <List orientation='vertical'>
                  <ListItem>
                     <Icon name='Phone' />
                     (024) 7300 1955
                  </ListItem>
                  <ListItem>
                     <Icon name='Mail' /> caodang@fpt.edu.vn
                  </ListItem>
               </List>
               <Box className='flex items-center gap-x-6'>
                  <a href='https://www.facebook.com/fpt.poly'>
                     <FacebookIcon
                        width={20}
                        height={20}
                        fill='hsl(var(--muted-foreground))'
                        onMouseEnter={(e) => {
                           e.currentTarget.setAttribute('fill', 'currentColor')
                        }}
                        onMouseLeave={(e) => e.currentTarget.setAttribute('fill', 'hsl(var(--muted-foreground))')}
                     />
                  </a>
                  <a href='https://www.youtube.com/channel/UCHXm-vzOfAuLucVBKDUfhvQ'>
                     <YoutubeIcon
                        width={20}
                        height={20}
                        fill='hsl(var(--muted-foreground))'
                        onMouseEnter={(e) => {
                           e.currentTarget.setAttribute('fill', 'currentColor')
                        }}
                        onMouseLeave={(e) => e.currentTarget.setAttribute('fill', 'hsl(var(--muted-foreground))')}
                     />
                  </a>
                  <a href='https://www.tiktok.com/@fpt.polytechnic.official'>
                     <TiktokIcon
                        width={20}
                        height={20}
                        fill='hsl(var(--muted-foreground))'
                        onMouseEnter={(e) => {
                           e.currentTarget.setAttribute('fill', 'currentColor')
                        }}
                        onMouseLeave={(e) => e.currentTarget.setAttribute('fill', 'hsl(var(--muted-foreground))')}
                     />
                  </a>
               </Box>
            </Box>

            <Box className='space-y-4'>
               <Typography variant='small' className='font-bold'>
                  HỆ THỐNG CƠ SỞ
               </Typography>
               <Box className='grid w-full grid-cols-4 gap-x-6 gap-y-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
                  {Array.isArray(areas) &&
                     areas.map((area) => (
                        <HoverCard openDelay={200} closeDelay={200}>
                           <HoverCardTrigger asChild>
                              <Button variant='link' className='justify-start whitespace-nowrap px-0 text-muted-foreground hover:text-foreground'>
                                 {area.name}
                              </Button>
                           </HoverCardTrigger>
                           <HoverCardContent className='max-w-sm' align='start'>
                              <Typography variant='small' className='flex items-start gap-x-2'>
                                 <Icon name='MapPin' className='basis-[32px]' /> {area.address}
                              </Typography>
                           </HoverCardContent>
                        </HoverCard>
                     ))}
               </Box>
            </Box>
         </Box>
         <Box className='mx-auto max-w-full p-6'>
            <p className='text-center text-xs leading-5 text-muted-foreground'>&copy; 2023 FPT Polytechnic, Inc. All rights reserved.</p>
         </Box>
      </Box>
   )
}

const List = tw.ul<{ orientation?: 'horizontal' | 'vertical' }>`
   flex gap-y-2 
   ${(props) => (props.orientation === 'vertical' ? 'flex-col' : 'flex-row')}
`
const ListItem = tw.li`gap-x-2 text-sm font-medium flex items-center`

export default Footer
