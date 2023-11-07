// Random Palette
const generateButton = document.getElementById('generatePalette');
const colorPalettes = document.getElementById('colorPalettes');
const apiUrl1 = 'https://www.colourlovers.com/api/palettes/random';

generateButton.addEventListener('click', () => {
  generateRandomPalettes(5, colorPalettes, apiUrl1);
});

function generateRandomPalettes(count, palettesContainer, apiUrl1) {
  fetchRandomPalettes(count, apiUrl1)
    .then((palettes) => {
      displayColorPalettes(palettes, palettesContainer);
    })
    .catch((error) => {
      console.error('Error generating random palettes:', error);
    });
}

function fetchRandomPalettes(count, apiUrl1) {
  const palettes = [];
  const fetchPromises = [];

  for (let i = 0; i < count; i++) {
    fetchPromises.push(
      fetch(`${apiUrl1}?format=json`)
        .then((response) => {
          if (response.ok) {
            return response.json().then((data) => data[0].colors);
          } else {
            throw new Error('Failed to fetch color palette.');
          }
        })
    );
  }

  return Promise.all(fetchPromises);
}

function displayColorPalettes(palettes, palettesContainer) {
  palettesContainer.innerHTML = '';

  palettes.forEach((colors) => {
    const paletteContainer = document.createElement('div');
    paletteContainer.classList.add('palette');

    colors.forEach((color) => {
      const colorBox = document.createElement('div');
      colorBox.style.backgroundColor = `#${color}`;
      colorBox.classList.add('color-box');
      paletteContainer.appendChild(colorBox);
    });

    palettesContainer.appendChild(paletteContainer);
  });
}

// Pick a Color - An attempt at returning a color palette based on the user's generated color
// Keep getting a CORS error, but idk what that actually is....
const hueSlider = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const lightnessSlider = document.getElementById('lightness');
const opacitySlider = document.getElementById('opacity');
const hexInput = document.getElementById('hex');
const rgbInput = document.getElementById('rgb');
const colorPreview = document.querySelector('.color-preview');
hueSlider.addEventListener('input', updateColor);
saturationSlider.addEventListener('input', updateColor);
lightnessSlider.addEventListener('input', updateColor);
opacitySlider.addEventListener('input', updateColor);

function updateColor() {
  const h = hueSlider.value;
  const s = saturationSlider.value;
  const l = lightnessSlider.value;
  const a = opacitySlider.value / 100;
  const color = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  colorPreview.style.backgroundColor = color;
  const tinyColor = tinyColor(color);
  hexInput.value = tinyColor.toHex();
  rgbInput.value = tinyColor.toRgbString();
}
const selectedColorPalettes = document.getElementById('selectedColorPalettes');
const apiURL2 = 'http://www.colourlovers.com/api/palettes';

const pickColorButton = document.getElementById('pickColor');
pickColorButton.addEventListener('click', () => {
  const selectedColor = getCurrentColor();
  generatePalettesForColor(selectedColor, 5, selectedColorPalettes, apiURL2);
});

function getCurrentColor() {
  const h = hueSlider.value;
  const s = saturationSlider.value;
  const l = lightnessSlider.value;
  const a = opacitySlider.value / 100;
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

function generatePalettesForColor(selectedColor, count, paletteContainer, apiURL) {
  fetchPalettesForColor(selectedColor, count, apiURL)
    .then((palettes) => {
      displayColorPalettes(palettes, paletteContainer);
    })
    .catch((error) => {
      console.error('Error generating palettes for selected color:', error);
    });
}

function fetchPalettesForColor(selectedColor, count, apiURL) {
  const palettes = [];
  const fetchPromises = [];

  for (let i = 0; i < count; i++) {
    fetchPromises.push(
      fetch(`${apiURL}?format=json&hex=${selectedColor}`)
        .then((response) => {
          if (response.ok) {
            return response.json().then((data) => data[0].colors);
          } else {
            throw new Error('Failed to fetch color palette for selected color.');
          }
        })
    );
  }

  return Promise.all(fetchPromises);
}

function displayColorPalettes(palettes, palettesContainer) {
  palettesContainer.innerHTML = '';

  palettes.forEach((colors) => {
    const paletteContainer = document.createElement('div');
    paletteContainer.classList.add('palette');

    colors.forEach((color) => {
      const colorBox = document.createElement('div');
      colorBox.style.backgroundColor = `#${color}`;
      colorBox.classList.add('color-box');
      paletteContainer.appendChild(colorBox);
    });

    palettesContainer.appendChild(paletteContainer);
  });
}
