const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(`${baseUrl}`)
    if (!response.ok) {
        throw new Error('Error fetching response')
    }
    return await response.json()
}

const create = async (anecdote) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anecdote)
    }
    const response = await fetch(`${baseUrl}`, options)
    if (!response.ok) {
        throw new Error('Error creating anecdote')
    }
    return await response.json()
}

const update = async (id, anecdote) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anecdote)
    }
    const response = await fetch(`${baseUrl}/${id}`, options)
    if (!response.ok) {
        throw new Error('Error updating anecdote')
    }
    return await response.json()
}

const remove = async (id) => {
    const options = {
        method: 'DELETE'
    }
    const response = await fetch(`${baseUrl}/${id}`, options)
    if (!response.ok) {
        throw new Error('Error deleting anecdote')
    }
    return await response.json()
}

export default { getAll, create, update, remove }