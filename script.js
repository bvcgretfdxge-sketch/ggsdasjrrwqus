const form = document.getElementById("character-form");
const teamOne = document.getElementById("team-1");
const teamTwo = document.getElementById("team-2");
const template = document.getElementById("character-template");
const battleLog = document.getElementById("battle-log");
const nextTurnButton = document.getElementById("next-turn");
const turnLabel = document.getElementById("turn-label");

let currentTurn = 1;
const maxHp = 100;
const maxMp = 50;

const stateLabels = {
  attack: "attack",
  heal: "curar",
  idle: "idle",
};

const characterIcons = {
  Velocista: "💨",
  Soporte: "✨",
  Guerrero: "🗡️",
  Táctico: "🧠",
};

const logMessage = (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  battleLog.prepend(item);
};

const updateTurnLabel = () => {
  turnLabel.textContent = `Jugador ${currentTurn}`;
};

const updateActionAvailability = () => {
  document.querySelectorAll(".character-card").forEach((card) => {
    const isActiveTeam = card.dataset.team === String(currentTurn);
    card.querySelectorAll(".actions button").forEach((button) => {
      button.disabled = !isActiveTeam || card.dataset.hp === "0";
    });
  });
};

const updateMeters = (card) => {
  const hp = Number(card.dataset.hp);
  const mp = Number(card.dataset.mp);
  const hpBar = card.querySelector(".hp-bar");
  const mpBar = card.querySelector(".mp-bar");
  const hpText = card.querySelector(".hp-text");
  const mpText = card.querySelector(".mp-text");
  hpBar.style.width = `${(hp / maxHp) * 100}%`;
  mpBar.style.width = `${(mp / maxMp) * 100}%`;
  hpText.textContent = `HP ${hp}/${maxHp}`;
  mpText.textContent = `MP ${mp}/${maxMp}`;
};

const getOpponents = (team) => {
  const enemyTeam = team === "1" ? "2" : "1";
  return Array.from(document.querySelectorAll(`.character-card[data-team="${enemyTeam}"]`));
};

const applyDamage = (card, amount) => {
  const hp = Number(card.dataset.hp);
  const nextHp = Math.max(hp - amount, 0);
  card.dataset.hp = String(nextHp);
  updateMeters(card);
  if (nextHp === 0) {
    logMessage(`💥 ${card.dataset.name} cayó fuera de combate.`);
  }
};

const setState = (card, state) => {
  card.dataset.state = state;
  const label = card.querySelector(".state-label");
  label.textContent = stateLabels[state];
};

const applyAction = (card, action) => {
  if (card.dataset.team !== String(currentTurn)) {
    logMessage("⏳ Espera tu turno para actuar.");
    return;
  }

  const hp = Number(card.dataset.hp);
  const mp = Number(card.dataset.mp);

  if (hp <= 0) {
    logMessage(`💥 ${card.dataset.name} está fuera de combate.`);
    return;
  }

  if (action === "attack") {
    const damage = Math.floor(Math.random() * 16) + 10;
    card.dataset.mp = String(Math.max(mp - 5, 0));
    const opponents = getOpponents(card.dataset.team).filter((enemy) => enemy.dataset.hp !== "0");
    if (opponents.length === 0) {
      logMessage("🏁 No quedan rivales en pie.");
    } else {
      const target = opponents[Math.floor(Math.random() * opponents.length)];
      applyDamage(target, damage);
      logMessage(`⚔️ ${card.dataset.name} ataca a ${target.dataset.name} (-${damage} HP).`);
    }
  }

  if (action === "heal") {
    if (mp < 10) {
      logMessage(`✨ ${card.dataset.name} necesita más MP para curar.`);
      return;
    }
    const heal = Math.floor(Math.random() * 16) + 12;
    card.dataset.mp = String(mp - 10);
    card.dataset.hp = String(Math.min(hp + heal, maxHp));
    logMessage(`💚 ${card.dataset.name} restaura ${heal} HP.`);
  }

  if (action === "idle") {
    const regen = Math.floor(Math.random() * 8) + 6;
    card.dataset.mp = String(Math.min(mp + regen, maxMp));
    logMessage(`🌀 ${card.dataset.name} recarga ${regen} MP.`);
  }

  setState(card, action);
  updateMeters(card);
  currentTurn = currentTurn === 1 ? 2 : 1;
  updateTurnLabel();
  updateActionAvailability();
  logMessage(`🔄 Turno del Jugador ${currentTurn}.`);
};

const createCharacterCard = ({ name, team, icon, role }) => {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".character-card");
  const iconElement = clone.querySelector(".character-icon");
  const nameElement = clone.querySelector(".character-name");
  const roleElement = clone.querySelector(".character-role");

  card.dataset.name = name;
  card.dataset.team = team;
  card.dataset.hp = String(maxHp);
  card.dataset.mp = String(maxMp);
  iconElement.textContent = icon || characterIcons[role] || "⭐";
  nameElement.textContent = name;
  roleElement.textContent = role;

  clone.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      applyAction(card, button.dataset.action);
    });
  });

  if (team === "2") {
    teamTwo.appendChild(clone);
  } else {
    teamOne.appendChild(clone);
  }

  updateMeters(card);
  updateActionAvailability();
  logMessage(`✅ ${name} se une al equipo del Jugador ${team}.`);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const team = formData.get("team");
  const icon = formData.get("icon").trim();
  const role = formData.get("role");

  if (!name) {
    return;
  }

  createCharacterCard({ name, team, icon, role });
  form.reset();
});

nextTurnButton.addEventListener("click", () => {
  currentTurn = currentTurn === 1 ? 2 : 1;
  updateTurnLabel();
  updateActionAvailability();
  logMessage(`🔄 Comienza el turno del Jugador ${currentTurn}.`);
});

updateTurnLabel();
updateActionAvailability();
logMessage("🎮 Listo para la batalla. Agrega personajes para iniciar.");
