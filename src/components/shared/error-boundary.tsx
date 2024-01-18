/**
 * @copyright PeoScouser98
 */

import { Component, ErrorInfo } from 'react'
import { Box, Icon, Typography } from '../ui'

type State = {
   hasError: boolean
   error: Error | null
   errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<React.PropsWithChildren, State> {
   public state: State = {
      hasError: false,
      error: null,
      errorInfo: null
   }

   public static getDerivedStateFromError(error: Error, errorInfo: ErrorInfo): State {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error, errorInfo }
   }

   public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Uncaught error:', error, errorInfo)
   }

   public render() {
      if (this.state.hasError) {
         return (
            <Box className='flex h-full items-start space-x-6'>
               <Icon name='AlertTriangle' size={48} className='text-destructive' />
               <Box>
                  <Typography variant='h6' className='mb-2'>
                     Something went wrong
                  </Typography>
                  <details className='whitespace-pre-wrap'>
                     {this.state.error && this.state.error.toString()}
                     <br />
                     {this.state.errorInfo?.componentStack}
                  </details>
               </Box>
            </Box>
         )
      }

      return this.props.children
   }
}

export default ErrorBoundary
