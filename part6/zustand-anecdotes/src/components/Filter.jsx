import { useAnecdoteActions } from '../store'
const Filter = () => {

    const { setFilter } = useAnecdoteActions();

    const handleChange = (event) => {
        console.log(event.target.value)
        setFilter(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter