import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { forkJoin, map, Observable } from 'rxjs';
import { Filter } from '../models/filter.model';
import { Post } from '../models/post.model';
import { State } from '../models/state.enum';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api: string = environment.apiUrl + 'post/api/post';
  private http: HttpClient = inject(HttpClient);

  createPost(post: Post, username: string, id: number): Observable<Post> {
    const headers = { username: username, id: id.toString() };
    return this.http.post<Post>(this.api, post, { headers });
  }

  getPostsByAuthorIdAndState(authorId: number, state: string): Observable<Post[]> {
    const headers = { authorId: authorId.toString() };
    return this.http.get<Post[]>(`${this.api}/filter/${state}`, { headers: headers });
  }

  getPostsByState(state: State): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/filter/${state}`);
  }

  checkIfTitleExists(title: string): Observable<boolean> {
    return forkJoin({
      conceptPosts: this.getPostsByState(State.CONCEPT),
      publishedPosts: this.getPostsByState(State.PUBLISHED)
    }).pipe(
      map(({ conceptPosts, publishedPosts }) => {
        const allTitles = [...conceptPosts, ...publishedPosts].map(post => post.title.toLowerCase());
        return allTitles.includes(title.toLowerCase());
      })
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.api}/${id}`, post);
  }

  filterInPosts(filter: Filter): Observable<Post[]> {
    return this.http.get<Post[]>(this.api + '/published').pipe(
      map((posts: Post[]) => posts.filter(posts => this.isPostMatchingFilter(posts, filter)))
    );
  }

  private isPostMatchingFilter(post: Post, filter: Filter): boolean {
    const matchesTitle = post.title.toLowerCase().includes(filter.title.toLowerCase());
    const matchesAuthor = post.author.toLowerCase().includes(filter.author.toLowerCase());
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
