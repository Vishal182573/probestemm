/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/no-unused-vars*/ 
"use client";

// Essential imports for the component
import React from "react";
import Image from "next/image";
// Import icons from lucide-react library for feature items
import {
  Video,
  Briefcase,
  ChartArea,
  Book,
  RotateCcw,
  Tag,
  Truck,
} from "lucide-react";
import { WEBINARHOME } from "../../../public";

// Interface defining the structure of each feature item
interface FeatureItem {
  icon: React.ReactNode;  // Icon component to be displayed
  title: string;         // Title of the feature
  description: string;   // Description text for the feature
}

// Props interface for the FeaturesSection component
interface FeaturesSectionProps {
  features: FeatureItem[];                // Array of feature items to display
  mediaUrl: any;                          // URL for the media (image/gif)
  mediaAlt: string;                       // Alt text for the media
  isGif?: boolean;                        // Flag to determine if media is a GIF
  imagePosition: "left" | "right";        // Position of the image
  backgroundColor?: string;               // Background color of the section
  textColor?: string;                     // Text color for the content
}

// Default features array with shipping-related items
const defaultFeatures: FeatureItem[] = [
  {
    icon: <Truck className="w-8 h-8 text-[#4CAF50]" />,
    title: "Free Shipping in 24 hours",
    description:
      "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products",
  },
  {
    icon: <RotateCcw className="w-8 h-8 text-[#4CAF50]" />,
    title: "Free Returns",
    description:
      "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products",
  },
  {
    icon: <Tag className="w-8 h-8 text-[#4CAF50]" />,
    title: "Only Genuine Products",
    description:
      "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products",
  },
];

// Main FeaturesSection component that displays features alongside an image
const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
  mediaUrl,
  mediaAlt,
  isGif = false,
  imagePosition,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  // Image/GIF component that can be reused based on position
  const imageComponent = (
    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      {/* Conditional rendering based on whether the media is a GIF or regular image */}
      {isGif ? (
        <img
          src={mediaUrl}
          alt={mediaAlt}
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={mediaUrl}
          alt={mediaAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </div>
  );

  return (
    // Main container with customizable background color
    <div className={`w-full ${backgroundColor} py-12 px-4 md:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Grid layout that changes based on image position */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Conditional rendering of image based on position */}
          {imagePosition === "left" && imageComponent}

          {/* Features List Container */}
          <div className="space-y-8">
            {/* Map through features array to render each feature item */}
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className={`${textColor} opacity-80 leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Conditional rendering of image based on position */}
          {imagePosition === "right" && imageComponent}
        </div>
      </div>
    </div>
  );
};

// Interface for demo component props
interface demoprops {
  imagePosition: "left" | "right";
}

// Demo component showcasing the FeaturesSection with STEM-related content
const FeaturesDemo: React.FC<{ imagePosition: "left" | "right" }> = ({
  imagePosition,
}) => {
  // Custom features array for STEM-related content
  const features: FeatureItem[] = [
    {
      icon: <Video className="w-8 h-8 text-[#eb5e17]" />,
      title: "Personal Journeys",
      description:
        " Presenters share their experiences, motivations, and challenges, offering participants inspiration and guidance for their own careers.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-[#eb5e17]" />,
      title: "Career Insights",
      description:
        "Learn about diverse career paths, required skills, and growth opportunities in various STEM fields, from research to industry.",
    },
    {
      icon: <ChartArea className="w-8 h-8 text-[#eb5e17]" />,
      title: "Unique Research Areas",
      description:
        "Discover the distinct characteristics of each field, its real-world impact, and why innovation in these areas is crucial.",
    },
    {
      icon: <Book className="w-8 h-8 text-[#eb5e17]" />,
      title: "Our Webinars",
      description:
        "Aim to inform, inspire, and connect participants with professionals who can mentor and guide them. Join us to learn, ask questions, and explore the endless possibilities within STEM!",
    },
  ];

  // Return FeaturesSection with demo-specific props
  return (
    <FeaturesSection
      mediaUrl={WEBINARHOME}
      mediaAlt="Probe STEM Features"
      isGif={false}
      imagePosition={imagePosition}
      backgroundColor="bg-white"
      textColor="text-gray-900"
      features={features}
    />
  );
};

export default FeaturesDemo;
