import "./Search.css";
//hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { useQuery } from "../../hooks/useQuery";

//components
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";

//redux
import { searchPhoto, likePhoto } from "../../slices/PhotoSlice";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  //load photos
  useEffect(() => {
    dispatch(searchPhoto(search));
  }, [dispatch, search]);

  //like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Loading..</p>;
  }

  return (
    <div id="search">
      <h2>You're searching for: {search}</h2>
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              See more
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className="no-photos">No results to show.</h2>
      )}
    </div>
  );
};

export default Search;
