export interface OnboardingTemplate {
  id: string
  name: string
  countryId?: string
  branchId?: string
  taskIds: string[]
  createdAt: string
}

export interface OnboardingTaskDefinition {
  id: string
  title: string
  description?: string
}

export interface OnboardingTask {
  id: string
  userId: string
  templateId: string
  taskId: string
  title: string
  dueDate?: string
  completedAt?: string
  assignedTo?: string
}
