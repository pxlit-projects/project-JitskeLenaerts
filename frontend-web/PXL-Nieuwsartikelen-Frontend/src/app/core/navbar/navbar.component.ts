import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }

  isRedacteur(): boolean {
    return this.authService.isRedacteur();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
