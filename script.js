let display = document.querySelector('.result');
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function inputNumber(num) {
    if (waitingForOperand) {
        currentInput = num;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    
    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.charAt(0) === '-' ? 
            currentInput.slice(1) : '-' + currentInput;
        updateDisplay();
    }
}

function percentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

function setOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const newValue = performCalculation(currentValue, inputValue, operator);

        currentInput = String(newValue);
        previousInput = newValue;
        updateDisplay();
    }

    waitingForOperand = true;
    operator = nextOperator;

    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = [...document.querySelectorAll('.btn-operator')]
        .find(btn => btn.textContent === nextOperator);
    if (activeBtn && nextOperator !== '=') {
        activeBtn.classList.add('active');
    }
}

function calculate() {
    const inputValue = parseFloat(currentInput);

    if (previousInput !== null && operator) {
        const newValue = performCalculation(previousInput, inputValue, operator);
        
        currentInput = String(newValue);
        previousInput = null;
        operator = null;
        waitingForOperand = false;
        
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
        });
        
        updateDisplay();
    }
}

function performCalculation(firstValue, secondValue, operator) {
    switch (operator) {
        case '+':
            return firstValue + secondValue;
        case '-':
            return firstValue - secondValue;
        case '×':
            return firstValue * secondValue;
        case '÷':
            return secondValue !== 0 ? firstValue / secondValue : 0;
        default:
            return secondValue;
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        setOperator('+');
    } else if (key === '-') {
        setOperator('-');
    } else if (key === '*') {
        setOperator('×');
    } else if (key === '/') {
        event.preventDefault();
        setOperator('÷');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
    } else if (key === '%') {
        percentage();
    }
});

updateDisplay();