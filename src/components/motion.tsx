import * as React from "react";

import { motion } from "framer-motion";

import { useInView } from "react-intersection-observer";

import { MotionComponentProps } from "../types";

export const Motion = React.forwardRef<HTMLElement, MotionComponentProps>(
  ({ children, className, tag = "div", initialY = 0, animateY = 0, initialX = 0, animateX = 0, duration = 0.5, delay = 0, ...rest }, ref) => {
    const [inViewRef, inView] = useInView({
      threshold: 0,
      triggerOnce: false,
    });

    const setRefs = (node: HTMLElement) => {
      if (ref) {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      }
      inViewRef(node);
    };

    const Component: React.ElementType = motion[tag as keyof typeof motion];

    return (
      <Component
        ref={setRefs}
        initial={{ opacity: 0, y: initialY, x: initialX }}
        animate={{
          opacity: inView ? 1 : 0,
          y: inView ? animateY : initialY,
          x: inView ? animateX : initialX,
        }}
        transition={{ duration, delay }}
        className={`${className ?? ""}`}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Motion.displayName = "Motion";
