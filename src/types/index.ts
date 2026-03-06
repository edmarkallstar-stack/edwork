export type Role = 'super_admin' | 'country_hr' | 'branch_hr' | 'branch_manager' | 'employee'

export interface Organisation {
  id: string
  name: string
}

export interface Country {
  id: string
  name: string
  code: string
  timezone: string
  organisationId: string
}

export interface Branch {
  id: string
  name: string
  countryId: string
  address?: string
  timezone: string
}

export interface Department {
  id: string
  name: string
  branchId: string
}

export interface User {
  id: string
  email: string
  displayName: string
  role: Role
  branchId: string | null
  countryId: string | null
  departmentId: string | null
  jobTitle: string | null
  employeeId: string | null
  managerId: string | null
  joinDate: string | null
  status: 'active' | 'offboarded'
  photoURL: string | null
  authUid: string
}

export interface EmployeeProfile extends User {
  phone?: string
  emergencyContact?: string
  address?: string
}
