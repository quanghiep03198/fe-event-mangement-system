import { Paths } from '@/common/constants/pathnames'
import useBreadcrumbs from '@/common/hooks/use-breadcrumbs'
import { Box, Icon } from '@/components/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const NavbarBreadcrumb: React.FunctionComponent = () => {
   const breadcrumbs = useBreadcrumbs()

   return (
      <Breadcrumb>
         <Link className='text-sm font-medium' to={Paths.HOME}>
            <Icon name='Home' />
         </Link>
         {Array.isArray(breadcrumbs) &&
            breadcrumbs?.map((item, index) => (
               <Box className='inline-flex items-center space-x-2' key={index}>
                  <Icon name='ChevronRight' />
                  <Link to={item.path}>{item.name}</Link>
               </Box>
            ))}
      </Breadcrumb>
   )
}

const Breadcrumb = tw.div`flex items-center space-x-2`

export default NavbarBreadcrumb
