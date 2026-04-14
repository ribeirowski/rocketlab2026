import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Produtos", icon: Package },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r bg-card">
      <div className="flex h-13 items-center gap-2.5 border-b px-4">
        {/* Logo Vitrine */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          aria-label="Vitrine"
        >
          <rect width="26" height="26" rx="7" fill="hsl(var(--primary))" />
          <path
            d="M7 9h12M7 13h8M7 17h10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="19" cy="17" r="2.5" fill="white" />
        </svg>
        <span className="text-sm font-semibold tracking-tight">Vitrine</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
