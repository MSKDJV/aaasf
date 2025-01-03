(function () {
    const allowedDomain = "mskdjv.github.io"; // Укажите разрешённый домен
    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

    // Проверка: выполняется ли код в браузере
    if (!isBrowser) {
        console.error("Unauthorized usage detected. This script can only run in a browser.");
        process.exit(1); // Завершение работы для серверной среды
    }

    // Проверка домена
    if (window.location.hostname !== allowedDomain) {
        console.warn("Unauthorized usage detected on domain:", window.location.hostname);
        
        // Очистка содержимого страницы
        document.body.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: black;
            color: red;
            font-size: 3em;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        document.body.innerHTML = "Вы украли код!";

        // Остановка выполнения скрипта
        throw new Error("Unauthorized usage detected. Script execution stopped.");
    }

    // Ваш основной код
    console.log("Script is running on the authorized domain:", allowedDomain);

    // Пример функциональности
    function protectedFunction() {
        console.log("This is a protected function.");
    }

    protectedFunction();
})();


let lastBettingTime = 0; 
let tokenIndex = 0;

const tokens = [
    "demo",
    "demo",
    "demo"
];

function getAuthorizationToken() {
    const token = tokens[tokenIndex];
    tokenIndex = (tokenIndex + 1) % tokens.length;
    return `Bearer ${token}`;
}

function getRan(min, max) {
    return Math.random() * (max - min) + min;
}

async function checkSignal() {
    let randomNumber1 = getRan(1.1, 5.0).toFixed(2);
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';
    const response = await fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    });
    const data = await response.json();
    const state = data.current_state;


    let responseText = document.getElementById('responseText');
    if (!responseText) {
        console.error('Element with ID responseText not found.');
        return;
    }

    if (state === "betting" && Date.now() - lastBettingTime > 5000) {
        let resultText = `${randomNumber1}x`;
        document.getElementById("responseText").textContent = resultText;
        localStorage.setItem('resultText', resultText);
        responseText.className = 'text betting';        
        lastBettingTime = Date.now();
    } else if (state === "ending") {
        responseText.textContent = "Waiting..";
        responseText.className = 'text fly';
    } 
}

function fetchDataAndUpdate() {
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=1play_luckyjet';
    fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    })
        .then(response => response.json())
        .then(data => {
            const kef = parseFloat(data.current_coefficients);
            updateCoefficients(kef);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateCoefficients(coefficients) {
    const coefficientsDiv = document.getElementById('coefficients');
    if (!coefficientsDiv) {
        console.error('Element with ID coefficients not found.');
        return;
    }

    if (coefficients !== 1) {
        coefficientsDiv.innerText = `x${coefficients}`; 
        coefficientsDiv.classList.remove('smallt');
        coefficientsDiv.classList.add('kif');
    } 
}

fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 100);
let intervalId = setInterval(checkSignal, 100);
checkSignal();
