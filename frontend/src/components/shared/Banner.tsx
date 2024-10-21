import React from 'react';
import Image from 'next/image';

interface BannerProps {
  imageSrc: any;
  altText: string;
  title: string;
  subtitle?: string
}

const Banner: React.FC<BannerProps> = ({
  imageSrc,
  altText,
  title,
  subtitle,
}) => {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={altText}
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-6 text-center max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default Banner;