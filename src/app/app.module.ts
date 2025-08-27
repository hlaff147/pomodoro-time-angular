import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PomodoroTimerComponent } from './pomodoro/pomodoro-timer.component';

@NgModule({
  declarations: [AppComponent, PomodoroTimerComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
