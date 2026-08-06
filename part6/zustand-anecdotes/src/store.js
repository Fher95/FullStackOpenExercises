
import { create } from 'zustand'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const voteAndSort = (state, id) => {
  const newList = state.anecdotes.map(element => element.id === id ? { ...element, votes: element.votes + 1 } : element);
  newList.sort((a, b) => b.votes - a.votes);
  return { anecdotes: newList }
}

const useAnecdoteStore = create((set) => ({
  anecdotes: anecdotesAtStart.map(asObject),
  actions: {
    add: anecdote => set(state => ({ anecdotes: [...state.anecdotes, asObject(anecdote)] })),
    vote: id => set(state => voteAndSort(state, id)),
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
