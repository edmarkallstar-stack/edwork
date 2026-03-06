import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/routes'
import { AppShell } from '@/components/AppShell'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardEmployee } from '@/features/dashboard/DashboardEmployee'
import { DashboardManager } from '@/features/dashboard/DashboardManager'
import { DashboardHR } from '@/features/dashboard/DashboardHR'
import { DashboardSuperAdmin } from '@/features/dashboard/DashboardSuperAdmin'
import { EmployeeListPage } from '@/features/employees/EmployeeListPage'
import { JobPostingsPage } from '@/features/recruitment/JobPostingsPage'
import { JobPostingFormPage } from '@/features/recruitment/JobPostingFormPage'
import { OnboardingTemplatesPage } from '@/features/onboarding/OnboardingTemplatesPage'
import { OrgStructurePage } from '@/features/policies/OrgStructurePage'
import { MyTimesheetPage, TimesheetHistoryPage } from '@/features/attendance/MyTimesheetPage'
import { LeaveRequestPage } from '@/features/leave/LeaveRequestPage'
import { OTRequestPage } from '@/features/ot/OTRequestPage'
import { PublicHolidaysPage } from '@/features/holidays/PublicHolidaysPage'
import { ApprovalsQueuePage } from '@/features/approvals/ApprovalsQueuePage'
import { MyBenefitsPage } from '@/features/benefits/MyBenefitsPage'
import { MyExpensesPage } from '@/features/expenses/MyExpensesPage'
import { MyRequestsPage } from '@/features/staff/MyRequestsPage'
import { MyPayslipsPage } from '@/features/payroll/MyPayslipsPage'
import { PerformancePage } from '@/features/performance/PerformancePage'
import { ContractsPage } from '@/features/contracts/ContractsPage'
import { TrainingPage } from '@/features/training/TrainingPage'
import { OffboardingPage } from '@/features/offboarding/OffboardingPage'
import { AssetsPage } from '@/features/assets/AssetsPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { BulkImportExportPage } from '@/features/reports/BulkImportExportPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-edmark-neutral-50">
        <div className="text-edmark-dark-blue font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route path="staff" element={<StaffLayout />}>
          <Route index element={<DashboardEmployee />} />
          <Route path="timesheet" element={<MyTimesheetPage />} />
          <Route path="timesheet/history" element={<TimesheetHistoryPage />} />
          <Route path="leave" element={<LeaveRequestPage />} />
          <Route path="ot" element={<OTRequestPage />} />
          <Route path="benefits" element={<MyBenefitsPage />} />
          <Route path="expenses" element={<MyExpensesPage />} />
          <Route path="requests" element={<MyRequestsPage />} />
          <Route path="payslips" element={<MyPayslipsPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="recruitment/jobs" element={<JobPostingsPage />} />
          <Route path="recruitment/jobs/new" element={<JobPostingFormPage />} />
          <Route path="onboarding/templates" element={<OnboardingTemplatesPage />} />
          <Route path="org-structure" element={<OrgStructurePage />} />
          <Route path="holidays" element={<PublicHolidaysPage />} />
          <Route path="approvals" element={<ApprovalsQueuePage />} />
          <Route path="payroll" element={<ReportsPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="offboarding" element={<OffboardingPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="bulk" element={<BulkImportExportPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'employee') return <Navigate to="/staff" replace />
  return <Navigate to="/admin" replace />
}

function StaffLayout() {
  return <Outlet />
}

function AdminLayout() {
  return <Outlet />
}

function AdminDashboard() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'employee') return <Navigate to="/staff" replace />
  if (user.role === 'branch_manager') return <DashboardManager />
  if (user.role === 'branch_hr' || user.role === 'country_hr') return <DashboardHR />
  return <DashboardSuperAdmin />
}

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-edmark-neutral-50">
      <div className="text-center text-edmark-dark-blue">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-edmark-neutral-700">You do not have permission to view this page.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
