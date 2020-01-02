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
import {MessageComponent} from './cards/message/message.component';
import {CockpitComponent} from './pages/cockpit/cockpit.component';
import {MapComponent} from './pages/map/map.component';
import {InviteComponent} from './pages/system/invite/invite.component';
import {FormComponent} from './components/form/form.component';
import {ResetComponent} from './pages/system/reset/reset.component';
import {ForgotComponent} from './pages/system/forgot/forgot.component';
import {LogoComponent} from './components/logo/logo.component';
import {LocationComponent} from './pages/system/location/location.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {InputComponent} from './components/input/input.component';
import {WhitespaceComponent} from './components/whitespace/whitespace.component';
import {ChatComponent} from './widgets/chat/chat.component';
import {ChannelEditorComponent} from './editors/channel-editor/channel-editor.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {CardIntroComponent} from "./cards/card-intro/card-intro.component";
import {TeamsComponent} from "./widgets/teams/teams.component";

const defaultActions = [{
  name: "Abis.Sidebar.ToggleVisibility",
  label: "Open/Close Sidebar",
  icon: "menu",
  position: "left"
}, {
  name: "Abis.Chat.ToggleVisibility",
  label: "Open/Close Chat",
  icon: "chat",
  position: "right"
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
    path: 'location', component: LocationComponent, data: {
      "title": "Add location",
      "actions": defaultActions
    }
  },
  {
    path: 'channel-editor', component: ChannelEditorComponent, data: {
      "title": "Create new channel",
      "actions": defaultActions
    }
  }
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
    CardComponent,
    IconbarComponent,
    StoreComponent,
    LineChartComponent,
    StudioComponent,
    TableComponent,
    MessageComponent,
    CockpitComponent,
    MapComponent,
    InviteComponent,
    FormComponent,
    ResetComponent,
    ForgotComponent,
    LogoComponent,
    LocationComponent,
    HeaderComponent,
    InputComponent,
    WhitespaceComponent,
    ChatComponent,
    ChannelEditorComponent,
    CardIntroComponent,
    TeamsComponent,
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
    GraphQLModule,
    HttpClientModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
