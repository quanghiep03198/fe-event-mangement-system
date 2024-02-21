import { cn } from '@/common/utils/cn'
import React, { Fragment, useRef, useState } from 'react'
import { Icon, Skeleton } from '..'

type ImageProps = React.HTMLProps<HTMLImageElement>

export const Image: React.FC<ImageProps> = (props) => {
   const [isError, setIsError] = useState<boolean>(false)
   const [isLoaded, setIsLoaded] = useState<boolean>(false)
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

   const handleError: React.ReactEventHandler<HTMLImageElement> = async ({ currentTarget }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      await Promise.resolve(setTimeout(() => setIsLoaded(true), 0))
      if (props.src) setIsError(true)
      currentTarget.onerror = null // prevents looping
   }

   return (
      <Fragment>
         <Skeleton style={{ width: props.width, height: props.height }} className={cn('!m-0', props.className, { hidden: isLoaded })} />
         <div
            className={cn(props.className, '!m-0 items-center justify-center rounded-lg bg-accent/50', {
               hidden: Boolean(props.src) && !isError,
               flex: !props.src || isError
            })}
            style={{ width: props.width, height: props.height }}
         >
            <Icon name='Image' size={32} strokeWidth={1} className='text-muted-foreground/50' />
         </div>
         <img
            className={cn('!m-0', props.className, { hidden: !isLoaded || isError || !props.src })}
            src={props.src}
            alt={props.alt ?? 'image'}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            width={props.width}
            height={props.height}
         />
      </Fragment>
   )
}
