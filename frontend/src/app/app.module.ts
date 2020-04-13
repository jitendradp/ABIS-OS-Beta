import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatCheckboxModule,
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
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import {AccessComponent} from './pages/system/access/access.component';
import {ContentComponent} from './components/content/content.component';
import {ButtonComponent} from './components/button/button.component';
import {SignupComponent} from './pages/system/signup/signup.component';
import {LoginComponent} from './pages/system/login/login.component';
import {IconbarComponent} from './components/iconbar/iconbar.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxEchartsModule} from "ngx-echarts";
import {MapComponent} from './pages/map/map.component';
import {LogoComponent} from './components/logo/logo.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {InputComponent} from './components/input/input.component';
import {WhitespaceComponent} from './components/whitespace/whitespace.component';
import {HttpClientModule} from '@angular/common/http';
import {CardIntroComponent} from "./cards/card-intro/card-intro.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {LogoutComponent} from './pages/system/logout/logout.component';
import {IAction} from "./actions/IAction";
import {CardMessageComponent} from "./cards/card-message/card-message.component";
import {CardGroupComponent} from "./cards/card-group/card-group.component";
import {CardFormComponent} from "./cards/card-form/card-form.component";
import {SearchComponent} from "./search/search.component";
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import {CardComponent} from "./cards/card/card.component";
import {SetVisibility} from "./actions/ui/SetVisibility";
import {DeviceDetectorModule} from "ngx-device-detector";
import {ClusterPopupComponent} from "./pages/map/cluster-popup/cluster-popup.component";
import {AgGridModule} from "ag-grid-angular";
import {CardProfileComponent} from "./cards/card-profile/card-profile.component";
import {ChartGraphForceComponent} from "./components/charts/chart-graph-force/chart-graph-force.component";
import {ChartLineComponent} from "./components/charts/chart-line/chart-line.component";
import {ChartMapComponent} from "./components/charts/chart-map/chart-map.component";
import {ChartSankeyComponent} from "./components/charts/chart-sankey/chart-sankey.component";
import {ChartTableComponent} from "./components/charts/chart-table/chart-table.component";
import {MaterialElevationDirective} from "./directives/material-elevation.directive";
import {ChipComponent} from "./components/chip/chip.component";
import {CardListEntryComponent} from "./list-items/card-list-entry/card-list-entry.component";
import {ListGroupComponent} from "./lists/list-group/list-group.component";
import {ListContactComponent} from "./lists/list-contact/list-contact.component";
import {AvatarComponent} from "./components/avatar/avatar.component";
import {ListChipComponent} from "./list-items/list-chip/list-chip.component";
import {FeedComponent} from "./feed/feed.component";
import {ListMemberComponent} from "./list-items/list-member/list-member.component";
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {ListChatComponent} from "./lists/list-chat/list-chat.component";
import {ProfileService} from "./services/profile.service";
import {CanActivateRoute} from "./services/routeGuard";
import {MaterialDesignFrameworkModule} from "angular6-json-schema-form";
import {ServiceDialogComponent} from "./services/service-dialog/service-dialog.component";
import {GraphQLConfigModule} from "./apolloConfig";
import {ChangePasswordComponent} from "./pages/system/change-password/change-password.component";
import {SetPasswordComponent} from "./pages/system/set-password/set-password.component";
import {ResetPasswordComponent} from "./pages/system/reset-password/reset-password.component";
import {CreateProfileComponent} from "./pages/system/create-profile/create-profile.component";
import {CreateRoomComponent} from "./pages/system/create-room/create-room.component";
import {InviteComponent} from "./pages/system/invite/invite.component";
import {ListComponent} from './components/list/list.component';
import {GeoJsonEntryComponent} from "./list-items/geoJson-entry/geoJson-entry.component";
import { ProfileComponent } from './pages/profile/profile.component';
import {DetailComponent} from "./pages/detail/detail.component";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

const defaultActions: IAction[] =
  [
    /*
    <SetVisibility>{
      name: SetVisibility.Name,
      label: "Open/Close Menu",
      icon: "chevron_left",
      side: "left",
      state: "toggle",
      elevation: "base"
    },*/

    // todo show/hide when user is logged in or not
    <SetVisibility>{
      name: SetVisibility.Name,
      label: "Open/Close Chat",
      icon: "more_vert",
      side: "right",
      state: "toggle",
      elevation: "base"
    }
  ];


const appRoutes: Routes = [
  {
    path: 'access', component: AccessComponent, data: {
      "title": "Welcome",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'signin', component: LoginComponent, data: {
      "title": "Login",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'detail', component: DetailComponent, data: {
      "title": "",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'register', component: SignupComponent, data: {
      "title": "Sign up",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'invite', component: InviteComponent, data: {
      "title": "Invite",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'change-password', component: ChangePasswordComponent, data: {
      "title": "Change password",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: '', component: MapComponent, data: {
      "title": "Map",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'reset-password', component: ResetPasswordComponent, data: {
      "title": "Reset password",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'create-profile', component: CreateProfileComponent, data: {
      "title": "Create profile",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'create-room', component: CreateRoomComponent, data: {
      "title": "Create room",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'set-password', component: SetPasswordComponent, data: {
      "title": "Set password",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'logout', component: LogoutComponent, data: {
      "title": "Logout",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'group-list', component: ListGroupComponent, data: {
      "title": "Groups",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'profile', component: ProfileComponent, data: {
      "title": "Profile",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'chat', component: FeedComponent, data: {
      "title": "hi",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
];


@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    ContentComponent,
    ButtonComponent,
    SignupComponent,
    LoginComponent,
    IconbarComponent,
    MapComponent,
    LogoComponent,
    HeaderComponent,
    InputComponent,
    WhitespaceComponent,
    CardIntroComponent,
    NavigationComponent,
    LogoutComponent,
    CardMessageComponent,
    CardGroupComponent,
    CardFormComponent,
    SearchComponent,
    CardComponent,
    ClusterPopupComponent,
    CardProfileComponent,
    ChartGraphForceComponent,
    ResetPasswordComponent,
    ChartLineComponent,
    ChartMapComponent,
    ChartSankeyComponent,
    SetPasswordComponent,
    ChangePasswordComponent,
    ChartTableComponent,
    MaterialElevationDirective,
    InviteComponent,
    FeedComponent,
    ChipComponent,
    CardListEntryComponent,
    ListGroupComponent,
    ListContactComponent,
    CreateProfileComponent,
    CreateRoomComponent,
    AvatarComponent,
    ListChipComponent,
    ResetPasswordComponent,
    ListMemberComponent,
    FileUploadComponent,
    ListChatComponent,
    ServiceDialogComponent,
    ListComponent,
    GeoJsonEntryComponent,
    ProfileComponent,
    DetailComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    DeviceDetectorModule.forRoot(),
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
    MatSlideToggleModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatSnackBarModule,
    GraphQLConfigModule,
    HttpClientModule,
    MatBottomSheetModule,
    MatSliderModule,
    FormsModule,
    MatCheckboxModule,
    MatProgressBarModule,
    AgGridModule.withComponents([]),
    MatTooltipModule,
    MatPaginatorModule,
    MaterialDesignFrameworkModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZGF2ZXdhdmVhYmlzY2xvdWQiLCJhIjoiY2s0eXYycjhzMDRhczNkbXF6dzNkMzlzayJ9.nyAc-uTfNfDTF0lxmZ3a3Q', // Optionnal, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'pk.eyJ1IjoiZGF2ZXdhdmVhYmlzY2xvdWQiLCJhIjoiY2s0eXYycjhzMDRhczNkbXF6dzNkMzlzayJ9.nyAc-uTfNfDTF0lxmZ3a3Q' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    }),
    CalendarModule.forRoot({provide: DateAdapter, useFactory: momentAdapterFactory}),
  ],
  providers: [ProfileService, CanActivateRoute],
  entryComponents: [SearchComponent, ListGroupComponent, ListContactComponent, ListChatComponent, FeedComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
