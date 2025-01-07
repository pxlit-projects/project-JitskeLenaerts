import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddPostComponent } from './add-post.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';

describe('AddPostComponent', () => {
    let component: AddPostComponent;
    let fixture: ComponentFixture<AddPostComponent>;
    let postServiceMock: jasmine.SpyObj<PostService>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        postServiceMock = jasmine.createSpyObj('PostService', ['checkIfTitleExists', 'createPost']);
        authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, AddPostComponent],
            providers: [
                { provide: PostService, useValue: postServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
                FormBuilder
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddPostComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should initialize user from AuthService when user is authenticated', () => {
            const mockUser: User = { username: 'john_doe', id: 1, password: 'password', role: 'user', authorName: 'John Doe' };
            authServiceMock.getCurrentUser.and.returnValue(mockUser);

            component.ngOnInit();

            expect(component.user).toEqual(mockUser);
        });

        it('should initialize user as null when user is not authenticated', () => {
            authServiceMock.getCurrentUser.and.returnValue(null);

            component.ngOnInit();

            expect(component.user).toBeNull();
        });
    });

    describe('onSubmit', () => {
        it('should set error message if title already exists', () => {
            const mockUser: User = { username: 'john_doe', id: 1, password: 'password', role: 'user', authorName: 'John Doe' };
        
            authServiceMock.getCurrentUser.and.returnValue(mockUser);  
        
            postServiceMock.checkIfTitleExists.and.returnValue(of(true));  
        
            component.postForm.setValue({
                title: 'Existing Post Title',
                content: 'Content of the post',
                category: 'Category',
                createdAt: new Date(),
                updatedAt: new Date(),
                state: State.CONCEPT
            });
        
            component.onSubmit();
        
            expect(component.errorMessage).toBe('This title already exists. Please choose another title.');
        
            expect(postServiceMock.checkIfTitleExists).toHaveBeenCalledWith('Existing Post Title');
        
            expect(postServiceMock.createPost).not.toHaveBeenCalled();
        });
        
    
        it('should create a new post if title is unique', () => {
            const mockUser: User = { username: 'john_doe', id: 1, password: 'password', role: 'user', authorName: 'John Doe' };
            authServiceMock.getCurrentUser.and.returnValue(mockUser); 
    
            postServiceMock.checkIfTitleExists.and.returnValue(of(false));
    
            const mockPost = {
                id: 1,
                title: 'New Post Title',
                author: 'John Doe',
                authorId: 1,
                content: 'Content of the post',
                category: 'Category',
                state: State.CONCEPT,
                createdAt: new Date(),
                updatedAt: new Date()
            };
    
            postServiceMock.createPost.and.returnValue(of(mockPost));  
    
            component.postForm.setValue({
                title: 'New Post Title',
                content: 'Content of the post',
                category: 'Category',
                createdAt: new Date(),
                updatedAt: new Date(),
                state: State.CONCEPT
            });
    
            component.onSubmit();
    
            expect(postServiceMock.checkIfTitleExists).toHaveBeenCalledWith('New Post Title');
    
            expect(postServiceMock.createPost).toHaveBeenCalledWith(jasmine.objectContaining({
                title: 'New Post Title',
                author: 'John Doe',
                authorId: 1,
                content: 'Content of the post',
                category: 'Category',
                state: State.CONCEPT
            }), 'john_doe', 1);
    
            expect(routerMock.navigate).toHaveBeenCalledWith(['/concept/posts']);
        });
    
        it('should set error message if an error occurs while validating the title', () => {
            const mockUser: User = { username: 'john_doe', id: 1, password: 'password', role: 'user', authorName: 'John Doe' };
            authServiceMock.getCurrentUser.and.returnValue(mockUser);  
    
            postServiceMock.checkIfTitleExists.and.returnValue(throwError(() => new Error('Title validation error')));
    
            component.postForm.setValue({
                title: 'New Post Title',
                content: 'Content of the post',
                category: 'Category',
                createdAt: new Date(),
                updatedAt: new Date(),
                state: State.CONCEPT
            });
    
            component.onSubmit();
    
            expect(component.errorMessage).toBe('An error occurred while validating the title. Please try again.');
        });
    
        it('should set error message if user is not authenticated', () => {
            authServiceMock.getCurrentUser.and.returnValue(null);
    
            component.postForm.setValue({
                title: 'New Post Title',
                content: 'Content of the post',
                category: 'Category',
                createdAt: new Date(),
                updatedAt: new Date(),
                state: State.CONCEPT
            });
    
            component.onSubmit();
    
            expect(component.errorMessage).toBe('User is not authenticated.');
    
            expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        });
    });
    
    
    describe('canDeactivate', () => {
        it('should return true if form is not dirty', () => {
            component.postForm.markAsPristine();
            expect(component.canDeactivate()).toBeTrue();
        });

        it('should prompt user if form is dirty', () => {
            component.postForm.markAsDirty();
            spyOn(window, 'confirm').and.returnValue(true);

            expect(component.canDeactivate()).toBeTrue();
            expect(window.confirm).toHaveBeenCalled();
        });

        it('should return false if user cancels navigation', () => {
            component.postForm.markAsDirty();
            spyOn(window, 'confirm').and.returnValue(false);

            expect(component.canDeactivate()).toBeFalse();
        });
    });
});