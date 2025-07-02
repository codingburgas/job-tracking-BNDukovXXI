import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.isLoggedIn()) {
    // Ако потребителят е логнат, му позволяваме достъп.
    return true;
  }

  notificationService.showError('Трябва да влезете в системата, за да достъпите тази страница.');
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  notificationService.showError('Нямате права за достъп до тази секция.');
  router.navigate(['/jobs']);
  return false;
};