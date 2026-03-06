export type ExpenseClaimStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface ExpenseClaim {
  id: string
  userId: string
  status: ExpenseClaimStatus
  submittedAt?: string
  approverId?: string
  createdAt: string
}

export interface ExpenseItem {
  id: string
  claimId: string
  category: string
  amount: number
  currency: string
  receiptRef?: string
  description?: string
}
