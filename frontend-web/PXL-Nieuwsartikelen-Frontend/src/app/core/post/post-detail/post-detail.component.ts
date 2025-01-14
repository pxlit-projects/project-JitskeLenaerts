import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { State } from '../../../shared/models/state.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Comment } from '../../../shared/models/comment.model';
import { FormsModule } from '@angular/forms';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post!: Post;
  authorName: string = '';
  authorId: number | null = null;
  comments: Comment[] = [];
  newCommentText: string = '';
  isUserLoggedIn: boolean = false;
  editingCommentId: number | null = null;
  editingCommentText: string = '';
  errorMessage: string = '';
  currentUser: User | null = null;
  public postId!: number;

  router: Router = inject(Router);
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  commentService: CommentService = inject(CommentService);
  authService: AuthService = inject(AuthService);

  readonly State = State;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isUserLoggedIn = !!this.currentUser;
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (!postId) {
      this.errorMessage = 'Invalid post ID.';
      return;
    }
    this.postId = Number(postId);
    this.fetchPost(postId);
    this.fetchComments(postId);
  }

  fetchPost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post = post;
        const author = this.authService.getUserById(this.post.authorId);
        this.authorName = author?.authorName ? author.authorName : 'Author is anonymous';
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.errorMessage = 'Could not fetch the post. Please try again later.';
      },
    });
  }

  fetchComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        this.comments = comments.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
        this.errorMessage = 'Could not fetch comments. Please try again later.';
      },
    });
  }

  submitComment(): void {
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to comment.';
      return;
    }

    if (!this.newCommentText.trim()) {
      this.errorMessage = 'Comment text cannot be empty.';
      return;
    }

    const newComment: Comment = {
      id: 0,
      postId: this.post.id,
      comment: this.newCommentText.trim(),
      author: this.currentUser.authorName,
      authorId: this.currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.commentService.createComment(newComment).subscribe({
      next: (comment) => {
        this.comments = [comment, ...this.comments];
        this.newCommentText = '';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error posting comment:', err);
        this.errorMessage = 'Failed to post the comment. Please try again.';
      },
    });
  }
  
  deleteComment(commentId: number): void {
    const comment = this.comments.find((c) => c.id === commentId);

    if (!comment) {
      this.errorMessage = 'Comment not found.';
      return;
    }

    if (!this.currentUser || comment.authorId !== this.currentUser.id) {
      this.errorMessage = 'You can only delete your own comments.';
      return;
    }

    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId,this.currentUser.username,this.currentUser.id).subscribe({
        next: () => {
          this.comments = this.comments.filter((c) => c.id !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.errorMessage = 'Failed to delete the comment. Please try again later.';
        },
      });
    }
  }

  editComment(comment: Comment): void {
    if (!this.currentUser || comment.authorId !== this.currentUser.id) {
      this.errorMessage = 'You can only edit your own comments.';
      return;
    }

    this.editingCommentId = comment.id;
    this.editingCommentText = comment.comment;
  }

  saveEditedComment(): void {
    if (!this.currentUser || this.editingCommentId === null || !this.editingCommentText.trim()) {
      this.errorMessage = 'Invalid data. Unable to save the comment.';
      return;
    }

    const updatedComment: Comment = {
      ...this.comments.find((c) => c.id === this.editingCommentId)!,
      comment: this.editingCommentText.trim(),
      updatedAt: new Date().toISOString(),
    };

    this.commentService.updateComment(this.editingCommentId,updatedComment,this.currentUser.username,this.currentUser.id).subscribe({
      next: (comment) => {
        const index = this.comments.findIndex((c) => c.id === comment.id);
        if (index !== -1) {
          this.comments[index] = comment;
        }
        this.editingCommentId = null;
        this.editingCommentText = '';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.errorMessage = 'Failed to update the comment. Please try again.';
      },
    });
  }

  getStateClass(state: string): string {
    switch (state) {
      case State.CONCEPT:
        return 'state-concept';
      case State.SUBMITTED:
        return 'state-submitted';
      case State.REJECTED:
        return 'state-rejected';
      case State.APPROVED:
        return 'state-approved';
      case State.PUBLISHED:
        return 'state-published';
      default:
        return '';
    }
  }

  getStateLabel(state: string): string {
    switch (state) {
      case State.CONCEPT:
        return 'Concept';
      case State.SUBMITTED:
        return 'Submitted';
      case State.REJECTED:
        return 'Rejected';
      case State.APPROVED:
        return 'Approved';
      case State.PUBLISHED:
        return 'Published';
      default:
        return 'Unknown State';
    }
  }
}
