import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../../shared/models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}


  apply(jobPostingId: string): Observable<any> {
    return this.http.post(this.apiUrl, { jobPostingId });
  }


  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/my`);
  }

  getApplicationsForJob(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`);
  }


  updateStatus(applicationId: string, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${applicationId}/status`, { status });
  }
}