import React from 'react';
import { cn } from '@/lib/utils';

interface ClarioLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const ClarioLogo: React.FC<ClarioLogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Clario Logo Icon - Document with Quill */}
      <div className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document Background */}
          <rect
            x="15"
            y="20"
            width="60"
            height="70"
            rx="4"
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          {/* Folded Corner */}
          <path
            d="M65 20 L75 20 L75 30 L65 20 Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          {/* Document Lines */}
          <line x1="25" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
          <line x1="25" y1="45" x2="55" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
          <line x1="25" y1="55" x2="50" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
          
          {/* Quill Pen */}
          <g transform="rotate(-15 50 50)">
            {/* Quill Shaft */}
            <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            
            {/* Quill Feather */}
            <path
              d="M25 25 Q20 20 15 25 Q20 30 25 25"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            
            {/* Feather Details */}
            <line x1="20" y1="22" x2="18" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
            <line x1="22" y1="28" x2="20" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
          </g>
        </svg>
        
        {/* Neon Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm -z-10" />
      </div>
      
      {/* Clario Text */}
      {showText && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
          textSizeClasses[size]
        )}>
          CLARIO
        </span>
      )}
    </div>
  );
};

export default ClarioLogo;
