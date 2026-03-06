import { useAuth } from '@/contexts/AuthContext'

export function DashboardHR() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">HR dashboard</h2>
      <p className="text-edmark-neutral-700">
        Welcome, {user?.displayName || user?.email}. HR operations and metrics.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Headcount" subtitle="By branch and country" />
        <DashboardCard title="Probation alerts" subtitle="Ending soon" />
        <DashboardCard title="Contract expiry" subtitle="Renewals due" />
        <DashboardCard title="Onboarding" subtitle="New joiners status" />
        <DashboardCard title="Payroll cycle" subtitle="Current period" />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="p-4 bg-white border border-edmark-neutral-200 rounded-lg shadow-sm">
      <h3 className="font-medium text-edmark-dark-blue">{title}</h3>
      <p className="text-sm text-edmark-neutral-700 mt-1">{subtitle}</p>
    </div>
  )
}
