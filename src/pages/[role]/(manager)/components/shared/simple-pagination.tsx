import { FeedbackInterface } from '@/common/types/entities'
import { Box, Button, Icon } from '@/components/ui'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as qs from 'qs'
import { memo } from 'react'
import useQueryParams from '@/common/hooks/use-query-params'

const SimplePagination: React.FC<Pick<Pagination<FeedbackInterface>, 'hasNextPage' | 'hasPrevPage' | 'totalPages' | 'totalDocs'>> = (props) => {
   const [params] = useQueryParams()
   const navigate = useNavigate()
   const currentPage = params.page ? Number(params.page) : 1

   return (
      <Box className='flex items-center gap-x-4 text-xs'>
         {currentPage}/{props.totalPages ?? 1} trong tổng số {new Intl.NumberFormat().format(props.totalDocs || 0)}
         <Box>
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
