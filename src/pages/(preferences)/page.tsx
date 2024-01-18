import { Box, Icon, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from '@/components/ui'
import { useEffect } from 'react'
import Header from './components/header/index.tsx'

import useQueryParams from '@/common/hooks/use-query-params'
import AccountSettingsPanel from './components/account-settings/index.tsx'
import ChangePasswordPanel from './components/change-password/index.tsx'
const PreferencesPage: React.FunctionComponent = () => {
   const [params, setParam] = useQueryParams('tab')

   useEffect(() => {
      if (!params.tab) setParam('tab', 'account-settings')
   }, [])

   return (
      <Box className='flex h-screen flex-col items-stretch gap-y-10 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/25'>
         <Header />
         <Box className='mx-auto w-full max-w-7xl p-10 sm:p-4'>
            <Tabs className='w-full space-y-10' value={params.tab} onValueChange={(value) => setParam('tab', value)}>
               <Box className='mx-auto flex max-w-7xl items-start justify-between sm:flex-col sm:gap-y-6'>
                  <Box className='space-y-1'>
                     <Typography variant='h5'>Cài đặt</Typography>
                     <Typography variant='small' color='muted'>
                        Cập nhật thông tin tài khoản và bảo mật
                     </Typography>
                  </Box>
                  <TabsList className='grid grid-cols-2 sm:w-full'>
                     <TabsTrigger value='account-settings' className='gap-x-2'>
                        <Icon name='UserRound' /> Cài đặt tài khoản
                     </TabsTrigger>
                     <TabsTrigger value='change-password' className='gap-x-2'>
                        <Icon name='KeyRound' /> Đổi mật khẩu
                     </TabsTrigger>
                  </TabsList>
               </Box>
               <Box className='mx-auto max-w-7xl'>
                  <TabsContent value='account-settings'>
                     <AccountSettingsPanel />
                  </TabsContent>
                  <TabsContent value='change-password'>
                     <ChangePasswordPanel />
                  </TabsContent>
               </Box>
            </Tabs>
         </Box>
      </Box>
   )
}

export default PreferencesPage
