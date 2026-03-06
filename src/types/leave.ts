export type LeaveRequestStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface LeaveType {
  id: string
  countryId: string
  name: string
  maxDays?: number
  carryOver?: number
}

export interface LeaveBalance {
  id: string
  userId: string
  leaveTypeId: string
  year: number
  accrued: number
  used: number
  carriedOver: number
}

export interface LeaveRequest {
  id: string
  userId: string
  leaveTypeId: string
  start: string
  end: string
  days: number
  status: LeaveRequestStatus
  approverId?: string
  comments?: string
  createdAt: string
}
