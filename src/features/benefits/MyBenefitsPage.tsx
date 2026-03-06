import { useQuery } from '@tanstack/react-query'
import { getEmployeeBenefits } from '@/api/benefits'
import { getBenefits } from '@/api/benefits'
import { useAuth } from '@/contexts/AuthContext'

export function MyBenefitsPage() {
  const { user } = useAuth()
  const { data: assigned } = useQuery({
    queryKey: ['employeeBenefits', user?.id],
    queryFn: () => (user ? getEmployeeBenefits(user.id) : []),
    enabled: !!user,
  })
  const { data: allBenefits } = useQuery({
    queryKey: ['benefits'],
    queryFn: () => getBenefits(),
    enabled: !!user,
  })

  const benefitIds = assigned?.map((a) => a.benefitId) ?? []
  const myBenefits = allBenefits?.filter((b) => benefitIds.includes(b.id)) ?? []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">My benefits</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6">
        <ul className="space-y-3">
          {myBenefits.map((b) => (
            <li key={b.id} className="text-edmark-dark-blue">
              <span className="font-medium">{b.name}</span>
              <span className="text-edmark-neutral-700 ml-2">({b.type})</span>
            </li>
          ))}
          {myBenefits.length === 0 && (
            <li className="text-edmark-neutral-700">No benefits assigned.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
