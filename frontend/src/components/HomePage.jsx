import React from "react";
import {Link} from 'react-router-dom'

export default function HomePage(){
    return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Task Management System</h1>
      <p>Please log in or register to continue.</p>
      <div>
        <Link to="/login" style={{ marginRight: '10px' }}>
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}