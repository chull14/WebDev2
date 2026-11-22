import { useParams } from 'react-router-dom';

function InstructorDetail() {
  const { id } = useParams();
  return <h1>Instructor {id}</h1>;
}
export default InstructorDetail;