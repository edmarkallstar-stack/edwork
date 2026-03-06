export interface Benefit {
  id: string
  name: string
  countryId?: string
  branchId?: string
  type: string
  documentRef?: string
}

export interface EmployeeBenefit {
  id: string
  userId: string
  benefitId: string
  assignedAt: string
}
