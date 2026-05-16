import { jsPDF } from 'jspdf';
import type { ProcessedResult } from './imageProcessor';

// Constants for PDF Generation
const PAGE_WIDTH = 8.5; // US Letter width in inches
const PAGE_HEIGHT = 11; // US Letter height in inches
const MARGIN = 0.5; // 0.5 inch margins
const OVERLAP_PIXELS = 5; // How many pixels to overlap for easy taping
export const generatePDF = async (data: ProcessedResult, title: string = "PixelatePro Pattern") => {
  // Use points for jsPDF, 72 points = 1 inch
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter'
  });

  const drawableWidth = PAGE_WIDTH - MARGIN * 2;
  const drawableHeight = PAGE_HEIGHT - MARGIN * 2;

  // 1. Calculate how many pages we need based on grid size and cell size
  // Let's dynamically determine a comfortable cell size, aiming for 10-14 count equivalent if possible
  // E.g., at 10 count, cell size is 0.1 inches.
  let cellSize = 0.1;
  if (data.gridWidth < 50 && data.gridHeight < 50) {
    cellSize = 0.15; // Make it bigger if it's a small grid
  }

  const cellsPerPageX = Math.floor(drawableWidth / cellSize);
  const cellsPerPageY = Math.floor(drawableHeight / cellSize);

  const pagesX = Math.ceil(data.gridWidth / (cellsPerPageX - OVERLAP_PIXELS));
  const pagesY = Math.ceil(data.gridHeight / (cellsPerPageY - OVERLAP_PIXELS));

  let isFirstPage = true;

  // Helper to draw grid on a single page
  const drawPage = (pageCol: number, pageRow: number) => {
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    // Calculate grid chunk bounds for this page
    const startX = pageCol * (cellsPerPageX - OVERLAP_PIXELS);
    const startY = pageRow * (cellsPerPageY - OVERLAP_PIXELS);
    const endX = Math.min(startX + cellsPerPageX, data.gridWidth);
    const endY = Math.min(startY + cellsPerPageY, data.gridHeight);

    // Draw header
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${title} - Page ${pageRow * pagesX + pageCol + 1} of ${pagesX * pagesY}`, MARGIN, MARGIN - 0.1);

    // Draw overlap guides
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    if (pageCol > 0) {
      pdf.text(`<- Match to Page ${pageRow * pagesX + pageCol}`, MARGIN, MARGIN + drawableHeight / 2, { angle: 90 });
    }
    if (pageCol < pagesX - 1) {
      pdf.text(`Match to Page ${pageRow * pagesX + pageCol + 2} ->`, PAGE_WIDTH - MARGIN + 0.1, MARGIN + drawableHeight / 2, { angle: 90 });
    }

    // Draw grid
    pdf.setLineWidth(0.005);
    pdf.setDrawColor(200, 200, 200);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        // Find pixel color
        const pixel = data.pixels.find(p => p.x === x && p.y === y);
        if (!pixel) continue;

        const drawX = MARGIN + (x - startX) * cellSize;
        const drawY = MARGIN + (y - startY) * cellSize;

        // Optionally, highlight overlap areas slightly
        const isOverlap = (pageCol > 0 && x < startX + OVERLAP_PIXELS) ||
                          (pageRow > 0 && y < startY + OVERLAP_PIXELS);

        if (isOverlap) {
            pdf.setFillColor(240, 240, 240);
            pdf.rect(drawX, drawY, cellSize, cellSize, 'F');
        }

        // Draw border
        pdf.rect(drawX, drawY, cellSize, cellSize, 'S');

        // Draw Symbol
        pdf.setTextColor(0, 0, 0); // Always black text for printable pattern
        pdf.setFontSize(cellSize * 72 * 0.7); // Convert cell size to points
        pdf.text(pixel.color.symbol || '', drawX + cellSize / 2, drawY + cellSize / 2 + 0.02, { align: 'center', baseline: 'middle' });
      }
    }
  };

  // Generate grid pages
  for (let r = 0; r < pagesY; r++) {
    for (let c = 0; c < pagesX; c++) {
      drawPage(c, r);
    }
  }

  // Generate Inventory Page
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Materials Inventory', MARGIN, MARGIN);

  let yPos = MARGIN + 0.5;
  pdf.setFontSize(10);

  const inventoryArray = Object.values(data.colorInventory).sort((a, b) => b.count - a.count);

  inventoryArray.forEach((item) => {
    if (yPos > PAGE_HEIGHT - MARGIN) {
        pdf.addPage();
        yPos = MARGIN;
    }

    // Symbol box
    pdf.setDrawColor(0,0,0);
    pdf.rect(MARGIN, yPos - 0.15, 0.2, 0.2, 'S');
    pdf.text(item.info.symbol || '', MARGIN + 0.1, yPos - 0.05, { align: 'center' });

    // Details
    pdf.text(`${item.info.id} - ${item.info.name}`, MARGIN + 0.3, yPos);
    pdf.text(`${item.count} units`, MARGIN + 3, yPos);

    // Add color swatch
    pdf.setFillColor(item.info.rgb[0], item.info.rgb[1], item.info.rgb[2]);
    pdf.rect(MARGIN + 4, yPos - 0.15, 0.4, 0.2, 'FD');

    yPos += 0.3;
  });

  // Monetization/Affiliate Links placeholder text on the last page
  yPos += 0.5;
  if (yPos > PAGE_HEIGHT - MARGIN - 1) {
    pdf.addPage();
    yPos = MARGIN + 0.5;
  }

  pdf.setFontSize(12);
  pdf.setTextColor(0, 100, 200);
  pdf.text('Support the creator: Buy me a coffee! (Link)', MARGIN, yPos);
  pdf.text('Need supplies? Buy them here (Affiliate Link)', MARGIN, yPos + 0.3);

  // Save the PDF
  pdf.save('PixelatePro_Pattern.pdf');
};
