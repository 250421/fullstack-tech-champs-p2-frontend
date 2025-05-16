import { UserDropdown } from "@/features/auth/components/userDropdown"

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 py-4.5 bg-gray-800 border-b border-gray-800 shadow-sm">
      <div className="relative w-full flex items-center px-4 mx-auto">
        
        {/* Centered Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white">
          NFL Fantasy Draft
        </h1>

        {/* Right-aligned User Dropdown */}
        <div className="ml-auto z-50">
          <UserDropdown />
        </div>
      </div>
    </nav>
  )
}
