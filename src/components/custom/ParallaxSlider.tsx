import React, { useState, useEffect, useRef } from 'react';

// TypeScript type definition for a slide (optional, but good practice)
type Slide = {
  image: string;
  title: string;
  description: string;
};

interface ParallaxSliderProps {
  slides: Slide[];
}

export default function ParallaxSlider({ slides }: ParallaxSliderProps) {
  // State to manage values that change over time and are used in rendering
  const [inView, setInView] = useState(false);  // Tracks if the component is in the viewport
  const [yValue, setYValue] = useState('0%'); // Stores the calculated 'y' transform value
  const [MotionDiv, setMotionDiv] = useState<any>(null); //To store and use motion.div

  // Ref to attach to the motion.div, needed for IntersectionObserver
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Browser-Only Execution Block ---
    if (typeof window !== 'undefined') {

      // 1. Asynchronously import framer-motion and react-intersection-observer.
      //    This is the most robust way to prevent SSR issues.
      async function loadAndInitialize() {
        try {
          // 2. Get the necessary hooks and functions
          const { motion, useScroll, useTransform } = await import('framer-motion');
          const { useInView } = await import('react-intersection-observer');

          // 3. Set up scroll tracking and the y transform
          const { scrollYProgress } = useScroll();
          const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

          // 4. Set up Intersection Observer
          const [ref, view] = useInView({ triggerOnce: true });
          setInView(view);

          setMotionDiv(motion.div);

          // 5. Apply the ref function to our container
          if (containerRef.current) {
            ref(containerRef.current);
          }

          // 6. Subscribe to changes in the 'y' value and update state
          const unsubscribeY = y.onChange((latest: string) => {
            setYValue(latest);
          });

          return () => {
            unsubscribeY();
          };
        } catch (error) {
          console.error('Error initializing ParallaxSlider:', error);
        }
      }

      loadAndInitialize();
    }
  }, []);

  // Conditionally render based on whether MotionDiv has been loaded
  if (!MotionDiv) {
    return null; // Or a loading spinner, etc.
  }

  return (
    <div className="h-screen overflow-hidden relative">
      <MotionDiv
        style={{ y: yValue }}
        className="absolute inset-0 flex flex-col"
      >
        {slides.map((slide, index) => (
          <section
            key={index}
            className="h-screen w-full flex items-center justify-center relative"
          >
            <MotionDiv
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </section>
        ))}
      </MotionDiv>
    </div>
  );
}