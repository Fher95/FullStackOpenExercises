const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => <Part part={part} />)}
    </div>
  );
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = ({ course }) => {
  return (<>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total
      total={
        course.parts.reduce((acc, cur) => acc + cur.exercises, 0)
      }
    />
  </>)
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
    ]
  }

  return <Course course={course} />
}

export default App