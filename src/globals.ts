export const MINUTE = 60
export const HOUR = MINUTE * 60

export type TimeParts = Readonly<{
  hours: number
  minutes: number
  seconds: number
}>
