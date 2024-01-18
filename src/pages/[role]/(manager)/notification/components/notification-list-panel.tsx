import useQueryParams from '@/common/hooks/use-query-params'
import { Box, Icon, ScrollArea, Skeleton } from '@/components/ui'
import { useGetAllNotificationToUserQuery } from '@/redux/apis/notification.api'
import { useAppSelector } from '@/redux/hook'
import React, { useContext, useEffect, useState } from 'react'
import SimplePagination from '../../components/shared/simple-pagination'
import NotificationCard from './notification-card'
import SearchBox from './search-box'
import { NotificationContext } from '../context/notification-context'

const NotificationListPanel: React.FunctionComponent = () => {
   const [params] = useQueryParams('type', 'page')
   const user = useAppSelector((state) => state.auth.user)
   const [advancedSearchOptions, setAdvancedSearchOptions] = useState<Record<string, any>>({})
   const { data, isLoading } = useGetAllNotificationToUserQuery({
      userId: user?.id!,
      params: { limit: 10, page: params.page, type: params.type, ...advancedSearchOptions }
   })
   const { setSelectedNotification } = useContext(NotificationContext)

   useEffect(() => {
      if (data) {
         if (data.totalDocs > 0) setSelectedNotification(data.docs[0])
         else setSelectedNotification(undefined)
      }
   }, [data])

   return (
      <Box className='relative h-[inherit] @container'>
         <Box className='flex h-16 items-center justify-between border-b p-4'>
            <SearchBox onSearchOptionsChange={setAdvancedSearchOptions} />
            <Box className='absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 justify-end border-t bg-background px-4 py-2 @xl:relative @xl:top-0 @xl:!-translate-x-full @xl:justify-end @xl:border-none @xl:p-0'>
               <SimplePagination
                  hasNextPage={data?.hasNextPage!}
                  hasPrevPage={data?.hasPrevPage!}
                  totalDocs={data?.totalDocs!}
                  totalPages={data?.totalPages!}
               />
            </Box>
         </Box>

         {isLoading && (
            <Box className='flex flex-col gap-y-2 p-4'>
               {Array.apply(null, Array(3)).map(() => (
                  <Box className='flex flex-col gap-2 rounded-lg border p-4'>
                     <Skeleton className='h-2 w-1/4 rounded-lg' />
                     <Skeleton className='h-2 w-1/3 rounded-lg' />
                     <Skeleton className='h-2 w-1/2 rounded-lg' />
                     <Skeleton className='mt-2 h-2 w-full rounded-lg' />
                     <Skeleton className='h-2 w-full rounded-lg' />
                  </Box>
               ))}
            </Box>
         )}

         {Array.isArray(data?.docs) && data?.docs.length > 0 ? (
            <ScrollArea className='h-[calc(70vh-4rem)] p-4'>
               <Box className='flex flex-col gap-y-2'>{data?.docs?.map((item) => <NotificationCard data={item} key={item.id} />)} </Box>
            </ScrollArea>
         ) : (
            <Box className='flex h-[calc(70vh-4.5rem)] items-center justify-center gap-x-4 text-sm text-muted-foreground'>
               <Icon name='MailX' size={56} strokeWidth={1} />
            </Box>
         )}
      </Box>
   )
}

export default NotificationListPanel
