import { Paths } from '@/common/constants/pathnames'
import AuthGuard from '@/guard/auth.guard'
import PreferencesPage from '@/pages/(preferences)/page'
import { RouteObject } from 'react-router-dom'

const userPreferencesRoutes: RouteObject = {
   path: Paths.ACCOUNT_SETTINGS,
   element: (
      <AuthGuard>
         <PreferencesPage />
      </AuthGuard>
   )
}

export default userPreferencesRoutes
