"use client";

import React, { useState, useEffect } from "react";
import { Power, Map, Navigation, CheckCircle, IndianRupee, Clock, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectorApp() {
    const [isOnline, setIsOnline] = useState(false);
    const [incomingPing, setIncomingPing] = useState(false);
    const [activePickup, setActivePickup] = useState<any>(null);

    // Generate a random ID for the session to distinguish collectors if multiple test
    const [collectorId] = useState(`rad_${Math.floor(Math.random() * 10000)}`);
    const [channel, setChannel] = useState<any>(null);

    // Handle going Online -> Start broadcasting location
    useEffect(() => {
        let watchId: number;
        let localChannel: any = null;

        if (isOnline) {
            localChannel = supabase.channel('active_collectors', {
                config: { broadcast: { self: true } }
            });
            setChannel(localChannel);

            // We'll simulate movement or get real location if available
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    localChannel.send({
                        type: 'broadcast',
                        event: 'location_update',
                        payload: {
                            id: collectorId,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }
                    });
                },
                (error) => console.error("Location error:", error),
                { enableHighAccuracy: true }
            );

            // Mock receiving a ride request ping
            const timer = setTimeout(() => {
                if (!activePickup) setIncomingPing(true);
            }, 8000);

            return () => {
                clearTimeout(timer);
                navigator.geolocation.clearWatch(watchId);
                supabase.removeChannel(localChannel);
            }
        } else {
            if (channel) supabase.removeChannel(channel);
            setChannel(null);
        }
    }, [isOnline]);

    const acceptPickup = () => {
        setIncomingPing(false);
        setActivePickup({
            customerName: "Aryan Sharma",
            address: "B-402, Green Valley Apartments, Sector 14",
            distance: "1.2 km away",
            estimate: "~20 kg Cardboard/Newspaper",
            valueRange: "₹400 - ₹600"
        });
    };

    return (
        <div className="relative h-full w-full bg-[#050505] flex flex-col font-sans overflow-hidden">

            {/* HEADER / STATUS BAR */}
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl px-6 py-5 border-b border-white/10 z-20 flex justify-between items-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 text-left">
                    <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        Raddiwala <span className="text-emerald-400">Pro</span>
                    </h1>
                    <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest mt-1">Today's Earnings: ₹1,450</p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] relative z-10">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=collector1&backgroundColor=0f172a" alt="profile" />
                </div>
            </div>

            {/* MAIN VIEW */}
            <div className="flex-1 relative flex flex-col items-center justify-center">
                {/* Cinematic Map Background Concept */}
                <div className="absolute inset-0 z-0 bg-[#0a0a0a] flex items-center justify-center">
                    <Map className="w-96 h-96 text-white/5 opacity-50" strokeWidth={0.5} />
                </div>

                {/* ONLINE TOGGLE */}
                <AnimatePresence>
                    {!activePickup && !incomingPing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            {isOnline && (
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none w-64 h-64 -translate-y-12" />
                            )}
                            <button
                                onClick={() => setIsOnline(!isOnline)}
                                className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-700 ${isOnline
                                        ? "bg-[#065f46]/80 text-white shadow-[0_0_80px_rgba(5,150,105,0.4)] hover:scale-105 border border-emerald-400/50"
                                        : "bg-[#111111] text-white shadow-black hover:scale-105 border border-white/10"
                                    }`}
                            >
                                <Power className={`w-14 h-14 mb-3 transition-colors ${isOnline ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,1)]" : "text-white/30"}`} strokeWidth={2.5} />
                                <span className="text-xl font-black tracking-widest">{isOnline ? "ONLINE" : "OFFLINE"}</span>

                                {/* Radar ping ring */}
                                {isOnline && (
                                    <div className="absolute inset-0 rounded-full border border-emerald-400 animate-[ping_3s_infinite] opacity-50" />
                                )}
                            </button>

                            {isOnline && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-10 text-center"
                                >
                                    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-3 rounded-full text-sm font-bold text-white shadow-xl">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]"></span>
                                        Broadcasting location...
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* INCOMING PING ALERT */}
                <AnimatePresence>
                    {incomingPing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="absolute inset-x-4 bottom-8 z-50 bg-[#111111]/90 backdrop-blur-2xl text-white rounded-[2rem] p-6 shadow-2xl border border-emerald-500/50 flex flex-col"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-500/30 mb-4 inline-block animate-pulse">
                                        <Zap className="w-3.5 h-3.5" /> High Demand Request
                                    </span>
                                    <h2 className="text-3xl font-extrabold leading-tight tracking-tight">1.2 km away</h2>
                                    <p className="text-white/50 font-medium text-sm mt-1">{activePickup?.estimate || "~20 kg Cardboard/Newspaper"}</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-[#065f46] flex flex-col items-center justify-center border border-emerald-400 shadow-xl">
                                    <IndianRupee className="w-6 h-6 text-white" strokeWidth={2.5} />
                                    <span className="text-xs font-bold text-white tracking-wider">₹400+</span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full relative z-10 mt-2">
                                <button
                                    onClick={() => setIncomingPing(false)}
                                    className="flex-1 bg-white/5 border border-white/10 text-white/70 font-bold py-4 rounded-[1.2rem] text-lg hover:bg-white/10 hover:text-white transition"
                                >
                                    Pass
                                </button>
                                <button
                                    onClick={acceptPickup}
                                    className="w-[60%] bg-emerald-600 text-white font-extrabold py-4 rounded-[1.2rem] text-lg hover:bg-emerald-500 transition shadow-[0_0_30px_rgba(5,150,105,0.4)]"
                                >
                                    Accept Order
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ACTIVE NAVIGATION UI */}
                <AnimatePresence>
                    {activePickup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-40 bg-[#0a0a0a] flex flex-col"
                        >
                            {/* Map Mockup for Nav */}
                            <div className="flex-1 bg-[#050505] relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-[#111111] transform -translate-x-1/2 -translate-y-1/2 z-20"></div>

                                {/* Direction Path Mock */}
                                <div className="absolute top-[30%] left-[30%] right-1/2 bottom-1/2 border-l-4 border-b-4 border-emerald-500 rounded-bl-3xl opacity-50 border-dashed z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

                                {/* Floating Nav Instructions */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute top-6 left-4 right-4 bg-[#111111]/90 backdrop-blur-xl border border-white/10 text-white p-5 rounded-[1.5rem] shadow-2xl flex items-center gap-5 z-30"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Navigation className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-black tracking-tight mb-0.5">Turn left in 200m</h3>
                                        <p className="text-white/50 text-sm font-medium">Towards Sector 14 Main Road</p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Bottom Customer Info Card */}
                            <motion.div
                                initial={{ y: 200 }}
                                animate={{ y: 0 }}
                                className="bg-[#111111]/90 backdrop-blur-3xl border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] p-6 pb-10 z-50 text-left"
                            >
                                <div className="flex justify-between items-center mb-8 px-2 mt-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{activePickup.customerName}</h2>
                                        <p className="text-sm font-medium text-white/50 mt-1 max-w-[250px] leading-tight truncate">
                                            {activePickup.address}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-white/50" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActivePickup(null)}
                                    className="w-full bg-white text-black font-extrabold tracking-widest text-lg py-5 flex items-center justify-center gap-2 rounded-[1.5rem] hover:scale-[0.98] transition-transform"
                                >
                                    <CheckCircle className="w-6 h-6" /> ARRIVED AT LOCATION
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
