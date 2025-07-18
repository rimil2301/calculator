let display = document.getElementById('display');
let currentInput = '0';
let result = 0;

function appendToDisplay(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    display.textContent = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    result = 0;
    display.textContent = currentInput;
    document.getElementById('currencyResult').textContent = 'Currency: 0';
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
        currentInput = '0';
    }
    display.textContent = currentInput;
}

function applyFunction(func) {
    try {
        let num = parseFloat(currentInput);
        if (isNaN(num)) {
            throw new Error('Invalid input');
        }
        if (func === 'sqrt') {
            if (num < 0) {
                throw new Error('Cannot calculate square root of negative number');
            }
            result = Math.sqrt(num);
        } else if (func === 'cbrt') {
            result = Math.cbrt(num);
        }
        result = Number(result.toFixed(8));
        display.textContent = result;
        currentInput = result.toString();
        convertCurrency();
    } catch (error) {
        console.error('Function Error:', error.message);
        display.textContent = 'Error';
        currentInput = '0';
        setTimeout(clearDisplay, 1000);
    }
}

function calculate() {
    try {
        // Replace display operators with JavaScript-compatible operators
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        result = eval(expression);
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        result = Number(result.toFixed(8));
        display.textContent = result;
        currentInput = result.toString();
        convertCurrency();
    } catch (error) {
        console.error('Calculation Error:', error.message);
        display.textContent = 'Error';
        currentInput = '0';
        setTimeout(clearDisplay, 1000);
    }
}

async function convertCurrency() {
    const currency = document.getElementById('currency').value;
    if (!result) return;
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await response.json();
        const rate = data.rates[currency];
        const converted = (result * rate).toFixed(2);
        document.getElementById('currencyResult').textContent = `Currency: ${converted} ${currency}`;
    } catch (error) {
        console.error('Currency Conversion Error:', error.message);
        document.getElementById('currencyResult').textContent = 'Currency: Error';
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    // Map keyboard operators to display operators
    const operatorMap = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    if (/[0-9]/.test(key)) {
        appendToDisplay(key);
    } else if (operatorMap[key]) {
        appendToDisplay(operatorMap[key]);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (key === 's') {
        applyFunction('sqrt');
    } else if (key === 'c') {
        applyFunction('cbrt');
    }
});
