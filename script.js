const scenes = [
  {
    text: "The group suspects the kidnapper is the Lich, but you're not ready to face him. Choose:",
    options: ["Go to the forest", "Go to the tavern"]
  },
  {
    text: "The Magic Man appears! Prepare for battle.",
    img: "Magic Man.jpg",
    text2: "Health: 300 HP • Attack: 30. Roll >3 to gain +10 defense, ≤3 you lose weapon or take 30 HP."
  },
  {
    text: "The Jelly Monster emerges!",
    img: "Monstro gelatina.jpg",
    text2: "Health: 400 HP • Attack: 40. An Oracle appears after first hits, challenge: sing 'I Want It That Way'."
  },
  {
    text: "The Final Battle with the Lich begins!",
    img: "Lich.jpg",
    text2: "Health: 500 HP • Attack: 50. Sever his horns at −250 HP, solve hangman word 'Lightning' to win."
  },
  {
    text: "Congratulations! You've defeated the Lich, freed the princess, and opened the portal to the Citadel.",
    img: "Lich.jpg"
  }
];

let currentScene = -1;
const sceneDiv = document.getElementById('scene');
const nextBtn = document.getElementById('next-button');

function showScene(i) {
  sceneDiv.innerHTML = '';
  const s = scenes[i];

  const p1 = document.createElement('p');
  p1.innerText = s.text;
  sceneDiv.appendChild(p1);

  if (s.img) {
    const img = document.createElement('img');
    img.src = s.img;
    img.alt = s.img;
    sceneDiv.appendChild(img);
  }

  if (s.text2) {
    const p2 = document.createElement('p');
    p2.innerText = s.text2;
    sceneDiv.appendChild(p2);
  }

  nextBtn.classList.remove('hidden');
}

document.getElementById('start-button').addEventListener('click', () => {
  document.querySelector('.start-screen').classList.add('hidden');
  document.querySelector('.game-screen').classList.remove('hidden');
  currentScene = 0;
  showScene(currentScene);
});

nextBtn.addEventListener('click', () => {
  currentScene++;
  if (currentScene < scenes.length) showScene(currentScene);
  else {
    nextBtn.classList.add('hidden');
    sceneDiv.innerHTML = "<h2>The End. Refresh to play again.</h2>";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('start-button');
  const startScreen = document.querySelector('.start-screen');
  const gameScreen = document.querySelector('.game-screen');

  btn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  });
});
