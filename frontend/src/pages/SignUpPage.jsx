import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/general';

function SignUpPage() {
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
});
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
    setErrors(prev => ({
        ...prev,
        [name]: ''
    }));
    }
};

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
    newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
    newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
    return;
    }

    setIsLoading(true);
    
    try {
        await apiCall('/account/creation', 'post', formData, null);

        navigate('/sign-in', { 
        state: { message: 'Account created successfully! Please sign in.' }
        });

    } catch (error) {
        console.log(error)
        setErrors({ submit: 'Network error. Please try again.' });
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#BCBDC0] to-[#565857]">
    <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Your JumboBoxd Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
            </label>
            <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
            />
            {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
        </div>

        <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
            </label>
            <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
            />
            {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            />
            {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
        </div>

        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
            </label>
            <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a password"
            />
            {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
        </div>

        {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
        )}

        <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
        >
            {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        </form>

        <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
            onClick={() => navigate('/sign-in')}
            className="text-blue-600 hover:text-blue-800 font-medium"
            >
            Sign in here
            </button>
        </p>
        </div>
    </div>
    </div>
);
}

export default SignUpPage;