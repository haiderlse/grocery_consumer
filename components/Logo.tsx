import React from 'react';

// Update props to match HTMLImgElement attributes
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', ...props }) => {
  return (
    <img
      src="/assets/logo.png" // Updated path to your image file
      alt="Pick Me Up Logo"
      className={className}
      // Default width/height can be managed by className (e.g. h-8 w-auto)
      // or set explicitly if needed, but className is more flexible.
      {...props}
    />
  );
};

export default Logo;