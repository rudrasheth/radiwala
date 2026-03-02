"use client";

import React, { useState } from "react";
import { Copyleft as Newspaper, Box, Factory, Briefcase, IndianRupee } from "lucide-react";

const SCRAP_CATEGORIES = [
    { id: "newspaper", label: "Newspaper", price: 15, icon: Newspaper, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { id: "cardboard", label: "Cardboard", price: 10, icon: Box, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: "iron", label: "Iron/Steel", price: 40, icon: Factory, color: "text-slate-300 bg-white/5 border-white/10" },
    { id: "plastic", label: "Plastics", price: 12, icon: Briefcase, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
];

export default function PriceCatalog() {
    const [estimatedValue, setEstimatedValue] = useState(0);

    const handleEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseInt(e.target.value);
        setEstimatedValue(weight * 20);
    };

    return (
        <div className="space-y-6">
            {/* HORIZONTAL CATALOG SCROLL */}
            <div>
                <div className="flex items-center justify-between mb-4 min-w-full">
                    <h3 className="text-sm font-bold text-white/90 tracking-tight">Today's Rates</h3>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(52,211,153,0.2)]">Live</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-6 px-6">
                    {SCRAP_CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex-shrink-0 w-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-4 snap-start flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl"
                        >
                            <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                <cat.icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-white/50 tracking-wide mb-1">{cat.label}</p>
                                <p className="text-sm font-black text-white flex items-center justify-center -ml-1">
                                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400 mr-0.5" />
                                    {cat.price}<span className="text-[10px] text-white/30 font-bold ml-1">/kg</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRICE ESTIMATOR */}
            <div className="bg-[#111111] backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 shadow-inset-dark">
                <label className="text-sm font-bold text-white/90 tracking-tight flex items-center justify-between mb-6">
                    Quick Estimator
                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xl font-black flex items-center gap-0.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <IndianRupee className="w-5 h-5" strokeWidth={3} />
                        {estimatedValue > 0 ? estimatedValue : '--'}
                    </span>
                </label>

                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        defaultValue="0"
                        onChange={handleEstimateChange}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                    />
                    <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
                        <span>0 kg</span>
                        <span>50 kg</span>
                        <span>100+ kg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
