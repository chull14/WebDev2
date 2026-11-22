import { Link } from "react-router-dom";
import { checkValue, formatDate } from "../utils/helpers";


function ExhibitionCard({exhibition}) {
    const start = formatDate(exhibition.aic_start_at);
    const end = formatDate(exhibition.aic_end_at);

    return (
        <Link className="card" to={`/exhibitions/${exhibition.id}`}>
            {checkValue(exhibition.image_url) && (<img src={exhibition.image_url} alt={exhibition.title}/>) }
            <h2>{exhibition.title || 'Untitled'}</h2>
            {start && end && <p>{start} - {end}</p>}
            {checkValue(exhibition.gallery_title) && <p>{exhibition.gallery_title}</p>}
            {checkValue(exhibition.status) && <p>{exhibition.status}</p>}
            <p>ID: {exhibition.id}</p>
        </Link>
    )
}

export default ExhibitionCard;