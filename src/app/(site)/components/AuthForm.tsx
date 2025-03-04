"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState, useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoadind, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

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
  const password = watch("password"); // Get live password value
  const confirmPassword = watch("confirmPassword"); // Get live confirm password value

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    console.log(data);
    if (variant === "REGISTER") {
      // if (data.password !== data.confirmPassword) {
      //   toast.error("Passwords do not match!");
      //   setIsLoading(false);
      //   return;
      // }
      axios
        .post("http://localhost:3005/api/auth/signup", data)
        .then(() => toast.success("Account created successfully!"))
        .catch(() => toast.error("Something Went Wrong!"))
        .finally(() => setIsLoading(false));

      // await fetch("http://localhost:3005/api/auth/signup",{
      //   method:"POST",
      //   headers:{
      //     "Content-Type":"application/json",
      //   },
      //     body:JSON.stringify(data)
      // })
    }
    if (variant === "LOGIN") {
      const { email, password } = data;
      axios
        .post("http://localhost:3005/api/auth/signin", { email, password })
        .then(() => toast.success("Logged in successfully!"))
        .catch(() => toast.error("Invalid credentials!"))
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    //NextAuth Social Signin
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="username"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoadind}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoadind}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoadind}
          />
          {variant === "REGISTER" && (
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              register={register}
              errors={errors}
              disabled={isLoadind}
            />
          )}
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match!</p>
          )}
          <div>
            <Button disabled={isLoadind} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Devcord?"
              : "Already have an accout?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
