"use client";

import React, { useState } from "react";
import { Send, X, MessageCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface ChatProps {
    onClose: () => void;
    collectorName: string;
}

export default function ChatInterface({ onClose, collectorName }: ChatProps) {
    const [messages, setMessages] = useState([
        { id: 1, text: "I'll be at your location in 5 minutes.", sender: "collector" },
    ]);
    const [inputText, setInputText] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages([...messages, { id: Date.now(), text: inputText, sender: "user" }]);
        setInputText("");

        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: "I've arrived at the main gate. Please confirm.", sender: "collector" }]);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "10%" }}
            className="absolute inset-0 z-[60] bg-background flex flex-col pt-12"
        >
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 sticky top-0 glass z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm relative">
                        <MessageCircle className="w-6 h-6 text-primary" strokeWidth={2.5} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full animate-pulse shadow-sm" />
                    </div>
                    <div>
                        <h2 className="font-outfit text-xl font-extrabold text-foreground tracking-tight leading-none mb-1">{collectorName}</h2>
                        <p className="text-[10px] font-black text-primary/60 tracking-widest uppercase italic">Active Partner · Pro</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 glass rounded-2xl text-foreground/30 hover:text-foreground transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                    <button onClick={onClose} className="p-2.5 glass rounded-2xl text-foreground/30 hover:text-foreground transition-colors border border-border">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 no-scrollbar">
                <div className="text-center my-8">
                    <span className="bg-secondary/20 border border-border/50 px-4 py-1.5 rounded-full text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Transaction Chat</span>
                </div>
                
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] rounded-[1.5rem] p-5 shadow-sm transition-all ${msg.sender === "user"
                            ? "bg-primary text-white rounded-br-sm shadow-xl shadow-primary/10"
                            : "glass border-border/60 text-foreground/80 rounded-bl-sm font-medium"
                            }`}>
                            <p className="text-sm leading-relaxed tracking-tight">{msg.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2 pb-12 glass border-t border-border/40 relative z-10">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-secondary/30 border border-border/60 rounded-[1.5rem] px-5 py-5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 focus:bg-background transition-all shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-14 h-14 bg-primary text-white disabled:bg-foreground/5 disabled:text-foreground/20 rounded-[1.2rem] flex items-center justify-center transition-all shadow-xl shadow-primary/20 active:scale-95 btn-premium"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
