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

const parseTimePart = (value: string): number => {
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
  const starting = useRef<boolean>(false)

  const inProgress = running || paused
  const showHours = !inProgress || time >= HOUR
  const showMinutes = !inProgress || time >= MINUTE

  useLayoutEffect(() => {
    elapsedIndicator.current = new ElapsedIndicator()
    elapsedIndicator.current.setSize(70)
    elapsedIndicatorContainer.current.append(elapsedIndicator.current.element)

    logic.current = new TimerLogic()
    logic.current.onElapsed = (elapsedPercentage: number): void => {
      elapsedIndicator.current.update(elapsedPercentage)
    }
    logic.current.onTick = setTime
  }, [])

  const updateTimeParts = (givenTime: number): void => {
    const parts = separateTimeParts(givenTime)
    setHours(parts.hours.toString())
    setMinutes(parts.minutes.toString())
    setSeconds(parts.seconds.toString())
  }

  const clear = (): void => {
    setTime(0)
    updateTimeParts(0)
    setRunning(false)
    setPaused(false)
    elapsedIndicator.current.clear()
  }

  useEffect(() => {
    if (!running) return

    if (time === 0) {
      clear()
      return
    }

    updateTimeParts(time)
  }, [time])

  useEffect(() => {
    if (running) return

    const newTime = collectTimeParts({
      hours: parseTimePart(hours),
      minutes: parseTimePart(minutes),
      seconds: parseTimePart(seconds)
    })

    setTime(newTime)
  }, [hours, minutes, seconds])

  const start = (): void => {
    logic.current.start(time)
    setRunning(true)
    starting.current = false
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

  const onBlur = (): void => {
    if (starting.current) return
    updateTimeParts(time)
  }
  const onMouseUp = (): void => {
    if (starting.current) {
      updateTimeParts(time)
      starting.current = false
    }
  }

  return (
    <div className={styles.container} onMouseUp={onMouseUp}>
      <TimerName />

      <div className={styles.time}>
        {showHours && (
          <>
            <TimeInput
              value={hours}
              setValue={setHours}
              disabled={inProgress}
              onBlur={onBlur}
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
              onBlur={onBlur}
            />
            <TimeSeparator />
          </>
        )}

        <TimeInput
          value={seconds}
          setValue={setSeconds}
          disabled={inProgress}
          onBlur={onBlur}
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

          return (
            <Button
              disabled={time === 0}
              onClick={start}
              onMouseDown={(): void => {
                starting.current = true
              }}
            >
              start
            </Button>
          )
        })()}
      </div>
    </div>
  )
}
