import { cn } from '@/common/utils/cn'
import React, { useEffect, useRef, useState } from 'react'
import { Icon, Skeleton } from '..'
import { isEmpty } from 'lodash'

type ImageProps = { fallback?: string } & React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = (props) => {
   const [error, setError] = useState<boolean>(false)

   const handleError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
      currentTarget.onerror = null // prevents looping
      if (props.fallback) {
         currentTarget.src = props.fallback
      }
      setError(true)
   }

   if ((error && !props.fallback) || isEmpty(props.src))
      return (
         <div
            className={cn(props.className, '!m-0 flex items-center justify-center rounded-lg bg-accent/50')}
            style={{ width: props.width, height: props.height }}
         >
            <Icon name='Image' size={32} strokeWidth={1} className='text-muted-foreground/50' />
         </div>
      )

   return <img loading='lazy' className={cn(props.className)} src={props.src} onError={handleError} width={props.width} height={props.height} />
}
