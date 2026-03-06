import { useQuery } from '@tanstack/react-query'
import { getCountries, getBranches } from '@/api/firestore'
import type { Country, Branch } from '@/types'

export function OrgStructurePage() {
  const { data: countries } = useQuery<Country[]>({ queryKey: ['countries'], queryFn: getCountries })
  const { data: branches } = useQuery<Branch[]>({ queryKey: ['branches'], queryFn: () => getBranches() })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">Organisation structure</h2>
      <section>
        <h3 className="text-lg font-medium text-edmark-dark-blue mb-3">Countries</h3>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-edmark-neutral-200">
            <thead className="bg-edmark-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edmark-neutral-200">
              {(countries ?? []).map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-sm text-edmark-dark-blue">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-edmark-neutral-700">{c.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!countries || countries.length === 0) && (
            <div className="px-4 py-8 text-center text-edmark-neutral-700">No countries yet.</div>
          )}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-medium text-edmark-dark-blue mb-3">Branches</h3>
        <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-edmark-neutral-200">
            <thead className="bg-edmark-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edmark-neutral-200">
              {(branches ?? []).map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 text-sm text-edmark-dark-blue">{b.name}</td>
                  <td className="px-4 py-3 text-sm text-edmark-neutral-700">
                    {countries?.find((c) => c.id === b.countryId)?.name ?? b.countryId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!branches || branches.length === 0) && (
            <div className="px-4 py-8 text-center text-edmark-neutral-700">No branches yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}
