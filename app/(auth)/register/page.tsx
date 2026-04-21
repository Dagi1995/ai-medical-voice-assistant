"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeartPulse, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const hasMinLimit = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLimit && hasLetter && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
      } else {
        toast.success("Registered successfully! Please sign in.");
        router.push("/login");
      }
    } catch (e) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-md w-full p-8 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl border border-slate-100 dark:border-white/5">
        <div className="flex justify-center mb-8">
          <HeartPulse className="h-12 w-12 text-blue-600 dark:text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
            />
            {password.length > 0 && (
              <div className="mt-3 space-y-1 text-sm bg-slate-50 dark:bg-white/5 p-3 rounded-lg">
                <div className={`flex items-center gap-2 ${hasMinLimit ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {hasMinLimit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasLetter ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {hasLetter ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>Contains a letter</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>Contains a number</span>
                </div>
              </div>
            )}
          </div>
          <Button type="submit" disabled={loading || !name || !email || !isPasswordValid} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50">
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center text-slate-600 dark:text-slate-400">
          Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
