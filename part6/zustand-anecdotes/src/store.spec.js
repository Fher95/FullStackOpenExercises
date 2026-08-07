import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAnecdoteStore, { useAnecdoteActions, useAnecdotes } from './store';


// Mock the anecdoteService functions
vi.mock('./services/anecdotes', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    remove: vi.fn()
  }
}));

import anecdoteService from './services/anecdotes';

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('should initialize the store with all anecdotes when calling the initialize action', async () => {
    const mockAnecdotes = [{ id: '123', content: 'Test anecdote', votes: 5 }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    await act(async () => {
      await useAnecdoteStore.getState().actions.initialize();
    });

    expect(anecdoteService.getAll).toHaveBeenCalled();
    expect(useAnecdoteStore.getState().anecdotes).toEqual(mockAnecdotes);
  });
  it('should verify the order by votes of the initialized anecdotes', async () => {
    const mockAnecdotes = [
      { id: '123', content: 'Test anecdote', votes: 5 },
      { id: '124', content: 'Test anecdote', votes: 17 },
      { id: '125', content: 'Test anecdote', votes: 22 },
      { id: '126', content: 'Test anecdote', votes: 21 }
    ];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0].id).toEqual('125')
    expect(anecdotesResult.current[3].id).toEqual('123')

  })

  it('should add a new anecdote when calling the add action', async () => {
    const content = 'New anecdote';
    anecdoteService.create.mockResolvedValue({ id: '1', content, votes: 0 })
    await act(async () => {
      await useAnecdoteStore.getState().actions.add(content);
    });

    expect(anecdoteService.create).toHaveBeenCalledWith({ content, votes: 0 });
    expect(useAnecdoteStore.getState().anecdotes).toEqual([
      { id: expect.any(String), content, votes: 0 }
    ]);
  });

  it('should vote an anecdote when calling the vote action', async () => {
    const mockAnecdotes = [
      { id: '123', content: 'Test anecdote', votes: 5 },
      { id: '124', content: 'Test anecdote', votes: 4 },
      { id: '125', content: 'Test anecdote', votes: 5 },
    ];
    const id = '125';
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);
    anecdoteService.update.mockResolvedValue({ ...mockAnecdotes[2], votes: 6 })
    await act(async () => {
      await useAnecdoteStore.getState().actions.initialize();
      await useAnecdoteStore.getState().actions.vote(id);
    });

    expect(anecdoteService.update).toHaveBeenCalledWith(id, { id: '125', content: 'Test anecdote', votes: 6 });
    const votedAnecdote = useAnecdoteStore.getState().anecdotes.find(element => element.id == id);
    expect(votedAnecdote.votes).toBe(6);
  });

})

describe('useAnecdotes filter', () => {
  beforeEach(() => {
    const mockAnecdotes = [
      { id: '123', content: 'Blue one', votes: 5 },
      { id: '124', content: 'Blue two', votes: 4 },
      { id: '125', content: 'Red one', votes: 5 },
    ];
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: '' })
  })
  it('should filter the blue elements in anecdotes list', async () => {
    const { result } = renderHook(() => useAnecdoteActions())
    await act(() => {
      result.current.setFilter('Blue')
    })
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toHaveLength(2)
  })
  it('should filter the red elements in anecdotes list', async () => {
    const { result } = renderHook(() => useAnecdoteActions())
    await act(() => {
      result.current.setFilter('red')
    })
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toHaveLength(1)
  })
  it('should filter the yellow elements in anecdotes list', async () => {
    const { result } = renderHook(() => useAnecdoteActions())
    await act(() => {
      result.current.setFilter('yellow')
    })
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toHaveLength(0)
  })
})