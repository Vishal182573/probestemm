"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface BulletPoint {
  text: string;
  link: string;
}

interface AnimatedBulletListProps {
  bulletPoints: BulletPoint[];
  className?: string;
}

const AnimatedBulletList: React.FC<AnimatedBulletListProps> = ({
  bulletPoints,
  className = "",
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const animationRef = useRef<number | null>(null);
  const speedRef = useRef<number>(0.5); // pixels per frame
  const lastTimeRef = useRef<number>(0);
  
  useEffect(() => {
    if (containerRef.current) {
      // Calculate total list height of the first list only
      const firstList = containerRef.current.querySelector('ul');
      if (firstList) {
        setListHeight(firstList.scrollHeight);
      }
    }
  }, [bulletPoints]);

  const animate = (time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    if (!isHovering) {
      let newY = y.get() - speedRef.current * (delta / 16.67); // normalize to 60fps
      
      // Reset position when it reaches the end of first list
      if (Math.abs(newY) >= listHeight) {
        newY = 0;
      }
      
      y.set(newY);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (listHeight > 0) {
      // Calculate speed based on list height to complete one cycle in 20 seconds
      speedRef.current = listHeight / (20 * 60); // 20 seconds at 60fps
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [listHeight, isHovering]);

  return (
    <div 
      className={`relative overflow-hidden rounded-lg border border-white/20 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={containerRef}
    >
      <motion.div
        className="absolute w-full"
        style={{ y }}
      >
        <ul className="list-none p-0 m-0">
          {bulletPoints.map((point, index) => (
            <li key={index} className="mb-6">
              <Link href={point.link} className="no-underline">
                <div className="flex items-center text-white hover:underline text-xl py-2 px-4 rounded-lg text-start">
                  <div className="min-w-[8px] w-2 h-2 rounded-full bg-white mr-2 flex-shrink-0"></div>
                  <span>{point.text}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Duplicate the list to create a seamless loop */}
        <ul className="list-none p-0 m-0">
          {bulletPoints.map((point, index) => (
            <li key={`duplicate-${index}`} className="mb-6">
              <Link href={point.link} className="no-underline">
                <div className="flex items-center text-white hover:underline text-xl py-2 px-4 rounded-lg text-start">
                  <div className="min-w-[8px] w-2 h-2 rounded-full bg-white mr-2 flex-shrink-0"></div>
                  <span>{point.text}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AnimatedBulletList;