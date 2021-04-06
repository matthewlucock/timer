import type { TimeParts } from './globals'

export const collectTimeParts = ({ hours, minutes, seconds }: TimeParts): number => {
  minutes += hours * 60
  seconds += minutes * 60
  return seconds
}

export const separateTimeParts = (seconds: number): TimeParts => {
  let minutes = Math.floor(seconds / 60)
  seconds %= 60
  const hours = Math.floor(minutes / 60)
  minutes %= 60

  return { hours, minutes, seconds }
}
