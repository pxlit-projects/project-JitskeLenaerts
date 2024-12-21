import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { PostDetailComponent } from './core/post/post-detail/post-detail.component';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { EditPostComponent } from './core/post/edit-post/edit-post.component';
import { LoginComponent } from './core/login/login.component';
import { PostListPublishedComponent } from './core/post/post-list-published/post-list-published.component';
import { PostListConceptComponent } from './core/post/post-list-concept/post-list-concept.component';
import { AuthGuard } from './shared/guards/auth-guard.guard';
import { ConfirmLeaveGuard } from './shared/guards/confirm-leave.guard';
import { PostListRejectedComponent } from './core/post/post-list-rejected/post-list-rejected.component';
import { PostListApprovedComponent } from './core/post/post-list-approved/post-list-approved.component';
import { SubmittedReviewCheckComponent } from './core/review/submitted-review-check/submitted-review-check.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'add', component: AddPostComponent,canActivate: [AuthGuard],canDeactivate: [ConfirmLeaveGuard] },
  { path: 'review/posts', component: SubmittedReviewCheckComponent,canActivate: [AuthGuard] },
  { path: 'published/posts', component: PostListPublishedComponent,canActivate: [AuthGuard] },
  { path: 'concept/posts', component: PostListConceptComponent,canActivate: [AuthGuard] },
  { path: 'rejected/posts', component: PostListRejectedComponent,canActivate: [AuthGuard] },
  { path: 'approved/posts', component: PostListApprovedComponent,canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostDetailComponent,canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditPostComponent,canActivate: [AuthGuard],canDeactivate: [ConfirmLeaveGuard] },
  { path: '**', component: LoginComponent }
];
