export type JobStatus = 'draft' | 'open' | 'closed'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'offer' | 'rejected' | 'hired'

export interface JobPosting {
  id: string
  branchId: string
  countryId: string
  title: string
  description: string
  department: string
  status: JobStatus
  createdBy: string
  createdAt: string
  deadline?: string
}

export interface Application {
  id: string
  jobId: string
  applicantName: string
  applicantEmail: string
  applicantPhone?: string
  resumeRef?: string
  coverLetterRef?: string
  status: ApplicationStatus
  appliedAt: string
}

export interface Interview {
  id: string
  applicationId: string
  scheduledAt: string
  locationOrLink?: string
  notes?: string
}

export interface InterviewFeedback {
  id: string
  interviewId: string
  reviewerId: string
  score?: number
  feedback: string
  submittedAt: string
}

export interface Offer {
  id: string
  applicationId: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  documentRef?: string
  createdAt: string
}
