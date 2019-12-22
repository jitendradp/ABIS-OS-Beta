import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatGridListModule,
  MatIconModule, MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from "@angular/material";
import {MenuComponent} from './menu/menu.component';
import {AccessComponent} from './pages/access/access.component';
import { ContentComponent } from './content/content.component';
import { ButtonComponent } from './button/button.component';

const appRoutes: Routes = [
  {path: 'access', component: AccessComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AccessComponent,
    ContentComponent,
    ButtonComponent
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
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
