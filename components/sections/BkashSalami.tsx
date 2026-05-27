'use client';

import React, { useState } from 'react';
import GoldenButton from '../ui/GoldenButton';
import { Send, Check, Phone, DollarSign, MessageSquare, RefreshCw, Sparkles, Award } from 'lucide-react';
import gsap from 'gsap';

export default function BkashSalami() {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [note, setNote] = useState('Eid Mubarak! bKash er salami nilam! 🌸');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trxId, setTrxId] = useState('');

  const handleSendSalami = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !receiver.trim() || !phone.trim()) return;

    setIsProcessing(true);
    
    // Play envelope opening slide sound
    try {
      if ((window as any).triggerEnvelopeSound) {
        (window as any).triggerEnvelopeSound();
      }
    } catch (e) {}

    // Simulate bKash transaction delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Generate a realistic mock bKash transaction ID
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let mockTrx = 'TXN';
      for (let i = 0; i < 7; i++) {
        mockTrx += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTrxId(mockTrx);

      // Play success chime
      try {
        if ((window as any).triggerEidChime) {
          (window as any).triggerEidChime();
        }
      } catch (e) {}
    }, 2800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSender('');
    setReceiver('');
    setPhone('');
    setCustomAmount('');
    setAmount('500');
    setNote('Eid Mubarak! bKash er salami nilam! 🌸');
  };

  const finalAmount = amount === 'custom' ? customAmount : amount;

  return (
    <section id="bkash-salami-section" className="relative py-24 w-full z-20 px-6">
      
      {/* Background soft pink radial glow representing bKash aesthetics */}
      <div className="absolute inset-0 bg-contain bg-center opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #E2125B 0%, transparent 60%)' }} />

      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-sm md:text-base text-gold-300 tracking-[0.2em] uppercase mb-3">
            Bangladeshi Cultural Fun
          </h2>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide">
            bKash Dummy Eid Salami
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E2125B] to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            The legendary Eid tradition of Salami / Eidi meets modern fintech! Send a playful, mock bKash receipt card to surprise your cousins on WhatsApp.
          </p>
        </div>

        <div className="flex justify-center items-start">
          
          {isSuccess ? (
            // bKash Success Receipt Card
            <div className="w-full max-w-sm glass-panel border border-[#E2125B]/40 rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(226,18,91,0.2)] animate-fade-in text-center flex flex-col justify-between min-h-[480px]">
              
              {/* bKash Signature pink Header */}
              <div className="bg-[#E2125B] p-6 text-white flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 animate-bounce mb-1">
                  <Check className="w-6 h-6 text-white stroke-[3]" />
                </div>
                <span className="font-serif text-xs uppercase tracking-widest font-semibold">bKash Eid Salami</span>
                <h3 className="font-serif text-xl font-bold">Transfer Successful</h3>
              </div>

              {/* Receipt Body */}
              <div className="p-8 flex flex-col gap-6 bg-black/40 flex-grow">
                
                {/* Stamp overlay */}
                <div className="border border-dashed border-[#E2125B]/40 bg-[#E2125B]/5 py-2 px-4 rounded-lg inline-block self-center mb-2 rotate-[-3deg] shadow-sm">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#E2125B] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    EID SALAMI RECEIVED
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">Salami Amount</span>
                  <span className="font-serif text-3xl md:text-4xl font-extrabold text-gold-300 block tracking-wide">
                    ৳{finalAmount} BDT
                  </span>
                </div>

                <div className="flex flex-col gap-4 border-t border-b border-white/5 py-4 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">From (Sender):</span>
                    <span className="text-white font-semibold">{sender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To (Receiver):</span>
                    <span className="text-white font-semibold">{receiver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">bKash Number:</span>
                    <span className="text-white font-mono">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="text-gold-300 font-mono font-bold uppercase">{trxId}</span>
                  </div>
                </div>

                {/* Submitter Note */}
                <div className="bg-[#E2125B]/5 border border-[#E2125B]/10 p-3 rounded-lg text-left">
                  <span className="text-[8px] uppercase tracking-widest text-[#E2125B] font-bold block mb-1">Personal Note</span>
                  <p className="text-gray-300 text-xs italic font-serif leading-relaxed">
                    “{note}”
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="p-6 border-t border-white/5 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const origin = window.location.origin;
                    navigator.clipboard.writeText(`Hey ${receiver}! I sent you ৳${finalAmount} Eid Salami on bKash! Open this link to collect it: ${origin}/#bkash-salami-section`);
                    alert('Playful bKash Salami message copied to clipboard! Send it on WhatsApp!');
                  }}
                  className="bg-[#E2125B] hover:bg-[#c20c4c] text-white font-semibold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Share on WhatsApp
                </button>
                <button
                  onClick={handleReset}
                  className="glass-panel border border-white/5 hover:border-gold-300/30 text-gold-300 px-6 py-2 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all"
                >
                  Send Another Salami
                </button>
              </div>

            </div>
          ) : (
            // bKash Submission Form
            <form
              onSubmit={handleSendSalami}
              className="w-full max-w-md glass-panel border border-[#E2125B]/20 rounded-3xl p-8 flex flex-col gap-5 shadow-lg relative overflow-hidden"
            >
              {/* Decorative top bKash brand line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E2125B]" />

              <div className="flex items-center gap-2 text-gold-300 font-serif border-b border-white/10 pb-4 mb-2">
                <Award className="w-5 h-5 text-[#E2125B] animate-pulse" />
                Playful Salami Box
              </div>

              {/* Sender Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Your Name (Sender)</label>
                <input
                  type="text"
                  required
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. Rahim Miah"
                  className="w-full bg-black/40 border border-white/10 focus:border-[#E2125B]/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* Receiver Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Cousin's Name (Recipient)</label>
                <input
                  type="text"
                  required
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="e.g. Aria Islam"
                  className="w-full bg-black/40 border border-white/10 focus:border-[#E2125B]/50 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              {/* bKash Phone Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">bKash Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    pattern="^01[3-9]\d{8}$"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-black/40 border border-white/10 focus:border-[#E2125B]/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>
                <span className="text-[8px] text-gray-500 font-light">Must be a valid 11-digit Bangladeshi mobile number</span>
              </div>

              {/* Salami presets */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Select Eidi Amount (৳)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['100', '500', '1000', 'custom'].map((val) => {
                    const isSelected = amount === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E2125B] border-[#E2125B] text-white shadow-md'
                            : 'glass-panel border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {val === 'custom' ? 'Custom' : `৳${val}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom amount */}
              {amount === 'custom' && (
                <div className="flex flex-col gap-1 animate-fade-in">
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Enter Custom Amount</label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min={10}
                      max={50000}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 2026 Taka"
                      className="w-full bg-black/40 border border-white/10 focus:border-[#E2125B]/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Custom Salami Note</label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-3.5" />
                  <textarea
                    maxLength={100}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#E2125B]/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing || !sender.trim() || !receiver.trim() || !phone.trim()}
                className="bg-[#E2125B] hover:bg-[#c20c4c] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Holding bKash Pin Sweep...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send bKash Eid Salami
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
