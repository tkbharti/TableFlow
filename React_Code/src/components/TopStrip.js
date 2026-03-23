import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../context/LoadingContext";

export default function TopStrip() {
  const { loading } = useLoading();

  return (
     
    <AnimatePresence mode="wait">
      {loading && (
    <motion.div
          key="processing-strip"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          exit={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "linear" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "4px",
            zIndex: 999999,
            background: `
              linear-gradient(
                90deg, 
                #15A5FF ,
                #3091d5 ,
                #15A5FF ,
                #3091d5 ,
                #15A5FF 
              )
            `,
            backgroundSize: "300% 100%",
            animation: "stripFlow 2s linear infinite",
            boxShadow: `
              0 0 6px rgba(255,255,255,0.8),
              0 0 12px rgba(0,0,0,0.6)
            `,
          }}
        />
      )}
    </AnimatePresence> 
  );
}
