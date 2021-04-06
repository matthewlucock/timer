import * as preact from 'preact'
import { useState } from 'preact/hooks'

import styles from './styles.scss'

import { Input } from 'timer/components/input'
import type { InputSetValue } from 'timer/components/input'

const MAX_LENGTH = 40
let counter = 1

export const TimerName: preact.FunctionComponent = () => {
  const [name, setName] = useState<string>(`Timer ${counter++}`)

  const setValue: InputSetValue = newValue => {
    if (newValue.length > MAX_LENGTH) return false
    setName(newValue)
  }

  return (
    <Input className={styles.timerName} value={name} setValue={setValue} />
  )
}
