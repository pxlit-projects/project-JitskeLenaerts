import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private api: string = environment.apiUrl + 'comment/api/comment';

  constructor(private http: HttpClient) { }

  createComment(commentRequest: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.api, commentRequest);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.api);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.api}/${postId}`);
  }

  updateComment(id: number, commentRequest: Comment): Observable<Comment> {
    return this.http.patch<Comment>(`${this.api}/${id}`, commentRequest);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
