import * as preact from 'preact'
import { useEffect } from 'preact/hooks'

import styles from './main.scss'

import { Timer } from './components/timer'

const usePageLoaded = (): void => {
  useEffect(() => {
    document.body.classList.add(styles.loaded)

    return () => {
      document.body.classList.remove(styles.loaded)
    }
  }, [])
}

export const App: preact.FunctionComponent = () => {
  usePageLoaded()

  return (
    <Timer />
  )
}
