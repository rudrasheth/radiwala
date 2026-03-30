"use client";

import React, { useState } from "react";
import { Newspaper, Box, Factory, Briefcase, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

const SCRAP_CATEGORIES = [
    { id: "newspaper", label: "Newspaper", price: 15, icon: Newspaper },
    { id: "cardboard", label: "Cardboard", price: 10, icon: Box },
    { id: "iron", label: "Iron/Steel", price: 40, icon: Factory },
    { id: "plastic", label: "Plastics", price: 12, icon: Briefcase },
];

export default function PriceCatalog() {
    const [estimatedValue, setEstimatedValue] = useState(0);

    const handleEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseInt(e.target.value);
        setEstimatedValue(weight * 20);
    };

    return (
        <div className="space-y-8 animate-entrance">
            {/* HORIZONTAL CATALOG SCROLL */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-outfit text-lg font-bold text-foreground tracking-tight">Today's Market Rates</h3>
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Live</span>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-6 px-6">
                    {SCRAP_CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex-shrink-0 w-36 glass rounded-2xl p-4 snap-start border border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group shadow-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-primary/5 transition-all">
                                <cat.icon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground/40 tracking-wide mb-1 uppercase">{cat.label}</p>
                                <p className="text-xl font-outfit font-black text-foreground flex items-baseline">
                                    <IndianRupee className="w-3.5 h-3.5 text-primary mr-0.5" strokeWidth={3} />
                                    {cat.price}<span className="text-[10px] text-foreground/30 font-bold ml-1 italic lowercase">/kg</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* PRICE ESTIMATOR */}
            <div className="bg-secondary/20 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="font-bold text-foreground text-base mb-1">Quick Estimator</h4>
                        <p className="text-xs text-foreground/40 font-medium italic">Based on average load Mix</p>
                    </div>
                    <div className="bg-background border border-border/80 px-4 py-3 rounded-2xl flex items-center gap-1 shadow-sm">
                        <IndianRupee className="w-5 h-5 text-primary" strokeWidth={3} />
                        <span className="text-2xl font-outfit font-black text-foreground tracking-tight">
                            {estimatedValue > 0 ? estimatedValue : '--'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            defaultValue="0"
                            onChange={handleEstimateChange}
                            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                        />
                        <div className="absolute top-[-25px] left-[50%] -translate-x-[50%] bg-primary text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            Est. Weight
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-extrabold text-foreground/30 uppercase tracking-widest px-1">
                        <span>0 kg</span>
                        <div className="w-[1px] h-2 bg-border mt-1" />
                        <span>50 kg</span>
                        <div className="w-[1px] h-2 bg-border mt-1" />
                        <span>100+ kg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
