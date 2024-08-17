import "./EditProfile.css";

import { uploads } from "../../utils/config";
import { useSelector, useDispatch } from "react-redux";
import { profile, resetMessage, updateProfile } from "../../slices/UserSlice";
import Message from "../../components/Message";
import { useEffect, useState } from "react";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const dispatch = useDispatch();

  const { user, message, error, loading } = useSelector((state) => state.user);

  //load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  //fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //get user data fromm states
    const userData = {
      name,
    };
    if (profileImage) {
      userData.profileImage = profileImage;
    }
    if (bio) {
      userData.bio = bio;
    }
    if (password) {
      userData.password = password;
    }

    //building form data
    const userFormData = Object.keys(userData).reduce((formData, key) => {
      formData.append(key, userData[key]);
      return formData;
    }, new FormData());
    await dispatch(updateProfile(userFormData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e) => {
    const image = e.target.files[0];
    setPreviewImage(image);
    //update image state
    setProfileImage(image);
  };

  const serverUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}`;
  // const baseUrlUploads = `${import.meta.env.VITE_SERVER_UPLOADS}/users/${
  //   photo.image
  // }`;

  return (
    <div id="edit-profile">
      <h1>Edit your personal data</h1>
      <p className="subtitle">
        Add a profile image and tell more about yourself.
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${serverUrlUploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input
          type="email"
          placeholder="Email"
          disabled
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}
        />
        <label>
          <span>Profile Image:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Profile description"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <label>
          <span>Want to change your password?</span>
          <input
            type="password"
            placeholder="Insert your new password"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>
        {!loading && <input type="submit" value="Update" />}
        {loading && <input type="submit" value="Wait" disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};

export default EditProfile;
