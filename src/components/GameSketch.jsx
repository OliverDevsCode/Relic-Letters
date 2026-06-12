import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { gameEngine } from "../p5/engine";
import { useAuth } from "../contexts/authContext";
import { fetchFCMToken } from "../utils/useNotifications";
import "./GameSketch.css";

const GameSketch = React.memo(({ activeModal, setActiveModal }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  
  // Consuming custom Auth states
  const { userLoggedIn, currentUser } = useAuth();
  
  //  1. Create a mutable ref to hold the latest game action logic
  const gameActionRef = useRef(null);
  const gameResetRef = useRef(null);

  //  2. Keep the action ref pointing to the absolute latest React state values
  useEffect(() => {
    gameActionRef.current = (event) => {
      if (event.type === "ENTER_HOUSE") {
        if (userLoggedIn) {
          const userId = currentUser.uid;

          fetchFCMToken(userId);
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

      if (event.type === "OPEN_POST_OPTIONS") {
        setActiveModal("POSTCAT_COMPONENT");
      }

      if (event.type === "NOTIFICATION_INTERFACE") {
        setActiveModal("NOTIFICATION_COMPONENT");
      }

      if (event.type === "SECRET_INTERFACE") {
        setActiveModal("SECRET_COMPONENT");
      }
      
      if (event.type === "OPEN_POST_OFFICE") {
        if (userLoggedIn) {
          const userId = currentUser.uid;
          fetchFCMToken(userId);
          const p5Instance = instanceRef.current;
          if (p5Instance && p5Instance._gameEngineContext) {
            const ctx = p5Instance._gameEngineContext;
            ctx.currentMap = ctx.postOfficeMap;
            ctx.currentCam = ctx.postOfficeCam;
            ctx.currentMapData = ctx.postOfficeData;
            
            // Calculate pixel coordinates based on actual map tile positions
            // Tile (6, 9) is the ideal bottom-center entrance on your wood floor
            const spawnTileX = 6;
            const spawnTileY = 7;
            const tileSize = ctx.tile_size * ctx.scale;
            
            const targetX = spawnTileX * tileSize;
            const targetY = spawnTileY * tileSize;

            if (ctx.mainSprite) {
              ctx.mainSprite.x = targetX;
              ctx.mainSprite.y = targetY;
            } else if (p5Instance.mainSprite) {
              p5Instance.mainSprite.x = targetX;
              p5Instance.mainSprite.y = targetY;
            }
          }
        } else {
          setActiveModal("AUTH_REQUIRED");
        }
      }
    };

    gameResetRef.current = () => {
      const p5Instance = instanceRef.current;
      const ctx = p5Instance?._gameEngineContext;
      const targetSprite = ctx?.mainSprite || p5Instance?.mainSprite;

      if (p5Instance && targetSprite) {
        // Read directly from the live p5 canvas dimensions 
        // instead of depending on React state parameters
        targetSprite.x = p5Instance.width / 2; 
        targetSprite.y = p5Instance.height / 2;
        
        console.log("Cat reset successfully to:", targetSprite.x, targetSprite.y);
      } else {
        console.warn("Could not reset player: Game engine context or sprite is not fully loaded yet.");
      }
    };

  }, [userLoggedIn, setActiveModal]);

  const handleResetClick = () => {
    if (gameResetRef.current) {
      gameResetRef.current();
    }
  };

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
  <div className="game-container-wrapper">
    {/* Game Canvas Mount Node */}
    <div ref={containerRef} />
    {/* Reset Button */}
    <button className="reset-sprite-pos" onClick={handleResetClick}>Reset Cat</button>
  </div>
  );
});

export default GameSketch;