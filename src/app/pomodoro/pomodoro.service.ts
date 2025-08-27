import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';
import { TimerState } from './timer-state.enum';
import { TIMER_CONSTANTS } from './timer.constants';
import { TimerConfig, TimerStateData } from './timer.types';
import { minutesToSeconds } from './timer.utils';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private readonly _state$ = new BehaviorSubject<TimerStateData>({
    mode: TimerState.Work,
    remaining: minutesToSeconds(TIMER_CONSTANTS.DEFAULT_WORK_DURATION),
    isRunning: false,
    isCompleted: false
  });

  private timerSubscription?: Subscription;
  private defaultConfig: TimerConfig = {
    workDuration: TIMER_CONSTANTS.DEFAULT_WORK_DURATION,
    breakDuration: TIMER_CONSTANTS.DEFAULT_BREAK_DURATION
  };

  get state$(): Observable<TimerStateData> {
    return this._state$.asObservable();
  }

  get remaining$(): Observable<number> {
    return this.state$.pipe(map(state => state.remaining));
  }

  get mode$(): Observable<TimerState> {
    return this.state$.pipe(map(state => state.mode));
  }

  get isRunning$(): Observable<boolean> {
    return this.state$.pipe(map(state => state.isRunning));
  }

  get isCompleted$(): Observable<boolean> {
    return this.state$.pipe(map(state => state.isCompleted));
  }

  start(duration?: number): void {
    const currentState = this._state$.value;
    const targetDuration = duration ?? this.getDurationForMode(currentState.mode);
    
    this.updateState({
      ...currentState,
      remaining: targetDuration,
      isRunning: true,
      isCompleted: false
    });

    this.startTimer(targetDuration);
  }

  pause(): void {
    this.stopTimer();
    this.updateState({
      ...this._state$.value,
      isRunning: false
    });
  }

  reset(duration?: number): void {
    this.stopTimer();
    const currentState = this._state$.value;
    const targetDuration = duration ?? this.getDurationForMode(currentState.mode);
    
    this.updateState({
      ...currentState,
      remaining: targetDuration,
      isRunning: false,
      isCompleted: false
    });
  }

  switchMode(): void {
    const currentState = this._state$.value;
    const newMode = currentState.mode === TimerState.Work ? TimerState.Break : TimerState.Work;
    const newDuration = this.getDurationForMode(newMode);
    
    this.updateState({
      ...currentState,
      mode: newMode,
      remaining: newDuration,
      isRunning: false,
      isCompleted: false
    });
  }

  setMode(mode: TimerState): void {
    const currentState = this._state$.value;
    if (currentState.mode !== mode) {
      const newDuration = this.getDurationForMode(mode);
      
      this.updateState({
        ...currentState,
        mode,
        remaining: newDuration,
        isRunning: false,
        isCompleted: false
      });
    }
  }

  updateConfig(config: Partial<TimerConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
    this.reset();
  }

  private startTimer(duration: number): void {
    this.timerSubscription = interval(TIMER_CONSTANTS.TIMER_INTERVAL)
      .pipe(
        takeWhile(() => this._state$.value.isRunning && this._state$.value.remaining > 0)
      )
      .subscribe(() => {
        const currentState = this._state$.value;
        const newRemaining = currentState.remaining - 1;
        
        if (newRemaining <= 0) {
          this.handleTimerCompletion();
        } else {
          this.updateState({
            ...currentState,
            remaining: newRemaining
          });
        }
      });
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = undefined;
  }

  private handleTimerCompletion(): void {
    const currentState = this._state$.value;
    
    this.updateState({
      ...currentState,
      remaining: 0,
      isRunning: false,
      isCompleted: true
    });

    // Auto-switch mode after completion
    setTimeout(() => {
      this.switchMode();
      this.updateState({
        ...this._state$.value,
        isCompleted: false
      });
    }, TIMER_CONSTANTS.AUTO_SWITCH_DELAY);
  }

  private getDurationForMode(mode: TimerState): number {
    return mode === TimerState.Work 
      ? minutesToSeconds(this.defaultConfig.workDuration)
      : minutesToSeconds(this.defaultConfig.breakDuration);
  }

  private updateState(newState: TimerStateData): void {
    this._state$.next(newState);
  }

  stop(): void {
    this.pause();
  }
}
