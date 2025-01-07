import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isRedacteur', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [NavbarComponent], 
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([]),
      ]
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  describe('isLoggedIn', () => {
    it('should return true if the user is logged in', () => {
      const mockUser = { username: 'johndoe', id: 1, password: 'password123', role: 'admin', authorName: 'John Doe' };
      authServiceMock.getCurrentUser.and.returnValue(mockUser); 
      expect(component.isLoggedIn()).toBeTrue();
    });

    it('should return false if the user is not logged in', () => {
      authServiceMock.getCurrentUser.and.returnValue(null); 
      expect(component.isLoggedIn()).toBeFalse();
    });
  });

  describe('isRedacteur', () => {
    it('should return true if the user is a Redacteur', () => {
      authServiceMock.isRedacteur.and.returnValue(true);
      expect(component.isRedacteur()).toBeTrue();
    });

    it('should return false if the user is not a Redacteur', () => {
      authServiceMock.isRedacteur.and.returnValue(false); 
      expect(component.isRedacteur()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should call authService.logout and navigate to home on logout', () => {
      component.logout();

      expect(authServiceMock.logout).toHaveBeenCalled();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
