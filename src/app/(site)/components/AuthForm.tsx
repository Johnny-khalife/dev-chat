"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useState, useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoadind, setIsLoading] = useState(false);

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

  const onSubmit: SubmitHandler<FieldValues> = async(data) => {
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
        .catch(() =>toast.error("Something Went Wrong!"))
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
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
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
