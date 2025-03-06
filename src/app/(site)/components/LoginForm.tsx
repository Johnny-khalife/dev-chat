"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3005/api/auth/signin",
        data
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          <Button disabled={isLoading} fullWidth type="submit">
            Sign in
          </Button>
        </form>

        <div className="flex gap-2 justify-center text-sm mt-6 text-gray-500">
          <span>New to Devcord?</span>
          <span onClick={onSwitch} className="underline cursor-pointer">
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
