"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Loader from "@/public/loader.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    async function resetPassword(){

        setIsUpdating(true);
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (error) throw error;
          router.push("/");
        } catch (error) {
          console.log(error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="mx-auto py-4 max-w-max space-y-2 h-screen">
            <label htmlFor="username">
                New password
                <input
                name="password"
                type="password"
                value={newPassword}
                className="text-gray-100 mt-1 px-2 py-1 w-60 block bg-zinc-800 border border-zinc-700 rounded"
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </label>
            <button
                disabled={!newPassword}
                className={`py-1 w-full border border-green-500 bg-green-700 rounded flex justify-center items-center gap-x-2 ${
                !newPassword ? "opacity-50" : "hover:bg-green-600"
                }`}
                onClick={resetPassword}
            >
                Update
                {isUpdating && (
                <Image
                    src={Loader}
                    alt="loader"
                    height={16}
                    width={16}
                    className="animate-spin"
                />
                )}
            </button>
        </div>
    )

}