import { useAppSelector } from '@/redux/hook'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import { useEffect, useRef } from 'react'

const TawkMessenger: React.FunctionComponent = () => {
   const authenticated = useAppSelector((state) => state.auth.authenticated)
   const ref = useRef<typeof TawkMessengerReact.prototype>(null!)

   useEffect(() => {
      if (authenticated) ref.current.showWidget()
      else ref.current.onLoad = ref.current.hideWidget()
   }, [authenticated])

   return <TawkMessengerReact ref={ref} propertyId={import.meta.env.VITE_TAWK_PROPERTY_ID} widgetId={import.meta.env.VITE_TAWK_WIDGET_ID} />
}

export default TawkMessenger
