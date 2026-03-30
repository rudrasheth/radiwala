"use client";

import React, { useState, useEffect } from "react";
import LiveMapDashboard from "../components/map/LiveMapDashboard";
import CollectorApp from "../components/collector/CollectorApp";
import AuthScreen from "../components/auth/AuthScreen";
import { User, Truck, ArrowRight, Leaf, Sparkles, LogOut, ShieldCheck, Zap } from "lucide-react";
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
        <main className="w-full h-screen relative bg-background flex flex-col font-jakarta overflow-hidden">
            
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="absolute top-[-10%] right-[-10%] w-[80%] h-[60%] bg-primary/20 blur-[120px] rounded-full"
                />
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[50%] bg-accent/30 blur-[100px] rounded-full"
                />
            </div>

            {session && view !== "onboarding" && view !== "auth" && (
                <button
                    onClick={handleLogout}
                    className="absolute top-6 right-6 z-[100] w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all text-foreground/40 group"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            )}

            <AnimatePresence mode="wait">
                {view === "onboarding" && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col relative z-10"
                    >
                        {/* Header Section */}
                        <div className="pt-20 pb-10 px-8 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 20 }}
                                className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                <Leaf className="w-8 h-8 text-primary relative z-10" strokeWidth={2} />
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="font-outfit text-5xl font-extrabold tracking-tight text-foreground mb-4"
                            >
                                Scrap<span className="text-primary">Uber</span>
                            </motion.h1>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 bg-secondary/50 border border-border/50 px-4 py-1.5 rounded-full"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-foreground/70 text-xs font-bold tracking-widest uppercase">Premium Collection</span>
                            </motion.div>
                        </div>

                        {/* Features List - Desktop/Large tablet only or subtle on mobile */}
                        <div className="hidden sm:flex px-10 gap-4 mb-auto">
                           {/* ... feature cards ... */}
                        </div>

                        {/* Selection & CTA Area */}
                        <div className="px-6 pb-12 mt-auto space-y-4">
                            <motion.div 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-center mb-6"
                            >
                                <p className="text-foreground/50 text-sm font-medium">Smart recycling for the modern world</p>
                            </motion.div>

                            <motion.button
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                onClick={() => handleRoleSelect("customer")}
                                className="group relative w-full bg-foreground text-background rounded-[1.5rem] p-5 shadow-2xl shadow-foreground/10 flex items-center gap-5 active:scale-[0.98] transition-all"
                            >
                                <div className="w-12 h-12 bg-background/10 rounded-2xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-background" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold tracking-tight mb-0.5">I want to Sell Scrap</h3>
                                    <p className="text-xs text-background/60 font-medium">Instant pickup & best prices</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-4 h-4 text-background" />
                                </div>
                            </motion.button>

                            <motion.button
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => handleRoleSelect("collector")}
                                className="group relative w-full glass rounded-[1.5rem] p-5 flex items-center gap-5 active:scale-[0.98] transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.03] transition-colors" />
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transition-colors">
                                    <Truck className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-foreground tracking-tight mb-0.5">I am a Partner</h3>
                                    <p className="text-xs text-foreground/40 font-medium">Start earning on your own schedule</p>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:translate-x-1 transition-all">
                                    <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full relative z-20"
                    >
                        <LiveMapDashboard />
                    </motion.div>
                )}

                {view === "collector" && (
                    <motion.div
                        key="collector"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full relative z-20"
                    >
                        <CollectorApp />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
