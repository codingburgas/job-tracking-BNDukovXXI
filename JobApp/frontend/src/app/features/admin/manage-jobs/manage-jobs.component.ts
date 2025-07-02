import { Component, OnInit } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { JobPosting } from '../../../shared/models/job-posting.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
// TODO: Add component for creating/editing jobs later
// import { MatDialog } from '@angular/material/dialog';
// import { JobEditDialogComponent } from '../job-edit-dialog/job-edit-dialog.component';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.scss']
})
export class ManageJobsComponent implements OnInit {
  jobs: JobPosting[] = [];
  isLoading = true;
  displayedColumns: string[] = ['title', 'company', 'datePosted', 'status', 'actions'];

  constructor(
    private jobService: JobService,
    private router: Router
    // private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false,
    });
  }

  viewApplications(jobId: string): void {
    this.router.navigate(['/admin/applications', jobId]);
  }

  // TODO: Implement create/edit functionality
   openEditDialog(job?: JobPosting): void {
  //   const dialogRef = this.dialog.open(JobEditDialogComponent, {
  //     width: '600px',
  //     data: job ? { ...job } : {}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.loadJobs();
  //     }
  //   });
 }
}