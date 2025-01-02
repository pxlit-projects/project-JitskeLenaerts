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

  createComment(commentRequest: Comment, username: string = "", userId: number = 0): Observable<Comment> {
    const headers = { username: username, userId: userId.toString(), };
    return this.http.post<Comment>(this.api, commentRequest, { headers: headers });
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.api);
  }

  getCommentsByPostId(postId: number, username: string = "", userId: number = 0): Observable<Comment[]> {
    const headers = { username: username, userId: userId.toString(), };
    return this.http.get<Comment[]>(`${this.api}/${postId}`, { headers: headers });
  }

  updateComment(id: number, commentRequest: Comment, username: string, userId: number): Observable<Comment> {
    const headers = { username: username, userId: userId.toString(), };
    return this.http.patch<Comment>(`${this.api}/${id}`, commentRequest, { headers: headers });
  }

  deleteComment(id: number, username: string, userId: number): Observable<void> {
    const headers = { username: username, userId: userId.toString(), };
    return this.http.delete<void>(`${this.api}/${id}`, { headers: headers });
  }
}
