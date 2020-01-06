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
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
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
import {ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {InputComponent} from './components/input/input.component';
import {WhitespaceComponent} from './components/whitespace/whitespace.component';
import {ChatComponent} from './widgets/chat/chat.component';
import {ChannelEditorComponent} from './editors/channel-editor/channel-editor.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {CardIntroComponent} from "./cards/card-intro/card-intro.component";
import {TeamsComponent} from "./widgets/chat/teams/teams.component";
import {NavigationComponent} from "./pages/system/navigation/navigation.component";
import {SwitchProfileComponent} from './pages/system/switch-profile/switch-profile.component';
import {LogoutComponent} from './pages/system/logout/logout.component';
import {IAction} from "./actions/IAction";
import {ToggleVisibility} from "./actions/ui/sidebar/ToggleVisibility";
import {ExplorerComponent} from "./pages/explorer/explorer.component";
import {TeamEditorComponent} from "./editors/team-editor/team-editor.component";
import {AvatarsComponent} from "./components/avatars/avatars.component";
import {CardMessageComponent} from "./cards/card-message/card-message.component";
import {CardTeamComponent} from "./cards/card-team/card-team.component";
import {CardFormComponent} from "./cards/card-form/card-form.component";
import {CardStoreComponent} from "./cards/card-store/card-store.component";
import {SearchComponent} from "./widgets/search/search.component";
import {NgxMapboxGLModule} from "ngx-mapbox-gl";
import {CardComponent} from "./cards/card/card.component";
import {ChartTableComponent} from "./charts/chart-table/chart-table.component";
import {ChartLineComponent} from "./charts/chart-line/chart-line.component";
import {ChartMapComponent} from "./charts/chart-map/chart-map.component";
import {CommandComponent} from "./widgets/command/command.component";

const defaultActions: IAction[] = [<ToggleVisibility>{
  name: ToggleVisibility.Name,
  label: "Open/Close Sidebar",
  icon: "menu",
  side: "left"
}, <ToggleVisibility>{
  name: ToggleVisibility.Name,
  label: "Open/Close Chat",
  icon: "question_answer",
  side: "right"
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
    path: 'channel-editor', component: ChannelEditorComponent, data: {
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
    path: 'explorer', component: ExplorerComponent, data: {
      "title": "Teams",
      "actions": defaultActions
    }
  },
  {
    path: 'team-editor', component: TeamEditorComponent, data: {
      "title": "Create new team",
      "actions": defaultActions
    }
  },
  {
    path: 'command', component: CommandComponent, data: {
      "title": "New command",
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
    ChannelEditorComponent,
    CardIntroComponent,
    TeamsComponent,
    NavigationComponent,
    SwitchProfileComponent,
    LogoutComponent,
    ExplorerComponent,
    TeamEditorComponent,
    AvatarsComponent,
    CardMessageComponent,
    CardTeamComponent,
    CardFormComponent,
    CardStoreComponent,
    SearchComponent,
    CardComponent,
    ChartTableComponent,
    ChartLineComponent,
    ChartMapComponent,
    CommandComponent,
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
    MatSlideToggleModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatSnackBarModule,
    GraphQLModule,
    HttpClientModule,
    MatBottomSheetModule,
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
