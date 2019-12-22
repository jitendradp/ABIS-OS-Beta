import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatFormFieldControl, MatFormFieldModule,
  MatGridListModule,
  MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatOptionModule, MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
} from "@angular/material";
import {MenuComponent} from './menu/menu.component';
import {AccessComponent} from './pages/access/access.component';
import {ContentComponent} from './content/content.component';
import {ButtonComponent} from './button/button.component';
import {RegisterComponent} from './pages/register/register.component';
import {SigninComponent} from './pages/signin/signin.component';
import {GobackComponent} from './goback/goback.component';

const appRoutes: Routes = [
  {path: 'access', component: AccessComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'register', component: RegisterComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AccessComponent,
    ContentComponent,
    ButtonComponent,
    RegisterComponent,
    SigninComponent,
    GobackComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
