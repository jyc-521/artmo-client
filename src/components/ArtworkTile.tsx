import { Link } from 'react-router-dom';
import type { Artwork } from '../types';
import ArtworkImage from './ArtworkImage';

export default function ArtworkTile({ artwork }: { artwork: Artwork }) {
  return (
    <Link to={`/artworks/${artwork.id}`} className="tile">
      <ArtworkImage artwork={artwork} className="tile-img" />
      <span className="tile-title">{artwork.title}</span>
      <span className="tile-artist">{artwork.artist}</span>
    </Link>
  );
}
