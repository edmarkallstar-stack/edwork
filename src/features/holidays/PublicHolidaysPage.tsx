import { useQuery } from '@tanstack/react-query'
import { getFirebaseDb } from '@/config/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import type { PublicHoliday } from '@/types/attendance'
import { getCountries } from '@/api/firestore'

async function getPublicHolidays(countryId?: string, year?: number) {
  let q = query(collection(getFirebaseDb(), 'publicHolidays'))
  if (countryId) q = query(q, where('countryId', '==', countryId))
  if (year != null) q = query(q, where('year', '==', year))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PublicHoliday))
}

export function PublicHolidaysPage() {
  const year = new Date().getFullYear()
  const { data: countries } = useQuery({ queryKey: ['countries'], queryFn: getCountries })
  const { data: holidays } = useQuery({
    queryKey: ['publicHolidays', year],
    queryFn: () => getPublicHolidays(undefined, year),
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Public holidays ({year})</h2>
      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {(holidays ?? []).map((h) => (
              <tr key={h.id}>
                <td className="px-4 py-3 text-sm">{h.date}</td>
                <td className="px-4 py-3 text-sm">{h.name}</td>
                <td className="px-4 py-3 text-sm text-edmark-neutral-700">
                  {countries?.find((c) => c.id === h.countryId)?.name ?? h.countryId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!holidays || holidays.length === 0) && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">No public holidays configured.</div>
        )}
      </div>
    </div>
  )
}
