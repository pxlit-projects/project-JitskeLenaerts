import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth-guard.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getCurrentUserRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {

    it('should return true if the user is logged in and has the required role', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getCurrentUserRole.and.returnValue('admin');

      const next = { data: { role: 'admin' } } as any;
      const state = {} as any;
      const result = guard.canActivate(next, state);

      expect(result).toBe(true);
    });

    it('should return false and navigate to /home if the user does not have the required role', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getCurrentUserRole.and.returnValue('user');

      const next = { data: { role: 'admin' } } as any;
      const state = {} as any;
      const result = guard.canActivate(next, state);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should return false and navigate to /login if the user is not logged in', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);

      const next = { data: { role: 'admin' } } as any;
      const state = {} as any;
      const result = guard.canActivate(next, state);

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should return true if the user is logged in and the required role is not provided', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getCurrentUserRole.and.returnValue('user');

      const next = { data: {} } as any; 
      const state = {} as any;
      const result = guard.canActivate(next, state);

      expect(result).toBe(true);
    });
  });
});
