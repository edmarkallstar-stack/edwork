export interface Timesheet {
  id: string
  userId: string
  branchId: string
  date: string
  checkIn?: string
  checkOut?: string
  breakMinutes?: number
  timezone: string
}

export interface WorkSchedule {
  id: string
  branchId?: string
  countryId?: string
  name: string
  type: 'standard' | 'rotating' | 'partTime'
  daysOfWeek?: number[]
  startTime?: string
  endTime?: string
  breakMinutes?: number
}

export interface PublicHoliday {
  id: string
  countryId: string
  date: string
  name: string
  year: number
  isSubstitute?: boolean
}
