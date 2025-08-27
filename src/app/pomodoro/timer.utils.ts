import { TIME_FORMAT } from './timer.constants';

/**
 * Formata segundos em formato MM:SS
 * @param totalSeconds - Total de segundos
 * @returns String formatada no formato MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(TIME_FORMAT.MINUTES_PADDING, TIME_FORMAT.PADDING_CHAR);
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(TIME_FORMAT.SECONDS_PADDING, TIME_FORMAT.PADDING_CHAR);
  return `${minutes}:${seconds}`;
}

/**
 * Converte minutos para segundos
 * @param minutes - Minutos para converter
 * @returns Segundos equivalentes
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * Converte segundos para minutos
 * @param seconds - Segundos para converter
 * @returns Minutos equivalentes
 */
export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60);
}
