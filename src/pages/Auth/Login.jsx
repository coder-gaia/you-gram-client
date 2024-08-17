import "./Auth.css";

//components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

//hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//redux
import { login, reset } from "../../slices/AuthSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      email,
      password,
    };

    dispatch(login(user));
  };

  //clear all the states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
      <h2>YouGram</h2>
      <p className="subtitle">Login into your account.</p>
      <form onSubmit={handleSubmit}>
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
        {!loading && <input type="submit" value="Login" />}
        {loading && <input type="submit" value="Wait" disabled />}
        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Dont't have an account? <Link to="/register">Click here.</Link>
      </p>
    </div>
  );
};

export default Login;
