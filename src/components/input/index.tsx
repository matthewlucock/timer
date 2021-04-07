import * as preact from 'preact'
import { useRef, useState } from 'preact/hooks'
import clsx from 'clsx'

import styles from './styles.scss'

export type InputSetValue = (newValue: string) => false | undefined
type Props = Readonly<{
  className?: string
  value: string
  setValue: InputSetValue
  disabled?: boolean
  onBlur?: () => void
}>

export const Input: preact.FunctionComponent<Props> = props => {
  const input = useRef<HTMLInputElement>()
  const [focused, setFocused] = useState<boolean>(false)

  const onInput = (): void => {
    const newValue = input.current.value
    const setResult = props.setValue(newValue)
    if (setResult === false) input.current.value = props.value
  }
  const onFocus = (): void => {
    setFocused(true)
  }
  const onBlur = (): void => {
    setFocused(false)
    if (props.onBlur !== undefined) props.onBlur()
  }

  const onContainerMouseDown = (event: MouseEvent): void => {
    if (!focused) {
      input.current.focus()
      // Prevent the mousedown event itself from blurring the just-focused input
      event.preventDefault()
    }
  }
  const containerClassName = clsx(
    styles.container,
    focused && styles.focused,
    props.disabled === true && styles.disabled,
    props.className
  )

  return (
    <div className={containerClassName} onMouseDown={onContainerMouseDown}>
      <div className={styles.innerContainer}>
        <input
          ref={input}
          className={styles.input}
          type='text'
          value={props.value}
          disabled={props.disabled}
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
          spellcheck={false}
        />

        <span className={styles.sizer} aria-hidden>{props.value}</span>
      </div>
    </div>
  )
}
