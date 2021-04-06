import * as preact from 'preact'

import styles from './styles.scss'

type Props = Readonly<{
  onClick: () => void
  disabled?: boolean
}>

export const Button: preact.FunctionComponent<Props> = props => (
  <button className={styles.button} onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
)
