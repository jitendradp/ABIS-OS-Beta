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
  MatOptionModule, MatPaginatorModule, MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule, MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import {AccessComponent} from './pages/system/access/access.component';
import {ContentComponent} from './components/content/content.component';
import {ButtonComponent} from './components/button/button.component';
import {RegisterComponent} from './pages/system/register/register.component';
import {SigninComponent} from './pages/system/signin/signin.component';
import {ProfileComponent} from './pages/system/profile/profile.component';
import {IconbarComponent} from './components/iconbar/iconbar.component';
import {StoreComponent} from './pages/store/store.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NgxEchartsModule} from "ngx-echarts";
import {StudioComponent} from './pages/studio/studio.component';
import {ProfileService} from "./services/profile.service";
import {CockpitComponent} from './pages/cockpit/cockpit.component';
import {MapComponent} from './pages/map/map.component';
import {InviteComponent} from './pages/system/invite/invite.component';
import {ResetComponent} from './pages/system/reset/reset.component';
import {ForgotComponent} from './pages/system/forgot/forgot.component';
import {LogoComponent} from './components/logo/logo.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {InputComponent} from './components/input/input.component';
import {WhitespaceComponent} from './components/whitespace/whitespace.component';
import {ChatComponent} from './chat/chat.component';
import {EditorChannelComponent} from './editors/editor-channel/editor-channel.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {CardIntroComponent} from "./cards/card-intro/card-intro.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {SwitchProfileComponent} from './pages/system/switch-profile/switch-profile.component';
import {LogoutComponent} from './pages/system/logout/logout.component';
import {IAction} from "./actions/IAction";
import {RoomsComponent} from "./pages/rooms/rooms.component";
import {EditorRoomComponent} from "./editors/editor-room/editor-room.component";
import {AvatarsComponent} from "./components/avatars/avatars.component";
import {CardMessageComponent} from "./cards/card-message/card-message.component";
import {CardRoomComponent} from "./cards/card-room/card-room.component";
import {CardFormComponent} from "./cards/card-form/card-form.component";
import {CardStoreComponent} from "./cards/card-store/card-store.component";
import {SearchComponent} from "./search/search.component";
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import {CardComponent} from "./cards/card/card.component";
import {ChartTableComponent} from "./charts/chart-table/chart-table.component";
import {ChartLineComponent} from "./charts/chart-line/chart-line.component";
import {ChartMapComponent} from "./charts/chart-map/chart-map.component";
import {EditorCommandComponent} from "./editors/editor-command/editor-command.component";
import {ChartGraphForceComponent} from "./charts/chart-graph-force/chart-graph-force.component";
import {ChartSankeyComponent} from "./charts/chart-sankey/chart-sankey.component";
import {SetVisibility} from "./actions/ui/sidebar/SetVisibility";
import {DeviceDetectorModule} from "ngx-device-detector";
import {ClusterPopupComponent} from "./pages/map/cluster-popup/cluster-popup.component";
import {AgGridModule} from "ag-grid-angular";
import {EditorPortfolioComponent} from "./editors/editor-portfolio/editor-portfolio.component";
import {SmartCryptoAppComponent} from "./smartapps/smart-crypto-app/smart-crypto-app.component";
import {CardPortfolioComponent} from "./cards/card-portfolio/card-portfolio.component";
import {CardProfileComponent} from "./cards/card-profile/card-profile.component";

const defaultActions: IAction[] = [<SetVisibility>{
  name: SetVisibility.Name,
  label: "Open/Close Sidebar",
  icon: "menu",
  side: "left",
  state: "toggle"
}, <SetVisibility>{
  name: SetVisibility.Name,
  label: "Open/Close Chat",
  icon: "question_answer",
  side: "right",
  state: "toggle"
}];

const appRoutes: Routes = [
  {
    path: '', component: AccessComponent, data: {
      "title": "Welcome",
      "actions": defaultActions
    }
  },
  {
    path: 'signin', component: SigninComponent, data: {
      "title": "Login",
      "actions": defaultActions
    }
  },
  {
    path: 'register', component: RegisterComponent, data: {
      "title": "Sign up",
      "actions": defaultActions
    }
  },
  {
    path: 'profile', component: ProfileComponent, data: {
      "title": "Settings",
      "actions": defaultActions
    }
  },
  {
    path: 'cockpit', component: CockpitComponent, data: {
      "title": "Cockpit",
      "actions": defaultActions
    }
  },
  {
    path: 'store', component: StoreComponent, data: {
      "title": "Store",
      "actions": defaultActions
    }
  },
  {
    path: 'studio', component: StudioComponent, data: {
      "title": "Studio",
      "actions": defaultActions
    }
  },
  {
    path: 'map', component: MapComponent, data: {
      "title": "Map",
      "actions": defaultActions
    }
  },
  {
    path: 'invite', component: InviteComponent, data: {
      "title": "Invite",
      "actions": defaultActions
    }
  },
  {
    path: 'reset-password', component: ResetComponent, data: {
      "title": "Reset password",
      "actions": defaultActions
    }
  },
  {
    path: 'forgot-password', component: ForgotComponent, data: {
      "title": "Forgot password",
      "actions": defaultActions
    }
  },
  {
    path: 'editor-channel', component: EditorChannelComponent, data: {
      "title": "Create new channel",
      "actions": defaultActions
    }
  },
  {
    path: 'switch-profile', component: SwitchProfileComponent, data: {
      "title": "Switch profile",
      "actions": defaultActions
    }
  },
  {
    path: 'logout', component: LogoutComponent, data: {
      "title": "Logout",
      "actions": defaultActions
    }
  },
  {
    path: 'chat-rooms', component: RoomsComponent, data: {
      "title": "Rooms",
      "actions": defaultActions
    }
  },
  {
    path: 'editor-team', component: EditorRoomComponent, data: {
      "title": "Create new team",
      "actions": defaultActions
    }
  },
  {
    path: 'command', component: EditorCommandComponent, data: {
      "title": "New command",
      "actions": defaultActions
    }
  },
  {
    path: 'smart-crypto-app', component: SmartCryptoAppComponent, data: {
      "title": "Smart Crypto App",
      "actions": defaultActions
    }
  },
  {
    path: 'chat', component: ChatComponent, data: {
      "title": "Chat",
      "actions": defaultActions
    }
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
    ProfileComponent,
    IconbarComponent,
    StoreComponent,
    StudioComponent,
    CockpitComponent,
    MapComponent,
    InviteComponent,
    ResetComponent,
    ForgotComponent,
    LogoComponent,
    HeaderComponent,
    InputComponent,
    WhitespaceComponent,
    ChatComponent,
    EditorChannelComponent,
    CardIntroComponent,
    NavigationComponent,
    SwitchProfileComponent,
    LogoutComponent,
    RoomsComponent,
    EditorRoomComponent,
    AvatarsComponent,
    CardMessageComponent,
    CardRoomComponent,
    CardFormComponent,
    CardStoreComponent,
    SearchComponent,
    CardComponent,
    ChartTableComponent,
    ChartLineComponent,
    ChartMapComponent,
    EditorCommandComponent,
    ChartGraphForceComponent,
    ChartSankeyComponent,
    ClusterPopupComponent,
    EditorPortfolioComponent,
    SmartCryptoAppComponent,
    CardPortfolioComponent,
    CardProfileComponent,
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
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiZGF2ZXdhdmVhYmlzY2xvdWQiLCJhIjoiY2s0eXYycjhzMDRhczNkbXF6dzNkMzlzayJ9.nyAc-uTfNfDTF0lxmZ3a3Q', // Optionnal, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'pk.eyJ1IjoiZGF2ZXdhdmVhYmlzY2xvdWQiLCJhIjoiY2s0eXYycjhzMDRhczNkbXF6dzNkMzlzayJ9.nyAc-uTfNfDTF0lxmZ3a3Q' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ],
  providers: [ProfileService],
  entryComponents: [SearchComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
