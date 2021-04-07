import * as preact from 'preact'
import clsx from 'clsx'

import styles from './styles.scss'

type Props = preact.JSX.HTMLAttributes<HTMLButtonElement>

export const Button: preact.FunctionComponent<Props> = ({ className, ...rest }) => (
  <button className={clsx(styles.button, className)} {...rest} />
)
