import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Context/AuthContext';


export default function LoginForm() {
    const navigate = useNavigate();
    const { login, accessToken, loginError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const result = await login({
            email: data.email,
            password: data.password,
        });

        if (result.success) {
            navigate('/');
        } else {
            alert(result.error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="">
            <div className="bg-transparent">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col">
                            <InputText
                                {...register('email', { required: 'Email is required' })}
                                placeholder="Enter email"
                                className="w-full p-3 text-primary bg-transparent border rounded-lg placeholder:text-primary"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col relative">
                            <InputText
                                {...register('password', { required: 'Password is required' })}
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 text-primary bg-transparent border rounded-lg placeholder:text-primary pr-10"
                            />
                            <i
                                className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} absolute right-3 top-3 cursor-pointer text-blue-700`}
                                onClick={togglePasswordVisibility}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center my-5">
                        <h6 className="text-primary">Forget Password?</h6>
                    </div>

                    <Button
                        type="submit"
                        label="Login"
                        icon="pi pi-lock"
                        className="bg-primary text-secondary py-2 px-4 rounded-lg"
                    />
                </form>
            </div>
        </div>
    );
}