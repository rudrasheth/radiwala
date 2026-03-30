"use client";

import React, { useState, useEffect } from "react";
import { Power, Map, Navigation, CheckCircle, IndianRupee, Clock, Zap, Loader2, ChevronRight, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import("../map/RealMap"), { ssr: false });

export default function CollectorApp() {
    const [isOnline, setIsOnline] = useState(false);
    const [incomingPing, setIncomingPing] = useState(false);
    const [activePickup, setActivePickup] = useState<any>(null);
    const [collectorId] = useState(`rad_${Math.floor(Math.random() * 10000)}`);
    const [channel, setChannel] = useState<any>(null);
    const [userData, setUserData] = useState<{ full_name?: string } | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserData(session.user.user_metadata as any);
            }
        });
    }, []);

    useEffect(() => {
        let watchId: number;
        let localChannel: any = null;

        if (isOnline) {
            localChannel = supabase.channel('active_collectors', {
                config: { broadcast: { self: true } }
            });
            setChannel(localChannel);

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
        const testCustomers = [
            { name: "Aryan Sharma", address: "B-402, Green Valley Apartments, Sector 14" },
            { name: "Meera Kapur", address: "72, DLF Phase 3, Gurgaon" },
            { name: "Vikram Singh", address: "A-12, Lajpat Nagar, New Delhi" },
            { name: "Nisha Das", address: "Flat 104, Sunrise Tower, Noida Sector 62" }
        ];
        const selected = testCustomers[Math.floor(Math.random() * testCustomers.length)];
        
        setIncomingPing(false);
        setActivePickup({
            customerName: selected.name,
            address: selected.address,
            distance: "1.2 km away",
            estimate: "~20 kg Cardboard/Newspaper",
            valueRange: "₹400 - ₹600"
        });
    };

    return (
        <div className="relative h-full w-full bg-background flex flex-col font-jakarta overflow-hidden">

            {/* HEADER / STATUS BAR */}
            <div className="glass px-6 py-4 border-b border-border/40 z-30 flex justify-between items-center relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userData?.full_name || 'collector1'}&backgroundColor=f8fafc`} alt="profile" className="bg-secondary/50" />
                    </div>
                    <div>
                        <h1 className="font-outfit text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                            {userData?.full_name?.split(' ')[0] || "Partner"} <span className="text-primary">Pro</span>
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-primary' : 'bg-foreground/20'}`} />
                            <p className="text-[10px] font-extrabold text-foreground/40 uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-extrabold text-foreground/40 uppercase tracking-widest">Today</p>
                    <p className="font-outfit text-xl font-black text-primary">₹1,450</p>
                </div>
            </div>

            {/* MAIN VIEW */}
            <div className="flex-1 relative flex flex-col items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <RealMap
                        userLocation={{ lat: 28.7000, lng: 77.1000 }}
                        collectors={{}}
                        isSearching={false}
                    />
                </div>

                {/* ONLINE TOGGLE */}
                {!activePickup && !incomingPing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`group relative w-56 h-56 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-2xl ${
                                isOnline 
                                ? "bg-primary text-white scale-105 border-4 border-white/20" 
                                : "bg-foreground text-background border-4 border-foreground/5"
                            }`}
                        >
                            <AnimatePresence mode="wait">
                                {isOnline ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                        <Loader2 className="w-16 h-16 mb-4 animate-spin-slow opacity-40 absolute" />
                                        <Power className="w-12 h-12 mb-2 relative z-10" strokeWidth={2.5} />
                                        <span className="font-outfit text-xl font-black tracking-widest relative z-10">ONLINE</span>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                        <Power className="w-12 h-12 mb-2 opacity-50" strokeWidth={2.5} />
                                        <span className="font-outfit text-xl font-black tracking-widest">OFFLINE</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <div className="mt-12">
                            <div className={`glass px-6 py-3 rounded-full flex items-center gap-3 border transition-all ${isOnline ? 'border-primary/40' : 'border-border'}`}>
                                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-primary animate-pulse' : 'bg-foreground/10'}`} />
                                <span className="text-xs font-bold text-foreground/60 tracking-wider">
                                    {isOnline ? "Awaiting new pickup requests..." : "Go online to start earning"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* INCOMING PING ALERT */}
                <AnimatePresence>
                    {incomingPing && (
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            className="absolute bottom-8 left-4 right-4 z-50 glass rounded-[2.5rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-primary/30"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/20">
                                            <Zap className="w-3 h-3 fill-white" /> New Request
                                        </span>
                                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">12s remaining</span>
                                    </div>
                                    <h2 className="font-outfit text-4xl font-extrabold text-foreground tracking-tight line-clamp-1">{incomingPing ? "1.2 km" : "Finding..."}</h2>
                                    <p className="text-foreground/50 font-medium italic">~20kg Cardboard & Papers</p>
                                </div>
                                <div className="bg-secondary/50 p-4 rounded-3xl border border-border/50 text-center">
                                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-0.5">Est. Value</p>
                                    <p className="font-outfit text-2xl font-black text-primary">₹400+</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setIncomingPing(false)} className="px-6 py-5 rounded-2xl glass hover:bg-destructive/5 hover:text-destructive transition-all font-bold text-foreground/40">
                                    Decline
                                </button>
                                <button onClick={acceptPickup} className="flex-1 bg-primary text-white font-black text-xl py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 btn-premium">
                                    Accept Pickup <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ACTIVE PICKUP NAVIGATION */}
                <AnimatePresence>
                    {activePickup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-40 bg-background flex flex-col font-jakarta"
                        >
                            <div className="flex-1 relative">
                                <RealMap
                                    userLocation={{ lat: 28.7000, lng: 77.1000 }}
                                    collectors={{ "target": { lat: 28.7050, lng: 77.1050 } }}
                                />
                                <div className="absolute top-8 left-4 right-4 z-50">
                                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="glass border-primary/20 rounded-3xl p-6 shadow-2xl flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Navigation className="w-8 h-8 text-white fill-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-outfit text-2xl font-black text-foreground leading-tight">Turn Left in 200m</h3>
                                            <p className="text-foreground/40 font-medium tracking-wide">Sector 14 Main Road</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="glass rounded-t-[3rem] border-t border-border/40 p-8 pt-4 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                                <div className="w-12 h-1.5 bg-foreground/5 rounded-full mx-auto mb-8" />
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-secondary border border-border shadow-sm">
                                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${activePickup.customerName}&backgroundColor=f8fafc`} alt="customer" />
                                        </div>
                                        <div>
                                            <h4 className="font-outfit text-2xl font-black text-foreground">{activePickup.customerName}</h4>
                                            <p className="text-xs font-medium text-foreground/40 italic line-clamp-1">{activePickup.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 glass rounded-full flex items-center justify-center text-primary border-primary/20"><Phone className="w-5 h-5 fill-primary/10" /></button>
                                    </div>
                                </div>

                                <button onClick={() => setActivePickup(null)} className="w-full bg-foreground text-background font-black text-xl py-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 btn-premium">
                                    <CheckCircle className="w-7 h-7" /> ARRIVED AT LOCATION
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
