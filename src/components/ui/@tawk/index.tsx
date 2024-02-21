import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

const TawkMessenger: React.FunctionComponent = () => {
   return <TawkMessengerReact propertyId={import.meta.env.VITE_TAWK_PROPERTY_ID} widgetId={import.meta.env.VITE_TAWK_WIDGET_ID} />
}

export default TawkMessenger
