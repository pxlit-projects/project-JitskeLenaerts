import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { PostDetailComponent } from './core/post/post-detail/post-detail.component';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { EditPostComponent } from './core/post/edit-post/edit-post.component';
import { LoginComponent } from './core/login/login.component';
import { PostListPublishedComponent } from './core/post/post-list-published/post-list-published.component';
import { PostListConceptComponent } from './core/post/post-list-concept/post-list-concept.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddPostComponent },
  { path: 'published/posts', component: PostListPublishedComponent },
  { path: 'concept/posts', component: PostListConceptComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'edit/:id', component: EditPostComponent },
  { path: '**', component: LoginComponent }
];
