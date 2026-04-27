import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>);
}

const MostVotedAnecdote = ({ anecdotes, votes }) => {
  let [maxValue, index] = [0, 0];
  Object.keys(votes).forEach(element => {
    if (votes[element] > maxValue) {
      maxValue = votes[element];
      index = Number(element);
    }
  });
  return (<>
    <h1>Anecdote with most votes</h1>
    <p>{anecdotes[index]}</p>
  </>);
}

const Anecdotes = ({ anecdotes, votes, selected }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdotes[selected]}
      </div>
      <div>has {votes[selected] ?? 0} votes</div>
    </>
  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({});

  const setRandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  }

  const voteAnecdote = () => {
    const copy = { ...votes };
    copy[selected] = (copy[selected] ?? 0) + 1;
    setVotes(copy);
    console.log(copy);
  }

  return (
    <>
      <Anecdotes anecdotes={anecdotes} votes={votes} selected={selected} />
      <Button onClick={voteAnecdote} text='vote' />
      <Button onClick={setRandomAnecdote} text='next anecdote' />
      <MostVotedAnecdote anecdotes={anecdotes} votes={votes} />
    </>
  )
}

export default App