document.addEventListener("DOMContentLoaded", () => {
    managePoints();

    document.querySelector("#restart").addEventListener("click", () => {
        location.reload();
    })

    document.querySelector("#play").addEventListener("click", () => {
        const menu = document.querySelector("#menu");

        menu.style.opacity = 0;
        setTimeout(() => {
            menu.style.display = "none";
        }, 300);

        spawn();
    })
});

const spawnInterval = 1000;
const removeInterval = 3000;
const popSfx = new Audio("sfx/pop.mp3");
const fartSfx = new Audio("sfx/fart.mp3");
let spawner;
let greenRemover;
let x = Math.random();
let points = 0;

function spawn() {
    spawner = setInterval(() => {
        x = Math.random();
        
        if (x > 0.5) {
            spawnGreen();
        } else {
            spawnRed();
        }
    }, spawnInterval);
}

function spawnGreen() {
    const green = document.createElement('div');
        
    green.className = "green";
    green.classList.add("spawn", "dot");
    document.body.appendChild(green);
    green.addEventListener("click", pop);
    green.style.left = Math.floor(Math.random() * 90 + 1) + "%";
    green.style.top = Math.floor(Math.random() * 90 + 1) + "%";

    greenRemover = setTimeout(() => {
        removeDot(green);
    }, removeInterval);
}

function spawnRed() {
    const red = document.createElement('div');
        
    red.className = "red";
    red.classList.add("spawn", "dot");
    document.body.appendChild(red);
    red.addEventListener("click", pop);
    red.style.left = Math.floor(Math.random() * 90 + 1) + "%";
    red.style.top = Math.floor(Math.random() * 90 + 1) + "%";

    setTimeout(() => {
        removeDot(red);
    }, removeInterval);
}

function pop() {
    this.classList.add("pop");
    
    if (this.className.includes("green")) {
        clearTimeout(greenRemover);
        popSfx.play();
        managePoints("add");
    } else {
        fartSfx.play();
        managePoints("subtract");
        verifyGameOver();
    }
    
    setTimeout(() => {
        this.remove();
    }, 300);
}

function removeDot(dot) {
    dot.classList.add("implode");

    if (dot.className.includes("green")) {
        fartSfx.play();
        managePoints("subtract");
        verifyGameOver();
    }

    setTimeout(() => {
        dot.remove();
    }, 300);
}

function managePoints(action) {
    const pointsDisplay = document.querySelector("#points");

    if (action == "add") {
        points++;
    } else if (action == "subtract") {
        points --;
    } else if (action == "reset") {
        points = 0;
    }

    pointsDisplay.innerHTML = `<div class="spawn">${points}</div>`; 
}

function verifyGameOver() {
    if (points <= 0) {
        clearInterval(spawner);
        clearTimeout(greenRemover);
        managePoints("reset");
        document.querySelector("#gameOver").style.display = "block";
    }
}