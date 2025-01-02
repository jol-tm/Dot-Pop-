let spawnInterval;
let removeInterval;
let spawner;
let greenRemover;
let x = Math.random();
let diff;
let points = 0;

document.addEventListener("DOMContentLoaded", () => {
    managePoints();

    document.querySelector("#restart").addEventListener("click", () => {
        location.reload();
    })

    document.querySelector("#play").addEventListener("click", () => {
        const menu = document.querySelector("#menu");

        [...document.querySelectorAll(".diffOption")].some(element => {
            if (element.checked) {
                diff = element.value;
                console.log(diff);
                return true;
            }
        });

        menu.style.opacity = 0;
        setTimeout(() => {
            menu.style.display = "none";
        }, 300);

        if (diff == "easy") {
            spawnInterval = 1000;
            removeInterval = 2000;
        } else if (diff == "medium") {
            spawnInterval = 1000;
            removeInterval = 1000;
        } else if (diff == "hard") {
            spawnInterval = 500;
            removeInterval = 1000;
        }

        spawn();
    })
});

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
    const popSfx = new Audio("sfx/pop.mp3");
    const fartSfx = new Audio("sfx/fart.mp3");

    this.classList.add("pop");
    this.removeEventListener("click", pop);
    
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
    const fartSfx = new Audio("sfx/fart.mp3");

    dot.removeEventListener("click", pop);
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
        managePoints("reset");
        document.querySelector("#gameOver").style.display = "block";
    }
}