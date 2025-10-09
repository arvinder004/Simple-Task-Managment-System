import React, {useState} from 'react';
import { signin } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
    <div className="min-h-screen h-screen flex justify-center items-center p-5 
                    bg-gradient-to-br from-blue-100 to-emerald-50 overflow-hidden">
      
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transition-all duration-300 transform">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Log In to TaskFlow
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 
                         focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none" 
            />
          </div>
          
          <div className="mb-5">
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-gray-700 
                         focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
              />
              <span 
                onClick={togglePasswordVisibility}
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-indigo-600 transition duration-200 text-xl"
              >
                {showPassword ? '🙈' : '👁️'} 
              </span>
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
                {error}
            </p>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white text-lg 
                       transition duration-300 ease-in-out shadow-md 
                       ${loading 
                           ? 'bg-indigo-400 cursor-not-allowed opacity-70' 
                           : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:translate-y-px'
                        }`}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"> 
                Register here
            </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}