import * as preact from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
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
  const widthCalculator = useRef<HTMLElement>()

  const onInput = (): void => {
    const newValue = input.current.value
    const setResult = props.setValue(newValue)
    if (setResult === false) input.current.value = props.value
  }

  useLayoutEffect(() => {
    widthCalculator.current.textContent = props.value
    input.current.style.width = `${widthCalculator.current.offsetWidth}px`
  }, [props.value])

  return (
    <>
      <input
        ref={input}
        className={clsx(styles.input, props.className)}
        type='text'
        value={props.value}
        disabled={props.disabled}
        onInput={onInput}
        onBlur={props.onBlur}
        spellcheck={false}
      />

      <span ref={widthCalculator} className={styles.widthCalculator} aria-hidden />
    </>
  )
}
