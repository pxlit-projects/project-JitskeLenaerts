import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  private users: User[] = [
    { username: 'gebruiker1', password: 'gebruiker123', role: 'gebruiker', id: 1, authorName: 'Gebruiker Gevens' },
    { username: 'gebruiker2', password: 'gebruiker123', role: 'gebruiker', id: 2, authorName: 'Gebruiker Lenaerts' },
    { username: 'redacteur1', password: 'redacteur123', role: 'redacteur', id: 3, authorName: 'Redacteur Swinnen' },
    { username: 'redacteur2', password: 'redacteur123', role: 'redacteur', id: 4, authorName: 'Redacteur Subron' },
  ];

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find((u) => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      return true;
    }
    this.currentUser = null;
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isRedacteur(): boolean {
    return this.currentUser?.role === 'redacteur';
  }

  getCurrentUserRole(): User['role'] | null {
    return this.currentUser ? this.currentUser.role : null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(user => user.id === userId);
  }
}
