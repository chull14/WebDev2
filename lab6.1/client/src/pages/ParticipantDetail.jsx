import { useParams } from 'react-router-dom';

function ParticipantDetail() {
  const { id } = useParams();
  return <h1>Participant {id}</h1>;
}
export default ParticipantDetail;