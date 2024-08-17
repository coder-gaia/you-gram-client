import "./Profile.css";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";
//service
import userService from "../../services/UserService";

//config
import { uploads } from "../../utils/config";

//hook
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

//slices
import { getUserDetails } from "../../slices/UserSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/PhotoSlice";

//components
import Message from "../../components/Message";
import { Link } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");

  //new form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  const resetComponent = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  useEffect(() => {
    if (id) {
      dispatch(getUserDetails(id));
      dispatch(getUserPhotos(id));
    }
  }, [dispatch, id]);

  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const photoData = {
      title,
      image,
    };

    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData));

    setTitle("");

    resetComponent();
  };

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));

    resetComponent();
  };

  const showOrHideForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponent();
  };

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      showOrHideForms();

      setEditId(photo._id);
      setEditTitle(photo.title);
      setEditImage(photo.image);
    }
  };

  const handleCancelEdit = (event) => {
    showOrHideForms();
  };

  if (loading) {
    return <p>Loading..</p>;
  }

  const serverUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}`;


  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${serverUrlUploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Share a good moment!</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Photo title:</span>
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Photo</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Post" />}
              {loadingPhoto && <input type="submit" value="Await.." disabled />}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editing...</p>
            {editImage && (
              <img
                src={`${serverUrlUploads}/photos/${editImage}`}
                alt={editPhotoForm.title}
              />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Insert a new title"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Update" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel edit
              </button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}

      <div className="user-photos">
        <h2>Published photos</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${serverUrlUploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === userAuth._id ? (
                  <>
                    <div className="actions">
                      <Link to={`/photos/${photo._id}`}>
                        <BsFillEyeFill />
                      </Link>
                      <BsPencilFill onClick={() => handleEdit(photo)} />
                      <BsXLg onClick={() => handleDelete(photo._id)} />
                    </div>
                  </>
                ) : (
                  <Link to={`/photos/${photo._id}`} className="btn">
                    See
                  </Link>
                )}
              </div>
            ))}
          {photos.length === 0 && <p>No photos were published.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
