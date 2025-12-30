import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAppDispatch } from '../hooks';
import { setUser } from '../store/authSlice';
import toast from 'react-hot-toast';

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof schema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await api.post('/api/auth/login', data);
            if (response.data?.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                dispatch(setUser(response.data.user));
                toast.success('Login successful');
                navigate('/');
            } else {
                toast.error('Login failed');
            }
        } catch (error) {
            console.error('Login failed', error);
            toast.error('Login failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            {...register("email")}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            {...register("password")}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="mt-2 w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-3 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
