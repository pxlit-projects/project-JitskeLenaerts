import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPostComponent } from './add-post/add-post.component';
import { GetAllPostsComponent } from './get-all-posts/get-all-posts.component';

export const routes: Routes = [
  {path: '', redirectTo: 'Home', pathMatch: 'full'},
  { path: 'Home', component: HomeComponent },
  { path: 'Add-Post', component: AddPostComponent },
  { path: '**', component: HomeComponent }
];
