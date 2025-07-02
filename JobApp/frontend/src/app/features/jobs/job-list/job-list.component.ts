import { Component, OnInit } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { JobPosting } from '../../../shared/models/job-posting.model';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgOptimizedImage, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  isLoading = true;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getActiveJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
        this.isLoading = false;
      }
    });
  }
}