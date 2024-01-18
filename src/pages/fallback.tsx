import '@/styles/nprogress.css'

import { useEffect } from 'react'
import nProgress from 'nprogress'

const Fallback: React.FunctionComponent = () => {
   nProgress.configure({
      showSpinner: false
   })
   useEffect(() => {
      nProgress.start()

      return () => {
         nProgress.done()
      }
   }, [])

   return null
}

export default Fallback
