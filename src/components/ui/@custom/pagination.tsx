import { cn } from '@/common/utils/cn'
import { Box, Button, Icon, buttonVariants } from '@/components/ui'
import * as qs from 'qs'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import tw from 'tailwind-styled-components'

type PaginationProps = Omit<Pagination<unknown>, 'docs'> & { onPrefetch?: () => void }

const calculatePaginationRange = (currentPage: number, totalPages: number): number[] => {
   const range = 2
   let start = Math.max(1, currentPage - range)
   let end = Math.min(totalPages, currentPage + range)

   if (end - start < range * 2) {
      if (start === 1) {
         end = Math.min(totalPages, start + range * 2)
      } else {
         start = Math.max(1, end - range * 2)
      }
   }
   return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

const Pagination: React.FC<PaginationProps> = (props) => {
   const { page, totalPages, hasNextPage, hasPrevPage, onPrefetch: handlePrefetch } = props
   const navigate = useNavigate()
   const paginationRange = calculatePaginationRange(page, totalPages)

   return (
      <Box className='mx-auto flex w-full max-w-full items-center justify-center gap-x-1'>
         <Button disabled={!hasPrevPage} variant='ghost' className='gap-x-2' onClick={() => navigate({ search: qs.stringify({ page: page - 1 }) })}>
            <Icon name='ChevronLeft' /> Previous
         </Button>
         {paginationRange.map((pageIndex, index) => {
            if (index === paginationRange.length - 1 && pageIndex < totalPages) return <PaginationElipsis>...</PaginationElipsis>
            return (
               <Link
                  key={pageIndex}
                  to={{ search: qs.stringify({ page: pageIndex }) }}
                  className={cn(buttonVariants({ variant: page == pageIndex ? 'outline' : 'ghost', size: 'icon' }), 'aspect-square')}
               >
                  {pageIndex}
               </Link>
            )
         })}
         <Button
            variant='ghost'
            disabled={!hasNextPage}
            className='flex-row-reverse gap-x-2'
            onClick={() => navigate({ search: qs.stringify({ page: page + 1 }) })}
            onMouseEnter={() => {
               if (handlePrefetch) handlePrefetch()
            }}
         >
            <Icon name='ChevronRight' /> Next
         </Button>
      </Box>
   )
}

const PaginationElipsis = tw.span`tracking-widest text-lg text-foreground`

export default Pagination
