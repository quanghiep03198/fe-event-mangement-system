import { Tooltip as TooltipWrapper, TooltipContent, TooltipProvider, TooltipTrigger } from '..'

type TooltipProps = { content: string; dir?: 'top'; asChild?: boolean; side?: 'top' | 'bottom' | 'right' | 'left'; hidden?: boolean } & React.PropsWithChildren

const Tooltip: React.FC<TooltipProps> = (props) => {
   return (
      <TooltipProvider delayDuration={0}>
         <TooltipWrapper>
            <TooltipTrigger asChild={props.asChild} type='button'>
               {props.children}
            </TooltipTrigger>
            <TooltipContent className='z-[100]' side={props.side} hidden={props.hidden}>
               {props.content}
            </TooltipContent>
         </TooltipWrapper>
      </TooltipProvider>
   )
}

Tooltip.defaultProps = {
   side: 'top'
}

export default Tooltip
