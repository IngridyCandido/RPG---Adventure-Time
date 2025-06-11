// Personagens e inimigos
const characters = {
  "Pebble Stonewall": { attack:70, defense:90, maxHP:180, hp:180 },
  "Kaela Shadowveil": { attack:100, defense:40, maxHP:160, hp:160 },
  "Merlírio": { attack:50, defense:30, maxHP:120, hp:120 },
  "Áster Duskwatch": { attack:80, defense:70, maxHP:120, hp:120 },
  "Dussekar Flame": { attack:90, defense:50, maxHP:100, hp:100 }
};

const enemies = {
  "Magic Man": { attack:30, maxHP:300, hp:300, img:"Magic Man.jpg" },
  "Gelatinous Monster": { attack:40, maxHP:400, hp:400, img:"Monstro gelatina.jpg" },
  "The Lich": { attack:50, maxHP:500, hp:500, img:"Lich.jpg" }
};

// DOM
const select = document.getElementById("selectCharacter");
const startBtn = document.getElementById("startBtn");
const story = document.getElementById("story");
const storyText = document.getElementById("storyText");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const battle = document.getElementById("battle");
const enemyImage = document.getElementById("enemyImage");
const playerName = document.getElementById("playerName");
const playerHP = document.getElementById("playerHP");
const enemyName = document.getElementById("enemyName");
const enemyHP = document.getElementById("enemyHP");
const attackBtn = document.getElementById("attackBtn");
const defendBtn = document.getElementById("defendBtn");
const danceDiv = document.getElementById("dance");
const danceButtons = document.querySelectorAll(".dance-btn");
const startDanceBtn = document.getElementById("startDanceBtn");
const hangmanDiv = document.getElementById("hangman");
const wordDisplay = document.getElementById("wordDisplay");
const errorsLeftSpan = document.getElementById("errorsLeft");
const keyboardDiv = document.getElementById("keyboard");
const restartHangmanBtn = document.getElementById("restartHangmanBtn");

// Estado
let state = {
  player: null,
  scene:0, hasSword:false, hasMap:false, hasPortalKey:false,
  currentEnemy:null, combatCallback:null,
  danceSequence:[], hangmanWord:"LIGHTNING", guessed:[], errorsLeft:6
};

// Iniciar
startBtn.onclick = () => {
  state.player = JSON.parse(JSON.stringify(characters[select.value]));
  state.scene = 1;
  document.getElementById("character-select").classList.add("hidden");
  nextScene();
};

// Mostrar cena
function nextScene() {
  hideAll();
  switch (state.scene) {
    case 1:
      showStory("The group receives some information, leading you to suspect that the one who kidnapped her was the Lich. However, you are not strong enough to face him in your current condition. Do you want to go straight to the forest to gather equipment and resources to begin your search for her, or would you rather look for clues at the tavern?", [
        {t:"Go to the forest", s:2}, {t:"Go to the tavern", s:10}
      ]);
      break;
    case 2:
      showStory("The trees are tall, and the place is beautiful. You begin exploring the area. Suddenly, something shiny catches your eye.", [
        {t:"Approach and pick it up", s:3}, {t:"Ignore it", s:4}
      ]);
      break;
    case 3:
      state.hasSword=true;
      showStory("You found a mystical sword! Keep it with whom?", [
        {t:"Like you",s:5}, {t:"Choose another",s:5}
      ]);
      break;
    case 4:
      showStory("You proceed without items.", [
        {t:"Next", s:5}
      ]);
      break;
    case 5:
      startCombat("Magic Man", () => {
        if (state.currentEnemy.hp<=0) {
          state.hasMap = true;
          state.player.hp = state.player.maxHP;
          alert("Magic Man defeated! You received a Map and Healing Potion.");
          state.scene = 6;
          nextScene();
        }
      });
      break;
    case 6:
      showStory("In the mausoleum, three bells. Which one to ring?", [
        {t:"Silver Bell", s:7}, {t:"Play another", s:8}
      ]);
      break;
    case 7:
      alert("Correct bell! Portal opens.");
      startCombat("Gelatinous Monster", () => {
        state.scene = 9;
        nextScene();
      });
      break;
    case 8:
      alert("Wrong bell, a monster.");
      startCombat("Gelatinous Monster", () => {
        state.scene = 9;
        nextScene();
      });
      break;
    case 9:
      showDance();
      break;
    case 10:
      showStory("In the tavern, he taunted Magic Man. Prepare defense!", [
        {t:"Defend", s:5}
      ]);
      break;
  }
}

// UI de histórias
function showStory(text, opts){
  story.classList.remove("hidden");
  storyText.textContent = text;
  [option1,option2].forEach((btn,i)=>{
    if(opts[i]){
      btn.textContent=opts[i].t;
      btn.onclick=()=>{state.scene=opts[i].s; nextScene();}
      btn.classList.remove("hidden");
    } else btn.classList.add("hidden");
  });
}

// Reset visibilidade
function hideAll(){
  story.classList.add("hidden");
  battle.classList.add("hidden");
  danceDiv.classList.add("hidden");
  hangmanDiv.classList.add("hidden");
}

// Combate
function startCombat(eKey, cb){
  state.currentEnemy = JSON.parse(JSON.stringify(enemies[eKey]));
  state.combatCallback = cb;
  playerName.textContent = select.value;
  enemyName.textContent = eKey;
  enemyImage.src = state.currentEnemy.img;
  updateHP();
  hideAll();
  battle.classList.remove("hidden");
  attackBtn.onclick = playerAttack;
  defendBtn.onclick = playerDefend;
}

// Jogador ataca
function playerAttack(){
  const dmg = Math.max(0, state.player.attack - Math.floor(state.currentEnemy.attack/2));
  state.currentEnemy.hp -= dmg;
  updateHP(); log(`You caused ${dmg} of damage.`);
  setTimeout(enemyTurn,500);
}

// Jogador defende (com chance)
function playerDefend(){
  if(Math.random()*6>3){
    state.player.defense+=10;
    log("Solid barrier! +10 defense.");
  } else {
    if(state.hasSword){
      state.hasSword=false;
      log("Barrier failed — sword lost!");
    } else {
      state.player.hp-=30;
      updateHP();
      log("Total failure — lost 30 HP.");
    }
  }
  setTimeout(enemyTurn,500);
}

// Turno inimigo & fim combate
function enemyTurn(){
  if(state.currentEnemy.hp<=0) return endCombat();
  const dmg = state.currentEnemy.attack - Math.floor(state.player.defense/10);
  state.player.hp-=dmg; updateHP();
  log(`Enemy caused ${dmg} of damage.`);
  if(state.player.hp<=0){
    alert("Defeated! Reload to try again.");
    return;
  }
  // Se estiver no combate com Gelatinous e depois da dança, aplicar self-damage
  if(state.scene===9 && state.currentEnemy.hp>0 && state.danceSuccess){
    state.currentEnemy.hp-=50;
    log("Gelatinous got confused and got hurt (-50 HP)!");
    updateHP();
  }
}

// Encerramento
function endCombat(){
  battle.classList.add("hidden");
  state.combatCallback();
}

// Atualiza HP
function updateHP(){
  playerHP.textContent = state.player.hp;
  enemyHP.textContent = state.currentEnemy.hp;
}

// Log
function log(msg){ console.log(msg); }

// Dança
startDanceBtn.onclick = () => {
  hideAll(); danceDiv.classList.remove("hidden");
  state.danceSequence = [];
  danceButtons.forEach(btn => {
    btn.disabled = false;
    btn.onclick = () => state.danceSequence.push(btn.dataset.move);
  });
  alert("Click in order: head, shoulders, knees, feet — 3 times!");
  setTimeout(checkDance,10000);
};

function checkDance(){
  const pattern=["head","shoulders","knees","feet"];
  const seq = pattern.concat(pattern,pattern);
  state.danceSuccess = seq.every((m,i)=>state.danceSequence[i]===m);
  if(state.danceSuccess){
    alert("Perfect dance! Gelatinous is stunned!");
  } else alert("Failed — prepare to fight.");
  // seguir para Hangman e Lich
  state.scene = 11;
  initHangman();
}

// Hangman
restartHangmanBtn.onclick = initHangman;

function initHangman(){
  hideAll(); hangmanDiv.classList.remove("hidden");
  state.guessed=[]; state.errorsLeft=6;
  wordDisplay.textContent="_ ".repeat(state.hangmanWord.length);
  errorsLeftSpan.textContent = state.errorsLeft;
  keyboardDiv.innerHTML = "";
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(c=>{
    const b=document.createElement("button");
    b.textContent=c;
    b.onclick=()=> guessLetter(c);
    keyboardDiv.appendChild(b);
  });
}

function guessLetter(c){
  if(state.guessed.includes(c)) return;
  state.guessed.push(c);
  if(!state.hangmanWord.includes(c)) state.errorsLeft--;
  displayWord();
  errorsLeftSpan.textContent=state.errorsLeft;
  if(!wordDisplay.textContent.includes("_")) return hangmanWin();
  if(state.errorsLeft<=0) return hangmanLose();
}

function displayWord(){
  wordDisplay.textContent = state.hangmanWord.split("").map(ch=>
    state.guessed.includes(ch) ? ch : "_").join(" ");
}

function hangmanWin(){
  alert("Correct! The Enchiridion releases energy!");
  state.scene=12;
  startLichBattle(true);
}

function hangmanLose(){
  alert("You've missed! Unstable Power grants the Lich +10 attack.");
  state.scene=12;
  startLichBattle(false);
}

function startLichBattle(hangmanSuccess){
  state.currentEnemy = JSON.parse(JSON.stringify(enemies["The Lich"]));
  if(!hangmanSuccess) state.currentEnemy.attack += 10;
  state.combatCallback = endGame;
  playerName.textContent = select.value;
  enemyName.textContent = "The Lich";
  enemyImage.src = state.currentEnemy.img;
  updateHP();
  hideAll();
  battle.classList.remove("hidden");
  attackBtn.onclick = lichPlayerAttack;
  defendBtn.onclick = playerDefend;
}

function lichPlayerAttack(){
  const dmg = Math.max(0, state.player.attack - Math.floor(state.currentEnemy.attack/2));
  state.currentEnemy.hp -= dmg;
  updateHP(); log(`You give ${dmg} of damage.`);
  if(state.currentEnemy.hp <= 250 && !state.gotKey){
    state.gotKey = true;
    state.hasPortalKey = true;
    alert("Broken Antler! You get the key to the Enchiridion!");
  }
  setTimeout(lichEnemyTurn, 500);
}

function lichEnemyTurn(){
  if(state.currentEnemy.hp<=0) return endGame();
  const dmg = state.currentEnemy.attack - Math.floor(state.player.defense/10);
  state.player.hp -= dmg;
  updateHP(); log(`Lich give ${dmg} of damage..`);
  if(state.player.hp<=0){
    alert("You died! Reload to try again.");
  }
}

function endGame(){
  battle.classList.add("hidden");
  if(state.currentEnemy.hp<=0){
    alert("You've defeated the Lich! Portal active. Congratulations!");
  } else alert("You escaped, but injured. Next start will be harder.");
}
