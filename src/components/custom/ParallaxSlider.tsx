import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

export default function ParallaxSlider({ slides }: { slides: Slide[] }) {
  const { scrollYProgress } = useScroll();
  const [ref, inView] = useInView({ triggerOnce: true });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '-50%']
  );

  return (
    <div className="h-screen overflow-hidden relative">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 flex flex-col"
      >
        {slides.map((slide, index) => (
          <section 
            key={index}
            className="h-screen w-full flex items-center justify-center relative"
          >
            <motion.div
              ref={ref}
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
