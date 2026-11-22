import { useParams } from 'react-router-dom';

function WorkshopDetail() {
  const { id } = useParams();
  return <h1>Workshop {id}</h1>;
}
export default WorkshopDetail;