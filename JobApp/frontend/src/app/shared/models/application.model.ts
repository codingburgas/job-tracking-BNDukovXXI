export interface Application {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  applicantName: string;
  dateApplied: Date;
  status: 'Submitted' | 'ApprovedForInterview' | 'Rejected';
}