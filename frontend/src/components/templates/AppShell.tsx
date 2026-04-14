import { Outlet } from 'react-router-dom'
import { Sidebar } from './SideBar'
import { Toaster } from '@/components/ui/sonner'

export function AppShell() {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-6xl p-6">
          <Outlet />
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}