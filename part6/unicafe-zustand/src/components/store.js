import { create } from 'zustand'

function calculateValues(state) {
    return {
        ...state,
        all: state.good + state.neutral + state.bad,
        average: (state.good - state.bad) / (state.good + state.neutral + state.bad),
        positive: state.good / (state.good + state.neutral + state.bad) * 100
    }
}

const useCounterStore = create(set => ({
    good: 0,
    neutral: 0,
    bad: 0,
    all: 0,
    average: 0,
    positive: 0,
    actions: {
        incrementGood: () => set(state => calculateValues({ ...state, good: state.good + 1 })),
        incrementNeutral: () => set(state => calculateValues({ ...state, neutral: state.neutral + 1 })),
        incrementBad: () => set(state => calculateValues({ ...state, bad: state.bad + 1 })),
    }
}))

export const useGood = () => useCounterStore(state => state.good)
export const useNeutral = () => useCounterStore(state => state.neutral)
export const useBad = () => useCounterStore(state => state.bad)
export const useAll = () => useCounterStore(state => state.all)
export const useAverage = () => useCounterStore(state => state.average)
export const usePositive = () => useCounterStore(state => state.positive)
export const useCounterControls = () => useCounterStore(state => state.actions)