import { getImage } from "../utils/helpers";

function ArtworkImage({ iiifUrl, imageId, title, width }) {
    const imageUrl = getImage(iiifUrl, imageId, width);
    let altText = title;
    if (!altText) {
        altText = 'Artwork image';
    }

    if (!imageUrl) {
        return (
            <div className='artwork-image placeholder'>
                <p>Image Not Available</p>
            </div>
        );
    }

    return <img className='artwork-image' src={imageUrl} alt={altText} />;
}

export default ArtworkImage;