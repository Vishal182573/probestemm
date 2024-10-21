/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import Image from "next/image";
import {
  Video,
  Briefcase,
  ChartArea,
  Book,
  RotateCcw,
  Tag,
  Truck,
} from "lucide-react";

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
  imagePosition: "left" | "right";
  backgroundColor?: string;
  textColor?: string;
}

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

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
  mediaUrl,
  mediaAlt,
  isGif = false,
  imagePosition,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  const imageComponent = (
    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
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
    <div className={`w-full ${backgroundColor} py-12 px-4 md:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {imagePosition === "left" && imageComponent}

          {/* Features List */}
          <div className="space-y-8">
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

          {imagePosition === "right" && imageComponent}
        </div>
      </div>
    </div>
  );
};

interface demoprops {
  imagePosition: "left" | "right";
}

const FeaturesDemo: React.FC<{ imagePosition: "left" | "right" }> = ({
  imagePosition,
}) => {
  const features: FeatureItem[] = [
    {
      icon: <Video className="w-8 h-8 text-[#4CAF50]" />,
      title: "Interactive Webinars",
      description:
        "Attend live webinars and discussions with industry experts and renowned professors.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-[#4CAF50]" />,
      title: "Industry-Academia Projects",
      description:
        "Collaborate on cutting-edge research projects with partners from both academia and industry.",
    },
    {
      icon: <ChartArea className="w-8 h-8 text-[#4CAF50]" />,
      title: "Engaging Discussions",
      description:
        "Participate in thought-provoking discussions and Q&A sessions with peers and mentors.",
    },
    {
      icon: <Book className="w-8 h-8 text-[#4CAF50]" />,
      title: "Insightful Blogs",
      description:
        "Stay updated with the latest trends and innovations through our curated blog posts.",
    },
  ];

  return (
    <FeaturesSection
      mediaUrl="https://yellowcherry.uk/wp-content/uploads/2022/05/website-design-animation-scene-2023-11-27-05-26-42-utc1.gif"
      mediaAlt="Probe STEM Features"
      isGif={true}
      imagePosition={imagePosition}
      backgroundColor="bg-white"
      textColor="text-gray-900"
      features={features}
    />
  );
};

export default FeaturesDemo;
