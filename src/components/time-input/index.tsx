import * as preact from 'preact'

import styles from './styles.scss'

import { Input } from 'timer/components/input'
import type { InputSetValue } from 'timer/components/input'

type Props = Readonly<{
  value: string
  setValue: (value: string) => void
  disabled: boolean
  onBlur: () => void
}>

export const TimeInput: preact.FunctionComponent<Props> = props => {
  const setValue: InputSetValue = newValue => {
    if (newValue.length === 0 || (/^\d+$/.test(newValue) && newValue.length <= 3)) {
      props.setValue(newValue)
    } else {
      return false
    }
  }

  return (
    <Input
      className={styles.timeInput}
      value={props.value}
      setValue={setValue}
      disabled={props.disabled}
      onBlur={props.onBlur}
    />
  )
}
