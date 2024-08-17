import "./Home.css";

//components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

//hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//redux
import { getAllPhotos, likePhoto } from "../../slices/PhotoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //load all photos
  useEffect(() => {
    dispatch(getAllPhotos());
  }, [dispatch]);

  //like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Loading..</p>;
  }

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer user={user} handleLike={handleLike} photo={photo} />
            <Link to={`/photos/${photo._id}`} className="btn">
              See more
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">
          There aren't published photos.{" "}
          <Link to={`/users/${user._id}`}>Click here!</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
