let typeScoreSum = 0;
let typeCount = 0;

function updateResult(data) {
  const currentPercent =
    typeCount == 0 ? 0 : Math.floor(typeScoreSum / typeCount);
  typeScoreSum += data.score;
  typeCount++;
  const updatedPercent = Math.floor(typeScoreSum / typeCount);
  const updatedDiff = updatedPercent - currentPercent;
  const isIncreament = updatedDiff > 0;
  if (updatedDiff != 0) {
    const scoreElement = document.querySelector(
      ".score-container .obtained-score"
    );
    let i = 0;
    const interval = setInterval(() => {
      if (i == Math.abs(updatedDiff)) {
        clearInterval(interval);
        document.querySelector(".status-message .percent").innerText =
          updatedPercent;
      } else {
        const text = currentPercent + (i + 1) * (isIncreament ? 1 : -1) + "";
        scoreElement.innerText = text.padStart(2, "0");
        i++;
      }
    }, 20);
  }
}

function populatePill(data) {
  const template = `
    <img class="type-icon" src="${data.icon}" alt="${data.category} Icon" />
    <div class="type-label">${data.category}</div>
    <div class="type-score">
      <span class="obtained-score">${data.score}</span>
      <span class="total-score">/ 100</span>
    </div>`;
  const pillClassName = data.category.toLowerCase();

  const pillElement = document.getElementsByClassName(pillClassName)[0];
  pillElement.classList.remove("loading");
  pillElement.innerHTML = template;

  updateResult(data);
}

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i == data.length) {
        clearInterval(interval);
      } else {
        populatePill(data[i]);
        i++;
      }
    }, 2000);
  });
