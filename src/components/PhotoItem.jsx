import "./PhotoItem.css";
import { Link } from "react-router-dom";
import { uploads } from "../utils/config";

const PhotoItem = ({ photo }) => {
  const serverUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}`;
  const baseUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}/photos/${
    photo.image
  }`;

  return (
    <div className="photo-item">
      {photo.image && (
        <img
          src={`${serverUrlUploads}/photos/${photo.image}`}
          alt={photo.title}
        />
      )}
      <h2>{photo.title}</h2>
      <p className="photo-author">
        By: <Link to={`/users/${photo.userId}`}>{photo.userName}</Link>
      </p>
    </div>
  );
};

export default PhotoItem;
