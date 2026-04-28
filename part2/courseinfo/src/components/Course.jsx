const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  );
}

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

  export default Course;