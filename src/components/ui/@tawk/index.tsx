import { useAppSelector } from '@/redux/hook'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import { useRef } from 'react'

const TawkMessenger: React.FunctionComponent = () => {
   const authenticated = useAppSelector((state) => state.auth.authenticated)
   const ref = useRef<typeof TawkMessengerReact.prototype>()

   const handleLoad = () => {
      if (!ref.current) return
      console.log(ref.current)
      if (authenticated) ref.current.showWidget()
      else ref.current.hideWidget()
   }

   handleLoad()

   return <TawkMessengerReact ref={ref} propertyId={import.meta.env.VITE_TAWK_PROPERTY_ID} widgetId={import.meta.env.VITE_TAWK_WIDGET_ID} onLoad={handleLoad} />
}

export default TawkMessenger
