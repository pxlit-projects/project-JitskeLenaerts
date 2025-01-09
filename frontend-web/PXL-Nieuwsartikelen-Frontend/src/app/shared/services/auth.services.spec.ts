import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { of } from 'rxjs';

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let authService: AuthService;
  let routerMock: RouterMock;

  beforeEach(() => {
    routerMock = new RouterMock();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
      ],
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    it('should return true and store currentUser in localStorage and sessionStorage on successful login', () => {
      const username = 'gebruiker1';
      const password = 'gebruiker123';
      spyOn(localStorage, 'setItem');
      spyOn(sessionStorage, 'setItem');

      const result = authService.login(username, password);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(authService.getCurrentUser()));
      expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(authService.getCurrentUser()));
    });

    it('should return false if username or password is incorrect', () => {
      const result = authService.login('invalidUser', 'wrongPassword');
      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear currentUser and navigate to /home', () => {
      authService.logout();
      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(sessionStorage.getItem('currentUser')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if a user is logged in', () => {
      authService.login('gebruiker1', 'gebruiker123');
      expect(authService.isLoggedIn()).toBe(true);
    });

  });

  describe('isRedacteur', () => {
    it('should return true if the current user is a redacteur', () => {
      authService.login('redacteur1', 'redacteur123');
      expect(authService.isRedacteur()).toBe(true);
    });

    it('should return false if the current user is not a redacteur', () => {
      authService.login('gebruiker1', 'gebruiker123');
      expect(authService.isRedacteur()).toBe(false);
    });
  });

  describe('getCurrentUserRole', () => {
    it('should return the role of the current user', () => {
      authService.login('gebruiker1', 'gebruiker123');
      expect(authService.getCurrentUserRole()).toBe('gebruiker');
    });
  });

  describe('getUserById', () => {
    it('should return a user by their id', () => {
      const user = authService.getUserById(1);
      expect(user).toEqual({ username: 'gebruiker1', password: 'gebruiker123', role: 'gebruiker', id: 1, authorName: 'Gebruiker Gevens' });
    });

    it('should return undefined if no user with the given id is found', () => {
      const user = authService.getUserById(999);
      expect(user).toBeUndefined();
    });
  });
});
