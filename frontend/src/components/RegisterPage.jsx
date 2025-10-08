import React, {useState} from 'react';
import { signup } from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true);

        try{
            const formData = {username, password}
            await signup(formData)
            setMessage('Registration successful! Redirecting to login...')
            setTimeout(() => {
              navigate('/login')
            }, 2000)
        } catch (e){
            setError('Signup Failed: ' + (e.response?.data?.message || e.message || 'Please try again'))
            console.error('Signup Failed:', e)
        } finally {
            setLoading(false);
        }     
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    return (
    // Full screen container with background gradient and centering
    <div className="min-h-screen h-screen flex justify-center items-center p-5 
                    bg-gradient-to-br from-blue-100 to-emerald-50 overflow-hidden">
      
      {/* Registration Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transition-all duration-300 transform">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Register for TaskFlow
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Username Input */}
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
          
          {/* Password Input with Visibility Toggle */}
          <div className="mb-5">
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // Note: pr-10 for icon clearance
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-gray-700 
                         focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
              />
              <span 
                onClick={togglePasswordVisibility}
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-indigo-600 transition duration-200 text-xl"
              >
                {/* Emojis used for icon placeholder */}
                {showPassword ? '🙈' : '👁️'} 
              </span>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
                {error}
            </p>
          )}

          {/* Success Message */}
          {message && (
            <p className="text-emerald-500 text-sm mb-4 text-center font-medium">
                {message}
            </p>
          )}
          
          {/* Register Button */}
          <button 
            type="submit" 
            disabled={loading}
            
            // Uses Emerald colors for Register button, consistent with the original intent
            className={`w-full py-3 rounded-lg font-semibold text-white text-lg 
                       transition duration-300 ease-in-out shadow-md 
                       ${loading 
                           ? 'bg-emerald-400 cursor-not-allowed opacity-70' 
                           : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:translate-y-px'
                        }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        {/* Login Link */}
        <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"> 
                Login here
            </Link>
        </div>
      </div>
    </div>
  );
}
