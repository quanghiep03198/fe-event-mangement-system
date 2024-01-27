import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { FeedbackInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Box,
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
   Typography
} from '@/components/ui'
import StarRatingRadioGroup from '@/components/ui/@custom/star-rating'
import { usePrefetch } from '@/redux/apis/feedback.api'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as qs from 'qs'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const Feedback: React.FC<{ data: FeedbackInterface }> = ({ data }) => {
   const [params] = useQueryParams()
   const prefetch = usePrefetch('getFeedbackDetails')
   const isSmallScreen = useMediaQuery('(min-width:320px) and (max-width: 1023px)')
   const [open, setOpen] = useState<boolean>(false)

   return (
      <Link
         to={{ search: qs.stringify({ ...params, feedback: data.id }) }}
         onMouseEnter={() => prefetch(data.id)}
         onClick={(e) => {
            e.currentTarget.scrollIntoView({ block: 'start', behavior: 'smooth' })
            if (isSmallScreen) {
               setOpen(!open)
            }
         }}
      >
         <Card className={cn('space-y-4 p-4 duration-200 ease-in-out hover:bg-accent/50', { 'bg-accent/50': params.feedback === String(data.id) })}>
            <CardHeader className='p-0'>
               <Box className='flex flex-row items-center justify-between'>
                  <HoverCard>
                     <HoverCardTrigger asChild>
                        <Button variant='link' className='h-fit gap-x-2 p-0 text-foreground'>
                           {data?.user?.name}
                        </Button>
                     </HoverCardTrigger>
                     <HoverCardContent align='start' className='w-fit'>
                        <Box className='flex justify-between space-x-4'>
                           <Avatar>
                              <AvatarImage src={data?.user?.avatar} />
                              <AvatarFallback>VC</AvatarFallback>
                           </Avatar>
                           <Box>
                              <Typography className='whitespace-nowrap text-sm font-semibold'>{data?.user?.name}</Typography>
                              <p className='text-sm'>{data?.user?.email}</p>
                              <Box className='flex items-center pt-2'>
                                 <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
                                 <span className='text-xs text-muted-foreground'>
                                    Tham gia ngày {format(data?.user?.created_at ?? new Date(), 'dd/MM/yyyy')}
                                 </span>
                              </Box>
                           </Box>
                        </Box>
                     </HoverCardContent>
                  </HoverCard>
                  <Time>{formatDistanceToNow(new Date(data?.created_at), { locale: vi, addSuffix: true })}</Time>
               </Box>
               <CardDescription className='text-xs text-foreground'>{data?.user?.email}</CardDescription>
            </CardHeader>
            <CardContent className='spacy-y-0 p-0'>
               <StarRatingRadioGroup defaultValue={data?.rating ? String(data?.rating) : '4'} disabled />
               <Typography
                  variant='small'
                  color='muted'
                  className={cn('line-clamp-2 text-xs', { '!line-clamp-none': isSmallScreen && open && data.id === +params.feedback })}
               >
                  {data.content}
               </Typography>
            </CardContent>
         </Card>
      </Link>
   )
}

const Time = tw.time`text-xs text-muted-foreground m-0 align-middle`

export default Feedback
