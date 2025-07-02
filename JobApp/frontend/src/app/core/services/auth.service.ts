import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin' | 'User';
  email: string;
}

interface User {
  id: string;
  role: 'Admin' | 'User';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loadUserFromToken();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }
  
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // '!!' превръща стойността в boolean
  }

  public getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  public isAdmin(): boolean {
    return this.userSubject.value?.role === 'Admin';
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        
        const expiry = (decodedToken as any).exp;
        if (expiry * 1000 < Date.now()) {
          this.logout(); // Токенът е изтекъл, изчистваме всичко
          return;
        }

        const user: User = {
          id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          email: decodedToken.email,
        };
        this.userSubject.next(user);
      } catch (error) {
        console.error("Failed to decode token", error);
        this.logout();
      }
    }
  }
}