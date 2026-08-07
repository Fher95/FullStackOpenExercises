
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import { setNotification } from './notification.store'

const showNotification = message => {
  setNotification(message)
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    add: async (anecdote) => {
      const added = await anecdoteService.create({ content: anecdote, votes: 0 })
      set(state => ({ anecdotes: [...state.anecdotes, added] }))
      showNotification(`Added anecdote: ${added.content}`)
    },
    vote: async (id) => {
      const voted = get().anecdotes.find(anecdote => anecdote.id == id)
      const updated = await anecdoteService.update(id, { ...voted, votes: voted.votes + 1 })
      const newList = get().anecdotes.map(anecdote => anecdote.id == id ? updated : anecdote)
      newList.sort((a, b) => b.votes - a.votes);
      set(() => ({ anecdotes: newList }))
      showNotification(`You voted '${updated.content}'`)
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      anecdotes.sort((a, b) => b.votes - a.votes)
      set(() => ({ anecdotes }))
    },
    remove: async (id) => {
      const removed = await anecdoteService.remove(id)
      console.log('EL REMOVED:', removed)
      set(() => ({ anecdotes: get().anecdotes.filter(anecdote => anecdote.id !== removed.id) } ))
    }
  },
}))

export const useAnecdotes = () => {
  const filter = useAnecdoteStore((state) => state.filter)
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()));
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore
