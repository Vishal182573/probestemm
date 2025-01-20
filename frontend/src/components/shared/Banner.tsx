import React from "react";
import Image from "next/image";

// Define the type interface for Banner component props
interface BannerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageSrc: any; // Source of the banner image
  altText: string; // Alternative text for accessibility
  title: string; // Main title text to display on banner
  subtitle?: string; // Optional subtitle text (marked with ?)
}

// Banner component definition using React.FC (Function Component) with BannerProps interface
const Banner: React.FC<BannerProps> = ({
  imageSrc,
  altText,
  title,
  subtitle,
}) => {
  return (
    // Main container with fixed height and overflow handling
    <div className="relative h-[320px] w-full overflow-hidden">
      {/* Background image using Next.js Image component for optimization */}
      <Image
        src={imageSrc}
        alt={altText}
        layout="fill"
        objectFit="cover"
        className="z-0" // Place image at the bottom layer
      />
      {/* Overlay div with orange background and opacity for image dimming */}
      <div className="absolute inset-0 bg-[#eb5e17] bg-opacity-60 z-10" />
      {/* Content container for title and subtitle with center alignment */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-4">
        {/* Title with responsive text size and bold styling */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-black">
          {title}
        </h1>
        {/* Conditional rendering of subtitle if provided */}
        {subtitle && (
          <p className="text-xl md:text-2xl mb-6 text-center max-w-2xl text-black">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// Export the Banner component as default export
export default Banner;
