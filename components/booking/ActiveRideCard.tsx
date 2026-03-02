"use client";

import React, { useState } from "react";
import { Navigation, Clock, Star, Phone, MessageSquare, IndianRupee, RotateCcw, ShieldCheck, X } from "lucide-react";
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
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] rounded-t-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/10 flex flex-col items-center"
            >
                <div className="w-14 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>
                <div className="w-full flex justify-end">
                    <button onClick={() => setShowInvoice(false)}><X className="w-5 h-5 text-white/50 hover:text-white transition" /></button>
                </div>
                <div className="text-center mb-8">
                    <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h2 className="text-3xl font-black text-white tracking-tight">Generate Receipt</h2>
                    <p className="text-white/50 font-medium mt-1">Finalize pickup details with {ride.collectorName}</p>
                </div>

                <div className="w-full space-y-6 mb-8">
                    <div className="bg-[#111111] border border-white/10 rounded-[1.5rem] p-5 shadow-inset-dark">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 block">Final Weighted Amount (kg)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={finalWeight}
                                onChange={(e) => setFinalWeight(e.target.value)}
                                className="w-full bg-transparent text-4xl font-black text-white focus:outline-none placeholder-white/20"
                            />
                            <span className="text-xl font-bold text-white/30">kg</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4 w-full">
                        <span className="text-white/50 font-bold uppercase tracking-widest text-sm">Est. Payout</span>
                        <span className="text-3xl font-black text-emerald-400 flex items-center">
                            <IndianRupee className="w-6 h-6 mr-1" strokeWidth={3} />
                            {parseInt(finalWeight || "0") * 20}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    className="w-full py-5 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all"
                >
                    Confirm & Pay
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-3xl rounded-t-[2.5rem] border-t border-emerald-500/20 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-emerald-500/50 rounded-b-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

            <div className="p-6 pt-10">
                {/* Top Status */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            Arriving in {ride.eta}
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                        </h2>
                        <p className="text-white/50 text-sm font-medium">Your Raddiwala is on the way</p>
                    </div>

                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-emerald-400 font-black text-xl">{ride.eta.split(" ")[0]}</span>
                        <span className="text-emerald-400/50 text-[10px] font-bold ml-0.5">m</span>
                    </div>
                </div>

                {/* Collector Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 flex items-center gap-5 mb-6 shadow-2xl">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${ride.collectorName}&backgroundColor=0f172a`} alt="Driver" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[#050505] text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/50 flex items-center gap-0.5">
                            {ride.rating} <Star className="w-2.5 h-2.5 fill-emerald-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white tracking-tight mb-0.5">{ride.collectorName}</h3>
                        <p className="text-white/50 text-sm font-medium">{ride.vehicle}</p>
                        <div className="inline-block mt-1.5 bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-md">
                            <p className="text-white text-xs font-bold tracking-widest">{ride.plate}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full mb-6">
                    <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-[1.2rem] flex items-center justify-center gap-2 transition-colors">
                        <Phone className="w-5 h-5 opacity-70" /> Call
                    </button>
                    <button onClick={() => setShowChat(true)} className="flex-1 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold py-4 rounded-[1.2rem] flex items-center justify-center gap-2 transition-colors">
                        <MessageSquare className="w-5 h-5" /> Message
                    </button>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-4">
                    <button onClick={onCancel} className="w-16 h-16 rounded-[1.2rem] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <RotateCcw className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowInvoice(true)}
                        className="flex-1 bg-white hover:bg-white/90 text-black font-black text-lg rounded-[1.2rem] shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform hover:scale-[0.98]"
                    >
                        Generate Receipt
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
