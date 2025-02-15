import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

interface ParallaxSliderProps {
  slides: Slide[];
}

export default function ParallaxSlider({ slides }: ParallaxSliderProps) {
  const [inView, setInView] = useState(false);
  const [yValue, setYValue] = useState('0%');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { scrollYProgress } = useScroll();
      const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
      const [ref, view] = useInView({ triggerOnce: true });

      setInView(view);
      if (containerRef.current) {
        ref(containerRef.current); // Apply the ref function directly
      }

      const unsubscribeY = y.onChange((latest) => {
        setYValue(latest);
      });

      return () => {
        unsubscribeY();
      };
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden relative">
      <motion.div
        style={{ y: yValue }}
        className="absolute inset-0 flex flex-col"
      >
        {slides.map((slide, index) => (
          <section
            key={index}
            className="h-screen w-full flex items-center justify-center relative"
          >
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
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