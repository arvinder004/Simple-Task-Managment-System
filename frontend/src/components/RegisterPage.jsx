import React, {useState} from 'react';
import { signup } from '../services/api';

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault()

        try{
            const formData = {username, password}
            const {data} = await signup(formData)
            console.log
        } catch (e){
            console.log('Signup Failed:', e)
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