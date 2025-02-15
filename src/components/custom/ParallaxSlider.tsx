import { useState, useEffect, useRef, SetStateAction } from 'react';
import { motion } from 'framer-motion';

// TypeScript type definition for a slide (optional, but good practice)
type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

interface ParallaxSliderProps {
  slides: Slide[];
}

export default function ParallaxSlider({ slides }: ParallaxSliderProps) {
  // State to manage values that change over time and are used in rendering
  const [inView, setInView] = useState(false);  // Tracks if the component is in the viewport
  const [yValue, setYValue] = useState('0%'); // Stores the calculated 'y' transform value

  // Ref to attach to the motion.div, needed for IntersectionObserver
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Browser-Only Execution Block ---
    // This entire block ONLY runs in the browser, not during SSR
    if (typeof window !== 'undefined') {

      // 1. Asynchronously import framer-motion and react-intersection-observer.
      //    This is the most robust way to prevent SSR issues.  Even though
      //    framer-motion *should* handle SSR, this is an extra layer of safety.
      async function loadAndInitialize() {

        // 2. Get the necessary hooks and functions
        const { useScroll, useTransform } = require('framer-motion'); // Use require inside async/await for CJS modules
        const { useInView } = require('react-intersection-observer');

        // 3. Set up scroll tracking and the y transform
        const { scrollYProgress } = useScroll();
        const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

        // 4. Set up Intersection Observer
        const [ref, view] = useInView({ triggerOnce: true });
        setInView(view);          // Update state when inView changes

        // 5. VERY IMPORTANT: Attach the ref from useInView to our containerRef
        //    This ensures that the IntersectionObserver is observing the correct element
        if (containerRef.current) {
          containerRef.current = ref.current
        }

        // 6. Subscribe to changes in the 'y' value and update state
        const unsubscribeY = y.onChange((latest: SetStateAction<string>) => {
          setYValue(latest);
        });

        // --- Cleanup Function ---
        // This runs when the component unmounts or before the effect re-runs
        return () => {
          unsubscribeY(); // Unsubscribe from the 'y' value changes
          // No need to manually unobserve with react-intersection-observer, it handles it
        };
      }

      loadAndInitialize(); // Call the async function
    }
    // --- End of Browser-Only Execution Block ---

  }, []); // Empty dependency array: This effect runs ONLY ONCE after the initial render


  // --- Render Method ---
  // This part is executed both during SSR (with limited data) and in the browser
  return (
    <div className="h-screen overflow-hidden relative">
      <motion.div
        style={{ y: yValue }}  // Use the state-managed 'yValue' for the transform
        className="absolute inset-0 flex flex-col"
      >
        {slides.map((slide, index) => (
          <section
            key={index}
            className="h-screen w-full flex items-center justify-center relative"
          >
            <motion.div
              ref={containerRef} // Attach the ref to the motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}} // Use state-managed inView
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="relative z-10 text-center text-white">
              <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl">{slide.subtitle}</p>
            </div>
          </section>
        ))}
      </motion.div>
    </div>
  );
}