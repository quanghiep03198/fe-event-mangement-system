import './styles/index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { Theme } from './common/constants/enums'
import { ThemeProvider } from './components/providers/theme-provider'
import { persistor, store } from './redux/store'
import Router from './routes'

const theme = (localStorage.getItem('theme') ?? 'system') as Theme

console.log(1)

ReactDOM.createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <PersistGate persistor={persistor}>
         <ThemeProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
               <Router />
               <Toaster
                  theme={theme}
                  expand={true}
                  closeButton={true}
                  toastOptions={{
                     unstyled: true,
                     classNames: {
                        toast: 'bg-background shadow gap-x-2 flex items-start border p-4 min-w-[20rem] rounded-lg text-xs',
                        title: 'text-foreground',
                        closeButton: 'text-muted-foreground right-0 top-0',
                        description: 'text-foreground',
                        actionButton: 'hover:!bg-accent !border-solid !border !border-border',
                        cancelButton: 'hover:!bg-accent !border-solid !border !border-border'
                     },
                     duration: 2000
                  }}
               />
            </GoogleOAuthProvider>
         </ThemeProvider>
      </PersistGate>
   </Provider>
)
