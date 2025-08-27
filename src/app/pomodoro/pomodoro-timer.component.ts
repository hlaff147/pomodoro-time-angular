import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PomodoroService } from './pomodoro.service';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.css']
})
export class PomodoroTimerComponent implements OnDestroy {
  workDuration = 25;
  breakDuration = 5;
  mode: 'work' | 'break' = 'work';
  remaining$ = this.pomodoro.remaining$;
  private completionSub?: Subscription;

  constructor(private pomodoro: PomodoroService) {}

  start(): void {
    this.cancelCompletionWatcher();
    const duration = (this.mode === 'work' ? this.workDuration : this.breakDuration) * 60;
    this.pomodoro.start(duration);
    this.completionSub = this.remaining$.subscribe(v => {
      if (v === 0) {
        this.mode = this.mode === 'work' ? 'break' : 'work';
        this.start();
      }
    });
  }

  pause(): void {
    this.pomodoro.stop();
    this.cancelCompletionWatcher();
  }

  reset(): void {
    this.pause();
    this.mode = 'work';
    this.pomodoro.start(this.workDuration * 60);
    this.pause();
  }

  private cancelCompletionWatcher(): void {
    this.completionSub?.unsubscribe();
    this.completionSub = undefined;
  }

  ngOnDestroy(): void {
    this.pomodoro.stop();
    this.cancelCompletionWatcher();
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
