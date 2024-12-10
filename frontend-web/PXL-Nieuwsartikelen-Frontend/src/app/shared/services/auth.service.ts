import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null; 

  constructor(private router: Router) {}

  private users: User[] = [
    { username: 'redacteur', password: 'redacteur123', role: 'redacteur' },
    { username: 'gebruiker', password: 'gebruiker123', role: 'gebruiker' },
  ];

  login(username: string, password: string): boolean {
    const user = this.users.find((u) => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isRedacteur(): boolean {
    return this.currentUser?.role === 'redacteur';
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
