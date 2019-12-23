import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule, MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {MenuComponent} from './menu/menu.component';
import {AccessComponent} from './pages/access/access.component';
import {ContentComponent} from './content/content.component';
import {ButtonComponent} from './button/button.component';
import {RegisterComponent} from './pages/register/register.component';
import {SigninComponent} from './pages/signin/signin.component';
import {GobackComponent} from './goback/goback.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {HomeComponent} from './pages/home/home.component';
import {PortfolioComponent} from './pages/portfolio/portfolio.component';
import {CreditsComponent} from './pages/credits/credits.component';
import {CardComponent} from './card/card.component';
import {NotificationsComponent} from './pages/notifications/notifications.component';
import {IconbarComponent} from './iconbar/iconbar.component';

const appRoutes: Routes = [
  {path: 'access', component: AccessComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'home', component: HomeComponent},
  {path: 'portfolio', component: PortfolioComponent},
  {path: 'credit', component: CreditsComponent},
  {path: 'notification', component: NotificationsComponent}
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
    GobackComponent,
    ProfileComponent,
    HomeComponent,
    PortfolioComponent,
    CreditsComponent,
    CardComponent,
    NotificationsComponent,
    IconbarComponent
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
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
