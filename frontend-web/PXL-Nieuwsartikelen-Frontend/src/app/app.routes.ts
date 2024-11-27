import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { PostDetailComponent } from './core/post/post-detail/post-detail.component';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { GetAllPostsComponent } from './core/post/get-all-posts/get-all-posts.component';
import { EditPostComponent } from './core/post/edit-post/edit-post.component';


export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'add', component: AddPostComponent },
  { path: 'posts', component: GetAllPostsComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'edit/:id', component: EditPostComponent },
  { path: '**', component: HomeComponent }
];
