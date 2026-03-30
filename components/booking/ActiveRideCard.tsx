"use client";

import React, { useState } from "react";
import { Navigation, Clock, Star, Phone, MessageSquare, IndianRupee, RotateCcw, ShieldCheck, X, ChevronRight } from "lucide-react";
import ChatInterface from "../communication/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";

export default function ActiveRideCard({ ride, onCancel }: { ride: any; onCancel: () => void }) {
    const [showChat, setShowChat] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [finalWeight, setFinalWeight] = useState("20");

    if (showChat) return <ChatInterface onClose={() => setShowChat(false)} collectorName={ride.collectorName} />;

    if (showInvoice) {
        return (
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 z-50 glass rounded-t-[3rem] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-border/40 flex flex-col items-center"
            >
                <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8"></div>
                <div className="w-full flex justify-end absolute top-8 right-8">
                    <button onClick={() => setShowInvoice(false)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground transition"><X className="w-5 h-5" /></button>
                </div>
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-outfit text-3xl font-extrabold text-foreground tracking-tight">Finalize Transaction</h2>
                    <p className="text-foreground/40 font-medium mt-1">Confirm measured weight with {ride.collectorName}</p>
                </div>

                <div className="w-full space-y-8 mb-10">
                    <div className="bg-secondary/30 border border-border/50 rounded-3xl p-6 shadow-sm">
                        <label className="text-[10px] font-extrabold text-foreground/30 uppercase tracking-widest mb-4 block">Weighted Amount (kg)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={finalWeight}
                                onChange={(e) => setFinalWeight(e.target.value)}
                                className="w-full bg-transparent text-5xl font-outfit font-black text-foreground focus:outline-none placeholder:text-foreground/10"
                            />
                            <span className="text-2xl font-bold text-foreground/20 italic">kg</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4 w-full">
                        <span className="text-foreground/40 font-extrabold uppercase tracking-widest text-[10px]">Estimated Payout</span>
                        <span className="text-4xl font-outfit font-black text-primary flex items-center">
                            <IndianRupee className="w-8 h-8 mr-1 p-1 bg-primary/10 rounded-lg" strokeWidth={3} />
                            {parseInt(finalWeight || "0") * 20}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    className="w-full py-6 rounded-[2rem] bg-primary text-white font-black text-xl shadow-xl shadow-primary/20 hover:scale-[0.98] transition-all btn-premium"
                >
                    Confirm & Accept Payment
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-40 glass rounded-t-[3rem] border-t border-border/40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] pb-24"
        >
            <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mt-4 mb-8"></div>

            <div className="px-8 pb-10">
                {/* Top Status */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">Active Order</span>
                            <div className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-sm" />
                        </div>
                        <h2 className="font-outfit text-3xl font-extrabold text-foreground tracking-tight">
                            Arriving in {ride.eta}
                        </h2>
                        <p className="text-foreground/40 font-medium italic mt-0.5">Partner is approaching your location</p>
                    </div>

                    <div className="w-16 h-16 glass border-border/60 rounded-2xl flex flex-col items-center justify-center shadow-xl">
                        <span className="font-outfit text-2xl font-black text-foreground">{ride.eta.split(" ")[0]}</span>
                        <span className="text-foreground/30 text-[10px] font-bold uppercase -mt-1 tracking-tighter">min</span>
                    </div>
                </div>

                {/* Collector Profile Card */}
                <div className="bg-secondary/20 border border-border/40 rounded-3xl p-5 flex items-center gap-5 mb-8 shadow-sm group">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-background shadow-md">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${ride.collectorName}&backgroundColor=f8fafc`} alt="Driver" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 glass text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-0.5 shadow-lg">
                            {ride.rating} <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-outfit text-xl font-extrabold text-foreground tracking-tight mb-0.5 group-hover:text-primary transition-colors">{ride.collectorName}</h3>
                        <p className="text-foreground/40 text-xs font-medium italic">{ride.vehicle}</p>
                        <div className="inline-block mt-2 bg-foreground/5 border border-border/50 px-2.5 py-1 rounded-lg">
                            <p className="text-foreground/60 text-[10px] font-black tracking-widest uppercase">{ride.plate}</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary border-primary/20"><Phone className="w-5 h-5 fill-primary/5" /></button>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-4">
                    <button onClick={onCancel} className="w-16 h-16 rounded-2xl glass hover:bg-destructive/5 hover:text-destructive text-foreground/20 transition-all flex items-center justify-center" title="Cancel Request">
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowInvoice(true)}
                        className="flex-1 bg-foreground text-background font-black text-xl rounded-2xl shadow-xl shadow-foreground/5 hover:bg-primary hover:text-white transition-all btn-premium flex items-center justify-center gap-3"
                    >
                        <span>Generate Receipt</span>
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
