function interpolateColor(color1, color2, factor) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
    .toString(16)
    .slice(1)}`;
}

export function getGradientColor(index) {
  const startColor = [35, 200, 140];
  const endColor = [0, 118, 58];

  if (index < 1 || index > 100) {
    throw new Error('Index out of range. It should be between 1 and 100.');
  }

  const factor = (index - 1) / 99; // 0 at index 1, 1 at index 100
  const color = interpolateColor(startColor, endColor, factor);

  return rgbToHex(color);
}
