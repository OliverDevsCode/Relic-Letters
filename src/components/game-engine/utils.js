/**
 * Callback function passed to loadStrings. 
 * 'linesArray' is an array where each item is one line of the text file.
 */
function parseTileFile(linesArray) {
  for (let line of linesArray) {
    line = line.trim();
    
    if (line === '') continue;
    
    let parts = line.split('#');
    let dataPart = parts[0].trim();
    let namePart = parts[1] ? parts[1].trim() : 'unknown';
    
    let values = dataPart.split(',').map(v => parseInt(v.trim()));
    
    if (values.length >= 5) {
      let id = values[0];
      
      tileMap[id] = {
        id: id,
        x: values[1],
        y: values[2],
        w: values[3],
        h: values[4],
        name: namePart
      };
    }
  }
}

/**
 * Reusable layout parser that reads a raw CSV array of strings 
 * containing both #TERRAIN and #OBJECTS.
 */
function parseMapFile(linesArray) {
  let terrainGrid = [];
  let objectList = [];
  let hitboxList = [];
  let currentSection = "";

  for (let line of linesArray) {
    line = line.trim();
    
    if (line === "") continue;
    
    // Toggle processing state based on headers
    if (line === "#TERRAIN") {
      currentSection = "terrain";
      continue;
    } else if (line === "#OBJECTS") {
      currentSection = "objects";
      continue;
    }
    else if (line === "#HITBOXES") {
      currentSection = "hitboxes";
      continue;
    }
    
    // Ignore descriptive structural comments
    if (line.startsWith("#")) continue;
    
    // Split the CSV comma values safely
    let values = line.split(',').map(v => parseInt(v.trim()));
    if(currentSection === "hitboxes"){
      values[0] = line.split(',')[0];
    }
    
    if (currentSection === "terrain") {
      terrainGrid.push(values);
    } else if (currentSection === "objects") {
      if (values.length >= 3) {
        objectList.push({
          id: values[0],
          tileX: values[1],
          tileY: values[2]
        });
      }
    }else if (currentSection === "hitboxes") {
      if (values.length >= 3) {
        hitboxList.push({
          id: values[0],
          tileX: values[1],
          tileY: values[2]
        });
      }
    }
  }

  // Returns the object package straight into your 'outdoorData' variable
  return {
    terrain: terrainGrid,
    objects: objectList,
    hitboxes: hitboxList
  };
}
