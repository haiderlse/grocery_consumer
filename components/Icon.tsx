import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
}

// SVG paths (examples - add more as needed)
const icons: Record<string, React.ReactNode> = {
  back: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  cart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
  heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  'heart-filled': <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor" />,
  plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
  minus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />,
  trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  chevronRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />,
  // --- FIXED THIS ICON ---
  mapPin: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
  clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  tag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2H8C4.686 2 2 4.686 2 8v8c0 3.314 2.686 6 6 6h8c3.314 0 6-2.686 6-6V8c0-3.314-2.686-6-6-6zM9 9a1 1 0 11-2 0 1 1 0 012 0z" />,
  gift: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  checkCircle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  sort: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />,
  // --- FIXED THIS ICON ---
  settings: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
  crown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-1.45-4.34L6 11.21l4.34-1.45L11.79 6l1.45 4.34L17.59 11.8l-4.34 1.45L12 17zM12 2v4M8.21 8.21l-2.83 2.83M12 22v-4M15.79 15.79l2.83-2.83M3.34 11.79l4.34-1.45" />, 
  receipt: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  'address-book': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 16h6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 11c1.657 0 3 -1.343 3 -3s-1.343 -3 -3 -3s-3 1.343 -3 3s1.343 3 3 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16h3" />
    </>
  ),
  wallet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 12h16M4 16h16M4 4h16v4H4zM7 16v4h10v-4H7z" />, 
  star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 20L12 16.72L5.82 20L7 14.14L2 9.27l6.91-1.01L12 2z" />,
  'ticket-alt': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
  utensils: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18m-4-1H8a3 3 0 01-3-3V7a3 3 0 013-3h1m6 0h1a3 3 0 013 3v11a3 3 0 01-3 3h-1M7 12h10" />,
  'shopping-basket': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  'arrow-up-left': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l-7 7m0-7h7v7" />,
  'x-circle': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  google: <path d="M20.94 11.004c0-.709-.061-1.39-.18-2.054H12v3.865h5.002c-.217 1.247-.875 2.311-1.803 3.018v2.519h3.236c1.891-1.734 2.982-4.288 2.982-7.348zM12 21c2.524 0 4.645-.83 6.196-2.248l-3.236-2.519c-.838.567-1.912.902-3.061.902-2.331 0-4.301-1.566-5.004-3.666H3.761v2.596C5.248 19.093 8.383 21 12 21zM6.892 13.405a5.385 5.385 0 0 1 0-3.81V7.001H3.761a9.002 9.002 0 0 0 0 8.998l3.131-2.594z" />,
  menu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />,
  apple: <path d="M12.012 6.546c-.665-.01-1.824.432-2.968 1.271C7.769 8.725 6.93 9.996 6.93 11.538c0 1.923.988 2.945 1.638 3.597.685.669 1.256.968 2.254.958 1.04-.01 1.427-.349 2.296-.999.792-.599 1.312-1.571 1.312-2.723 0-2.043-1.551-3.297-3.419-3.297zm2.928-2.481c.205-.618.069-1.274-.406-1.764-.46-.471-1.105-.716-1.743-.599-.009.15-.078.608-.173.938-.593.268-1.11.668-1.514 1.187.528.02 1.475-.239 2.022-.619a1.93 1.93 0 001.814-1.143zM12.058 2C9.96 2 8.753 3.374 7.774 4.365c-1.47 1.481-2.607 3.758-2.607 5.924 0 3.045 2.038 4.869 3.819 6.151.95.679 1.879 1.38 3.093 1.41.22.009.46-.02.698-.069l.069-.02c.95-.259 1.784-.8 2.417-1.36.737-.639 1.361-1.601 1.361-2.905 0-1.3-.57-2.478-1.552-3.317-.98-.84-2.407-1.291-3.953-1.291h-.01z" />,
  eye: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
  'eye-slash': <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .916-2.922 3.162-5.358 5.936-6.402M9.75 9.75A2.25 2.25 0 007.5 12a2.25 2.25 0 002.25 2.25m4.5 0A2.25 2.25 0 0016.5 12a2.25 2.25 0 00-2.25-2.25m0 0A2.25 2.25 0 0012 7.5a2.25 2.25 0 00-2.25 2.25M12 19l3-3m-3 3l-3-3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" /></>,
  'chevron-down': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />,
  'message-circle': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />,
  store: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L3 8v12h18V8L12 2zm0 0v5m0 10v-5m-5 5h10m-9-5H3m18 0h-4m-4 0v-5m-5 5V8M8 8l4-3 4 3" />,
  'person-pin': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
  motorcycle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 6a4 4 0 10-8 0 4 4 0 008 0zm-4 6h8m-4-6v6m-4 6h-1a1 1 0 01-1-1V9a1 1 0 011-1h1m9 8l-2-4H7l-2 4m13 0a2 2 0 100 4 2 2 0 000-4zm-9 0a2 2 0 100 4 2 2 0 000-4z" />
};

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', ...props }) => {
  let iconContent = icons[name];
  
  if (!iconContent) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }

  const isFilledIcon = name === 'heart-filled';
  const isSocialIcon = name === 'facebook' || name === 'google' || name === 'apple';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilledIcon || isSocialIcon ? 'currentColor' : 'none'}
      stroke={isFilledIcon || isSocialIcon ? 'none' : 'currentColor'}
      strokeWidth={isFilledIcon || isSocialIcon ? undefined : "1.5"} 
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      aria-hidden="true"
    >
      {iconContent}
    </svg>
  );
};

export default Icon;