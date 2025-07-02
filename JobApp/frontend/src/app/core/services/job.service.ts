import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPosting } from '../../shared/models/job-posting.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobpostings`;

  constructor(private http: HttpClient) {}

  getActiveJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(this.apiUrl);
  }

  getAllJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.apiUrl}/all`);
  }

  getJobById(id: string): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.apiUrl}/${id}`);
  }

  createJob(jobData: Partial<JobPosting>): Observable<JobPosting> {
    return this.http.post<JobPosting>(this.apiUrl, jobData);
  }

  updateJob(id: string, jobData: JobPosting): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, jobData);
  }
}