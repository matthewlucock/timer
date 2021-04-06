import * as preact from 'preact'
import { useState, useRef, useEffect, useLayoutEffect } from 'preact/hooks'

import styles from './styles.scss'

import { MINUTE, HOUR } from 'timer/globals'
import { collectTimeParts, separateTimeParts } from 'timer/util'
import { TimerLogic } from 'timer/logic'
import { ElapsedIndicator } from 'timer/logic/elapsed-indicator'

import { Button } from 'timer/components/button'
import { TimerName } from 'timer/components/timer-name'
import { TimeInput } from 'timer/components/time-input'
import { TimeSeparator } from 'timer/components/time-separator'

const parseTimePartString = (value: string): number => {
  const parsedValue = Number.parseInt(value)
  if (Number.isNaN(parsedValue)) return 0
  return parsedValue
}

export const Timer: preact.FunctionComponent = () => {
  const logic = useRef<TimerLogic>()
  const elapsedIndicator = useRef<ElapsedIndicator>()
  const elapsedIndicatorContainer = useRef<HTMLDivElement>()

  const [time, setTime] = useState<number>(0)
  const [hours, setHours] = useState<string>('0')
  const [minutes, setMinutes] = useState<string>('0')
  const [seconds, setSeconds] = useState<string>('0')

  const [running, setRunning] = useState<boolean>(false)
  const [paused, setPaused] = useState<boolean>(false)
  const inProgress = running || paused

  useLayoutEffect(() => {
    elapsedIndicator.current = new ElapsedIndicator()
    elapsedIndicator.current.setSize(70)
    elapsedIndicatorContainer.current.append(elapsedIndicator.current.element)
  }, [])

  const clear = (): void => {
    setTime(0)
    setRunning(false)
    setPaused(false)
    elapsedIndicator.current.clear()
  }

  const updateTimeParts = (time: number): void => {
    const parts = separateTimeParts(time)
    setHours(parts.hours.toString())
    setMinutes(parts.minutes.toString())
    setSeconds(parts.seconds.toString())
  }

  useEffect(() => {
    updateTimeParts(time)
    if (time === 0) clear()
  }, [time])

  useEffect(() => {
    logic.current = new TimerLogic()
    logic.current.emitter.on('elapsed', (elapsedPercentage?: number): void => {
      if (elapsedPercentage === undefined) throw new Error('Missing elapsed percentage')
      elapsedIndicator.current.update(elapsedPercentage)
    })
    logic.current.emitter.on('tick', (time?: number): void => {
      if (time === undefined) throw new Error('Missing time')
      setTime(time)
    })
  }, [])

  const start = (): void => {
    logic.current.start(time)
    setRunning(true)
  }
  const pause = (): void => {
    logic.current.pause()
    setRunning(false)
    setPaused(true)
  }
  const resume = (): void => {
    logic.current.resume()
    setRunning(true)
  }

  const updateTime = (): void => {
    const newTime = collectTimeParts({
      hours: parseTimePartString(hours),
      minutes: parseTimePartString(minutes),
      seconds: parseTimePartString(seconds)
    })

    setTime(newTime)
    if (time === newTime) updateTimeParts(newTime)
  }

  const showHours = !inProgress || time >= HOUR
  const showMinutes = !inProgress || time >= MINUTE

  return (
    <div className={styles.container}>
      <TimerName />

      <div className={styles.time}>
        {showHours && (
          <>
            <TimeInput
              value={hours}
              setValue={setHours}
              disabled={inProgress}
              onBlur={updateTime}
            />
            <TimeSeparator />
          </>
        )}

        {showMinutes && (
          <>
            <TimeInput
              value={minutes}
              setValue={setMinutes}
              disabled={inProgress}
              onBlur={updateTime}
            />
            <TimeSeparator />
          </>
        )}

        <TimeInput
          value={seconds}
          setValue={setSeconds}
          disabled={inProgress}
          onBlur={updateTime}
        />
      </div>

      <div ref={elapsedIndicatorContainer} className={styles.elapsedIndicatorContainer} />

      <div className={styles.buttons}>
        {((): preact.JSX.Element => {
          if (running) return <Button onClick={pause}>pause</Button>

          if (paused) {
            return (
              <>
                <Button onClick={clear}>cancel</Button>
                <Button onClick={resume}>resume</Button>
              </>
            )
          }

          return <Button onClick={start} disabled={time === 0}>start</Button>
        })()}
      </div>
    </div>
  )
}
