'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    const base = `
      inline-flex items-center justify-center gap-2 font-semibold cursor-pointer
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7040] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0806]
      disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
      select-none
    `;

    const variants = {
      primary: 'btn-glow text-white rounded-xl',
      secondary: `
        bg-transparent text-[#c8bdb8] rounded-xl
        border border-[rgba(46,112,64,0.25)]
        hover:border-[rgba(46,112,64,0.5)] hover:text-white hover:bg-[rgba(46,112,64,0.08)]
        transition-all duration-200
      `,
      ghost: `
        bg-transparent text-[#8a7a74] rounded-xl
        hover:text-[#c8bdb8] hover:bg-[rgba(255,255,255,0.04)]
        transition-all duration-200
      `,
      outline: `
        bg-transparent text-white rounded-xl
        border border-[rgba(255,255,255,0.12)]
        hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)]
        transition-all duration-200
      `,
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
