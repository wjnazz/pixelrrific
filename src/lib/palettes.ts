export type ColorInfo = {
  id: string; // ID used by manufacturer
  name: string; // Readable name
  rgb: [number, number, number]; // RGB values
  hex: string; // Hex code for easy rendering
  symbol?: string; // Assigned symbol for charts
};

export type Palette = {
  name: string;
  colors: ColorInfo[];
};

// Distinct symbols for charts
export const SYMBOLS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '@', '#', '$', '%', '&', '*', '+', '=', '?', '!', '~', '>', '<', '^',
  '★', '♠', '♣', '♥', '♦', '♪', '☀', '☁', '☂', '☃', '☄', '☾', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'
];

// Assigns symbols to a list of colors deterministically
const assignSymbols = (colors: Omit<ColorInfo, 'symbol'>[]): ColorInfo[] => {
  return colors.map((c, i) => ({
    ...c,
    symbol: SYMBOLS[i % SYMBOLS.length]
  }));
};

// Standard Basic Perler Palette
export const PERLER_PALETTE: Palette = {
  name: "Perler Beads",
  colors: assignSymbols([
    { id: "01", name: "White", rgb: [255, 255, 255], hex: "#FFFFFF" },
    { id: "02", name: "Cream", rgb: [240, 230, 180], hex: "#F0E6B4" },
    { id: "03", name: "Yellow", rgb: [250, 220, 0], hex: "#FADC00" },
    { id: "04", name: "Orange", rgb: [250, 120, 0], hex: "#FA7800" },
    { id: "05", name: "Red", rgb: [210, 40, 40], hex: "#D22828" },
    { id: "06", name: "Bubblegum", rgb: [240, 100, 150], hex: "#F06496" },
    { id: "07", name: "Purple", rgb: [130, 60, 160], hex: "#823CA0" },
    { id: "08", name: "Dark Blue", rgb: [40, 60, 150], hex: "#283C96" },
    { id: "09", name: "Light Blue", rgb: [70, 130, 220], hex: "#4682DC" },
    { id: "10", name: "Dark Green", rgb: [30, 120, 60], hex: "#1E783C" },
    { id: "11", name: "Light Green", rgb: [120, 200, 100], hex: "#78C864" },
    { id: "12", name: "Brown", rgb: [100, 60, 40], hex: "#643C28" },
    { id: "17", name: "Grey", rgb: [140, 150, 160], hex: "#8C96A0" },
    { id: "18", name: "Black", rgb: [30, 30, 30], hex: "#1E1E1E" },
    { id: "19", name: "Clear", rgb: [230, 240, 240], hex: "#E6F0F0" },
    { id: "33", name: "Peach", rgb: [255, 180, 150], hex: "#FFB496" },
    { id: "52", name: "Pastel Green", rgb: [160, 230, 160], hex: "#A0E6A0" },
    { id: "53", name: "Pastel Yellow", rgb: [255, 250, 150], hex: "#FFFA96" },
    { id: "54", name: "Pastel Blue", rgb: [150, 200, 240], hex: "#96C8F0" },
    { id: "56", name: "Pastel Purple", rgb: [180, 150, 220], hex: "#B496DC" },
    { id: "60", name: "Plum", rgb: [170, 60, 120], hex: "#AA3C78" },
    { id: "63", name: "Blush", rgb: [255, 150, 150], hex: "#FF9696" },
    { id: "83", name: "Pink", rgb: [255, 100, 150], hex: "#FF6496" },
    { id: "88", name: "Raspberry", rgb: [180, 40, 90], hex: "#B4285A" },
    { id: "90", name: "Butterscotch", rgb: [220, 150, 60], hex: "#DC963C" },
    { id: "91", name: "Sand", rgb: [230, 200, 160], hex: "#E6C8A0" },
    { id: "92", name: "Dark Grey", rgb: [90, 100, 110], hex: "#5A646E" },
    { id: "96", name: "Cranberry", rgb: [150, 30, 60], hex: "#961E3C" },
    { id: "97", name: "Rust", rgb: [180, 70, 40], hex: "#B44628" },
    { id: "98", name: "Light Brown", rgb: [160, 110, 70], hex: "#A06E46" }
  ])
};

// Sample Lego Palette (Common Solid Colors)
export const LEGO_PALETTE: Palette = {
  name: "Lego",
  colors: assignSymbols([
    { id: "1", name: "White", rgb: [255, 255, 255], hex: "#FFFFFF" },
    { id: "5", name: "Brick Yellow", rgb: [217, 187, 123], hex: "#D9BB7B" },
    { id: "18", name: "Nougat", rgb: [204, 112, 42], hex: "#CC702A" },
    { id: "21", name: "Bright Red", rgb: [201, 26, 9], hex: "#C91A09" },
    { id: "23", name: "Bright Blue", rgb: [0, 85, 191], hex: "#0055BF" },
    { id: "24", name: "Bright Yellow", rgb: [242, 205, 55], hex: "#F2CD37" },
    { id: "26", name: "Black", rgb: [27, 42, 52], hex: "#1B2A34" },
    { id: "28", name: "Dark Green", rgb: [24, 70, 50], hex: "#184632" },
    { id: "37", name: "Bright Green", rgb: [75, 159, 74], hex: "#4B9F4A" },
    { id: "38", name: "Dark Orange", rgb: [169, 85, 0], hex: "#A95500" },
    { id: "102", name: "Medium Blue", rgb: [90, 147, 219], hex: "#5A93DB" },
    { id: "106", name: "Bright Orange", rgb: [254, 138, 24], hex: "#FE8A18" },
    { id: "119", name: "Bright Yellowish Green", rgb: [160, 188, 34], hex: "#A0BC22" },
    { id: "124", name: "Bright Reddish Violet", rgb: [146, 57, 120], hex: "#923978" },
    { id: "135", name: "Sand Blue", rgb: [96, 116, 161], hex: "#6074A1" },
    { id: "138", name: "Sand Yellow", rgb: [141, 116, 82], hex: "#8D7452" },
    { id: "140", name: "Earth Blue", rgb: [0, 32, 86], hex: "#002056" },
    { id: "141", name: "Earth Green", rgb: [0, 69, 26], hex: "#00451A" },
    { id: "151", name: "Sand Green", rgb: [160, 188, 145], hex: "#A0BC91" },
    { id: "154", name: "Dark Red", rgb: [123, 46, 47], hex: "#7B2E2F" },
    { id: "191", name: "Flame Yellowish Orange", rgb: [252, 172, 0], hex: "#FCAC00" },
    { id: "192", name: "Reddish Brown", rgb: [88, 42, 18], hex: "#582A12" },
    { id: "194", name: "Medium Stone Grey", rgb: [160, 165, 169], hex: "#A0A5A9" },
    { id: "199", name: "Dark Stone Grey", rgb: [108, 110, 104], hex: "#6C6E68" },
    { id: "208", name: "Light Stone Grey", rgb: [228, 228, 218], hex: "#E4E4DA" },
    { id: "212", name: "Light Royal Blue", rgb: [159, 195, 233], hex: "#9FC3E9" },
    { id: "221", name: "Bright Purple", rgb: [205, 98, 152], hex: "#CD6298" },
    { id: "222", name: "Light Purple", rgb: [228, 173, 200], hex: "#E4ADC8" },
    { id: "268", name: "Medium Lilac", rgb: [52, 43, 117], hex: "#342B75" },
    { id: "283", name: "Light Nougat", rgb: [246, 215, 179], hex: "#F6D7B3" },
    { id: "312", name: "Medium Nougat", rgb: [170, 125, 85], hex: "#AA7D55" },
    { id: "321", name: "Dark Azur", rgb: [7, 139, 201], hex: "#078BC9" },
    { id: "322", name: "Medium Azur", rgb: [54, 174, 212], hex: "#36AED4" },
    { id: "323", name: "Aqua", rgb: [211, 242, 234], hex: "#D3F2EA" },
    { id: "324", name: "Medium Lavender", rgb: [160, 110, 185], hex: "#A06EB9" },
    { id: "325", name: "Lavender", rgb: [205, 164, 222], hex: "#CDA4DE" },
    { id: "326", name: "Spring Yellowish Green", rgb: [226, 249, 154], hex: "#E2F99A" },
    { id: "330", name: "Olive Green", rgb: [155, 146, 92], hex: "#9B925C" },
    { id: "353", name: "Vibrant Coral", rgb: [248, 131, 121], hex: "#F88379" }
  ])
};

// Standard DMC Palette for Cross-stitch and Diamond Art (Truncated for typical use, about 50 common colors)
export const DMC_PALETTE: Palette = {
  name: "DMC (Diamond / Cross-stitch)",
  colors: assignSymbols([
    { id: "150", name: "Dusty Rose Ultra Very Dark", rgb: [171, 38, 70], hex: "#AB2646" },
    { id: "152", name: "Shell Pink Medium Light", rgb: [226, 160, 153], hex: "#E2A099" },
    { id: "153", name: "Violet Very Light", rgb: [228, 203, 222], hex: "#E4CBDE" },
    { id: "154", name: "Grape Very Dark", rgb: [86, 34, 56], hex: "#562238" },
    { id: "155", name: "Blue Violet Medium Dark", rgb: [153, 133, 175], hex: "#9985AF" },
    { id: "156", name: "Blue Violet Medium Light", rgb: [170, 155, 196], hex: "#AA9BC4" },
    { id: "157", name: "Cornflower Blue Very Light", rgb: [187, 195, 222], hex: "#BBC3DE" },
    { id: "158", name: "Cornflower Blue Medium Very Dark", rgb: [78, 86, 126], hex: "#4E567E" },
    { id: "159", name: "Gray Blue Light", rgb: [199, 202, 215], hex: "#C7CAD7" },
    { id: "160", name: "Gray Blue Medium", rgb: [153, 159, 183], hex: "#999FB7" },
    { id: "161", name: "Gray Blue", rgb: [119, 126, 153], hex: "#777E99" },
    { id: "162", name: "Blue Ultra Very Light", rgb: [219, 236, 245], hex: "#DBECF5" },
    { id: "163", name: "Celadon Green Medium", rgb: [95, 137, 114], hex: "#5F8972" },
    { id: "164", name: "Forest Green Light", rgb: [200, 221, 195], hex: "#C8DDC3" },
    { id: "165", name: "Moss Green Very Light", rgb: [239, 245, 169], hex: "#EFF5A9" },
    { id: "166", name: "Moss Green Medium Light", rgb: [193, 205, 81], hex: "#C1CD51" },
    { id: "167", name: "Yellow Beige Very Dark", rgb: [167, 125, 73], hex: "#A77D49" },
    { id: "168", name: "Pewter Very Light", rgb: [209, 209, 209], hex: "#D1D1D1" },
    { id: "169", name: "Pewter Light", rgb: [132, 132, 132], hex: "#848484" },
    { id: "310", name: "Black", rgb: [0, 0, 0], hex: "#000000" },
    { id: "321", name: "Red", rgb: [199, 43, 59], hex: "#C72B3B" },
    { id: "444", name: "Lemon Dark", rgb: [255, 214, 0], hex: "#FFD600" },
    { id: "666", name: "Christmas Red Bright", rgb: [227, 27, 35], hex: "#E31B23" },
    { id: "700", name: "Christmas Green Bright", rgb: [8, 123, 57], hex: "#087B39" },
    { id: "798", name: "Delft Blue Dark", rgb: [59, 100, 168], hex: "#3B64A8" },
    { id: "820", name: "Royal Blue Very Dark", rgb: [26, 44, 91], hex: "#1A2C5B" },
    { id: "900", name: "Burnt Orange Dark", rgb: [209, 88, 7], hex: "#D15807" },
    { id: "904", name: "Parrot Green Very Dark", rgb: [52, 120, 52], hex: "#347834" },
    { id: "943", name: "Aquamarine Medium", rgb: [58, 165, 135], hex: "#3AA587" },
    { id: "972", name: "Canary Deep", rgb: [255, 181, 19], hex: "#FFB513" },
    { id: "995", name: "Electric Blue Dark", rgb: [0, 140, 183], hex: "#008CB7" },
    { id: "3031", name: "Mocha Brown Very Dark", rgb: [73, 56, 46], hex: "#49382E" },
    { id: "3371", name: "Black Brown", rgb: [30, 20, 15], hex: "#1E140F" },
    { id: "3865", name: "Winter White", rgb: [249, 247, 241], hex: "#F9F7F1" },
    { id: "B5200", name: "Snow White", rgb: [255, 255, 255], hex: "#FFFFFF" }
  ])
};

export const PALETTES: Record<string, Palette> = {
  dmc: DMC_PALETTE,
  perler: PERLER_PALETTE,
  lego: LEGO_PALETTE
};

export type Modality = keyof typeof PALETTES;
