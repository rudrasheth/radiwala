"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Navigation, Map } from "lucide-react";
import ActiveRideCard from "../booking/ActiveRideCard";
import PriceCatalog from "../catalog/PriceCatalog";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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
            {/* MOCK MAP BACKGROUND (Cinematic Dark Mode map style) */}
            <div className="absolute inset-0 z-0 bg-[#0a0a0a] flex items-center justify-center opacity-90">
                <Map className="w-96 h-96 text-white/5 opacity-50" strokeWidth={0.5} />

                {/* User Location Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                        <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,1)] z-10 relative border-2 border-[#050505]"></div>
                        {isSearching && (
                            <div className="absolute w-40 h-40 bg-emerald-500/20 rounded-full animate-ping pointer-events-none"></div>
                        )}
                        <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full animate-pulse pointer-events-none"></div>
                    </div>
                </div>

                {/* Live Supabase Collectors */}
                <AnimatePresence>
                    {Object.entries(liveCollectors).map(([id, pos]) => (
                        // Simplistic mock projection: mapped relative to center based on tiny offsets
                        // Assuming lat/lng changes are decimal degrees close to the user
                        <motion.div
                            key={id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            // Very rough mock rendering logic for demo purposes
                            className="absolute top-1/2 left-1/2 transition-transform duration-1000 ease-linear"
                            style={{
                                transform: `translate(calc(-50% + ${(pos.lng - 77.1000) * 10000}px), calc(-50% + ${(28.7000 - pos.lat) * 10000}px))`
                            }}
                        >
                            <div className="flex flex-col items-center group">
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-xl border border-white/20 mb-2 truncate max-w-[80px]">
                                    Active
                                </div>
                                <div className="w-10 h-10 bg-[#111111] border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform shadow-black/50">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Fallback mock collectors if none online */}
                {!isSearching && !activeRide && Object.keys(liveCollectors).length === 0 && (
                    <>
                        <div className="absolute top-[40%] left-[45%]">
                            <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </>
                )}
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
