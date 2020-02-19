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
import {RegisterComponent} from './pages/system/register/register.component';
import {SigninComponent} from './pages/system/signin/signin.component';
import {IconbarComponent} from './components/iconbar/iconbar.component';
import {StoreComponent} from './pages/store/store.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxEchartsModule} from "ngx-echarts";
import {StudioComponent} from './pages/studio/studio.component';
import {CockpitComponent} from './pages/cockpit/cockpit.component';
import {MapComponent} from './pages/map/map.component';
import {InviteComponent} from './widgets/chat/invite/invite.component';
import {LogoComponent} from './components/logo/logo.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {InputComponent} from './components/input/input.component';
import {WhitespaceComponent} from './components/whitespace/whitespace.component';
import {EditorChannelComponent} from './dialogs/editor-channel/editor-channel.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {CardIntroComponent} from "./cards/card-intro/card-intro.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {SwitchProfileComponent} from './dialogs/switch-profile/switch-profile.component';
import {LogoutComponent} from './pages/system/logout/logout.component';
import {IAction} from "./actions/IAction";
import {EditorGroupComponent} from "./dialogs/editor-group/editor-group.component";
import {CardMessageComponent} from "./cards/card-message/card-message.component";
import {CardGroupComponent} from "./cards/card-group/card-group.component";
import {CardFormComponent} from "./cards/card-form/card-form.component";
import {CardStoreComponent} from "./cards/card-store/card-store.component";
import {SearchComponent} from "./search/search.component";
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import {CardComponent} from "./cards/card/card.component";
import {SetVisibility} from "./actions/ui/sidebar/SetVisibility";
import {DeviceDetectorModule} from "ngx-device-detector";
import {ClusterPopupComponent} from "./pages/map/cluster-popup/cluster-popup.component";
import {AgGridModule} from "ag-grid-angular";
import {SmartCryptoAppComponent} from "./smartapps/smart-crypto-app/smart-crypto-app.component";
import {CardPortfolioComponent} from "./cards/card-portfolio/card-portfolio.component";
import {CardProfileComponent} from "./cards/card-profile/card-profile.component";
import {FeedMessageComponent} from "./feeds/feed-message/feed-message.component";
import {ChartGraphForceComponent} from "./components/charts/chart-graph-force/chart-graph-force.component";
import {ChartLineComponent} from "./components/charts/chart-line/chart-line.component";
import {ChartMapComponent} from "./components/charts/chart-map/chart-map.component";
import {ChartSankeyComponent} from "./components/charts/chart-sankey/chart-sankey.component";
import {ChartTableComponent} from "./components/charts/chart-table/chart-table.component";
import {MaterialElevationDirective} from "./directives/material-elevation.directive";
import {ChatNavigationComponent} from "./navigation/chat-navigation/chat-navigation.component";
import {ChipComponent} from "./components/chip/chip.component";
import {CardContactComponent} from "./cards/card-contact/card-contact.component";
import {ListGroupComponent} from "./lists/list-group/list-group.component";
import {ListContactComponent} from "./lists/list-contact/list-contact.component";
import {AvatarComponent} from "./components/avatar/avatar.component";
import {ListChipComponent} from "./lists/list-chip/list-chip.component";
import {ChatComponent} from "./widgets/chat/chat.component";
import {ResetPasswordComponent} from "./dialogs/reset-password/reset-password.component";
import {ListMemberComponent} from "./lists/list-member/list-member.component";
import {FeedNotificationComponent} from "./feeds/feed-notification/feed-notification.component";
import {ListDataspaceComponent} from "./lists/list-dataspace/list-dataspace.component";
import {ListProfileComponent} from "./lists/list-profile/list-profile.component";
import {CardDataspaceComponent} from "./cards/card-dataspace/card-dataspace.component";
import {FeedThreadComponent} from "./feeds/feed-thread/feed-thread.component";
import {CardChatComponent} from "./cards/card-chat/card-chat.component";
import {CalendarComponent} from "./pages/calendar/calendar.component";
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import {CalendarDaysComponent} from "./widgets/calendar/calendar-days/calendar-days.component";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {ListChatComponent} from "./lists/list-chat/list-chat.component";
import {EditorProfileComponent} from "./dialogs/editor-profile/editor-profile.component";
import {ProfileService} from "./services/profile.service";
import {EditorAccountComponent} from "./dialogs/editor-account/editor-account.component";
import {EditorPasswordComponent} from "./dialogs/editor-password/editor-password.component";
import {CanActivateRoute} from "./services/RouteGuards";
import {JsonSchemaFormModule} from "angular6-json-schema-form/lib/json-schema-form.module";
import {MaterialDesignFrameworkModule} from "angular6-json-schema-form";
import {ServiceDialogComponent} from "./services/service-dialog/service-dialog.component";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

const defaultActions: IAction[] =
  [
    <SetVisibility>{
      name: SetVisibility.Name,
      label: "Open/Close Menu",
      icon: "menu",
      side: "left",
      state: "toggle"
    },

    // todo show/hide when user is logged in or not
    <SetVisibility>{
      name: SetVisibility.Name,
      label: "Open/Close Chat",
      icon: "chat",
      side: "right",
      state: "toggle"
    }
  ];


const appRoutes: Routes = [
  {
    path: '', component: AccessComponent, data: {
      "title": "Welcome",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'signin', component: SigninComponent, data: {
      "title": "Login",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'register', component: RegisterComponent, data: {
      "title": "Sign up",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'cockpit', component: CockpitComponent, data: {
      "title": "Cockpit",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'store', component: StoreComponent, data: {
      "title": "Store",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'studio', component: StudioComponent, data: {
      "title": "Studio",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'map', component: MapComponent, data: {
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
    path: 'editor-channel', component: EditorChannelComponent, data: {
      "title": "Create new channel",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'switch-profile', component: SwitchProfileComponent, data: {
      "title": "Switch profile",
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
    path: 'editor-team', component: EditorGroupComponent, data: {
      "title": "Create new team",
      "actions": defaultActions
    }
    , canActivate: [CanActivateRoute]
  },
  {
    path: 'smart-crypto-app', component: SmartCryptoAppComponent, data: {
      "title": "Smart Crypto App",
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
    path: 'calendar', component: CalendarComponent, data: {
      "title": "Calendar",
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
    RegisterComponent,
    SigninComponent,
    IconbarComponent,
    StoreComponent,
    StudioComponent,
    CockpitComponent,
    MapComponent,
    InviteComponent,
    LogoComponent,
    HeaderComponent,
    InputComponent,
    WhitespaceComponent,
    EditorChannelComponent,
    CardIntroComponent,
    NavigationComponent,
    SwitchProfileComponent,
    LogoutComponent,
    EditorGroupComponent,
    CardMessageComponent,
    CardGroupComponent,
    CardFormComponent,
    CardStoreComponent,
    SearchComponent,
    CardComponent,
    ClusterPopupComponent,
    SmartCryptoAppComponent,
    CardPortfolioComponent,
    CardProfileComponent,
    FeedMessageComponent,
    ChartGraphForceComponent,
    ChartLineComponent,
    ChartMapComponent,
    ChartSankeyComponent,
    ChartTableComponent,
    MaterialElevationDirective,
    ChatNavigationComponent,
    ChatComponent,
    ChipComponent,
    CardContactComponent,
    ListGroupComponent,
    ListContactComponent,
    AvatarComponent,
    ListChipComponent,
    ResetPasswordComponent,
    ListMemberComponent,
    FeedNotificationComponent,
    ListDataspaceComponent,
    ListProfileComponent,
    CardDataspaceComponent,
    FeedThreadComponent,
    CardChatComponent,
    CalendarComponent,
    CalendarDaysComponent,
    FileUploadComponent,
    ListChatComponent,
    EditorProfileComponent,
    EditorAccountComponent,
    EditorPasswordComponent,
    ServiceDialogComponent,
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
    GraphQLModule,
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
  entryComponents: [SearchComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
