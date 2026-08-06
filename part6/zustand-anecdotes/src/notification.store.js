import { create } from 'zustand'

const useNotificationStore = create((set) => ({
    message: null,
    actions: {
        setMessage: (message) => {
            set(() => ({ message }))
            if (message) {
                setTimeout(() => {
                    set(() => ({ message: null }))
                }, 5000)
            }
        },
    }
}))

export const useMessage = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
export const setNotification = (message) => {
    useNotificationStore.getState().actions.setMessage(message)
}