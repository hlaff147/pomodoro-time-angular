import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PomodoroService } from './pomodoro.service';
import { TimerState } from './timer-state.enum';
import { TIMER_CONSTANTS } from './timer.constants';
import { TimerConfig } from './timer.types';
import { formatTime as formatTimeUtil } from './timer.utils';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.css']
})
export class PomodoroTimerComponent implements OnInit, OnDestroy {
  // Observables do service
  readonly remaining$: Observable<number>;
  readonly mode$: Observable<TimerState>;
  readonly isRunning$: Observable<boolean>;
  readonly isCompleted$: Observable<boolean>;

  // Configurações
  private readonly defaultConfig: TimerConfig = {
    workDuration: TIMER_CONSTANTS.DEFAULT_WORK_DURATION,
    breakDuration: TIMER_CONSTANTS.DEFAULT_BREAK_DURATION
  };

  // Expor enum para o template
  readonly TimerState = TimerState;

  // Subject para gerenciar destruição do componente
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly pomodoroService: PomodoroService) {
    // Inicializar observables
    this.remaining$ = this.pomodoroService.remaining$;
    this.mode$ = this.pomodoroService.mode$;
    this.isRunning$ = this.pomodoroService.isRunning$;
    this.isCompleted$ = this.pomodoroService.isCompleted$;
  }

  ngOnInit(): void {
    // Configurar o service com as configurações padrão
    this.pomodoroService.updateConfig(this.defaultConfig);
  }

  ngOnDestroy(): void {
    // Parar o timer e limpar recursos
    this.pomodoroService.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos de controle do timer
  start(): void {
    this.pomodoroService.start();
  }

  pause(): void {
    this.pomodoroService.pause();
  }

  reset(): void {
    this.pomodoroService.reset();
  }

  switchMode(): void {
    this.pomodoroService.switchMode();
  }

  setMode(mode: TimerState): void {
    this.pomodoroService.setMode(mode);
  }

  // Método utilitário para formatação de tempo (usado no template)
  formatTime(totalSeconds: number): string {
    return formatTimeUtil(totalSeconds);
  }
}

