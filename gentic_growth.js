const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const POPULATION_SIZE = 50;
let creatures = [];
let generation = 1;
let numCreatures = 0;
let simulationRunning = false;

function generateInitialPopulation() {
  for (let i = 0; i < POPULATION_SIZE; i++) {
    creatures.push(new Creature());
  }
}

function drawCreatures() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < creatures.length; i++) {
    creatures[i].draw(ctx);
  }
}

function updatePopulation() {
  numCreatures = creatures.length;
  creatures.sort(function(a, b) {
    return b.fitness() - a.fitness();
  });

  const fittest = creatures.slice(0, POPULATION_SIZE / 2);
  const offspring = breed(fittest);

  creatures = fittest.concat(offspring);
  generation++;
  updateUI();
}

function breed(fittest) {
  const offspring = [];

  for (let i = 0; i < POPULATION_SIZE / 2; i++) {
    const parent1 = fittest[Math.floor(Math.random() * fittest.length)];
    const parent2 = fittest[Math.floor(Math.random() * fittest.length)];
    offspring.push(parent1.breed(parent2));
  }

  return offspring;
}

class Creature {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 20 + 10;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.speed = Math.random() * 10 + 1;
    this.strength = Math.random() * 10 + 1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  fitness() {
    return this.speed + this.strength;
  }

  breed(partner) {
    const offspring = new Creature();

    offspring.size = (this.size + partner.size) / 2;
    offspring.color = this.color;
    offspring.speed = (this.speed + partner.speed) / 2;
    offspring.strength = (this.strength + partner.strength) / 2;

    return offspring;
  }
}

function updateUI() {
  document.getElementById('numCreatures').textContent = numCreatures;
  document.getElementById('generation').textContent = generation;
}

startBtn.addEventListener('click', () => {
  if (!simulationRunning) {
    simulationRunning = true;
    generateInitialPopulation();
    setInterval(() => {
      updatePopulation();
      drawCreatures();
    }, 500);
  }
});





function generateColorTable() {
  const colorCounts = {};
  
  // Count the number of creatures with each color in the current generation
  for (let i = 0; i < creatures.length; i++) {
    const color = creatures[i].color;
    if (!colorCounts[color]) {
      colorCounts[color] = 0;
    }
    colorCounts[color]++;
  }
  
  // Create the HTML table
  let tableHtml = '<table><tr><th>Color</th><th>Count</th></tr>';
  for (const color in colorCounts) {
    const count = colorCounts[color];
    tableHtml += `<tr><td>${color}</td><td>${count}</td></tr>`;
  }
  tableHtml += '</table>';
  
  // Update the HTML
  const colorTableContainer = document.getElementById('colorTable');
  colorTableContainer.innerHTML = tableHtml;
}

function updatePopulation() {
  numCreatures = creatures.length;
  creatures.sort(function(a, b) {
    return b.fitness() - a.fitness();
  });

  const fittest = creatures.slice(0, POPULATION_SIZE / 2);
  const offspring = breed(fittest);

  creatures = fittest.concat(offspring);
  generation++;
  
  generateColorTable();
}





function updateUI() {
  document.getElementById('numCreatures').textContent = numCreatures;
  document.getElementById('generation').textContent = generation;

  // update the creatures table
  const creaturesTableBody = document.getElementById('creaturesTableBody');
  creaturesTableBody.innerHTML = '';
  for (let i = 0; i < creatures.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${creatures[i].color}</td>
      <td>${creatures[i].fitness()}</td>
    `;
    creaturesTableBody.appendChild(row);
  }

  // update the color table
  const colorTableBody = document.getElementById('colorTableBody');
  colorTableBody.innerHTML = '';
  const colorCounts = {};
  for (let i = 0; i < creatures.length; i++) {
    const color = creatures[i].color;
    if (color in colorCounts) {
      colorCounts[color]++;
    } else {
      colorCounts[color] = 1;
    }
  }
  for (const color in colorCounts) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${generation}</td>
      <td>${color}</td>
      <td>${colorCounts[color]}</td>
    `;
    colorTableBody.appendChild(row);
  }
}







const colorTableBody = document.getElementById('colorTableBody');
const colorOccurrences = {};

function updateColorTable() {
  const colorCounts = {};

  for (let i = 0; i < creatures.length; i++) {
    const color = creatures[i].color;

    if (color in colorCounts) {
      colorCounts[color]++;
    } else {
      colorCounts[color] = 1;
    }
  }

  for (const color in colorCounts) {
    if (color in colorOccurrences) {
      colorOccurrences[color].push(colorCounts[color]);
    } else {
      colorOccurrences[color] = [colorCounts[color]];
    }
  }

  colorTableBody.innerHTML = '';

  for (const color in colorOccurrences) {
    const occurrences = colorOccurrences[color];
    const row = document.createElement('tr');
    const generationCell = document.createElement('td');
    const colorCell = document.createElement('td');
    const occurrencesCell = document.createElement('td');

    generationCell.textContent = generation;
    colorCell.style.backgroundColor = color;
    occurrencesCell.textContent = occurrences.join(', ');

    row.appendChild(generationCell);
    row.appendChild(colorCell);
    row.appendChild(occurrencesCell);

    colorTableBody.appendChild(row);
  }
}
