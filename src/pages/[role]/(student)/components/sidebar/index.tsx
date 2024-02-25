import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { Box, Button, Icon, Typography, buttonVariants } from '@/components/ui'
import StarRatingRadioGroup from '@/components/ui/@custom/star-rating'
import { useGetAllAreasQuery } from '@/redux/apis/area.api'
import { NavLink, matchPath, useLocation } from 'react-router-dom'

const postedTimeOptions: Record<'label' | 'value', string>[] = [
   { label: 'Mới nhất', value: 'latest' },
   { label: 'Cũ nhất', value: 'oldest' }
]

const Sidebar: React.FunctionComponent = () => {
   const [params, setParam, removeParam] = useQueryParams('search', 'sort', 'status', 'area')
   const { data: areas } = useGetAllAreasQuery({ pagination: false })
   const { pathname } = useLocation()

   const handleRemoveFilter: React.MouseEventHandler<HTMLElement> = (e) => {
      e.stopPropagation()
      removeParam(e.currentTarget.dataset.key)
   }

   return (
      <Box as='aside' className='flex flex-col items-stretch px-2'>
         <Box className='space-y-2 border-b pb-6'>
            <Typography variant='h6' color='muted' className='flex items-center gap-x-2 text-base'>
               <Icon name='MenuSquare' />
               Menu
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               <NavLink
                  to={Paths.EVENTS_BOARD}
                  className={({ isActive }) =>
                     cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-base font-normal', { 'text-primary hover:text-primary': isActive })
                  }
               >
                  Trang chủ
               </NavLink>
               <NavLink
                  to={Paths.MY_EVENTS}
                  className={({ isActive }) =>
                     cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-base font-normal', { 'text-primary hover:text-primary': isActive })
                  }
               >
                  Sự kiện của tôi
               </NavLink>
            </Box>
         </Box>

         <Box className='space-y-2 border-b py-6'>
            <Typography variant='h6' color='muted' className='flex items-center gap-x-2 text-base'>
               <Icon name='CalendarDays' />
               Ngày đăng
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               {postedTimeOptions.map((option) => (
                  <Button
                     key={option.value}
                     variant={params.area === option.value ? 'secondary' : 'ghost'}
                     className={cn('justify-start gap-x-2 text-base font-normal')}
                     disabled={Boolean(matchPath(Paths.EVENTS_DETAILS, pathname))}
                     onClick={() => setParam('sort', option.value)}
                  >
                     {option.label}
                     {params.sort === option.value && (
                        <Box className='ml-auto' data-key='sort' onClick={handleRemoveFilter}>
                           <Icon name='X' />
                        </Box>
                     )}
                  </Button>
               ))}
            </Box>
         </Box>

         <Box className='space-y-2 border-b py-6'>
            <Typography variant='h6' color='muted' className='flex items-center gap-x-2 text-base'>
               <Icon name='CheckSquare' />
               Trạng thái
            </Typography>
            <Box className='flex flex-col items-stretch gap-y-1'>
               {Object.values(EventStatus)
                  .filter((status) => status !== EventStatus.INACTIVE && typeof status === 'number')
                  .map((status) => (
                     <Button
                        key={status}
                        variant={+params.status === status ? 'secondary' : 'ghost'}
                        className={cn('justify-start gap-x-2 text-base font-normal')}
                        disabled={!!matchPath(Paths.EVENTS_DETAILS, pathname)}
                        onClick={() => setParam('status', status)}
                     >
                        {EventStatusValues.get(status as number)}
                        {+params.status === status && (
                           <Box className='ml-auto' data-key='status' onClick={handleRemoveFilter}>
                              <Icon name='X' />
                           </Box>
                        )}
                     </Button>
                  ))}
            </Box>
         </Box>
         <Box className='space-y-2 border-b py-6'>
            <Typography variant='h6' color='muted' className='flex items-center gap-x-2 text-base'>
               <Icon name='MessagesSquare' />
               Đánh giá
            </Typography>
            <StarRatingRadioGroup
               defaultValue='5'
               onValueChange={(value) => setParam('rating', value)}
               disabled={Boolean(matchPath(Paths.EVENTS_DETAILS, pathname))}
            />
         </Box>
         <Box className='space-y-2 py-6'>
            <Typography variant='h6' color='muted' className='flex items-center gap-x-2 text-base'>
               <Icon name='MapPin' />
               Khu vực
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               {Array.isArray(areas) &&
                  areas.map((option) => (
                     <Button
                        key={option.id}
                        variant={params.area === option.name ? 'secondary' : 'ghost'}
                        className={cn('justify-start gap-x-2 text-base font-normal')}
                        disabled={Boolean(matchPath(Paths.EVENTS_DETAILS, pathname))}
                        onClick={() => {
                           setParam('area', option.name)
                        }}
                     >
                        {option.name}
                        {params.area === option.name && (
                           <Box className='ml-auto' data-key='area' onClick={handleRemoveFilter}>
                              <Icon name='X' />
                           </Box>
                        )}
                     </Button>
                  ))}
            </Box>
         </Box>
      </Box>
   )
}

export default Sidebar
