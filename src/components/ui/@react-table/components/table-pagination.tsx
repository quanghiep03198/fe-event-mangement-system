import { Table } from '@tanstack/react-table'
import { Box, Button, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../..'
import { PaginationActions, PaginationHandler } from '@/common/hooks/use-server-pagination'
import { useSearchParams } from 'react-router-dom'
import Tooltip from '../../@override/tooltip'

type DataTablePaginationProps<TData> = {
   table: Table<TData>
   manualPagination: boolean
   onManualPaginate: PaginationHandler | undefined
} & Partial<Pagination<TData>>

export default function TablePagination<TData>({
   table,
   manualPagination,
   onManualPaginate: dispatch,
   hasNextPage,
   hasPrevPage,
   page,
   totalPages = 1,
   limit
}: DataTablePaginationProps<TData>) {
   const canNextPage = manualPagination ? hasNextPage : table.getCanNextPage()
   const canPreviousPage = manualPagination ? hasPrevPage : table.getCanPreviousPage()
   const pageCount = manualPagination ? totalPages : table.getPageCount()
   const pageSize = manualPagination ? limit : table.getState().pagination.pageSize
   const currentPage = manualPagination ? page : table.getState().pagination.pageIndex + 1
   const [_, setParams] = useSearchParams()

   const gotoFirstPage = () => {
      manualPagination ? dispatch!({ type: PaginationActions.GO_TO_FIRST_PAGE }) : table.setPageIndex(0)
      setParams((params) => {
         params.set('page', '1')
         return params
      })
   }

   const gotoPreviousPage = () => {
      manualPagination ? dispatch!({ type: PaginationActions.GO_TO_PREV_PAGE }) : table.previousPage()
      setParams((params) => {
         params.set('page', String(currentPage! - 1))
         return params
      })
   }

   const gotoNextPage = () => {
      manualPagination ? dispatch!({ type: PaginationActions.GO_TO_NEXT_PAGE }) : table.nextPage()
      setParams((params) => {
         params.set('page', String(currentPage! + 1))
         return params
      })
   }

   const gotoLastPage = () => {
      manualPagination
         ? dispatch!({
              type: PaginationActions.GO_TO_LAST_PAGE,
              payload: totalPages
           })
         : table.setPageIndex(table.getPageCount() - 1)
      setParams((params) => {
         params.set('page', String(pageCount))
         return params
      })
   }

   const changePageSize = (value: number) => {
      setParams((params) => {
         params.set('limit', value?.toString()!)
         return params
      })
      if (manualPagination) {
         if (currentPage! > pageCount!) gotoPreviousPage()
         dispatch!({
            type: PaginationActions.CHANGE_PAGE_SIZE,
            payload: value
         })
      } else {
         table.setPageSize(value)
      }
   }

   return (
      <Box className='flex items-center justify-between sm:justify-end'>
         <Box className='flex-1 text-sm text-muted-foreground sm:hidden'>
            {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} hàng được chọn.
         </Box>
         <Box className='flex items-center space-x-6 lg:space-x-8'>
            <Box className='flex items-center space-x-2'>
               <p className='text-sm font-medium'>Hiển thị</p>
               <Select
                  value={pageSize?.toString()}
                  onValueChange={(value) => {
                     changePageSize(+value)
                  }}
               >
                  <SelectTrigger className='h-8 w-[70px]'>
                     <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side='top'>
                     {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                           {pageSize}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </Box>
            <Box className='flex w-[100px] items-center justify-center text-sm font-medium'>
               Trang {currentPage} / {pageCount}
            </Box>
            <Box className='flex items-center space-x-1'>
               <Tooltip content='Trang đầu'>
                  <Button variant='outline' size='icon' className='h-8 w-8' onClick={gotoFirstPage} disabled={!canPreviousPage}>
                     <Icon name='ChevronsLeft' />
                  </Button>
               </Tooltip>
               <Tooltip content='Trang trước'>
                  <Button variant='outline' size='icon' className='h-8 w-8' onClick={gotoPreviousPage} disabled={!canPreviousPage}>
                     <Icon name='ChevronLeft' />
                  </Button>
               </Tooltip>
               <Tooltip content='Trang tiếp'>
                  <Button variant='outline' size='icon' className='h-8 w-8' onClick={gotoNextPage} disabled={!canNextPage}>
                     <Icon name='ChevronRight' />
                  </Button>
               </Tooltip>
               <Tooltip content='Trang cuối'>
                  <Button variant='outline' size='icon' className='h-8 w-8' onClick={gotoLastPage} disabled={!canNextPage}>
                     <Icon name='ChevronsRight' />
                  </Button>
               </Tooltip>
            </Box>
         </Box>
      </Box>
   )
}
