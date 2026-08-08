import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createNew, update } from '../services/anecdotes'

export const useAnecdotes = () => {

    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAll,
        refetchOnWindowFocus: false,
        retry: false
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createNew,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
        }
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: anecdote => (update(anecdote.id, anecdote)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        isError: result.isError,
        addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
        voteAnecdote: (anecdote) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    }

}