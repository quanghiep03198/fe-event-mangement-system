import { cn } from '@/common/utils/cn'
import { buttonVariants, Icon } from '@/components/ui'
import { IconProps } from '@/components/ui/@shadcn/icon'
import React, { memo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import tw from 'tailwind-styled-components'
import * as qs from 'qs'
import Tooltip from '@/components/ui/@override/tooltip'
import useQueryParams from '@/common/hooks/use-query-params'

type MenuItemType = {
   id: number
   icon: IconProps['name']
   label: string
   type: string
}

const menu: Array<MenuItemType> = [
   {
      id: 1,
      icon: 'Inbox',
      label: 'Tất cả',
      type: 'all'
   },
   {
      id: 2,
      icon: 'Send',
      label: 'Đã gửi',
      type: 'sent'
   },
   {
      id: 3,
      icon: 'CalendarClock',
      label: 'Đã lên lịch',
      type: 'scheduled'
   }
   // {
   //    id: 4,
   //    icon: 'Trash2',
   //    label: 'Đã xóa',
   //    type: 'deleted'
   // }
]

const NotificationMenu: React.FunctionComponent = () => {
   const [params, setParam] = useQueryParams()

   useEffect(() => {
      if (!params.type) setParam('type', 'all')
   }, [])

   return (
      <Menu>
         {menu.map((item) => (
            <MenuItem key={item.id}>
               <Tooltip content={item.label} side='right'>
                  <Link
                     to={{ search: qs.stringify({ ...params, type: item.type }) }}
                     className={cn('w-[inherit]', buttonVariants({ variant: 'ghost', size: 'icon' }), {
                        'text-primary hover:text-primary': params.type === item.type
                     })}
                  >
                     <Icon name={item.icon} />
                  </Link>
               </Tooltip>
            </MenuItem>
         ))}
      </Menu>
   )
}

const Menu = tw.ul`flex flex-col gap-y-1 items-stretch justify-start`
const MenuItem = tw.li`whitespace-nowrap w-full gap-x-2 [&>:first-child]:w-full`

export default memo(NotificationMenu)
