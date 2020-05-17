import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { EditMessageComponent } from './pages/edit-message/edit-message.component';
import { CurrenciesComponent } from './pages/currencies/currencies.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { GraphComponent } from './pages/graph/graph.component';
import { UsersLocationComponent } from './pages/users-location/users-location.component';



const routes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  { path: 'new-list', component: NewListComponent },
  { path: 'edit-list/:listId', component: EditListComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'lists', component: TaskViewComponent },

  { path: 'lists/:listId', component: TaskViewComponent },
  { path: 'lists/:listId/new-task', component: NewTaskComponent },
  { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'edit-user/:userId', component: EditUserComponent },
  { path: 'users/:userId', component: AdminPageComponent },
  { path: 'edit-message/:messageId', component: EditMessageComponent },
  { path: 'messages/:messageId', component: AdminPageComponent },
  { path: 'currencies', component: CurrenciesComponent },
  { path: 'graph', component: GraphComponent },
  { path: 'location', component: UsersLocationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }