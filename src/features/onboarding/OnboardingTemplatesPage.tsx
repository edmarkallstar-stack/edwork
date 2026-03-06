import { useQuery } from '@tanstack/react-query'
import { getFirebaseDb } from '@/config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { OnboardingTemplate } from '@/types/onboarding'

async function getTemplates(): Promise<OnboardingTemplate[]> {
  const snap = await getDocs(collection(getFirebaseDb(), 'onboardingTemplates'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OnboardingTemplate))
}

export function OnboardingTemplatesPage() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['onboardingTemplates'],
    queryFn: getTemplates,
  })

  if (isLoading) return <div className="text-edmark-neutral-700">Loading templates...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Onboarding templates</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(templates ?? []).map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 text-sm text-edmark-dark-blue">{t.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!templates || templates.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No onboarding templates yet.</div>
        )}
      </div>
    </div>
  )
}
