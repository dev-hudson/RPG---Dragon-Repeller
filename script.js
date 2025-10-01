let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ['stick'];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterName = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');

const weapons = [
    {name: 'bastão', power: 5},
    {name: 'punhal', power: 30},
    {name: 'martelo de garra', power: 50},
    {name: 'espada', power: 100}
];

const monsters = [
    {name: 'slime', level: 2, health: 15},
    {name: 'besta com presas', level: 8, health: 60},
    {name: 'dragão', level: 20, health: 300},
];
const locations = [
    {
        name: 'town square (Praça da cidade)',
        'button text': ['Go to store (Ir para loja)', 'Go to cave (Ir para caverna)', 'Fight dragon (Enfrentar o dragão)'],
        'button functions': [goStore, goCave, fightDragon],
        text: "Você está na praça da cidade. Você vê uma placa que diz \"Loja\"."
    },
    {
        name: "store (loja)",
        "button text": ["Compre 10 de saúde (10 de ouro)", "Comprar arma (30 de ouro)", "Vá para a praça da cidade"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "Você entrou na loja."
    },
    {
        name: 'cave (caverna)',
        'button text': ['Enfrentar slime', "Enfrentar fanged beast", "Vá para a praça da cidade"],
        'button functions': [fightSlime, fightBeast, goTown],
        text: "Você entrou na caverna. Você pode ver alguns monstros."
    },
    {
        name: 'fight (lutar)',
        'button text': ['Atacar', 'Esquivar', 'Correr'],
        'button functions': [attack, dodge, goTown],
        text: "Você está lutando contra um monstro"
    },
    {
        name: 'Matou o monstro',
        'button text': ['Ir para a praça da cidade', 'Ir para a praça da cidade', 'Ir para a praça da cidade'],
        'button functions': [goTown, goTown, easterEgg],
        text: `O monstro grita 'Arg!' ao morrer. Você ganha pontos de experiência e encontra ouro`
    },
    {
        
        name: 'Perdeu',
        'button text': ['REPLAY?', 'REPLAY?', 'REPLAY?'],
        'button functions': [restart, restart, restart],
        text: "Você morreu. &#x2620;"

    },
    {
        name: "Venceu",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: `Você matou o Dragão! VOCÊ VENCEU O JOGO! &#x1F389;`
    },
    {
        name: "easter egg", 
        "button text": ["2", "8", "Ir para praça da cidade?"], 
        "button functions": [pickTwo, pickEight, goTown], 
        text: `Você encontrou um jogo secreto. Escolha um número acima. Dez números serão escolhidos aleatoriamente entre 0 e 10. Se o número escolhido corresponder a um dos números aleatórios, você ganha.`
    }
];

function update(location) {
    monsterStats.style.display = 'none';
    button1.innerHTML = location['button text'][0];
    button2.innerHTML = location['button text'][1];
    button3.innerHTML = location['button text'][2];
    button1.onclick = location['button functions'][0]; 
    button2.onclick = location['button functions'][1];
    button3.onclick = location['button functions'][2];
    text.innerHTML = location.text;
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);           
}

function buyHealth() {
    if(gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = 'Você não tem ouro o suficiente para comprar saúde.';
    }
}
function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        
        if (gold >= 30) {
            gold -= 30;
            currentWeaponIndex ++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeaponIndex].name;
            text.innerText = `Agora você tem um(a) ${newWeapon}.`
            inventory.push(newWeapon);
            text.innerText += ` Você tem em seu inventário: ${inventory} `;
        } else {
            text.innerText = `Você não possui ouro suficiente para comprar uma arma.`
        }
    
    } else {
        text.innerText = "Você já possui a arma mais poderosa!";
        button2.innerText = "Vender arma por 15 de ouro";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = `Você vendeu um(a) ${currentWeapon}`;
        text.innerText += ` Você tem em seu inventário: ${inventory}`;
    } else {
        text.innerText = `Não venda sua única arma`;
    }
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = 'block';
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
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

function attack() {
    text.innerText = `O ${monsters[fighting].name} ataca.`;
    text.innerText += `Você ataca com sua ${weapons[currentWeaponIndex].name}.`;
    if (isMonsterHit()) {    
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += ` Você errou.`
    }
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        defeatMonster();
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += `Sua ${inventory.pop()} quebrou.`;
        currentWeaponIndex --;
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    return hit > 0 ? hit : 0;
}

function isMonsterHit () {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = `Você se esquiva do ${monsters[fighting].name}`;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = `Você escolheu ${guess}. Aqui estão os números aleatórios.`;
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + '\n';
    }
    if (numbers.includes(guess)) {
        text.innerText += `CERTO! Você ganhou 20 de ouro.`
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "ERRADO! Você perdeu 10 de vida";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

// inicializar botões
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
  
function goTown() {
    update(locations[0]);
}
