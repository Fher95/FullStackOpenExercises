import { useGood, useNeutral, useBad, useAll, useAverage, usePositive } from './store'
const Statistics = () => {

  const good = useGood()
  const neutral = useNeutral()
  const bad = useBad()
  const all = useAll()
  const average = useAverage()
  const positive = usePositive()


  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average.toFixed(1)}</td></tr>
          <tr><td>positive</td><td>{positive.toFixed(1)}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
