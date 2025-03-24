import { AnimatePresence, motion } from "framer-motion";

import { Container } from "./container";
import { Motion } from "./motion";
import { Pagination } from "./pagination";

import { SliderProps } from "../types";

export const Slider = ({ title, loading, children, totalPage, className, parentClassName, page, setPage }: SliderProps) => {
  return (
    <Container className={parentClassName ?? ""}>
      <div className="flex items-center justify-between">
        <Motion tag="h3" initialX={-50} animateX={0} duration={0.4} className="heading">
          {title}
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.8} delay={0.4}>
          <Pagination page={page} totalPage={totalPage} setPage={setPage} />
        </Motion>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="loader size-16 after:size-16"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className={className ?? ""}>
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </Container>
  );
};
