import ArtworkImage from "./ArtworkImage";
import { Link } from "react-router-dom";
import { checkValue } from "../utils/helpers";

function ArtworkCard({artwork, iiifUrl}) {
    return (
        <Link className='card' to={`/artworks/${artwork.id}`}>
            <ArtworkImage iiifUrl={iiifUrl} imageId={artwork.image_id} title={artwork.title}/>
            <h2>{artwork.title || 'Untitled'}</h2>
            {checkValue(artwork.artist_title) && <p>{artwork.artist_title}</p>}
            {checkValue(artwork.date_display) && <p>{artwork.date_display}</p>}
            <p>ID: {artwork.id}</p>
        </Link>
    )
}

export default ArtworkCard;