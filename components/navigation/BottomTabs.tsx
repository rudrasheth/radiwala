"use client";

import React from "react";
import { Home, ClipboardList, IndianRupee, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomTabsProps {
    activeTab: "home" | "orders" | "rates" | "profile";
    onChange: (tab: "home" | "orders" | "rates" | "profile") => void;
}

export default function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
    const tabs = [
        { id: "home", label: "Home", icon: Home },
        { id: "rates", label: "Rates", icon: IndianRupee },
        { id: "orders", label: "Orders", icon: ClipboardList },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] glass border-t border-border/20 px-4 pt-3 pb-8 flex justify-around items-center rounded-t-3xl shadow-2xl">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id as any)}
                        className="relative flex flex-col items-center gap-1 min-w-[64px] transition-all"
                    >
                        <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground/30 hover:text-foreground/60'}`}>
                            <tab.icon className={`w-6 h-6 ${isActive ? 'fill-primary/5' : ''}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-foreground/30'}`}>
                            {tab.label}
                        </span>
                        
                        {isActive && (
                            <motion.div 
                                layoutId="activeTabUnderline"
                                className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
