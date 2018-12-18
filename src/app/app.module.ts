import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatGridListModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule
} from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { GameComponent } from "./game/game.component";
import { FlexLayoutModule } from "@angular/flex-layout";
@NgModule({
  declarations: [AppComponent, GameComponent],
  imports: [
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatSnackBarModule,
    MatIconModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: ":id",
        component: GameComponent
      },
      {
        path: "**",
        component: GameComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
