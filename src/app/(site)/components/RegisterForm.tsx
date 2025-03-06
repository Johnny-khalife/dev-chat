"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3005/api/auth/signup",
        data
      );
      toast.success(response.data.message);
      
      // Switch to Login after successful registration
      setTimeout(() => {
        onSwitch(); 
      }, 1000); // Delay to let the user see the success message

    } catch (e: any) {
      toast.error(e.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="username"
            label="Name"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            placeholder="Enter your name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            placeholder="Enter your email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            placeholder="Enter your password"
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            placeholder="Confirm your password"
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match!</p>
          )}

          <Button disabled={isLoading} fullWidth type="submit">
            Register
          </Button>
        </form>

        <div className="flex gap-2 justify-center text-sm mt-6 text-gray-500">
          <span>Already have an account?</span>
          <span onClick={onSwitch} className="underline cursor-pointer">
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
