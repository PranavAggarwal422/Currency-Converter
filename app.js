let message = document.querySelector(".msg");
let btn = document.querySelector("#submit-btn");
let selects = document.querySelectorAll(".select-container select");
let images = document.querySelectorAll(".select-container img");
let amountInput = document.querySelector("#amount-input");
let errorMsg = document.querySelector("#amount-error");
let swapBtn = document.querySelector("#swap-btn");
let themeBtn = document.querySelector("#theme-btn");
let loading = document.querySelector("#loading-spinner");

const BASE_URL = "https://v6.exchangerate-api.com/v6/2eef1e75c13e866e1ca65600/pair";
const cache = new Map(); // Cache for rates (key: 'from-to', value: {rate, timestamp})
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Debounce function for real-time updates
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const commonCurrencies = ["USD", "EUR", "INR", "GBP", "JPY"];
function preloadFlags() {
    commonCurrencies.forEach(currency => {
        if (countryList[currency]) {
            const img = new Image();
            img.src = `https://flagsapi.com/${countryList[currency]}/flat/64.png`; 
        }
    });
}

// Force refresh rates, bypassing cache
async function forceRefreshRates() {
    if (!validateAmount()) return;
    const from = selects[0].value;
    const to = selects[1].value;
    const amount = parseFloat(amountInput.value);
    const key = `${from}-${to}`;
    
    // Clear cache for this pair
    cache.delete(key);
    
    // Fetch fresh rates
    await getExchangeRates(from, to, amount);
}

// Validate amount input
function validateAmount() {
    const value = amountInput.value.trim();
    const num = Number(value);
    if (value === "" || Number.isNaN(num) || num <= 0) {
        errorMsg.textContent = "Please enter a valid positive number.";
        errorMsg.style.display = "block";
        btn.disabled = true;
        return false;
    }
    errorMsg.style.display = "none";
    btn.disabled = false;
    return true;
}

// Add options to selects
function addOption(currency) {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    selects[0].appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    selects[1].appendChild(option2);

    if (currency === "INR") option2.selected = true;
    if (currency === "USD") option1.selected = true;
}

// Fetch exchange rate with caching
async function getExchangeRates(from, to, amount = 1) {
    const key = `${from}-${to}`;
    const now = Date.now();

    if (cache.has(key) && (now - cache.get(key).timestamp) < CACHE_DURATION) {
        const rate = cache.get(key).rate;
        displayResult(amount, from, to, rate);
        return;
    }

    loading.style.display = "block";
    message.textContent = "";
    try {
        const response = await fetch(`${BASE_URL}/${from}/${to}`); 
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();
        const rate = data.conversion_rate;
        cache.set(key, { rate, timestamp: now });
        displayResult(amount, from, to, rate);
    } catch (error) {
        message.textContent = "Conversion failed. Check your connection and try again.";
        console.error(error);
    } finally {
        loading.style.display = "none";
    }
}

// Display result
function displayResult(amount, from, to, rate) {
    const result = (amount * rate).toFixed(5);
    message.textContent = `${amount} ${from} = ${result} ${to}`;
}

// Real-time conversion
const debouncedConvert = debounce(() => {
    if (validateAmount()) {
        getExchangeRates(selects[0].value, selects[1].value, parseFloat(amountInput.value));
    }
}, 500);

// Populate selects
for (const currency in countryList) {
    addOption(currency);
}

// Event listeners
selects[0].addEventListener("change", (e) => {
    const currency = e.target.value;
    const img = images[0];
    const container = img.parentElement;
    
    // Show loading spinner
    container.classList.add("loading-flag");
    
    img.onload = () => {
        container.classList.remove("loading-flag");
    };
    img.onerror = () => {
        container.classList.remove("loading-flag");
    };
    img.src = `https://flagsapi.com/${countryList[currency]}/flat/64.png`; 
    
    debouncedConvert();
});

selects[1].addEventListener("change", (e) => {
    const currency = e.target.value;
    const img = images[1];
    const container = img.parentElement;
    
    // Show loading spinner
    container.classList.add("loading-flag");
    
    img.onload = () => {
        container.classList.remove("loading-flag");
    };
    img.onerror = () => {
        container.classList.remove("loading-flag");
    };
    img.src = `https://flagsapi.com/${countryList[currency]}/flat/64.png`;
    
    debouncedConvert();
});

amountInput.addEventListener("input", debouncedConvert);

swapBtn.addEventListener("click", () => {
    const tempVal = selects[0].value;
    const tempImg = images[0].src;
    selects[0].value = selects[1].value;
    images[0].src = images[1].src;
    selects[1].value = tempVal;
    images[1].src = tempImg;
    debouncedConvert();
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    forceRefreshRates();
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.innerHTML = document.body.classList.contains("dark") ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// Initial load
window.addEventListener("load", () => {
    preloadFlags();
    btn.textContent = "Refresh Rate"; // Update button label
    btn.disabled = false; // Enable it by default
    validateAmount();
    getExchangeRates(selects[0].value, selects[1].value, parseFloat(amountInput.value));
});