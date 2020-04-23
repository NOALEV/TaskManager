import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { AppComponent } from './app.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ManageComponent } from './pages/manage/manage.component';




import { CurrenciesComponent } from './pages/currencies/currencies.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginPageComponent,
    SignupPageComponent,
    EditListComponent,
    EditTaskComponent,

    AdminPageComponent,
    CurrenciesComponent,
    AdminPageComponent,
    EditUserComponent,
    MessagesComponent,
    ManageComponent,
  
    
  
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
