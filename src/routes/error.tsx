import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/components/NavBar'
import clsx from 'clsx'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/error')({
  component: ErrorPage,
})

export function ErrorPage() {
  return (
    <div className="flex-1">
      <NavBar />
      <div className={`absolute bg-bg-blue w-full h-full -z-10`} />
      <div className={clsx(
        "flex flex-col items-center justify-center h-[40rem] z-10"
      )}>
        <div className={clsx(
          `bg-bg border-bg-highlight border-[1px]`,
          "font-mono shadow-md rounded-md flex flex-col items-center justify-center"
        )}>
          <h1 className={`font-bold text-text p-4 text-6xl`}>(ಥ⌣ಥ)</h1>
          <div className={`bg-bg-highlight w-full h-[1px] mt-4`} />
          <p className={`font-medium text-sm italic text-text p-4`}>We couldn't find the page you're looking for! (404)</p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
