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
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {MenuComponent} from './components/menu/menu.component';
import {AccessComponent} from './pages/system/access/access.component';
import {ContentComponent} from './components/content/content.component';
import {ButtonComponent} from './components/button/button.component';
import {RegisterComponent} from './pages/system/register/register.component';
import {SigninComponent} from './pages/system/signin/signin.component';
import {GobackComponent} from './components/goback/goback.component';
import {ProfileComponent} from './pages/system/profile/profile.component';
import {CardComponent} from './components/card/card.component';
import {IconbarComponent} from './components/iconbar/iconbar.component';
import {StoreComponent} from './pages/store/store.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxEchartsModule} from "ngx-echarts";
import {LineChartComponent} from './charts/line-chart/line-chart.component';
import {StudioComponent} from './pages/studio/studio.component';
import {TableComponent} from './charts/table/table.component';
import {ProfileService} from "./services/profile.service";
import {MessageComponent} from './components/message/message.component';
import {CockpitComponent} from './pages/cockpit/cockpit.component';
import {MapComponent} from './pages/map/map.component';
import {VerifyComponent} from './pages/system/verify/verify.component';
import {InviteComponent} from './pages/system/invite/invite.component';
import {WorkspaceComponent} from './pages/system/workspace/workspace.component';
import {FormComponent} from './components/form/form.component';
import {ResetComponent} from './pages/system/reset/reset.component';
import { DescriptionComponent } from './components/description/description.component';

const appRoutes: Routes = [
  {path: 'access', component: AccessComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'cockpit', component: CockpitComponent},
  {path: 'store', component: StoreComponent},
  {path: 'studio', component: StudioComponent},
  {path: 'map', component: MapComponent},
  {path: 'verify', component: VerifyComponent},
  {path: 'invite', component: InviteComponent},
  {path: 'workspace', component: WorkspaceComponent}
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
    CardComponent,
    IconbarComponent,
    StoreComponent,
    LineChartComponent,
    StudioComponent,
    TableComponent,
    MessageComponent,
    CockpitComponent,
    MapComponent,
    VerifyComponent,
    InviteComponent,
    WorkspaceComponent,
    FormComponent,
    ResetComponent,
    DescriptionComponent
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
    MatTableModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
