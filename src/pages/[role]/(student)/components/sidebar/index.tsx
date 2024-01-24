import { areaOptions } from '@/common/constants/area-options'
import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { Box, Button, Icon, Input, Typography, buttonVariants } from '@/components/ui'
import { debounce, isEmpty } from 'lodash'
import * as qs from 'qs'
import { NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom'

type Props = {}

const postedTimeOptions: Record<'label' | 'value', string>[] = [
   { label: 'Mới nhất', value: 'latest' },
   { label: 'Cũ nhất', value: 'oldest' }
]

const Sidebar: React.FunctionComponent = () => {
   const [params, setParams, removeParam] = useQueryParams('search', 'sort', 'status', 'area')
   const { pathname } = useLocation()
   const navigate = useNavigate()

   const handleRemoveFilter: React.MouseEventHandler<HTMLElement> = (e) => {
      e.stopPropagation()
      removeParam(e.currentTarget.dataset.key)
   }

   return (
      <Box as='aside' className='flex flex-col items-stretch px-2'>
         <Box className='relative mb-6 sm:col-span-4'>
            <Input
               className='pl-8'
               type='search'
               placeholder='Tìm kiếm ...'
               onChange={debounce((e) => {
                  setParams('search', e.target.value)
                  if (isEmpty(e.target.value)) removeParam('search')
               })}
            />
            <Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50' />
         </Box>

         <Box className='space-y-2 border-b py-6'>
            <Typography variant='h6' color='muted' className='text-base'>
               Menu
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               <NavLink
                  to={Paths.EVENTS_BOARD}
                  className={({ isActive }) =>
                     cn(buttonVariants({ variant: 'ghost' }), 'justify-start gap-x-2 text-base font-normal', { 'text-primary hover:text-primary': isActive })
                  }
               >
                  <Icon name='Home' />
                  Trang chủ
               </NavLink>
               <NavLink
                  to={Paths.MY_EVENTS}
                  className={({ isActive }) =>
                     cn(buttonVariants({ variant: 'ghost' }), 'justify-start gap-x-2 text-base font-normal', { 'text-primary hover:text-primary': isActive })
                  }
               >
                  <Icon name='CalendarCheck' />
                  Sự kiện của tôi
               </NavLink>
            </Box>
         </Box>

         <Box className='space-y-2 border-b py-6'>
            <Typography variant='h6' color='muted' className='text-base'>
               Ngày đăng
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               {postedTimeOptions.map((option) => (
                  <Button
                     variant={params.area === option.value ? 'secondary' : 'ghost'}
                     className={cn('justify-start gap-x-2 text-base font-normal')}
                     disabled={!!matchPath(Paths.EVENTS_DETAILS, pathname)}
                     onClick={() => navigate({ search: qs.stringify({ ...params, sort: option.value }) })}
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
            <Typography variant='h6' color='muted' className='text-base'>
               Trạng thái
            </Typography>
            <Box className='flex flex-col items-stretch gap-y-1'>
               {Object.values(EventStatus)
                  .filter((status) => status !== EventStatus.INACTIVE && typeof status === 'number')
                  .map((status) => (
                     <Button
                        variant={+params.status === status ? 'secondary' : 'ghost'}
                        className={cn('justify-start gap-x-2 text-base font-normal')}
                        disabled={!!matchPath(Paths.EVENTS_DETAILS, pathname)}
                        onClick={() => navigate({ search: qs.stringify({ ...params, status: status }) })}
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
         <Box className='space-y-2 py-6'>
            <Typography variant='h6' color='muted' className='text-base'>
               Địa điểm
            </Typography>
            <Box className='flex flex-col gap-y-1'>
               {areaOptions.map((option) => (
                  <Button
                     variant={params.area === option.value ? 'secondary' : 'ghost'}
                     className={cn('justify-start gap-x-2 text-base font-normal')}
                     disabled={!!matchPath(Paths.EVENTS_DETAILS, pathname)}
                     onClick={() => navigate({ search: qs.stringify({ ...params, area: option.value }) })}
                  >
                     {option.label}
                     {params.area === option.value && (
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
