export type OTRequestStatus = 'pending' | 'approved' | 'rejected'

export interface OTRequest {
  id: string
  userId: string
  date: string
  hours: number
  reason: string
  status: OTRequestStatus
  approverId?: string
  createdAt: string
}
