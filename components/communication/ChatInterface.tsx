"use client";

import React, { useState } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChatProps {
    onClose: () => void;
    collectorName: string;
}

export default function ChatInterface({ onClose, collectorName }: ChatProps) {
    const [messages, setMessages] = useState([
        { id: 1, text: "I'll be there in 5 minutes.", sender: "collector" },
    ]);
    const [inputText, setInputText] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages([...messages, { id: Date.now(), text: inputText, sender: "user" }]);
        setInputText("");

        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: "Got it!", sender: "collector" }]);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-3xl flex flex-col pt-12"
        >
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#111111]/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white leading-tight">{collectorName}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]"></span>
                            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Online</p>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition">
                    <X className="w-5 h-5 text-white/70" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
                <div className="text-center my-6">
                    <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white/30 uppercase tracking-widest">Today</span>
                </div>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[80%] rounded-[1.5rem] p-4 shadow-xl ${msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-br-sm shadow-[0_0_20px_rgba(5,150,105,0.3)]"
                            : "bg-[#111111] border border-white/10 text-white/90 rounded-bl-sm"
                            }`}>
                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 relative z-10">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-[#111111] border border-white/10 rounded-[1.2rem] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 shadow-inset-dark transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-14 h-14 bg-emerald-600 disabled:bg-white/5 disabled:border disabled:border-white/10 text-white disabled:text-white/20 rounded-[1.2rem] flex items-center justify-center transition-all disabled:shadow-none shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
