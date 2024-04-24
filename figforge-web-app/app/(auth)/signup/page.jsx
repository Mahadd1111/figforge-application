"use client"
import { useReducer, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Loader from "@/public/loader.svg";
import Image from "next/image";

const initialState = {
    username :"",
    email: "",
    password: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "username":
            return { ...state, username: action.payload };
        case "email":
            return { ...state, email: action.payload };
        case "password":
            return { ...state, password: action.payload };
        default:
            throw new Error();
    }
}


export default function SignUp(){
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const router = useRouter();

    const handleChange = (e) => {
        dispatch({ type: e.target.name, payload: e.target.value });
    }

    const signUpUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const {username, email, password} = state;
        if(!username || !email || !password) {
            setError("All fields required");
            setLoading(false);
            return;
        }

        try{
            const {error, data} = await supabase.auth.signUp({
                email,
                password,
                options : {
                    username,
                    passwordSet : true,
                },
            });

            if (error) throw error;
            console.log(data);

            setMessage("Check your email for the confirmation link");

        } catch (error) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="py-8 h-screen">
          <h1 className="text-2xl text-center font-medium">Sign up</h1>
          <form
            className="mx-auto max-w-max mt-4 w- grid gap-y-2 place-items-center"
            onSubmit={signUpUser}
          >
            <label htmlFor="username">
              Username
              <input
                name="username"
                type="text"
                className="text-gray-100 mt-1 px-2 py-1 w-60 block bg-zinc-800 border border-zinc-700 rounded"
                onChange={handleChange}
              />
            </label>
            <label htmlFor="username">
              Email
              <input
                name="email"
                type="email"
                className="text-gray-100 mt-1 px-2 py-1 w-60 block bg-zinc-800 border border-zinc-700 rounded"
                onChange={handleChange}
              />
            </label>
            <label htmlFor="username">
              Password
              <input
                name="password"
                type="password"
                className="text-gray-100 mt-1 px-2 py-1 w-60 block bg-zinc-800 border border-zinc-700 rounded"
                onChange={handleChange}
              />
            </label>
            <button
              disabled={!state.username || !state.email || !state.password}
              className={`mt-2 py-1 w-full border border-green-500 bg-green-700 rounded flex justify-center items-center gap-x-2 ${
                !state.username || !state.email || !state.password
                  ? "opacity-50"
                  : "hover:bg-green-600"
              }`}
            >
              Sign up
              {loading && (
                <Image
                  src={Loader}
                  alt="loader"
                  height={16}
                  width={16}
                  className="animate-spin"
                />
              )}
            </button>

            <p className=" mt-1 text-sm">Already a user?{" "} 
                <span className="text-green-500 cursor-pointer" onClick={()=>{
                    router.push('/signin')
                }}>sign-in here.</span>
            </p>
          </form>
          <p className="mt-4 px-4 text-center">{message !== null && message}</p>
        </div>
    );
}