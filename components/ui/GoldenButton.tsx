'use client';

import React from 'react';

interface GoldenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export default function GoldenButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: GoldenButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-golden px-8 py-3.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto text-center ${className}`}
    >
      {children}
    </button>
  );
}
