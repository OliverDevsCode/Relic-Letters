import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { gameEngine } from "../p5/engine";
import { useAuth } from "../contexts/authContext";
import "./GameSketch.css";

const GameSketch = React.memo(({ activeModal, setActiveModal }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  
  // Consuming custom Auth states
  const { userLoggedIn, currentUser } = useAuth();

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

      if (event.type === "OPEN_DRAWER_INTERFACE") {
        setActiveModal("DRAWER_COMPONENT");
      }
      
      if (event.type === "OPEN_POST_OFFICE") {
        if (userLoggedIn) {
          setActiveModal("POST_OFFICE");
        } else {
          setActiveModal("AUTH_REQUIRED");
        }
      }
    };
  }, [userLoggedIn, setActiveModal]);

  // 3. The canvas engine setup hook only runs once on component mount
  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = "";
    if (instanceRef.current) {
      try { instanceRef.current.remove(); } catch (e) {}
      instanceRef.current = null;
    }

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
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Game Canvas Mount Node - no modals here to prevent p5 interference */}
      <div ref={containerRef} style={{ display: "block" }} />
    </div>
  );
});

export default GameSketch;