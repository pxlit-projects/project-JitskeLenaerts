import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { State } from '../models/state.enum';
import { RejectReview } from '../models/rejectReview.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api: string = environment.apiUrl + 'review/api/review';

  constructor(private http: HttpClient) { }

  getReviewsForPost(postId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}/${postId}`);
  }
  
  approvePost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${postId}/approve`, {});
  }

  rejectPost(id: number, reviewer: string, reviewerId: number, reviewRequest: RejectReview): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/reject`, reviewRequest, {
      headers: new HttpHeaders({
        'reviewer': reviewer,
        'reviewerId': reviewerId.toString(),
      }),
    });
  }
  
}
