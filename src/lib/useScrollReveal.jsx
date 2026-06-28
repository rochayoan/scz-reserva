import { useEffect, useRef, useState } from "react";

/**
 * Hook que detecta cuando un elemento entra en el viewport.
 * Retorna { ref, isVisible }.
 */
export function useScrollReveal({ threshold = 0.1, rootMargin = "0px 0px -60px 0px" } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

/**
 * Componente wrapper: el contenido aparece con fade-in-up
 * cuando entra al viewport.
 *
 * Uso: <ScrollReveal delay={200}><Section>...</Section></ScrollReveal>
 */
export default function ScrollReveal({ children, delay = 0, className = "" }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
