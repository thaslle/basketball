import React from 'react'
import s from './restart.module.scss'

type RestartProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

export const Restart = ({ onClick, children }: RestartProps) => {
  return (
    <button onClick={onClick} className={s.button}>
      {children}
    </button>
  )
}
