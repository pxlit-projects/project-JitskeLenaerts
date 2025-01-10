import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of } from 'rxjs';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';

class MockPostService {
    getPostById(postId: number, username: string, userId: number) {
        return of({ title: 'Test Title', content: 'Test Content', category: 'Test Category', state: State.CONCEPT });
    }

    updatePost(postId: number, post: Post, username: string, userId: number) {
        return of({});
    }
}

class MockAuthService {
    getCurrentUser() {
        return { username: 'john_doe', id: 1, authorName: 'John Doe' } as User;
    }
}

class MockRouter {
    navigate() {
        return of(true);
    }
}

describe('EditPostComponent', () => {
    let component: EditPostComponent;
    let fixture: ComponentFixture<EditPostComponent>;
    let postServiceMock: PostService;
    let authServiceMock: AuthService;
    let routerMock: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatButtonModule, MatTooltipModule, EditPostComponent],
            providers: [
                { provide: PostService, useClass: MockPostService },
                { provide: AuthService, useClass: MockAuthService },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditPostComponent);
        component = fixture.componentInstance;

        postServiceMock = TestBed.inject(PostService);
        authServiceMock = TestBed.inject(AuthService);
        routerMock = TestBed.inject(Router);

        fixture.detectChanges();
    });

    it('should load post and populate the form on init', () => {
        component.ngOnInit();
        expect(component.updateForm.get('title')?.value).toBe('Test Title');
        expect(component.updateForm.get('content')?.value).toBe('Test Content');
        expect(component.updateForm.get('category')?.value).toBe('Test Category');
        expect(component.updateForm.get('state')?.value).toBe(State.CONCEPT);
    });

    it('should call updatePost on form submission and navigate based on state', () => {
        const postData = {
            title: 'Updated Title',
            content: 'Updated Content',
            category: 'Updated Category',
            state: State.SUBMITTED
        };

        component.updateForm.setValue(postData);

        spyOn(postServiceMock, 'updatePost').and.callThrough();
        spyOn(routerMock, 'navigate');

        component.onUpdate();

        expect(postServiceMock.updatePost).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/submitted/posts']);
    });

    it('should handle form submission when user is not authenticated', () => {
        spyOn(authServiceMock, 'getCurrentUser').and.returnValue(null);

        component.onUpdate();

        expect(component.updateForm.invalid).toBeTrue();
    });

    it('should navigate to /submitted/posts if state is State.SUBMITTED', () => {
        const navigateSpy = spyOn(routerMock, 'navigate');

        component.updateForm.setValue({
            title: 'Test Title',
            content: 'Test Content',
            category: 'Test Category',
            state: State.SUBMITTED
        });

        component.onCancel();

        expect(navigateSpy).toHaveBeenCalledWith(['/submitted/posts']);
    });
    it('should navigate to concept posts when cancel is clicked', () => {
        spyOn(routerMock, 'navigate');

        component.onCancel();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/concept/posts']);
    });

    it('should handle invalid post ID on init', () => {
        spyOn(console, 'error');
        const mockRoute = TestBed.inject(ActivatedRoute);
        mockRoute.snapshot.params['id'] = 'invalid';

        component.ngOnInit();

        expect(console.error).toHaveBeenCalledWith('Invalid post ID!');
    });

    it('should display an error when user is not authenticated on init', () => {
        spyOn(console, 'error');
        spyOn(authServiceMock, 'getCurrentUser').and.returnValue(null);

        component.ngOnInit();

        expect(console.error).toHaveBeenCalledWith('User is not authenticated or could not be fetched!');
    });
});
