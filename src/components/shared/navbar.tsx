//import { UserDropdown } from '@/features/auth/components/userDropdown'

import { UserDropdown } from "@/features/auth/components/userDropdown"

export const Navbar = () => {
  return (
      <nav className="sticky top-0 z-50 py-4 bg-blue-400 border-b border-blue-600 shadow-sm">
    <div className="relative container flex items-center justify-end px-4 mx-auto">
      {/* Centered Title */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-black">
        NFL
      </h1>

      {/* Right-aligned User Dropdown */}
      <div className="relative z-50">
        <UserDropdown /> 
      </div>
    </div>
  </nav>
  )
}