import HttpStatus from '@/common/constants/http-status'
import { Icon } from '@/components/ui'
import { icons } from 'lucide-react'
import { UserRoleEnum } from '../constants/enums'
import { Control, FieldValues, Path } from 'react-hook-form'

declare global {
   type SuccessResponse<T> = {
      status: 'success' | 'error'
      message: string
      statusCode: HttpStatus
      metadata?: T
   }

   type ErrorResponse = {
      data: SuccessResponse<undefined>
      status: HttpStatus
   }

   type MenuNavigationItem = {
      id: number
      icon?: keyof typeof icons
      name: string
      path: string
      roles?: Array<UserRoleEnum>
      visible?: boolean
      breadcrunbs?: Array<{ path: string; name: string }>
   }

   type AnonymousFunction = (...args: any[]) => any

   type Pagination<T> = {
      docs: Array<T>
      hasNextPage: boolean
      hasPrevPage: boolean
      limit: number
      page: number
      totalDocs: number
      totalPages: number
   }

   type PaginationPayload = Record<'page' | 'limit', number>

   type OptionalPagination<T> = Pagination<T> | Array<T>

   interface BaseFieldControl<T extends FieldValues> {
      name: Path<T>
      control: Control<T>
      label?: string
      description?: string
      hidden?: boolean
      placeholder?: string
      defaultValue?: string
      className?: string
      layout?: 'vertical' | 'horizontal'
   }
}
