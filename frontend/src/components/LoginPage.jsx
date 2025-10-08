import React, {useState} from 'react';
import { signin } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')
        try{
            const formData = {username, password}
            const {data} = await signin(formData)
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard')
            console.log('Login Successful', data);
        } catch (e){
            setError('Login Failed: Invalid Credentials')
            console.log('Login Failed:', e)
        }     
    }

    return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Login</button>
      </form>
    </div>
  );
}