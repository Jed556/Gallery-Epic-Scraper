// Simple SVG icon components to replace lucide-react
import React from 'react';

const iconProps = {
    width: "1em",
    height: "1em",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
};

export const Settings = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

export const Menu = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const Grid = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

export const Download = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const Play = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <polygon points="5,3 19,12 5,21 5,3"></polygon>
    </svg>
);

export const X = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const Search = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
    </svg>
);

export const Filter = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
    </svg>
);

export const ArrowUpDown = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="m21 16-4 4-4-4"></path>
        <path d="M17 20V4"></path>
        <path d="m3 8 4-4 4 4"></path>
        <path d="M7 4v16"></path>
    </svg>
);

export const User = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const Image = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="9" cy="9" r="2"></circle>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
);

export const Video = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <polygon points="23,7 16,12 23,17 23,7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
);

export const Eye = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const Calendar = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const HardDrive = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <line x1="22" y1="12" x2="2" y2="12"></line>
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        <line x1="6" y1="16" x2="6.01" y2="16"></line>
        <line x1="10" y1="16" x2="10.01" y2="16"></line>
    </svg>
);

export const ExternalLink = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

export const PlayCircle = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10,8 16,12 10,16 10,8"></polygon>
    </svg>
);

export const FileText = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <path d="M14,2H6a2,2 0 0,0 -2,2V20a2,2 0 0,0 2,2H18a2,2 0 0,0 2,-2V8Z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
);

export const Code = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <polyline points="16,18 22,12 16,6"></polyline>
        <polyline points="8,6 2,12 8,18"></polyline>
    </svg>
);

export const Globe = ({ size = 24, ...props }) => (
    <svg {...iconProps} width={size} height={size} viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);
