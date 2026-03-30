"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Navigation, Map, Loader2, IndianRupee, ClipboardList, User, Leaf, ChevronRight, LogOut } from "lucide-react";
import ActiveRideCard from "../booking/ActiveRideCard";
import PriceCatalog from "../catalog/PriceCatalog";
import BottomTabs from "../navigation/BottomTabs";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import("./RealMap"), { ssr: false });

export default function LiveMapDashboard() {
    const [activeTab, setActiveTab] = useState<"home" | "orders" | "rates" | "profile">("home");
    const [isSearching, setIsSearching] = useState(false);
    const [activeRide, setActiveRide] = useState<any>(null);
    const [liveCollectors, setLiveCollectors] = useState<Record<string, { lat: number, lng: number }>>({});
    const [userData, setUserData] = useState<{ full_name?: string } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationText, setLocationText] = useState("Locating...");

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserData(session.user.user_metadata as any);
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation({ lat, lng });

                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                        const data = await res.json();
                        if (data && data.address) {
                            const area = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || data.address.town || data.address.village || "Unknown Location";
                            setLocationText(`${area}, Current Location`);
                        } else {
                            setLocationText("Current Location");
                        }
                    } catch (e) {
                        setLocationText("Current Location");
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationText("Location Permission Denied");
                    setUserLocation({ lat: 19.1860, lng: 72.8485 });
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocationText("Geolocation not supported");
            setUserLocation({ lat: 19.1860, lng: 72.8485 });
        }

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
        <div className="relative h-full w-full bg-background overflow-hidden font-jakarta">
            
            {activeTab === "home" && (
                <div className="absolute inset-0 z-0">
                    {userLocation ? (
                        <RealMap
                            userLocation={userLocation}
                            collectors={liveCollectors}
                            isSearching={isSearching}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/10">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-foreground/30 font-bold tracking-widest uppercase text-[10px]">Initializing Map...</p>
                        </div>
                    )}
                </div>
            )}

            {/* TOP HEADER / SEARCH BAR (Home only) */}
            {activeTab === "home" && (
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-0 left-0 right-0 z-20 p-6 pt-16"
                >
                    <div className="max-w-2xl mx-auto glass shadow-2xl border border-border/40 rounded-3xl p-4 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-0.5 ml-0.5">Your Location</p>
                            <input
                                type="text"
                                readOnly
                                value={locationText}
                                className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none placeholder:text-foreground/20"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full hover:bg-secondary transition-colors flex items-center justify-center text-foreground/30">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* MAIN VIEWS BY TAB */}
            <AnimatePresence mode="wait">
                {activeTab === "home" && (
                    <div key="home-view" className="relative h-full w-full overflow-hidden">
                        {activeRide ? (
                            <ActiveRideCard ride={activeRide} onCancel={() => setActiveRide(null)} />
                        ) : (
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute bottom-0 left-0 right-0 z-20 glass rounded-t-[3rem] border-t border-border/40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] pb-24"
                            >
                                <div className="max-w-3xl mx-auto w-full px-8 pt-4 pb-20 overflow-y-auto no-scrollbar max-h-[75vh]">
                                    <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8"></div>
                                    <div className="mb-10">
                                        <h2 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground mb-2">
                                            Hi, {userData?.full_name?.split(' ')[0] || "there"}
                                        </h2>
                                        <p className="text-base text-foreground/40 font-medium leading-relaxed italic">Ready to clear some space today?</p>
                                    </div>

                                    <PriceCatalog />

                                    <button
                                        onClick={handleInstantPickup}
                                        disabled={isSearching}
                                        className={`w-full py-6 mt-8 rounded-[2rem] flex items-center justify-center gap-4 text-white font-bold text-xl transition-all duration-500 relative overflow-hidden group btn-premium ${
                                            isSearching ? "bg-primary/80" : "bg-foreground shadow-2xl shadow-foreground/10 hover:bg-primary"
                                        }`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span className="font-outfit tracking-tight">Broadcasting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
                                                <span className="font-outfit tracking-tight">Request Instant Pickup</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {activeTab === "rates" && (
                    <motion.div key="rates-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-background p-8 pt-24 overflow-y-auto no-scrollbar pb-32">
                        <h2 className="font-outfit text-4xl font-extrabold text-foreground mb-4">Market Rates</h2>
                        <p className="text-foreground/40 mb-10 italic">Live scrap values updated hourly</p>
                        <PriceCatalog />
                        {/* More detailed pricing details can go here */}
                    </motion.div>
                )}

                {activeTab === "orders" && (
                    <motion.div key="orders-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 bg-background p-8 pt-24 overflow-y-auto no-scrollbar flex flex-col items-center justify-center pb-32">
                        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
                            <ClipboardList className="w-10 h-10 text-foreground/20" />
                        </div>
                        <h2 className="font-outfit text-2xl font-extrabold text-foreground mb-2">No active orders</h2>
                        <p className="text-foreground/40 text-center max-w-[240px]">Your completed pickups and active orders will appear here.</p>
                    </motion.div>
                )}
                
                {activeTab === "profile" && (
                    <motion.div key="profile-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-30 bg-background px-6 pt-24 pb-32 overflow-y-auto no-scrollbar">
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-xl bg-background">
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userData?.full_name || 'user'}&backgroundColor=f8fafc`} alt="user" />
                                </div>
                            </div>
                            <h2 className="font-outfit text-3xl font-extrabold text-foreground tracking-tight mt-6 mb-1">{userData?.full_name || "Eco Partner"}</h2>
                            <p className="text-foreground/40 font-bold text-xs uppercase tracking-[0.2em]">Verified User</p>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] px-2 mb-4">Account Overview</p>
                            
                            <div className="glass p-5 rounded-3xl border border-border/40 flex justify-between items-center bg-primary/[0.03]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Leaf className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary italic">ScrapUber Pro</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">Environmental Impact Tier 4</p>
                                    </div>
                                </div>
                                <div className="bg-primary px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Active</span>
                                </div>
                            </div>

                            <button className="w-full glass p-5 rounded-3xl border border-border/40 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <User className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="font-bold text-foreground/60 transition-colors group-hover:text-foreground">Profile Settings</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>

                            <button className="w-full glass p-5 rounded-3xl border border-border/40 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <IndianRupee className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="font-bold text-foreground/60 transition-colors group-hover:text-foreground">Payment Methods</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>

                            <button 
                                onClick={() => supabase.auth.signOut()}
                                className="w-full glass p-5 rounded-3xl border border-destructive/20 flex items-center justify-between group hover:bg-destructive/[0.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-destructive/5 flex items-center justify-center group-hover:bg-destructive/10 transition-colors">
                                        <LogOut className="w-5 h-5 text-destructive/60 group-hover:text-destructive transition-colors" />
                                    </div>
                                    <span className="font-bold text-destructive/60 transition-colors group-hover:text-destructive">Log Out</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-destructive/20 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PERSISTENT BOTTOM TAB BAR */}
            <BottomTabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />
        </div>
    );
}
