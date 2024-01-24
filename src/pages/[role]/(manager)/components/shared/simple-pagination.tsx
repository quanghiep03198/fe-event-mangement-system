import useQueryParams from '@/common/hooks/use-query-params'
import { FeedbackInterface } from '@/common/types/entities'
import { Box, Button, Icon, Typography } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import * as qs from 'qs'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const SimplePagination: React.FC<Pick<Pagination<FeedbackInterface>, 'hasNextPage' | 'hasPrevPage' | 'totalPages' | 'totalDocs'>> = (props) => {
   const [params] = useQueryParams()
   const navigate = useNavigate()
   const currentPage = params.page ? Number(params.page) : 1

   return (
      <Box className='flex items-center gap-x-4 text-xs'>
         <Typography variant='small' className='whitespace-nowrap text-xs'>
            {currentPage}/{props.totalPages ?? 1} trong tổng số {new Intl.NumberFormat().format(props.totalDocs || 0)}
         </Typography>
         <Box className='flex items-center gap-x-1'>
            <Button
               variant='ghost'
               size='icon'
               disabled={!props.hasPrevPage}
               onClick={() => navigate({ search: qs.stringify({ ...params, page: currentPage - 1 }) })}
            >
               <Icon name='ChevronLeft' />
            </Button>

            <Button
               variant='ghost'
               size='icon'
               disabled={!props.hasNextPage}
               onClick={() => navigate({ search: qs.stringify({ ...params, page: currentPage + 1 }) })}
            >
               <Icon name='ChevronRight' />
            </Button>
         </Box>
      </Box>
   )
}

export default memo(SimplePagination)
