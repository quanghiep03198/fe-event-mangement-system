import { cn } from '@/common/utils/cn'
import React, { useEffect, useState } from 'react'
import { Icon, Skeleton } from '..'

type ImageProps = { fallback?: string } & React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = (props) => {
   const [error, setError] = useState<boolean>(false)
   const [loading, setLoading] = useState<boolean>(true)

   const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (props.fallback) e.currentTarget.src = props.fallback
      setError(true)
      setLoading(false)
   }

   useEffect(() => {
      setLoading(false)
   }, [])

   return (
      <div className='relative'>
         {loading && <Skeleton className='absolute inset-0 z-10' style={{ width: props.width, height: props.height }} />}
         {!loading && !error && (
            <img
               loading='lazy'
               className={cn(props.className)}
               src={props.src}
               onLoad={() => setLoading(false)}
               onLoadedMetadata={() => setLoading(false)}
               onError={handleError}
               width={props.width}
               height={props.height}
            />
         )}
         {!props.fallback && (
            <div
               className={cn(props.className, '!m-0 items-center justify-center rounded-lg bg-accent/50')}
               style={{ width: props.width, height: props.height, display: error ? 'flex' : 'none' }}
            >
               <Icon name='Image' size={32} strokeWidth={1} className='text-muted-foreground/50' />
            </div>
         )}
      </div>
   )
}
