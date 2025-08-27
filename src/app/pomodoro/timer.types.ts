import { TimerState } from './timer-state.enum';

export interface TimerConfig {
  workDuration: number;
  breakDuration: number;
}

export interface TimerStateData {
  mode: TimerState;
  remaining: number;
  isRunning: boolean;
  isCompleted: boolean;
}

export interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchMode: () => void;
  setMode: (mode: TimerState) => void;
}
