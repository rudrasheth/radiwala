"use client";

import React, { useState, useEffect } from "react";
import LiveMapDashboard from "../components/map/LiveMapDashboard";
import CollectorApp from "../components/collector/CollectorApp";
import AuthScreen from "../components/auth/AuthScreen";
import { User, Truck, ArrowRight, Leaf, Sparkles, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [view, setView] = useState<"onboarding" | "auth" | "customer" | "collector">("onboarding");
    const [selectedRole, setSelectedRole] = useState<"customer" | "collector" | null>(null);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                // If logged in, check user metadata for role
                const role = session.user.user_metadata.role;
                if (role === "collector") {
                    setView("collector");
                } else {
                    setView("customer");
                }
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                const role = session.user.user_metadata.role || selectedRole;
                if (role === "collector") {
                    setView("collector");
                } else {
                    setView("customer");
                }
            } else {
                setView("onboarding");
            }
        });

        return () => subscription.unsubscribe();
    }, [selectedRole]);

    const handleRoleSelect = (role: "customer" | "collector") => {
        setSelectedRole(role);
        if (session) {
            setView(role);
        } else {
            setView("auth");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setView("onboarding");
        setSelectedRole(null);
    };

    return (
        <main className="w-full h-screen relative bg-[#050505] flex items-center justify-center font-sans overflow-hidden">

            {session && view !== "onboarding" && view !== "auth" && (
                <button
                    onClick={handleLogout}
                    className="absolute top-6 right-6 z-[100] w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all text-white/50 group"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            )}

            <AnimatePresence mode="wait">
                {view === "onboarding" && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md bg-[#0a0a0a] min-h-screen sm:min-h-[850px] sm:h-[850px] sm:border border-white/10 sm:rounded-[2.5rem] sm:shadow-2xl flex flex-col relative z-10 overflow-hidden"
                    >
                        {/* Cinematic Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#065f46]/20 to-transparent pointer-events-none" />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"
                        />

                        {/* Header Graphic */}
                        <div className="pt-24 pb-8 px-8 text-center relative z-20 flex flex-col items-center">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-900 p-[1px] rounded-3xl mb-8 shadow-2xl shadow-emerald-500/20"
                            >
                                <div className="w-full h-full bg-[#050505] rounded-3xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/10" />
                                    <Leaf className="w-10 h-10 text-emerald-400 relative z-10" strokeWidth={1.5} />
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight mb-3"
                            >
                                ScrapUber
                            </motion.h1>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <p className="text-white/70 text-sm font-medium tracking-wide">Premium Scrap Collection</p>
                            </motion.div>
                        </div>

                        {/* Selection Area */}
                        <div className="px-6 flex-1 flex flex-col justify-end gap-5 pb-10 relative z-20">

                            <motion.button
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => handleRoleSelect("customer")}
                                className="group relative w-full bg-white text-black rounded-[1.5rem] p-1 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="bg-white rounded-[1.35rem] p-5 flex items-center gap-5">
                                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="text-xl font-bold text-black tracking-tight mb-0.5">Continue as User</h3>
                                        <p className="text-sm text-black/60 font-medium">Clear scrap instantly</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </motion.button>

                            <motion.button
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => handleRoleSelect("collector")}
                                className="group relative w-full bg-[#111111] border border-white/10 hover:border-emerald-500/50 rounded-[1.5rem] p-1 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="bg-[#111111] rounded-[1.35rem] p-5 flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white/5 group-hover:bg-emerald-500/10 rounded-2xl flex items-center justify-center transition-colors">
                                        <Truck className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="text-xl font-bold text-white tracking-tight mb-0.5">I am a Raddiwala</h3>
                                        <p className="text-sm text-white/40 font-medium">Start earning now</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                </div>
                            </motion.button>

                        </div>
                    </motion.div>
                )}

                {view === "auth" && selectedRole && (
                    <AuthScreen
                        role={selectedRole}
                        onSuccess={() => setView(selectedRole)}
                        onBack={() => setView("onboarding")}
                    />
                )}

                {view === "customer" && (
                    <motion.div
                        key="customer"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md h-full sm:h-[850px] relative z-20"
                    >
                        <LiveMapDashboard />
                    </motion.div>
                )}

                {view === "collector" && (
                    <motion.div
                        key="collector"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md h-full sm:h-[850px] relative z-20"
                    >
                        <CollectorApp />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
