let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stick"];
let dodgeCount = 0;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const weaponText = document.querySelector("#weaponText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name: "Stick",
    power: 5,
  },

  {
    name: "Dagger",
    power: 30,
  },

  {
    name: "Claw Hammer",
    power: 50,
  },

  {
    name: "Sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15,
  },

  {
    name: "Fanged Beast",
    level: 8,
    health: 60,
  },

  {
    name: "Dragon",
    level: 20,
    health: 300,
  },
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town sqaure. You see a sign that says "Store".',
  },

  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You have entered the store",
  },

  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You have entered the cave. You see some monsters.",
  },

  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Got to town"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },

  {
    name: "kill monster",
    "button text": ["Go to town", "Go to town", "Go to town"],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!!" as it dies.\n You earn experience and fine gold!',
  },

  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die 💀",
  },

  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeated the dragon!!\n You win the game!!!",
  },
];

// initialise button
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  dodgeCount = 0;

  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  text.innerText = location["text"];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  // console.log("Going to store");
  update(locations[1]);
}

function goCave() {
  //   console.log("Going to cave");
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;

    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold!";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;

      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      weaponText.innerText = newWeapon;
      text.innerText = "You have bought: " + newWeapon;
      inventory.push(newWeapon);
      text.innerText += "\nYour current inventory is: " + inventory;
    } else {
      text.innerText = "You do not have enough gold!";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon (15 gold)";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += "\nYour current inventory is: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon.";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    "\nYou attack it with your " + weapons[currentWeapon].name + ".";

  if (isMonsterHit()) {
    health -= getAttacked(monsters[fighting].level);
  } else {
    text.innerText += "\nYou miss!";
  }
  monsterHealth -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    healthText.innerText = 0;
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }

      if (Math.random() <= 0.1 && inventory.length !== 1) {
        currentWeapon--;
        weaponText.innerText = inventory[currentWeapon];
        text.innerText += "\nYour " + inventory.pop() + " breaks!";
      }
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function getAttacked(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  return hit;
}

function dodge() {
    dodgeCount++ ; 
    text.innerText = "You try to dodge the attack from " + monsters[fighting].name + ".";
    if (dodgeCount < 5){
        if (Math.random() > 0.25){
            text.innerText += "\nYou dodge the attack successfully.";
            health += Math.floor(monsters[fighting].level / 2);
            healthText.innerText = health;
        } else {
            text.innerText += "\nYou failed to dodge.";
            health -= Math.floor(monsters[fighting].level / 4);
            healthText.innerText = health;
        }
    } else {
        if (Math.random() > 0.5){
            text.innerText += "\nYou dodge the attack successfully.";
            health += Math.floor(monsters[fighting].level / 4);
            healthText.innerText = health;
        } else {
            text.innerText += "\nYou failed to dodge.";
            health -= Math.floor(monsters[fighting].level / 2);
            healthText.innerText = health;
        }
    }
}

function lose() {
  health.innerText = 0;
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function defeatMonster() {
  gold += monsters[fighting].level * 5;
  xp += monsters[fighting].level;

  goldText.innerText = gold;
  xpText.innerText = xp;
  monsterHealthText.innerText = 0;

  update(locations[4]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}
