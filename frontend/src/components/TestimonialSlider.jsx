import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "./ui/button";

export default function TestimonialSlider({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto" data-testid="testimonial-slider">
      <div className="overflow-hidden py-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="testimonial-card bg-secondary/30 border border-white/10 rounded-3xl p-8 md:p-12"
            data-testid={`testimonial-${currentIndex}`}
          >
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-primary/30 mb-6" />

            {/* Content */}
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8">
              "{currentTestimonial.content}"
            </p>

            {/* Rating */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < currentTestimonial.rating ? "text-accent fill-accent" : "text-muted-foreground"}
                />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img
                src={currentTestimonial.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=38BDF8&color=fff`}
                alt={currentTestimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
              />
              <div>
                <h4 className="font-semibold text-foreground">{currentTestimonial.name}</h4>
                <p className="text-muted-foreground text-sm">{currentTestimonial.company}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          className="rounded-full w-12 h-12 border-white/10 hover:border-primary hover:bg-primary/10"
          aria-label="Témoignage précédent"
          data-testid="testimonial-prev"
        >
          <ChevronLeft size={20} />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
              data-testid={`testimonial-dot-${index}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="rounded-full w-12 h-12 border-white/10 hover:border-primary hover:bg-primary/10"
          aria-label="Témoignage suivant"
          data-testid="testimonial-next"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
