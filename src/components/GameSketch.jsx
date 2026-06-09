import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { gameEngine } from "../p5/engine";
import AuthPopup from "./AuthPopUp/AuthPopup";
import { useAuth } from "../contexts/authContext"; 

const GameSketch = React.memo(() => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  
  // Consuming custom Auth states
  const { userLoggedIn, currentUser } = useAuth();
  
  // UI Overlays state
  const [activeModal, setActiveModal] = useState(null); 

  //  1. Create a mutable ref to hold the latest game action logic
  const gameActionRef = useRef(null);

  //  2. Keep the action ref pointing to the absolute latest React state values
  useEffect(() => {
    gameActionRef.current = (event) => {
      if (event.type === "ENTER_HOUSE") {
        if (userLoggedIn) {
          const p5Instance = instanceRef.current;
          if (p5Instance && p5Instance._gameEngineContext) {
            const ctx = p5Instance._gameEngineContext;
            ctx.currentMap = ctx.indoorMap;
            ctx.currentCam = ctx.indoorCam;
            ctx.currentMapData = ctx.indoorData;
            
            if (ctx.mainSprite) {
              const size = ctx.tile_size * ctx.scale;
              ctx.mainSprite.x = 6 * size; 
              ctx.mainSprite.y = 9 * size;
            } else if (p5Instance.mainSprite) {
              const size = ctx.tile_size * ctx.scale;
              p5Instance.mainSprite.x = 6 * size;
              p5Instance.mainSprite.y = 9 * size;
            }
          }
        } else {
          setActiveModal("AUTH_REQUIRED");
        }
      }
      
      if (event.type === "OPEN_WRITE_INTERFACE") {
        setActiveModal("WRITE_COMPONENT");
      }
      
      if (event.type === "OPEN_POST_OFFICE") {
        if (userLoggedIn) {
          setActiveModal("POST_OFFICE");
        } else {
          // This will now reliably catch and launch instantly!
          setActiveModal("AUTH_REQUIRED");
        }
      }
    };
  }, [userLoggedIn]); // Updates the internal ref function automatically when logging status swaps

  // 3. The canvas engine setup hook only runs once on component mount
  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    if (instanceRef.current) {
      try { instanceRef.current.remove(); } catch (e) {}
      instanceRef.current = null;
    }

    // A static proxy wrapper that passes commands directly through your dynamic ref structure
    const proxyGameAction = (event) => {
      if (gameActionRef.current) {
        gameActionRef.current(event);
      }
    };

    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        instanceRef.current = new p5(
          (p) => gameEngine(p, { onTriggerAction: proxyGameAction }), 
          containerRef.current
        );
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (instanceRef.current) {
        try { instanceRef.current.remove(); } catch (e) {}
        instanceRef.current = null;
      }
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []); // Empty dependencies mean the canvas never glitches or rebuilds unprompted!

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Standard Game Canvas Mount Node */}
      <div ref={containerRef} style={{ display: "block" }} />

      {/* 2. React UI Overlays */}
      {activeModal === "AUTH_REQUIRED" && (
        <AuthPopup onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "WRITE_COMPONENT" && (
        <div className="retro-modal-overlay">
          <div className="retro-modal-content">
            <h2>Writing Desk</h2>
            <textarea placeholder="Compose your rustic letter..." rows="5" style={{ width: "100%", fontFamily: "monospace" }} />
            <button onClick={() => setActiveModal(null)} className="counter" style={{ marginTop: "10px" }}>Finish</button>
          </div>
        </div>
      )}

      {activeModal === "POST_OFFICE" && (
        <div className="retro-modal-overlay">
          <div className="retro-modal-content">
            <h2>Post Office</h2>
            <p>Welcome to the local sorting office!</p>
            <button onClick={() => setActiveModal(null)} className="counter">Leave Office</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default GameSketch;