import { Box } from '@/components/ui'
import { VerticalPlaceholderCard } from '../components/shared/event-placeholder-card'

const Loading: React.FunctionComponent = () => {
   const presetItems = Array.apply(null, Array(12)).map((_, i) => i)
   return (
      <Box className='grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-1 md:md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:gap-x-6'>
         {presetItems.map((item) => (
            <VerticalPlaceholderCard key={item} />
         ))}
      </Box>
   )
}

export default Loading
