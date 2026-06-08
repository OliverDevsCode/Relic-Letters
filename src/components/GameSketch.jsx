import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { gameEngine } from "../p5/engine";

const GameSketch = React.memo(() => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    // Aggressively clear any existing canvas first
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Remove any orphaned p5 instances
    if (instanceRef.current) {
      try {
        instanceRef.current.remove();
      } catch (e) {
        console.warn("Error removing p5 instance:", e);
      }
      instanceRef.current = null;
    }

    // Small delay to ensure DOM is fully cleared
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        instanceRef.current = new p5(gameEngine, containerRef.current);
      }
    }, 0);

    // CRITICAL CLEANUP:
    return () => {
      clearTimeout(timeoutId);
      if (instanceRef.current) {
        try {
          instanceRef.current.remove();
        } catch (e) {
          console.warn("Error during cleanup:", e);
        }
        instanceRef.current = null;
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
      <div ref={containerRef} className="canvas-wrapper-container" />
    </div>
  );
});

export default GameSketch;