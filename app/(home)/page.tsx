"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { Plane } from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import TravelHero from "@/components/home/TravelHero";
import { cn } from "@/lib/utils";

export default function Home() {
  const [step, setStep] = useState(0); // 0: initial, 1: arc+plane, 2: logo, 3: text/CTA
  const progress = useMotionValue(0);

  const arcCenterX = 490;
  const arcCenterY = 390;
  const arcRadius = 380;

  const cx = useTransform(progress, t => arcCenterX + arcRadius * Math.cos(Math.PI * (1 - t)));
  const cy = useTransform(progress, t => arcCenterY - arcRadius * Math.sin(Math.PI * (1 - t)));

  const angle = useTransform(progress, t => {
    const theta = Math.PI + Math.PI * t;
    const dx = -arcRadius * Math.PI * Math.sin(theta);
    const dy = arcRadius * Math.PI * Math.cos(theta);
    return (Math.atan2(dy, dx) * 180) / Math.PI + 40;
  });

  // Animation sequence control
  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 500);
      return () => clearTimeout(t);
    }
    if (step === 1) {
      const controls = animate(progress, 1, {
        duration: 2,
        ease: "easeInOut",
        onComplete: () => setStep(2),
      });
      return () => controls.stop();
    }
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 500);
      return () => clearTimeout(t);
    }
  }, [step]);

  const arcPath = "M 120 400 A 380 380 0 0 1 880 400";

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background illustration / video - full bleed edge-to-edge */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src="https://pollen-batch-41236914.figma.site/_components/v2/f0ee2dae7671c170c34f12e31c4cb41418976c98/769c564298c132f7919405cd9f17c1b1231f341d.769c5642.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Main Hero Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <motion.section
          className="flex flex-col items-center justify-center w-full h-full relative"
          layout
        >
          <motion.article
            layout
            className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden"
          >
            {/* Dotted Arc and Plane Icon */}
            <svg
              viewBox="0 0 1000 500"
              className="pointer-events-none absolute top-0 left-0 w-full h-full"
            >
              <motion.path
                d={arcPath}
                stroke="#8c6d58"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 10"
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
              {/* Animated Plane Icon moving along the arc - step 1 and after */}
              {step >= 1 && (
                <motion.g
                  style={{
                    translateX: cx,
                    translateY: cy,
                    rotate: angle,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plane className="text-transparent fill-[#c86d51]" height={24} width={24} />
                </motion.g>
              )}
            </svg>

            {/* Main Centerpiece Content */}
            <motion.div
              className="h-2/3 md:w-3/4 w-full relative z-10 flex flex-col items-center justify-center mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 30 }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-h-[75vh] max-w-[80vw] w-full h-full flex items-center justify-center mx-auto">
                <TravelHero />
              </div>
            </motion.div>

            {/* Centered CTA Button */}
            <motion.div
              className="absolute bottom-12 z-20 flex flex-col items-center justify-center p-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 30 }}
              transition={{ duration: 0.7 }}
            >
              <Link href="/dashboard">
                <InteractiveHoverButton className="border-2 border-[#b55c41] shadow-2xl shadow-[#c86d51]/30">
                  Get Started
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          </motion.article>
        </motion.section>
      </div>
    </div>
  );
}

