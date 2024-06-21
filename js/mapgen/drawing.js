/**
 * Draws a small pixel on the canvas at the specified coordinates with the given color.
 *
 * @param {CanvasRenderingContext2D} context - The canvas rendering context.
 * @param {number} x - The x-coordinate where the pixel will be drawn.
 * @param {number} y - The y-coordinate where the pixel will be drawn.
 * @param {string} color - The color of the pixel. Defaults to black if not specified.
 */
function drawSmallPixel(context, x, y, color) {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    context.fillStyle = color || '#000';
    context.fillRect(roundedX * world.pixelSize, roundedY * world.pixelSize, world.pixelSize, world.pixelSize);
  }
  
  /**
   * Draws a tiny pixel on the canvas at the specified coordinates with the given color.
   *
   * @param {CanvasRenderingContext2D} context - The canvas rendering context.
   * @param {number} x - The x-coordinate where the pixel will be drawn.
   * @param {number} y - The y-coordinate where the pixel will be drawn.
   * @param {string} color - The color of the pixel. Defaults to black if not specified.
   */
  function drawTinyPixel(context, x, y, color) {
    context.fillStyle = color || '#000';
    context.fillRect(x, y, 1, 1);
  }

/**
 * Draws a cell on the canvas based on the world's drawing type and the cell's properties.
 *
 * @param {number} x - The x-coordinate of the cell.
 * @param {number} y - The y-coordinate of the cell.
 */
function drawCell(x, y) {
    const type = world.drawingType;
    const cell = xy(x, y);
  
    const { r, g, b } = getRGBFromElevation(cell.elevation);
  
    if (type === "book") {
      drawBookType(cell);
    } else if (type === "parchment") {
      drawParchmentType(cell, r, g, b);
    } else if (type === "paper") {
      drawPaperType(cell, r, g, b);
    } else if (type === "papyrus") {
      drawPapyrusType(cell, r, g, b);
    } else if (type === "colorful") {
      drawColorfulType(cell);
    } else if (type === "heightmap") {
      drawHeightmapType(cell);
    } else if (type === "rivermap") {
      drawRivermapType(cell);
    } else {
      drawSpecialType(cell, type);
    }
  }
  
  /**
   * Calculates RGB values from the elevation.
   *
   * @param {number} elevation - The elevation of the cell.
   * @returns {Object} An object containing the r, g, and b values.
   */
  function getRGBFromElevation(elevation) {
    return {
      r: Math.floor((elevation / 10) * 8),
      g: Math.floor((elevation / 10) * 6),
      b: Math.floor((elevation / 10) * 4),
    };
  }
  
  /**
   * Draws a cell of "book" type.
   *
   * @param {Object} cell - The cell to draw.
   */
  function drawBookType(cell) {
    drawSmallPixel(ctx, cell.x, cell.y, "rgb(0, 0, 0)");
  
    const cellBiome = biome(cell);
  
    if (cellBiome === "beach") {
      cell.rgb = `rgb(${194 - cell.elevation * 3}, ${178 - cell.elevation * 3}, ${128 - cell.elevation * 3})`;
    } else if (cellBiome === "lake" || cellBiome === "river") {
      cell.rgb = `rgb(0, 0, ${350 - cell.elevation})`;
    } else if (cellBiome === "mountain") {
      const mountainMod = cell.elevation - limits.mountains.lower;
      cell.rgb = `rgb(${mountainMod}, ${mountainMod}, ${mountainMod})`;
    } else if (cellBiome === "arctic") {
      const el = cell.elevation;
      cell.rgb = `rgb(${355 - el}, ${355 - el}, ${355 - el})`;
    } else if (cellBiome === "desert") {
      const el = cell.elevation;
      cell.rgb = `rgb(${Math.floor(194 * (el / 255))}, ${Math.floor(178 * (el / 255))}, ${Math.floor(128 * (el / 255))})`;
    } else if (cellBiome === "grass") {
      drawGrassBookType(cell);
    } else if (cellBiome === "ocean") {
      const waterMod = 255 - Math.floor(getCorrectedColor(cell) * 0.6);
      cell.rgb = `rgb(0, 0, ${waterMod})`;
    }
  
    if (cell.tree) {
      drawInkTree(cell);
    }
    if (cell.text) {
      ctx.fillStyle = cell.rgb;
      ctx.font = "32px serif";
      ctx.fillText(cell.text, cell.x * world.pixelSize, cell.y * world.pixelSize);
    }
  }
  
  /**
   * Draws a grass cell of "book" type.
   *
   * @param {Object} cell - The cell to draw.
   */
  function drawGrassBookType(cell) {
    const correctedColor = getCorrectedColor(cell);
    let grassAccent = 0;
    let grassAccent2 = 0;
    let grass = correctedColor;
    let grassAlpha;
  
    if (grass > 100) {
      const diff = Math.floor(grass - 100);
      grassAccent = grass - 100;
      grassAccent2 = Math.floor(grassAccent * 1.3);
      grass -= Math.floor(diff / 2.5);
      const m = Math.max(1, Math.floor(cell.elevation / 25));
      grassAlpha = `0.${m}`;
    }
    cell.rgb = `rgb(${grassAccent2}, ${grass}, ${grassAccent})`;
  }
  
  /**
   * Draws a cell of "parchment" type.
   *
   * @param {Object} cell - The cell to draw.
   * @param {number} r - The red color component.
   * @param {number} g - The green color component.
   * @param {number} b - The blue color component.
   */
  function drawParchmentType(cell, r, g, b) {
    const cellBiome = biome(cell);
  
    if (cellBiome === "beach") {
      cell.rgb = `rgb(0, 0, 0)`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else if (cell.wetlands) {
      cell.rgb = `rgb(255, 255, 255)`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
      drawInkMarsh(cell);
    } else if (cellBiome === "river" || cellBiome === "lake" || cellBiome === "ocean") {
      cell.rgb = `rgb(200, 200, 200)`;
      mapOutline(ctx, cell.x * world.pixelSize, cell.y * world.pixelSize, cell.rgb, cell);
    } else if (cellBiome === "mountain") {
      cell.rgb = `rgb(255, 255, 255)`;
      drawInkMountain(cell);
    } else if (cell.tree) {
      cell.rgb = `rgb(255, 255, 255)`;
      drawInkTree(cell);
    } else {
      cell.rgb = `rgb(255, 255, 255)`;
    }
  }
  
  /**
   * Draws a cell of "paper" type.
   *
   * @param {Object} cell - The cell to draw.
   * @param {number} r - The red color component.
   * @param {number} g - The green color component.
   * @param {number} b - The blue color component.
   */
  function drawPaperType(cell, r, g, b) {
    const cellBiome = biome(cell);
  
    if (cellBiome === "beach" || cell.wetlands || cellBiome === "river" || cellBiome === "lake" || cellBiome === "ocean") {
      cell.rgb = `rgb(255, 255, 255)`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else if (cellBiome === "mountain" || cell.tree) {
      cell.rgb = `rgb(255, 255, 255)`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else {
      cell.rgb = `rgb(255, 255, 255)`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    }
  }
  
  /**
   * Draws a cell of "papyrus" type.
   *
   * @param {Object} cell - The cell to draw.
   * @param {number} r - The red color component.
   * @param {number} g - The green color component.
   * @param {number} b - The blue color component.
   */
  function drawPapyrusType(cell, r, g, b) {
    const cellBiome = biome(cell);
  
    if (cellBiome === "lake" || cellBiome === "ocean") {
      cell.rgb = `rgb(${100 + Math.floor(cell.elevation / 5)}, ${120 + Math.floor(cell.elevation / 5)}, ${140 + Math.floor(cell.elevation / 5)})`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else if (cell.tree || cellBiome === "beach" || cellBiome === "mountain" || cellBiome === "arctic") {
      cell.rgb = `rgb(${230 - Math.floor(cell.elevation / 5)}, ${210 - Math.floor(cell.elevation / 5)}, ${183 - Math.floor(cell.elevation / 5)})`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else {
      cell.rgb = `rgb(${230 - Math.floor(cell.elevation / 5)}, ${210 - Math.floor(cell.elevation / 5)}, ${183 - Math.floor(cell.elevation / 5)})`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    }
  }
  
  /**
   * Draws a cell of "colorful" type.
   *
   * @param {Object} cell - The cell to draw.
   */
  function drawColorfulType(cell) {
    const n = noise(cell.x, cell.y);
  
    if (cell.elevation < limits.seaLevel.upper) {
      cell.rgb = `rgb(${100 + Math.floor(cell.elevation / 5)}, ${120 + Math.floor(cell.elevation / 5)}, ${140 + Math.floor(cell.elevation / 5)})`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    }
  
    const cellBiome = biome(cell);
  
    if (cellBiome === "beach") {
      drawBeach(cell);
    } else if (cell.elevation >= limits.mountains.lower) {
      drawMountain(cell);
    } else if (cellBiome === "arctic") {
      drawArctic(cell);
    } else if (cellBiome === "desert") {
      drawDesert(cell);
    } else if (cellBiome === "grass") {
      drawGrass(cell);
    } else if (cellBiome === "ocean") {
      cell.rgb = `rgb(${100 + Math.floor(cell.elevation / 5)}, ${120 + Math.floor(cell.elevation / 5)}, ${140 + Math.floor(cell.elevation / 5)})`;
      drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
    } else {
      drawGrass(cell);
    }
  
    drawRiverTemplateTransparent(cell);
  }
  
  /**
   * Draws a cell of "heightmap" type.
   *
   * @param {Object} cell - The cell to draw.
   */
  function drawHeightmapType(cell) {
    let c = Math.floor(cell.elevation / 2);
    c = Math.min(255, Math.max(0, c));
    cell.rgb = `rgb(${c}, ${c}, ${c})`;
    drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
  }
  
  /**
   * Draws a cell of "rivermap" type.
   *
   * @param {Object} cell - The cell to draw.
   */
  function drawRivermapType(cell) {
    const c = cell.elevation > limits.seaLevel.upper ? "#ffffff" : "#ff0080";
    cell.rgb = c;
    drawSmallPixel(ctx, cell.x, cell.y, cell.rgb);
  }
  
  /**
   * Draws a cell of a special mask type.
   *
   * @param {Object} cell - The cell to draw.
   * @param {string} type - The type of mask.
   */
  function drawSpecialType(cell, type) {
    const maskValue = cell[type];
    if (maskValue) {
      const color = Math.floor((maskValue / 100) * 255);
      drawSmallPixel(ctx, cell.x, cell.y, `rgb(${color}, ${color}, ${color})`);
    } else {
      drawSmallPixel(ctx, cell.x, cell.y, `rgb(0, 0, 0)`);
    }
  }
  
  /**
 * Draws a name on the canvas at the specified coordinates.
 *
 * @param {string} name - The name to be drawn.
 * @param {number} x - The x-coordinate where the name will be drawn.
 * @param {number} y - The y-coordinate where the name will be drawn.
 */
function drawName(name, x, y) {
    ctx.font = "48px Georgia";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText(name, x, y);
  }
  
  /**
   * Draws a beach cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawBeach(cell) {
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(${194 - (cell.elevation * 3)}, ${178 - (cell.elevation * 3)}, ${128 - (cell.elevation * 3)})`);
  }
  
  /**
   * Draws a lake cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawLake(cell) {
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(0, 0, ${getRandomInt(150, 255)})`);
  }
  
  /**
   * Draws a tree cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawTree(cell) {
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(0, ${getRandomInt(25, 75)}, 0)`);
  }
  
  /**
   * Draws a mountain cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawMountain(cell) {
    const mountainMod = cell.elevation - limits.mountains.lower;
    const mountainR = mountainMod;
    const mountainG = mountainMod;
    const mountainB = mountainMod;
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(${mountainR}, ${mountainG}, ${mountainB})`);
  }
  
  /**
   * Draws an arctic cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawArctic(cell) {
    const el = cell.elevation;
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(${355 - el}, ${355 - el}, ${355 - el})`);
  }
  
  /**
   * Draws a desert cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawDesert(cell) {
    const el = cell.elevation;
    const desertR = Math.floor(194 * (el / 255));
    const desertG = Math.floor(178 * (el / 255));
    const desertB = Math.floor(128 * (el / 255));
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(${desertR}, ${desertG}, ${desertB})`);
  }
  
  /**
   * Draws a grass cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawGrass(cell) {
    const correctedColor = getCorrectedColor(cell);
    let grassAccent = 0;
    let grassAccent2 = 0;
    let grass = correctedColor;
    let grassAlpha;
  
    if (grass > 100) {
      const diff = Math.floor(grass - 100);
      grassAccent = grass - 100;
      grassAccent2 = Math.floor(grassAccent * 1.3);
      grass -= Math.floor(diff / 2.5);
      const m = Math.max(1, Math.floor(cell.elevation / 25));
      grassAlpha = `0.${m}`;
    }
    drawSmallPixel(ctx, cell.x, cell.y, `rgba(${grassAccent2}, ${grass}, ${grassAccent})`);
  }
  
  /**
   * Draws an ocean cell on the canvas.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawOcean(cell) {
    const correctedColor = getCorrectedColor(cell);
    const waterMod = 255 - Math.floor(correctedColor * 0.6);
    drawSmallPixel(ctx, cell.x, cell.y, `rgb(0, 0, ${waterMod})`);
  }
  
  /**
 * Draws an ink tree symbol on the canvas at the cell's coordinates.
 *
 * @param {Object} cell - The cell to be drawn.
 */
function drawInkTree(cell) {
    // sprite sheet, 32x32, hand-drawn black ink fantasy map tree symbol on white transparent background
    const roundedX = Math.round(cell.x);
    const roundedY = Math.round(cell.y);
    const img = GID(`tree${getRandomInt(1, 4)}`);
    console.log("DRAWING INK TREE");
    ctx.drawImage(img, roundedX * world.pixelSize, roundedY * world.pixelSize);
  }
  
  /**
   * Draws an ink marsh symbol on the canvas at the cell's coordinates.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawInkMarsh(cell) {
    const roundedX = Math.round(cell.x);
    const roundedY = Math.round(cell.y);
    const img = GID('marsh1');
    ctx.drawImage(img, roundedX * world.pixelSize, roundedY * world.pixelSize);
  }
  
  /**
   * Draws an ink mountain or hill symbol on the canvas at the cell's coordinates
   * based on the cell's elevation.
   *
   * @param {Object} cell - The cell to be drawn.
   */
  function drawInkMountain(cell) {
    const roundedX = Math.round(cell.x);
    const roundedY = Math.round(cell.y);
    let img;
  
    if (cell.elevation < 275) {
      img = GID("hills1");
    } else if (cell.elevation < 295) {
      img = GID("hills2");
    } else if (cell.elevation < 315) {
      img = GID("hills3");
    } else if (cell.elevation < 335) {
      img = GID("hills4");
    } else if (cell.elevation < 375) {
      img = GID("mountain4");
    } else if (cell.elevation < 405) {
      img = GID("mountain3");
    } else if (cell.elevation < 445) {
      img = GID("mountain2");
    } else {
      img = GID("mountain1");
    }
  
    ctx.drawImage(img, roundedX * world.pixelSize, roundedY * world.pixelSize);
  }
  

  /**
 * Draws an outline of a cell on the canvas at the specified coordinates with the given color.
 * The color is determined based on the cell's elevation.
 *
 * @param {CanvasRenderingContext2D} context - The canvas rendering context.
 * @param {number} x - The x-coordinate where the outline will be drawn.
 * @param {number} y - The y-coordinate where the outline will be drawn.
 * @param {string} color - The color of the outline. Defaults to a calculated color if not specified.
 * @param {Object} cell - The cell object containing elevation information.
 */
function mapOutline(context, x, y, color, cell) {
  const r = 100 + Math.floor((cell.elevation / 5));
  const g = 120 + Math.floor((cell.elevation / 5));
  const b = 140 + Math.floor((cell.elevation / 5));
  context.fillStyle = `rgb(${r}, ${g}, ${b})`;
  context.fillRect(x, y, 10, 10);
}

/**
 * Corrects the color of a cell based on its elevation.
 *
 * @param {Object} cell - The cell object containing elevation information.
 * @returns {number} The corrected color value.
 */
function getCorrectedColor(cell) {
  let correctedColor;
  const el = cell.elevation;

  if (el >= limits.seaLevel.upper) {
    correctedColor = el;
  } else {
    correctedColor = el * -1;
  }

  if (correctedColor > 255) {
    correctedColor = 255;
  } else if (correctedColor < -255) {
    correctedColor = -255;
  }

  return correctedColor;
}

/**
 * Draws the heightmap from scratch by iterating over the world map and drawing each cell.
 * If the small map is available, it clears the canvas, fills it with a base color,
 * and then draws each cell. Otherwise, it sets the drawing type to 'heightmap' and redraws the world.
 */
function drawHeightmapFromScratch() {
  if (world.smallMap) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, 8192, 4096);
    ctx.fillStyle = "rgb(75, 75, 75)";
    ctx.fill();
    for (let i = 0; i < 4096; i++) {
      for (let j = 0; j < 8192; j++) {
        drawHeightmapCell(j, i);
      }
    }
  } else {
    world.drawingType = "heightmap";
    drawWorld();
  }
}

function drawRiverMapFromScratch() {
  world.drawingType = "rivermap"
  drawWorld()
  /*
  if (world.smallMap) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, 8192, 4096);
    ctx.fillStyle = "#ff0080"
    ctx.fill();
    for (let i = 0; i < 4096; i++) {
      for (let j = 0; j < 8192; j++) {
        let cell = world.smallMap[i][j];
        if (cell.elevation >= limits.seaLevel.upper) {
          drawTinyPixel(ctx, j, i, "#ffffff");
        }
      }
    }
  } else {
    world.drawingType = "rivermap"
    drawWorld()
  }
  */
}

function redoLetterMap() {
  world.drawingType = "book";
  for (let i = 0; i < world.height; i++) {
    for (let j = 0; j < world.width; j++) {
      world.map[i][j].text = bookText[currentBookPosition]
      currentBookPosition += 1
      if (currentBookPosition === bookText.length - 1) {
        currentBookPosition = 0
      }
    }
  }

}

/**
 * Draws the entire world map by clearing the canvas, setting its dimensions,
 * and iterating over each cell to draw it.
 */
function drawWorld() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set the canvas dimensions based on the world's size and pixel size
  canvas.width = world.width * world.pixelSize;
  canvas.height = world.height * world.pixelSize;
  
  // Iterate over each cell in the world and draw it
  for (let y = 0; y < world.height; y++) {
    for (let x = 0; x < world.width; x++) {
      drawCell(x, y);
    }
  }
}

  /**
   * Draws a heightmap cell at the specified coordinates (x, y).
   * The function calculates the color value based on the cell's elevation and 
   * adjusts it slightly for a more natural look. The cell is then drawn as a tiny pixel.
   *
   * @param {number} x - The x-coordinate of the cell.
   * @param {number} y - The y-coordinate of the cell.
   */
  
  function drawHeightmapCell(x, y) {
    let cell = world.smallMap[y][x]
    let c;
    if (cell) {
      c = Math.floor((cell.elevation / 2))
      if (c > (limits.seaLevel.upper + 5)) {
        c += getRandomInt(-5, 5)
      }
    }
    if (c > 255) {
      c = 255
    }
    if (c < 0) {
      c = 0;
    }
    if (cell.bigCell && cell.bigCell.dropToWater && cell.bigCell.highPointRiver === false) {
      c = 0;
    }
  
    drawTinyPixel(ctx, x, y, `rgb(${c}, ${c}, ${c})`)
  }


