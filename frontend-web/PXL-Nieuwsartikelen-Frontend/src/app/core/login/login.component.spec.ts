import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule.forRoot([]), LoginComponent],  
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate to home on successful login', () => {
    authService.login.and.returnValue(true);

    component.username = 'testuser';
    component.password = 'testpassword';

    component.login();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set an error message when login fails', () => {
    authService.login.and.returnValue(false);

    component.username = 'wronguser';
    component.password = 'wrongpassword';

    component.login();

    expect(authService.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(component.errorMessage).toBe('Ongeldige gebruikersnaam of wachtwoord');
  });
});
