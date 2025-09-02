import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

function Logo({ size = 32, ...props }) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    // Use darker colors in dark mode for better contrast
    const primaryColor = isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main;
    const secondaryColor = isDarkMode ? theme.palette.primary.main : theme.palette.primary.light;

    return (
        <Box
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            role="img"
            aria-labelledby="logo-title logo-desc"
            sx={{
                width: size,
                height: size,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                ...props.sx
            }}
            {...props}
        >
            <title id="logo-title">Gallery Epic Scraper Logo</title>
            <desc id="logo-desc">Rounded diamond badge with a picture frame and photo in theme colors.</desc>

            {/* Defs for gradients using theme colors */}
            <defs>
                <linearGradient id="logo-badge-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={secondaryColor} />
                </linearGradient>

                <linearGradient id="logo-stroke-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                </linearGradient>

                <filter id="logo-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="12" stdDeviation="24" floodColor="#000" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Badge (rounded diamond) */}
            <g filter="url(#logo-shadow)">
                <path
                    d="M512 64 C560 64, 608 96, 640 128 L896 384 C928 416, 960 464, 960 512 C960 560, 928 608, 896 640 L640 896 C608 928, 560 960, 512 960 C464 960, 416 928, 384 896 L128 640 C96 608, 64 560, 64 512 C64 464, 96 416, 128 384 L384 128 C416 96, 464 64, 512 64 Z"
                    fill="url(#logo-badge-gradient)"
                />
                <path
                    d="M512 96 C552 96, 592 124, 620 152 L872 404 C900 432, 928 472, 928 512 C928 552, 900 592, 872 620 L620 872 C592 900, 552 928, 512 928 C472 928, 432 900, 404 872 L152 620 C124 592, 96 552, 96 512 C96 472, 124 432, 152 404 L404 152 C432 124, 472 96, 512 96 Z"
                    fill="none"
                    stroke="url(#logo-stroke-gradient)"
                    strokeWidth="12"
                />
            </g>

            {/* Gallery frame */}
            <rect 
                x="260" 
                y="328" 
                width="504" 
                height="368" 
                rx="40" 
                ry="40" 
                fill="rgba(255,255,255,0.12)" 
                stroke="#fff" 
                strokeWidth="20" 
            />
            
            {/* Photo: sun + mountains */}
            <circle cx="370" cy="420" r="44" fill="#fff" />
            <path 
                d="M300 632 L420 512 L520 612 L600 532 L724 656 L300 656 Z" 
                fill="#fff" 
                opacity="0.95" 
            />

            {/* Frame inner line for detail */}
            <rect 
                x="290" 
                y="358" 
                width="444" 
                height="308" 
                rx="28" 
                ry="28" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="28" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.35" 
            />

            {/* Spark lines (hint of "action") */}
            <path 
                d="M240 300 L200 260" 
                stroke="#fff" 
                strokeWidth="28" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.35" 
            />
            <path 
                d="M820 320 L860 280" 
                stroke="#fff" 
                strokeWidth="28" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.35" 
            />
            <path 
                d="M220 740 L180 780" 
                stroke="#fff" 
                strokeWidth="28" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                opacity="0.35" 
            />
        </Box>
    );
}

export default Logo;
