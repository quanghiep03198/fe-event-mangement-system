import { cn } from '@/common/utils/cn'
import { Header } from '@tanstack/react-table'

type ColumnResizerProps<TData, TValue> = {
   header: Header<TData, TValue>
}

export default function ColumnResizer<TData, TValue>({ header }: ColumnResizerProps<TData, TValue>) {
   return (
      <div
         onDoubleClick={() => header.column.resetSize()}
         onMouseDown={header.getResizeHandler()}
         onTouchStart={header.getResizeHandler()}
         onTouchMove={header.getResizeHandler()}
         className={cn('absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize hover:bg-primary', {
            'cursor-col-resize bg-primary': header.column.getIsResizing()
         })}
      />
   )
}
