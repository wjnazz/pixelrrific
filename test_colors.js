const uniqueColors = [
  { count: 10, info: { id: "1" } },
  { count: 50, info: { id: "2" } },
  { count: 2, info: { id: "3" } }
];
uniqueColors.sort((a, b) => b.count - a.count);
console.log(uniqueColors);
const restrictedPalette = uniqueColors.slice(0, 2).map(u => u.info);
console.log(restrictedPalette);
