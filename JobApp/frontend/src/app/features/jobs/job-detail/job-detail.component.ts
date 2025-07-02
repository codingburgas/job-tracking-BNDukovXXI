import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { JobPosting } from '../../../shared/models/job-posting.model';
import { Observable, of, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Application } from '../../../shared/models/application.model';
import { Nl2brPipe } from '../../../shared/pipes/nl2br.pipe';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule, MatIconModule, Nl2brPipe],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job: JobPosting | null = null;
  isLoading = true;
  isApplying = false;
  hasApplied = false;
   user$: Observable<any | null>;
  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
this.user$ = this.authService.user$;
  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.isLoading = false;
      return;
    }

    this.jobService.getJobById(jobId).pipe(
      switchMap(jobData => {
        this.job = jobData;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.role !== 'User') {
          return of(false);
        }
        return this.checkIfApplied(currentUser.id, jobId);
      })
    ).subscribe({
      next: (applied) => {
        this.hasApplied = applied;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private checkIfApplied(userId: string, jobId: string): Observable<boolean> {
    return this.applicationService.getMyApplications().pipe(
      switchMap((applications: Application[]) => {
        return of(applications.some(app => app.jobPostingId === jobId));
      })
    );
  }

  apply(): void {
    if (!this.job) return;

    this.isApplying = true;
    this.applicationService.apply(this.job.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Успешно кандидатствахте!');
        this.hasApplied = true;
        this.isApplying = false;
      },
      error: (err) => {
        this.notificationService.showError(err.error.message || 'Възникна грешка при кандидатстване.');
        this.isApplying = false;
      }
    });
  }
}