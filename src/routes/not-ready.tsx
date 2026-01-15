import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'

export const Route = createFileRoute('/not-ready')({
  component: NotReadyPage,
})

function NotReadyPage() {
  return (
    <div className="flex-1">
        <div className={`absolute bg-bg-blue w-full h-full -z-10`}/>
        <div className={clsx(
            "flex flex-col items-center justify-center h-[40rem] z-10"
        )}>
            <div className={clsx(
                `bg-bg border-bg-highlight border-[1px]`,
                "font-mono shadow-md rounded-md flex flex-col items-center justify-center"
            )}>
                <h1 className={`font-bold text-text p-4 text-6xl`}>(╯°□°）╯︵ ┻━┻</h1>
                <div className={`bg-bg-highlight w-full h-[1px] mt-4`}/>
                <p className={`font-medium text-sm italic text-text p-4`}>This page isn't ready for you to see yet! Check back again soon</p>
            </div>
        </div>
    </div>
  )
}
