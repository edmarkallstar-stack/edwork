import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { createJobPosting } from '@/api/recruitment'
import { getBranches } from '@/api/firestore'
import { useAuth } from '@/contexts/AuthContext'
import type { Branch } from '@/types'

export function JobPostingFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [branchId, setBranchId] = useState('')

  const { data: branches } = useQuery<Branch[]>({ queryKey: ['branches'], queryFn: () => getBranches() })

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string
      description: string
      department: string
      branchId: string
      countryId: string
    }) =>
      createJobPosting({
        ...data,
        status: 'draft',
        createdBy: user?.id ?? '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] })
      navigate('/admin/recruitment/jobs')
    },
  })

  const branch = branches?.find((b) => b.id === branchId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!branch) return
    createMutation.mutate({
      title,
      description,
      department,
      branchId,
      countryId: branch.countryId,
    } as { title: string; description: string; department: string; branchId: string; countryId: string })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-edmark-dark-blue">New job posting</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-edmark-neutral-200 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-edmark-dark-blue mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-edmark-dark-blue mb-1">Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-edmark-dark-blue mb-1">Branch</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
          >
            <option value="">Select branch</option>
            {(branches ?? []).map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-edmark-dark-blue mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-edmark-red text-white rounded-md hover:bg-edmark-red/90 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/recruitment/jobs')}
            className="px-4 py-2 border border-edmark-neutral-200 rounded-md text-edmark-dark-blue"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
