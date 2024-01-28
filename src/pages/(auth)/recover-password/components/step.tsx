import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/ui'

export type StepItem = {
   index: number
   name: string
   href: React.ComponentProps<typeof Link>['to']
   status: 'current' | 'upcoming' | 'completed'
}

export const Steps: React.FC<{ data: Array<StepItem> }> = ({ data }) => {
   return (
      <nav aria-label='Progress' className='w-full'>
         <ol role='list' className='flex divide-y-0 divide-border rounded-md border sm:flex-col sm:divide-y'>
            {data.map((step, stepIndex) => (
               <li key={step.name} className='relative flex flex-1'>
                  {step.status === 'completed' ? (
                     <Link to={step.href} className='group flex w-full items-center'>
                        <span className='flex items-center px-6 py-4 text-sm font-medium'>
                           <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/80'>
                              <Icon name='Check' size={24} className='text-primary-foreground' aria-hidden='true' />
                           </span>
                           <span className='ml-4 text-sm font-medium text-foreground'>{step.name}</span>
                        </span>
                     </Link>
                  ) : step.status === 'current' ? (
                     <Link to={step.href} className='flex items-center px-6 py-4 text-sm font-medium' aria-current='step'>
                        <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary'>
                           <span className='text-primary'>{step.index}</span>
                        </span>
                        <span className='ml-4 text-sm font-medium text-primary'>{step.name}</span>
                     </Link>
                  ) : (
                     <Link to={step.href} className='group flex items-center'>
                        <span className='flex items-center px-6 py-4 text-sm font-medium'>
                           <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 duration-200 group-hover:border-muted-foreground'>
                              <span className='text-muted-foreground duration-200 group-hover:text-foreground'>{step.index}</span>
                           </span>
                           <span className='ml-4 text-sm font-medium text-muted-foreground duration-200 group-hover:text-foreground'>{step.name}</span>
                        </span>
                     </Link>
                  )}

                  {stepIndex !== data.length - 1 ? (
                     <>
                        {/* Arrow separator for lg screens and up */}
                        <div className='absolute right-0 top-0  h-full w-5 sm:hidden' aria-hidden='true'>
                           <svg className='h-full w-full text-border' viewBox='0 0 22 80' fill='none' preserveAspectRatio='none'>
                              <path d='M0 -2L20 40L0 82' vectorEffect='non-scaling-stroke' stroke='currentcolor' strokeLinejoin='round' />
                           </svg>
                        </div>
                     </>
                  ) : null}
               </li>
            ))}
         </ol>
      </nav>
   )
}
