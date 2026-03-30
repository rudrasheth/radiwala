"use client";

import React, { useState } from "react";
import { Newspaper, Box, Factory, Briefcase, IndianRupee, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";

const SCRAP_CATEGORIES = [
    { id: "newspaper", label: "Paper/News", price: 15, icon: Newspaper, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "cardboard", label: "Cardboard", price: 10, icon: Box, color: "text-amber-600", bg: "bg-amber-600/10" },
    { id: "iron", label: "Iron/Steel", price: 40, icon: Factory, color: "text-slate-600", bg: "bg-slate-600/10" },
    { id: "plastic", label: "Plastics", price: 12, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-600/10" },
];

export default function PriceCatalog() {
    const [estimatedValue, setEstimatedValue] = useState(0);

    const handleEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseInt(e.target.value);
        setEstimatedValue(weight * 20);
    };

    return (
        <div className="space-y-10 animate-entrance">
            {/* GRID CATALOG */}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="font-outfit text-xl font-bold text-foreground tracking-tight">Today's Market Rates</h3>
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        <Zap className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {SCRAP_CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass rounded-3xl p-5 border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group shadow-sm active:scale-95"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <cat.icon className={`w-6 h-6 ${cat.color}`} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-extrabold text-foreground/40 tracking-[0.1em] uppercase truncate">{cat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-outfit font-black text-foreground">₹{cat.price}</span>
                                    <span className="text-[10px] text-foreground/30 font-bold italic lowercase">/kg</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* PRICE ESTIMATOR */}
            <div className="glass bg-secondary/20 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-7 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IndianRupee className="w-24 h-24 text-primary" strokeWidth={1} />
                </div>
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h4 className="font-outfit text-xl font-extrabold text-foreground mb-1">Quick Estimator</h4>
                        <p className="text-xs text-foreground/40 font-medium italic">Approximate value based on mixed load</p>
                    </div>
                    <div className="bg-background border border-border rounded-2xl px-5 py-4 flex items-center gap-1.5 shadow-xl">
                        <span className="text-primary font-bold text-lg">₹</span>
                        <span className="text-3xl font-outfit font-black text-foreground tracking-tight leading-none">
                            {estimatedValue > 0 ? estimatedValue : '0'}
                        </span>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div className="relative pt-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            defaultValue="0"
                            onChange={handleEstimateChange}
                            className="w-full h-2 bg-foreground/5 rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Small</span>
                            <span className="text-xs font-bold text-foreground/30 italic">0kg</span>
                        </div>
                        <div className="w-px h-6 bg-border" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Medium</span>
                            <span className="text-xs font-bold text-foreground/30 italic">50kg</span>
                        </div>
                        <div className="w-px h-6 bg-border" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Large</span>
                            <span className="text-xs font-bold text-foreground/30 italic">100+kg</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 px-1 text-primary/40">
                    <Info className="w-3.5 h-3.5" />
                    <p className="text-[10px] font-bold italic uppercase tracking-wider">Prices may vary based on material purity</p>
                </div>
            </div>
        </div>
    );
}
