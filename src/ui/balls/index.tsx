import { useShootingStore } from '~/store/use-shooting-store'
import s from './balls.module.scss'

export const Balls = () => {
  const { makes } = useShootingStore()

  return (
    <ul className={s.balls}>
      {[...Array(makes)].map((_, i) => (
        <li key={i}>
          <span>
            <span></span>
          </span>
        </li>
      ))}
    </ul>
  )
}
