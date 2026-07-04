import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function StatsCounter({ value, suffix = "", duration = 2.5 }) {
  const elementRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const targetElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const progressObj = { val: 0 };
          gsap.to(progressObj, {
            val: value,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
              setCount(Math.ceil(progressObj.val));
            },
          });
          observer.unobserve(targetElement);
        }
      },
      { threshold: 0.2 }
    );

    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.disconnect();
      }
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className="font-serif">
      {count}
      {suffix}
    </span>
  );
}
