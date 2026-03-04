"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Navigation, Map } from "lucide-react";
import ActiveRideCard from "../booking/ActiveRideCard";
import PriceCatalog from "../catalog/PriceCatalog";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import("./RealMap"), { ssr: false });

export default function LiveMapDashboard() {
    const [isSearching, setIsSearching] = useState(false);
    const [activeRide, setActiveRide] = useState<any>(null);
    const [liveCollectors, setLiveCollectors] = useState<Record<string, { lat: number, lng: number }>>({});
    const [userData, setUserData] = useState<{ full_name?: string } | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserData(session.user.user_metadata as any);
            }
        });

        // Subscribe to Supabase Realtime Broadcast for all active collectors
        const channel = supabase.channel('active_collectors', {
            config: { broadcast: { self: true } }
        });

        channel.on('broadcast', { event: 'location_update' }, (payload) => {
            const { id, lat, lng } = payload.payload;
            setLiveCollectors((prev) => ({
                ...prev,
                [id]: { lat, lng }
            }));
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleInstantPickup = () => {
        setIsSearching(true);
        // Simulate real-time matching
        setTimeout(() => {
            setIsSearching(false);
            setActiveRide({
                collectorName: "Ramesh Kumar",
                vehicle: "Piaggio Ape Auto",
                plate: "DL 1L 5084",
                eta: "2 mins",
                rating: 4.8,
            });
        }, 3000);
    };

    return (
        <div className="relative h-full w-full bg-[#050505] overflow-hidden font-sans">
            {/* REAL MAP BACKGROUND */}
            <div className="absolute inset-0 z-0 opacity-90">
                <RealMap
                    userLocation={{ lat: 28.7000, lng: 77.1000 }}
                    collectors={liveCollectors}
                    isSearching={isSearching}
                />
            </div>

            {/* TOP HEADER / SEARCH BAR */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 pt-16">
                <div className="max-w-2xl mx-auto bg-[#111111]/80 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors focus-within:border-emerald-500/50">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5 text-white/50" />
                    </div>
                    <input
                        type="text"
                        readOnly
                        value="Sector 14, Current Location"
                        className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder-white/30"
                    />
                </div>
            </div>

            {/* BOTTOM SHEET ACTIONS */}
            <AnimatePresence>
                {activeRide ? (
                    <ActiveRideCard ride={activeRide} onCancel={() => setActiveRide(null)} />
                ) : (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 z-20 bg-[#111111]/90 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
                    >
                        <div className="max-w-3xl mx-auto w-full">
                            <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-6"></div>

                            <div className="px-6 pb-10 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight text-white mb-1">
                                        Hello, {userData?.full_name || "User"}
                                    </h2>
                                    <p className="text-sm text-white/50 font-medium tracking-wide">Clear out your space instantly.</p>
                                </div>

                                <PriceCatalog />

                                {/* INSTANT PICKUP BUTTON */}
                                <button
                                    onClick={handleInstantPickup}
                                    disabled={isSearching}
                                    className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-white font-bold text-lg transition-all duration-300 relative overflow-hidden ${isSearching ? "bg-[#065f46] scale-[0.98]" : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_40px_rgba(5,150,105,0.3)] hover:shadow-[0_0_60px_rgba(5,150,105,0.5)]"
                                        }`}
                                >
                                    {isSearching ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Broadcasting Request...
                                        </>
                                    ) : (
                                        <>
                                            <Navigation className="w-5 h-5 fill-white" />
                                            Request Instant Pickup
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
