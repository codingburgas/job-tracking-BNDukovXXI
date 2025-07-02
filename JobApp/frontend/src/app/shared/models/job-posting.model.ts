export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  datePosted: Date;
  status: 'Active' | 'Inactive';
}