export const TIMER_CONSTANTS = {
  DEFAULT_WORK_DURATION: 25, // minutos
  DEFAULT_BREAK_DURATION: 5, // minutos
  AUTO_SWITCH_DELAY: 1000, // milissegundos
  TIMER_INTERVAL: 1000, // milissegundos
} as const;

export const TIME_FORMAT = {
  MINUTES_PADDING: 2,
  SECONDS_PADDING: 2,
  PADDING_CHAR: '0',
} as const;
