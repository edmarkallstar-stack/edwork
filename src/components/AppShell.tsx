import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function AppShell() {
  const { user, signOut, hasRole, isStaffAreaOnly } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isAdmin = hasRole('super_admin', 'country_hr', 'branch_hr', 'branch_manager')

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-edmark-neutral-50">
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-edmark-dark-blue text-white flex flex-col transition-transform duration-200 ease-out`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <span className="font-display font-bold text-lg">EDWORK</span>
          <button
            type="button"
            className="md:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink
            to="/staff"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {isStaffAreaOnly ? 'My dashboard' : 'Staff area'}
          </NavLink>
          <NavLink
            to="/staff/timesheet"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            My timesheet
          </NavLink>
          <NavLink
            to="/staff/leave"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Leave
          </NavLink>
          <NavLink
            to="/staff/ot"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            OT requests
          </NavLink>
          <NavLink
            to="/staff/benefits"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Benefits
          </NavLink>
          <NavLink
            to="/staff/expenses"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            My expenses
          </NavLink>
          <NavLink
            to="/staff/requests"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            My requests
          </NavLink>
          <NavLink
            to="/staff/payslips"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            My payslips
          </NavLink>
          {isAdmin && (
                <>
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Admin
                  </NavLink>
                  <NavLink
                    to="/admin/employees"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Employees
                  </NavLink>
                  <NavLink
                    to="/admin/recruitment/jobs"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Job postings
                  </NavLink>
                  <NavLink
                    to="/admin/onboarding/templates"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Onboarding
                  </NavLink>
                  <NavLink
                    to="/admin/org-structure"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Org structure
                  </NavLink>
                  <NavLink
                    to="/admin/holidays"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Public holidays
                  </NavLink>
                  <NavLink
                    to="/admin/approvals"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Approvals
                  </NavLink>
                  <NavLink
                    to="/admin/payroll"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Payroll
                  </NavLink>
                  <NavLink
                    to="/admin/performance"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Performance
                  </NavLink>
                  <NavLink
                    to="/admin/contracts"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Contracts
                  </NavLink>
                  <NavLink
                    to="/admin/training"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Training
                  </NavLink>
                  <NavLink
                    to="/admin/offboarding"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Offboarding
                  </NavLink>
                  <NavLink
                    to="/admin/assets"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Assets
                  </NavLink>
                  <NavLink
                    to="/admin/reports"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Reports
                  </NavLink>
                  <NavLink
                    to="/admin/bulk"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm pl-6 ${isActive ? 'bg-edmark-light-blue/20 text-edmark-light-blue' : 'hover:bg-white/10'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Bulk import/export
                  </NavLink>
                </>
              )}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/70 truncate px-2" title={user?.email}>
            {user?.displayName || user?.email}
          </div>
          <div className="text-xs text-white/50 truncate px-2">{user?.role}</div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm hover:bg-edmark-red/20 text-edmark-red"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-edmark-neutral-200 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-edmark-neutral-100 text-edmark-dark-blue"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="text-edmark-dark-blue font-semibold truncate">EDWORK</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
