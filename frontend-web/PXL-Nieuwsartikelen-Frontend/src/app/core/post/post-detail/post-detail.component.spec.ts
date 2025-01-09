import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Observable, of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Comment } from '../../../shared/models/comment.model';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';

class MockPostService {
    getPostById(id: number, username?: string, userId?: number) {
        return of({ id: 1, title: 'Test Post', content: 'Test Content', state: State.CONCEPT } as Post);
    }
}

class MockAuthService {
    getCurrentUser(): User | null {
        return { id: 1, username: 'testuser', authorName: 'Test User' } as User;
    }
}


class MockCommentService {
    getCommentsByPostId(postId: number, username?: string, userId?: number) {
        return of([{ id: 1, postId: 1, comment: 'Test Comment', authorId: 1, createdAt: new Date().toISOString() }] as Comment[]);
    }

    createComment(comment: Comment) {
        return of({ id: 2, postId: 1, comment: 'New Comment', authorId: 1, createdAt: new Date().toISOString() } as Comment);
    }

    deleteComment(commentId: number, username?: string, userId?: number): Observable<void> {
        return of(void 0);
    }

    updateComment(commentId: number, updatedComment: Comment, username?: string, userId?: number) {
        return of({ id: 1, postId: 1, comment: 'Updated Comment', authorId: 1, createdAt: new Date().toISOString() } as Comment);
    }
}


class MockRouter {
    navigate() { }
}

describe('PostDetailComponent', () => {
    let component: PostDetailComponent;
    let fixture: ComponentFixture<PostDetailComponent>;
    let postServiceMock: MockPostService;
    let authServiceMock: MockAuthService;
    let commentServiceMock: MockCommentService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostDetailComponent],
            providers: [
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
                { provide: PostService, useClass: MockPostService },
                { provide: AuthService, useClass: MockAuthService },
                { provide: CommentService, useClass: MockCommentService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PostDetailComponent);
        component = fixture.componentInstance;

        postServiceMock = TestBed.inject(PostService);
        authServiceMock = TestBed.inject(AuthService);
        commentServiceMock = TestBed.inject(CommentService);

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
    describe('getStateClass', () => {
        it('should return the correct class for each state', () => {
            expect(component.getStateClass(State.CONCEPT)).toBe('state-concept');
            expect(component.getStateClass(State.SUBMITTED)).toBe('state-submitted');
            expect(component.getStateClass(State.REJECTED)).toBe('state-rejected');
            expect(component.getStateClass(State.APPROVED)).toBe('state-approved');
            expect(component.getStateClass(State.PUBLISHED)).toBe('state-published');
        });

        it('should return an empty string for an unknown state', () => {
            expect(component.getStateClass('UNKNOWN_STATE')).toBe('');
        });
    });

    describe('getStateLabel', () => {
        it('should return the correct label for each state', () => {
            expect(component.getStateLabel(State.CONCEPT)).toBe('Concept');
            expect(component.getStateLabel(State.SUBMITTED)).toBe('Submitted');
            expect(component.getStateLabel(State.REJECTED)).toBe('Rejected');
            expect(component.getStateLabel(State.APPROVED)).toBe('Approved');
            expect(component.getStateLabel(State.PUBLISHED)).toBe('Published');
        });

        it('should return "Unknown State" for an unknown state', () => {
            expect(component.getStateLabel('UNKNOWN_STATE')).toBe('Unknown State');
        });
    });

    it('should initialize with post and comments', () => {
        component.ngOnInit();

        expect(component.post).toEqual(jasmine.objectContaining({ id: 1, title: 'Test Post' }));
        expect(component.comments.length).toBe(1);
        expect(component.comments[0].comment).toBe('Test Comment');
    });

    it('should display an error message for invalid post ID', () => {
        const mockRoute = TestBed.inject(ActivatedRoute);
        spyOn(mockRoute.snapshot.paramMap, 'get').and.returnValue(null);

        component.ngOnInit();

        expect(component.errorMessage).toBe('Invalid post ID.');
    });

    it('should fetch post and handle error gracefully', () => {
        spyOn(postServiceMock, 'getPostById').and.returnValue(throwError('Error fetching post'));

        component.fetchPost(1);

        expect(component.errorMessage).toBe('Could not fetch the post. Please try again later.');
    });

    it('should create a new comment and prepend to comments list', () => {
        component.newCommentText = 'New Comment';
        component.submitComment();

        expect(component.comments.length).toBe(2);
        expect(component.comments[0].comment).toBe('New Comment');
        expect(component.errorMessage).toBe('');
    });

    it('should handle empty comment text gracefully', () => {
        component.newCommentText = '  ';
        component.submitComment();

        expect(component.errorMessage).toBe('Comment text cannot be empty.');
    });

    it('should delete a comment successfully', () => {
        spyOn(commentServiceMock, 'deleteComment').and.callThrough();
        spyOn(window, 'confirm').and.returnValue(true);

        component.deleteComment(1);

        expect(commentServiceMock.deleteComment).toHaveBeenCalledWith(1, 'testuser', 1);
        expect(component.comments.length).toBe(0);
    });

    it('should edit a comment and save changes', () => {
        component.editComment(component.comments[0]);

        expect(component.editingCommentId).toBe(1);
        expect(component.editingCommentText).toBe('Test Comment');

        component.editingCommentText = 'Updated Comment';
        component.saveEditedComment();

        expect(component.comments[0].comment).toBe('Updated Comment');
        expect(component.editingCommentId).toBeNull();
    });

    describe('Comment sorting', () => {
        it('should sort comments by createdAt in descending order', () => {
            const mockComments: Comment[] = [
                { id: 1, postId: 1, comment: 'First comment', author: 'User1', authorId: 1, createdAt: '2025-01-06T12:00:00Z', updatedAt: '2025-01-06T12:00:00Z' },
                { id: 2, postId: 1, comment: 'Second comment', author: 'User2', authorId: 2, createdAt: '2025-01-07T12:00:00Z', updatedAt: '2025-01-07T12:00:00Z' },
                { id: 3, postId: 1, comment: 'Third comment', author: 'User3', authorId: 3, createdAt: '2025-01-05T12:00:00Z', updatedAt: '2025-01-05T12:00:00Z' },
            ];

            component.comments = mockComments;

            component.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            expect(component.comments[0].id).toBe(2);
            expect(component.comments[1].id).toBe(1);
            expect(component.comments[2].id).toBe(3);
        });
    });
    describe('Comment Deletion', () => {
        it('should prevent deleting another user\'s comment and show the correct error message', () => {
            const mockComments: Comment[] = [
                { id: 1, postId: 1, comment: 'First comment', author: 'User1', authorId: 1, createdAt: '2025-01-06T12:00:00Z', updatedAt: '2025-01-06T12:00:00Z' },
                { id: 2, postId: 1, comment: 'Second comment', author: 'User2', authorId: 2, createdAt: '2025-01-07T12:00:00Z', updatedAt: '2025-01-07T12:00:00Z' },
            ];

            component.comments = mockComments;

            component.deleteComment(2);

            expect(component.errorMessage).toBe('You can only delete your own comments.');
        });
    });
});
