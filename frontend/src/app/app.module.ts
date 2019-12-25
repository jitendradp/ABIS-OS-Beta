import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
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
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {MenuComponent} from './components/menu/menu.component';
import {AccessComponent} from './pages/access/access.component';
import {ContentComponent} from './components/content/content.component';
import {ButtonComponent} from './components/button/button.component';
import {RegisterComponent} from './pages/register/register.component';
import {SigninComponent} from './pages/signin/signin.component';
import {GobackComponent} from './components/goback/goback.component';
import {ProfileComponent} from './widgets/profile/profile.component';
import {HomeComponent} from './pages/home/home.component';
import {PortfolioComponent} from './widgets/portfolio/portfolio.component';
import {CreditsComponent} from './widgets/credits/credits.component';
import {CardComponent} from './components/card/card.component';
import {IconbarComponent} from './components/iconbar/iconbar.component';
import {StoreComponent} from './pages/store/store.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxEchartsModule} from "ngx-echarts";
import {LineChartComponent} from './charts/line-chart/line-chart.component';
import {StudioComponent} from './pages/studio/studio.component';
import {TableComponent} from './table/table.component';
import {NewsroomComponent} from './pages/newsroom/newsroom.component';
import {ProfileService} from "./services/profile.service";

const appRoutes: Routes = [
  {path: 'access', component: AccessComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'home', component: HomeComponent},
  {path: 'portfolio', component: PortfolioComponent},
  {path: 'credit', component: CreditsComponent},
  {path: 'store', component: StoreComponent},
  {path: 'studio', component: StudioComponent},
  {path: 'newsroom', component: NewsroomComponent}
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
    IconbarComponent,
    StoreComponent,
    LineChartComponent,
    StudioComponent,
    TableComponent,
    NewsroomComponent
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
    MatBadgeModule,
    FlexLayoutModule,
    DragDropModule,
    NgxEchartsModule,
    MatTableModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
