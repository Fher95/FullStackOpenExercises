import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {

    const { add } = useAnecdoteActions();

    const onCreateNew = (event) => {
        event.preventDefault()
        add(event.target.anecdote.value)
    }

    return (<>
        <h2>create new</h2>
        <form onSubmit={onCreateNew}>
            <div>
                <input name="anecdote" />
            </div>
            <button type="submit" >create</button>
        </form>
    </>)
}

export default AnecdoteForm;