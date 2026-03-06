export interface CompensationProfile {
  id: string
  userId: string
  countryId: string
  currency: string
  payFrequency: 'monthly' | 'semiMonthly' | 'biWeekly' | 'weekly'
  baseSalary: number
  effectiveFrom: string
}

export interface PayrollCycle {
  id: string
  countryId: string
  periodStart: string
  periodEnd: string
  status: 'draft' | 'processed' | 'closed'
  payDate: string
}

export interface PayrollRun {
  id: string
  payrollCycleId: string
  userId: string
  grossPay: number
  deductions: number
  netPay: number
  status: string
}

export interface Payslip {
  id: string
  payrollRunId: string
  userId: string
  documentRef?: string
  publishedAt?: string
}
