import { useState } from "react";
import authService from "../backend/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import service from "../backend/config";
import { hashPassword } from "../cryptography/hash";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    console.log('in signup : ' , data)
    setError("");
    try {

      const user = await service.getUserDetailswithmail(data.email)

      if(user) {
        setError("user already exists")
        return
      }

      localStorage.setItem("password",data.password)

      data.password = await hashPassword(data.password)

      console.log('login pass:' , data.password)
      
      const userData = await authService.createAccount(data);

      console.log(userData)
      
      //const res = await service.setUserDetails( {user_id : userData.$id ,password :data.password , mail : data.email , public_key : "999999"} )

      //
      
      if (userData) {
        const  userData = await authService.getCurrentUser();
        const res = await service.setUserDetails( {user_id : userData.$id ,password :data.password , mail : data.email , public_key : "999999"} )
        console.log('set user details ' , res)
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[\w.-]+@[\w.-]+\.cg$/.test(value) || "Email address must end with .cg",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
