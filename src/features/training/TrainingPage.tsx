import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  seedTrainingCourses,
} from '@/api/training'
import type { Course } from '@/types/training'

export function TrainingPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    order: 0,
    isPublished: true,
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      createCourse({
        ...form,
        createdAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setShowAdd(false)
      setForm({ title: '', description: '', videoUrl: '', order: courses.length, isPublished: true })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })

  const seedMutation = useMutation({
    mutationFn: seedTrainingCourses,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })

  const startEdit = (c: Course) => {
    setEditingId(c.id)
    setForm({
      title: c.title,
      description: c.description,
      videoUrl: c.videoUrl,
      order: c.order,
      isPublished: c.isPublished,
    })
  }

  const saveEdit = () => {
    if (!editingId) return
    updateMutation.mutate({
      id: editingId,
      data: {
        title: form.title,
        description: form.description,
        videoUrl: form.videoUrl,
        order: form.order,
        isPublished: form.isPublished,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-edmark-dark-blue">Training & development</h2>
          <p className="text-edmark-neutral-700">Manage video courses for staff training.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="px-3 py-2 border border-edmark-neutral-200 rounded-md text-sm hover:bg-edmark-neutral-50 disabled:opacity-50"
          >
            {seedMutation.isPending ? 'Seeding…' : 'Seed sample courses'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAdd(true)
              setForm({
                title: '',
                description: '',
                videoUrl: '',
                order: courses.length,
                isPublished: true,
              })
            }}
            className="px-3 py-2 bg-edmark-dark-blue text-white rounded-md text-sm hover:bg-edmark-dark-blue/90"
          >
            Add course
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white border border-edmark-neutral-200 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-edmark-dark-blue">New course</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                placeholder="Course title"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                rows={2}
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video URL (embed)</label>
              <input
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-published"
                checked={form.isPublished}
                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                className="rounded border-edmark-neutral-300"
              />
              <label htmlFor="add-published" className="text-sm">Published (visible to staff)</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.title.trim()}
              className="px-4 py-2 bg-edmark-dark-blue text-white rounded-md hover:bg-edmark-dark-blue/90 disabled:opacity-50"
            >
              Save course
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border border-edmark-neutral-200 rounded-md hover:bg-edmark-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-edmark-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-edmark-neutral-200">
          <thead className="bg-edmark-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-edmark-dark-blue">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-edmark-dark-blue">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edmark-neutral-200">
            {courses
              .filter((c) => !c.id.startsWith('mock-'))
              .map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-sm">{c.order}</td>
                  <td className="px-4 py-3 text-sm font-medium text-edmark-dark-blue">{c.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                        c.isPublished ? 'bg-green-100 text-green-800' : 'bg-edmark-neutral-100 text-edmark-neutral-700'
                      }`}
                    >
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === c.id ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={updateMutation.isPending}
                          className="text-sm text-edmark-dark-blue hover:underline disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-sm text-edmark-neutral-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="text-sm text-edmark-dark-blue hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this course?')) deleteMutation.mutate(c.id)
                          }}
                          className="text-sm text-edmark-red hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            {editingId && (
              <tr className="bg-edmark-neutral-50/50">
                <td colSpan={4} className="px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Video URL</label>
                      <input
                        value={form.videoUrl}
                        onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Order</label>
                      <input
                        type="number"
                        min={0}
                        value={form.order}
                        onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-edmark-neutral-200 rounded-md"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-published"
                        checked={form.isPublished}
                        onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                        className="rounded border-edmark-neutral-300"
                      />
                      <label htmlFor="edit-published" className="text-sm">Published</label>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {courses.filter((c) => !c.id.startsWith('mock-')).length === 0 && (
          <div className="px-4 py-8 text-center text-edmark-neutral-700">
            No courses yet. Add one or seed sample courses.
          </div>
        )}
      </div>
    </div>
  )
}
