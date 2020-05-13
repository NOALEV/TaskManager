import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';

import { MessagesComponent } from './pages/messages/messages.component';
import { ManageComponent } from './pages/manage/manage.component';
import { CurrenciesComponent } from './pages/currencies/currencies.component';
import { EditMessageComponent } from './pages/edit-message/edit-message.component';

import { CurrenciesFilterPipe } from './pages/currencies/currencies-filter.pipe';

import { DistinctwordsPipe } from './pipes/distinctwords.pipe';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    BarChartComponent,
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
    EditMessageComponent,
    CurrenciesFilterPipe,
    DistinctwordsPipe 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
