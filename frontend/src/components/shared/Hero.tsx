// Import necessary dependencies and components
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Monitor, Book, Users, PenTool, Lightbulb, GraduationCap } from 'lucide-react';
import Link from 'next/link';

// Main Hero Section Component
const HeroSection = () => {
  // State to track current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of slide data containing titles and icons for each slide
  const slides = [
    {
      title: "Connect, stay informed and learn no matter where you are",
      icon1: <Monitor className="w-20 h-20 text-orange-600" />,
      icon2: <Book className="w-16 h-16 text-orange-400" />,
      icon3: <Users className="w-18 h-18 text-orange-300" />,
    },
    {
      title: "Engage in interactive lessons and collaborative projects",
      icon1: <PenTool className="w-20 h-20 text-orange-600" />,
      icon2: <Lightbulb className="w-16 h-16 text-orange-400" />,
      icon3: <Users className="w-18 h-18 text-orange-300" />,
    },
    {
      title: "Achieve your learning goals with personalized guidance",
      icon1: <GraduationCap className="w-20 h-20 text-orange-600" />,
      icon2: <Lightbulb className="w-16 h-16 text-orange-400" />,
      icon3: <Users className="w-18 h-18 text-orange-300" />,
    },
  ];

  // Effect hook to automatically rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    // Main section with gradient background and full viewport height
    <section className="bg-gradient-to-r from-orange-100 to-orange-50 min-h-[80vh] flex items-center relative">
      <div className="container mx-auto px-4">
        {/* Carousel component for slide transitions */}
        <Carousel className="w-full max-w-6xl mx-auto transition-all duration-700">
          <CarouselContent>
            {/* Map through slides array to render each slide */}
            {slides.map((slide, index) => (
              <CarouselItem key={index} className={`transition-opacity  ease-in-out duration-1000`}>
                {/* Flex container for slide content */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  {/* Left side content with title and CTA buttons */}
                  <div className="md:w-1/2 mb-10 md:mb-0">
                    {/* Main heading with slide title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-orange-600 leading-tight">
                      {slide.title}
                    </h1>
                    {/* Call-to-action buttons container */}
                    <div className="flex space-x-4 mt-6">
                      {/* Teacher signup button */}
                      <Link href={"/teacher-profile"}>
                        <Button
                          variant="default"
                          size="lg"
                          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-2xl transform transition-transform duration-200 hover:scale-105"
                        >
                          Join as Teacher
                        </Button>
                      </Link>
                      {/* Student signup button */}
                      <Link href={"/student-profile"}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white shadow-lg hover:shadow-2xl transform transition-transform duration-200 hover:scale-105"
                        >
                          Join as Student
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {/* Commented out right side content with icons
                  This section can be uncommented to show decorative icons
                  <div className="md:w-1/2 flex justify-end relative">
                    ... existing code ...
                  </div> */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Slide indicators/dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {/* Map through slides to create indicator dots */}
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-orange-600' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Export the component as default
export default HeroSection;
