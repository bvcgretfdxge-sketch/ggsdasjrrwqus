const form = document.getElementById("character-form");
const teamOne = document.getElementById("team-1");
const teamTwo = document.getElementById("team-2");
const template = document.getElementById("character-template");
const battleLog = document.getElementById("battle-log");
const nextTurnButton = document.getElementById("next-turn");
const turnLabel = document.getElementById("turn-label");

let currentTurn = 1;

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

const setState = (card, state) => {
  card.dataset.state = state;
  const label = card.querySelector(".state-label");
  label.textContent = stateLabels[state];
  if (state === "attack") {
    logMessage(`⚔️ ${card.dataset.name} ejecuta un ataque rápido.`);
  }
  if (state === "heal") {
    logMessage(`💚 ${card.dataset.name} activa una cura de energía.`);
    const hpBar = card.querySelector(".hp-bar");
    hpBar.style.width = "100%";
  }
  if (state === "idle") {
    logMessage(`🌀 ${card.dataset.name} vuelve a estado idle.`);
  }
};

const createCharacterCard = ({ name, team, icon, role }) => {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".character-card");
  const iconElement = clone.querySelector(".character-icon");
  const nameElement = clone.querySelector(".character-name");
  const roleElement = clone.querySelector(".character-role");
  const hpBar = clone.querySelector(".hp-bar");

  card.dataset.name = name;
  iconElement.textContent = icon || characterIcons[role] || "⭐";
  nameElement.textContent = name;
  roleElement.textContent = role;
  hpBar.style.width = "100%";

  clone.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      setState(card, button.dataset.action);
    });
  });

  if (team === "2") {
    teamTwo.appendChild(clone);
  } else {
    teamOne.appendChild(clone);
  }

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
  logMessage(`🔄 Comienza el turno del Jugador ${currentTurn}.`);
});

updateTurnLabel();
logMessage("🎮 Listo para la batalla. Agrega personajes para iniciar.");
