"use client"
import React from "react";
import Image from "next/image";
import { Truck, RotateCcw, Tag } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: FeatureItem[];
  mediaUrl: string;
  mediaAlt: string;
  isGif?: boolean;
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: <Truck className="w-8 h-8 text-[#4CAF50]" />,
    title: "Free Shipping in 24 hours",
    description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
  },
  {
    icon: <RotateCcw className="w-8 h-8 text-[#4CAF50]" />,
    title: "Free Returns",
    description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
  },
  {
    icon: <Tag className="w-8 h-8 text-[#4CAF50]" />,
    title: "Only Genuine Products",
    description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
  }
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
  mediaUrl,
  mediaAlt,
  isGif = false
}) => {
  return (
    <div className="w-full bg-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 group"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Media Section */}
          <div className="relative h-[400px] lg:h-[300px] rounded-2xl overflow-hidden shadow-xl">
            {isGif ? (
              // If it's a GIF, use img tag for better GIF support
              <img
                src={mediaUrl}
                alt={mediaAlt}
                className="w-full h-full object-cover"
              />
            ) : (
              // If it's a regular image, use Next.js Image component
              <Image
                src={mediaUrl}
                alt={mediaAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage:
export default function FeaturesDemo() {
  return (
    <FeaturesSection
      mediaUrl="https://media.tenor.com/8tr_CU6730MAAAAM/web-dev-website-development.gif"
      mediaAlt="Features demonstration"
      features={[
        {
          icon: <Truck className="w-8 h-8 text-[#4CAF50]" />,
          title: "Free Shipping in 24 hours",
          description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
        },
        {
          icon: <RotateCcw className="w-8 h-8 text-[#4CAF50]" />,
          title: "Free Returns",
          description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
        },
        {
          icon: <Tag className="w-8 h-8 text-[#4CAF50]" />,
          title: "Only Genuine Products",
          description: "Continually e-enable premium outsourcing vis-a-vis intermandated manufactured products"
        }
      ]}
    />
  );
}