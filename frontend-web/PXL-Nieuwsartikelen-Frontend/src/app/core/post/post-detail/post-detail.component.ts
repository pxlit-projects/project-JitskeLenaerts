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

  router: Router = inject(Router);
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  commentService: CommentService = inject(CommentService);
  authService: AuthService = inject(AuthService);

  readonly State = State;

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id')!);
    this.fetchPost(postId);
    this.isUserLoggedIn = this.authService.isLoggedIn();
    this.fetchComments(postId);

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.authorName = currentUser.authorName;
      this.authorId = currentUser.id;
    }
  }

  fetchPost(id: number): void {
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        const author = this.authService.getUserById(post.authorId);
        if (author) {
          this.authorName = author.authorName;
        }
      },
      error: (err) => {
        console.error('Error fetching post:', err);
      }
    });
  }

  fetchComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  submitComment(): void {
    if (this.newCommentText.trim() && this.authorId) {
      const newComment: Comment = {
        id: 0,
        postId: this.post.id,
        comment: this.newCommentText,
        author: this.authorName,
        authorId: this.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.commentService.createComment(newComment).subscribe({
        next: (comment) => {
          this.comments.push(comment);
          this.newCommentText = '';
        },
        error: (err) => {
          console.error('Error posting comment:', err);
        }
      });
    }
  }

  deleteComment(commentId: number): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment && comment.authorId === this.authorId) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
        }
      });
    } else {
      this.errorMessage = 'You can only delete your own comments.'; 
    }
  }

  editComment(comment: Comment): void {
    if (comment.authorId === this.authorId) {
      this.editingCommentId = comment.id;
      this.editingCommentText = comment.comment;
    } else {
      this.errorMessage = 'You can only edit your own comments.';
    }
  }

  saveEditedComment(): void {
    if (this.editingCommentId !== null && this.editingCommentText.trim()) {
      const updatedComment: Comment = {
        ...this.comments.find(c => c.id === this.editingCommentId)!,
        comment: this.editingCommentText,
        updatedAt: new Date().toISOString()
      };

      this.commentService.updateComment(this.editingCommentId, updatedComment).subscribe({
        next: (comment) => {
          const index = this.comments.findIndex(c => c.id === comment.id);
          if (index !== -1) {
            this.comments[index] = comment;
          }
          this.editingCommentId = null;
          this.editingCommentText = '';
        },
        error: (err) => {
          console.error('Error updating comment:', err);
        }
      });
    }
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
