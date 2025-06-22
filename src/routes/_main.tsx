import { createFileRoute, Outlet } from '@tanstack/react-router'
import NavBar from '@/components/NavBar'
import clsx from 'clsx'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/_main')({
  component: MainLayout,
})

function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}
