import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../shared/models/application.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, DatePipe, MatTableModule, MatChipsModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;
  displayedColumns: string[] = ['jobTitle', 'dateApplied', 'status'];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
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