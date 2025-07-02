import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Application } from '../../../shared/models/application.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { JobService } from '../../../core/services/job.service';
import { JobPosting } from '../../../shared/models/job-posting.model';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, MatTableModule, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss']
})
export class ManageApplicationsComponent implements OnInit {
  applications: Application[] = [];
  job: JobPosting | null = null;
  isLoading = true;
  jobId: string | null = null;
  displayedColumns: string[] = ['applicantName', 'dateApplied', 'status', 'actions'];
  applicationStatuses = ['Submitted', 'ApprovedForInterview', 'Rejected'];

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    if (this.jobId) {
      this.loadData(this.jobId);
    }
  }

  loadData(jobId: string): void {
    this.isLoading = true;
    this.jobService.getJobById(jobId).subscribe(jobData => {
      this.job = jobData;
    });

    this.applicationService.getApplicationsForJob(jobId).subscribe(appData => {
      this.applications = appData;
      this.isLoading = false;
    });
  }

  changeStatus(application: Application, newStatus: string): void {
    this.applicationService.updateStatus(application.id, newStatus).subscribe({
      next: () => {
        application.status = newStatus as any;
        this.notificationService.showSuccess('Статусът е променен успешно.');
      },
      error: () => this.notificationService.showError('Грешка при промяна на статус.')
    });
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'ApprovedForInterview': return 'Одобрен за интервю';
      case 'Rejected': return 'Отказана';
      case 'Submitted':
      default: return 'Подадена';
    }
  }
}