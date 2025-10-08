import React, {useState} from 'react';
import { signin } from '../services/api';

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault()

        try{
            const formData = {username, password}
            const {data} = await signin(formData)

            localStorage.setItem('token', data.token)
            console.log('Login Successful', data);
        } catch (e){
            console.log('Login Failed:', e)
        }     
    }

    return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}