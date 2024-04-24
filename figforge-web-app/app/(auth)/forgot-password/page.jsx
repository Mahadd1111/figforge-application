"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Loader from "@/public/loader.svg"
import Image from "next/image"

export default function ForgotPassword(){
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    async function sendLink(e){
        e.preventDefault()
        setLoading(true)
        setError(null)

        try{
            const {error} = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if(error) throw error
            setError("Password reset link sent to your email")
        } catch (error) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="py-8 grid place-items-center h-screen">
            <h1 className="text-2xl text-center font-medium">Forgot password</h1>
            <form
                className="grid gap-y-2 place-items-center"
                onSubmit={sendLink}
            >
                <label htmlFor="username">
                Email
                <input
                    name="email"
                    type="email"
                    value={email}
                    className="mt-1 px-2 py-1 w-60 block bg-zinc-800 border border-zinc-700 rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />
                </label>
                <button
                disabled={!email}
                className={`mt-2 py-1 w-full border border-green-500 bg-green-700 rounded flex justify-center items-center gap-x-2 ${
                    !email ? "opacity-50" : "hover:bg-green-600"
                }`}
                >
                Send a link
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
            </form>
            <p className="mt-4 px-4 text-center">{error !== null && error}</p>
        </div>
    )

}
