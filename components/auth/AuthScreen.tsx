"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

interface AuthScreenProps {
    role: "customer" | "collector";
    onSuccess: () => void;
    onBack: () => void;
}

export default function AuthScreen({ role, onSuccess, onBack }: AuthScreenProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone,
                            role: role,
                        },
                    },
                });
                if (error) throw error;
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-full bg-background flex flex-col relative z-20"
        >
            <div className="p-8 pt-12 flex flex-col h-full relative z-30">
                <button
                    onClick={onBack}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-primary/5 transition-colors mb-10 shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground/70" />
                </button>

                <div className="mb-10">
                    <h2 className="font-outfit text-4xl font-extrabold text-foreground tracking-tight mb-3">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-foreground/50 font-medium text-lg leading-relaxed">
                        {role === "customer"
                            ? "Clear your scrap instantly."
                            : "Join the Raddiwala Pro network and start earning."}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-destructive/5 border border-destructive/10 text-destructive p-4 rounded-2xl text-sm font-bold mb-8"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required={!isLogin}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-12 pr-5 py-5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                                    />
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        required={!isLogin}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-12 pr-5 py-5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-12 pr-5 py-5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                        />
                    </div>

                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-secondary/30 border border-border/50 rounded-2xl pl-12 pr-5 py-5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-foreground text-background font-bold text-lg py-5 rounded-2xl shadow-xl shadow-foreground/5 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? "Sign In" : "Get Started"}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-auto text-center pb-8">
                    <p className="text-foreground/50 font-medium">
                        {isLogin ? "New to ScrapUber?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-bold ml-2 hover:underline focus:outline-none decoration-2 underline-offset-4"
                        >
                            {isLogin ? "Create Account" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
