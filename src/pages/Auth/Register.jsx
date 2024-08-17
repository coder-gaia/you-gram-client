import "./Auth.css";

//hooks
import { useEffect, useState } from "react";

//components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

//redux
import { register, reset } from "../../slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    console.log(user);

    dispatch(register(user));
  };

  //clear all the auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <h2>YouGram</h2>
      <p className="subtitle">Register now to see what's up in the world!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!loading && <input type="submit" value="Register" />}
        {loading && <input type="submit" value="Wait" disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Already have an account? <Link to="/login">Click here.</Link>
      </p>
    </div>
  );
}

export default Register;
