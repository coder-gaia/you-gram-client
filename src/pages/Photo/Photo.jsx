import "./Photo.css";
import { uploads } from "../../utils/config";
//components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import PhotoItem from "../../components/PhotoItem";

//hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//redux
import { getPhoto, likePhoto, comment } from "../../slices/PhotoSlice";
import LikeContainer from "../../components/LikeContainer";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { photo, error, loading, message } = useSelector(
    (state) => state.photo
  );

  const [commentText, setCommentText] = useState("");

  //load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  const resetMessage = useResetComponentMessage(dispatch);

  //insert a like
  const handleLike = () => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  //insert a comment
  const handleComment = (event) => {
    event.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id,
    };
    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  };

  //like & comments
  if (loading) {
    return <p>Loading...</p>;
  }

  const serverUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}`;

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>
      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comments: ({photo.comments.length})</h3>
            <form onSubmit={handleComment}>
              <input
                type="text "
                placeholder="Insert a comment"
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />
              <input type="submit" value="Comment" />
            </form>
            {photo.comments.length === 0 && <p>There is no comments yet</p>}
            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.userImage && (
                    <img
                      src={`${serverUrlUploads}/users/${comment.userImage}`}
                      alt={comment.userName}
                    />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
