import React from 'react';

function Login() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>DevCompass Login</h2>
      <input type="email" placeholder="Email" style={{ padding: '10px', margin: '10px' }} /><br />
      <input type="password" placeholder="Password" style={{ padding: '10px', margin: '10px' }} /><br />
      <button style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>
        Log In
      </button>
    </div>
  );
}

export default Login;