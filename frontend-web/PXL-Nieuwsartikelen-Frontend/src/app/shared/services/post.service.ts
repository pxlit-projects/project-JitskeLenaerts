import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { forkJoin, map, Observable } from 'rxjs';
import { Filter } from '../models/filter.model';
import { Post } from '../models/post.model';
import { State } from '../models/state.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api: string = environment.apiUrl + 'post/api/post';
  private http: HttpClient = inject(HttpClient);
  private authService:AuthService = inject(AuthService);

  createPost(post: Post, username: string, userId: number): Observable<Post> {
    const headers = { username: username, userId: userId.toString()};
    return this.http.post<Post>(this.api, post, { headers: headers });
  }

  getPostsByAuthorIdAndState(state: string, username: string, userId: number): Observable<Post[]> {
    const headers = { username: username, userId: userId.toString(), 'Content-Type': 'application/json' };
    return this.http.get<Post[]>(`${this.api}/filter/${state}`,{ headers: headers });
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }

  getAllPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/published`);
  }

  getPostsByState(state: State,username: string, userId: number): Observable<Post[]> {
    const headers = { username: username, userId: userId.toString(), 'Content-Type': 'application/json' };
    return this.http.get<Post[]>(`${this.api}/state/${state}`, { headers: headers });
  }

  checkIfTitleExists(title: string): Observable<boolean> {
    return this.getAllPosts().pipe(
      map((posts) => {
        const allTitles = posts.map(post => post.title.toLowerCase());
        return allTitles.includes(title.toLowerCase());
      })
    );
  }

  getPostById(id: number, username: string = "", userId: number = 0): Observable<Post> {
    const headers = { username: username, userId: userId.toString() , 'Content-Type': 'application/json'};
    return this.http.get<Post>(`${this.api}/${id}`, { headers: headers });
  }

  updatePost(id: number, post: Post,username: string, userId: number): Observable<Post> {
    const headers = { username: username, userId: userId.toString() , 'Content-Type': 'application/json'};
    return this.http.put<Post>(`${this.api}/${id}`, post, { headers: headers });
  }

  publishPost(id: number, post: Post,username: string, userId: number): Observable<Post> {
    const headers = { username: username, userId: userId.toString() , 'Content-Type': 'application/json'};
    return this.http.post<Post>(`${this.api}/${id}/publish`, post, { headers: headers });
  }

  filterInPostsByState(filter: Filter, state: State,username: string, userId: number): Observable<Post[]> {
    const headers = { username: username, userId: userId.toString(), 'Content-Type': 'application/json' };
    return this.http.get<Post[]>(`${this.api}/state/${state}`,{ headers: headers }).pipe(
      map((posts: Post[]) => posts.filter(posts => this.isPostMatchingFilter(posts, filter)))
    );
  }

  filterPublishedPosts(filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/published`).pipe(
        map((posts: Post[]) => posts.filter(posts => this.isPostMatchingFilter(posts, filter)))
    );
  }

  private isPostMatchingFilter(post: Post, filter: Filter): boolean {
    const matchesTitle = post.title.toLowerCase().includes(filter.title.toLowerCase());
    const authorName = this.authService.getUserById(post.authorId)?.authorName || '';
    const matchesAuthor = authorName.toLowerCase().includes(filter.author.toLowerCase()); 
    const matchesContent = post.content.toLowerCase().includes(filter.content.toLowerCase());
    const matchesCategory = post.category.toLowerCase().includes(filter.category.toLowerCase());
  
    const filterCreatedAtDate = filter.createdAt ? this.normalizeDate(new Date(filter.createdAt)) : null;
    const postCreatedAtDate = this.normalizeDate(new Date(post.createdAt));
  
    const matchesCreatedAt = filterCreatedAtDate && !isNaN(filterCreatedAtDate.getTime())
      ? postCreatedAtDate.getTime() === filterCreatedAtDate.getTime()
      : true;
  
    return matchesTitle && matchesAuthor && matchesContent && matchesCategory && matchesCreatedAt;
  }
  

  private normalizeDate(date: Date): Date {
    if (isNaN(date.getTime())) return date;
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
