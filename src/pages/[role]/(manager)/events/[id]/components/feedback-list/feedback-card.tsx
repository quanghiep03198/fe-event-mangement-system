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
import { useGetFeedbackDetailsQuery, usePrefetch } from '@/redux/apis/feedback.api'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as qs from 'qs'
import React from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const Feedback: React.FC<{ data: FeedbackInterface }> = ({ data }) => {
   const [params] = useQueryParams()
   const prefetch = usePrefetch('getFeedbackDetails')

   return (
      <Link to={{ search: qs.stringify({ ...params, feedback: data.id }) }} onMouseEnter={() => prefetch(data.id)}>
         <Card className={cn('duration-200 ease-in-out hover:bg-accent/50', { 'bg-accent/50': params.feedback === String(data.id) })}>
            <CardHeader className='pb-6 pt-4'>
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
            <CardContent className='spacy-y-0 py-0'>
               <Paragraph>{data.content}</Paragraph>{' '}
            </CardContent>
         </Card>
      </Link>
   )
}

const Time = tw.time`text-xs text-muted-foreground m-0 align-middle`
const Paragraph = tw.p`text-xs line-clamp-3 mb-6 text-muted-foreground`

export default Feedback
