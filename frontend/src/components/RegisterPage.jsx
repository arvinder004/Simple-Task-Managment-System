import React, {useState} from 'react';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        try{
            const formData = {username, password}
            await signup(formData)
            setMessage('Registration successful! Redirecting to login...')
            setTimeout(() => {
              navigate('/login')
            }, 2000)
        } catch (e){
            setError('Signup Failed: ' + (e.reponse?.data?.message || 'Please try again'))
            console.log('Signup Failed:', e)
        }     
    }

    return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px' }} required />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Register</button>
        </form>
    </div>
  );
}