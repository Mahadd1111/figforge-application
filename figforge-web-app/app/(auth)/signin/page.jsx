"use client"
import { useReducer, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Loader from "@/public/loader.svg";
import Image from "next/image";

const initialState = {
    email: "",
    password: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "email":
            return { ...state, email: action.payload };
        case "password":
            return { ...state, password: action.payload };
        default:
            throw new Error();
    }
}

export default function SignIn() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleChange = (e) => {
        dispatch({ type: e.target.name, payload: e.target.value });
    }

    const signInUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // const {email, password} = state;
        // if(!email || !password) {
        //     setError("Email and password required");
        //     setLoading(false);
        //     return;
        // }

        try{
            // const {error, data} = await supabase.auth.signInWithPassword({
            //     email,
            //     password,
            // });
            // if (error) throw error;
            // console.log(data);

            //sign in with github
            const {error, data} = await supabase.auth.signInWithOAuth({
                provider: "github",
            });

            console.log(data);
            // navigate to dashboard
            router.push("/dashboard");

        } catch (error) {
            console.log(error);
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen mx-auto max-w-max py-8">
            <h1 className="text-2xl text-center font-medium">Sign in</h1>
            <form
                className="mt-4 grid gap-y-2 place-items-center"
                onSubmit={signInUser}
            >
                {/* <label htmlFor="username">
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
                </label> */}
                <button
                // disabled={!state.email || !state.password}
                className={`mt-2 py-1 w-full border border-green-500 bg-green-700 rounded flex justify-center items-center gap-x-2 ${
                    !state.email || !state.password
                    ? "opacity-50"
                    : "hover:bg-green-600"
                }`}
                >
                Sign in With Github
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
                <a href="/forgot-password" className="mt-2 text-sm hover:text-green-500">Forgot password?</a>

                <p className="text-sm">Don&apos;t have an account?
                    <span className="text-green-500 cursor-pointer ml-1" onClick={()=>{
                        router.push('/signup')
                    }}>signup here.</span>
                </p>

            </form>
            <p className="mt-4 px-4 text-center text-red-500">{error !== null && error}</p>
        </div>
    )
}

