import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterModule, provideRouter } from '@angular/router'; 
import { Router } from '@angular/router'; 

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideRouter([
          { path: '', component: NavbarComponent }, 
          { path: 'add', component: NavbarComponent }, 
          { path: 'posts', component: NavbarComponent } 
        ]),
        NavbarComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a link to home', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector('a[routerLink="/"]');

    expect(homeLink).toBeTruthy(); 
  });

  it('should contain a link to add post', () => {
    fixture.detectChanges();  

    const compiled = fixture.nativeElement as HTMLElement;
    const addPostLink = compiled.querySelector('a[routerLink="/add"]');

    expect(addPostLink).toBeTruthy(); 
  });

  it('should contain a link to all posts', () => {
    fixture.detectChanges();  

    const compiled = fixture.nativeElement as HTMLElement;
    const allPostsLink = compiled.querySelector('a[routerLink="/posts"]');

    expect(allPostsLink).toBeTruthy(); 
  });
});
