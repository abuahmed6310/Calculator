
const userInput = document.querySelector('#user-input');
const displayResult = document.querySelector('#result');
const allKeys = document.querySelectorAll('[data-type]');

    let keys = '';
	let keyValue = '';
    let inputDisplay = '';
    let resultDisplay = '';
    let types = '';
    let  value  = '';

let isEqualsPressed = false;
let checkForDecimal = '';
let previousKey = { type: 'init' };
let data = {
    first: 0,
    second: 0,
    result: 0,
    operator: '',
    operatorsign: ''
  };

allKeys.forEach(key => key.addEventListener('click', whenClicked));

function whenClicked(event) {
    let key = event.target;
	keyValue = key.textContent;
    inputDisplay = userInput.textContent;
    resultDisplay = displayResult.textContent;
    const { type } = key.dataset;
    types =  type ;
    value  = key.id;
    
    
    if(type === 'number'&& checkForDecimal.length <= 16) {
        
            if(!isEqualsPressed) {
               userInput.textContent = (inputDisplay !== '0')? 
                  inputDisplay + keyValue : keyValue;
               displayResult.textContent = 
                  (inputDisplay !== '0' && previousKey.type !== 'operator')? 
                  resultDisplay + keyValue : keyValue;
            }else{
                userInput.textContent = keyValue;
                displayResult.textContent = keyValue;
            }
            checkForDecimal = checkForDecimal + keyValue;
            isEqualsPressed = false;

    }else if (types === 'operator' && previousKey.type !== 'operator') {
        if (!isEqualsPressed) {
            if (isNaN(inputDisplay)) {
                data.second = resultDisplay;
                data.result = operate(data.first, data.operator, data.second);
                userInput.textContent = data.result + ' ' + keyValue + ' '; 
                data.first = data.result;
            }else{
                userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
                data.first = inputDisplay;
            }
            displayResult.innerHTML = '&nbsp;';
            data.operator = value;
            data.operatorsign = keyValue; 
            checkForDecimal = '';  
        }else{
            if (resultDisplay === 'Undefined') return;
            userInput.textContent = data.result + ' ' + keyValue + ' ';
            displayResult.innerHTML = '&nbsp;';
            data.first = data.result;
            data.operator = value; 
            data.operatorsign = keyValue;
            checkForDecimal = ''; 
            isEqualsPressed = false; 
        }
    
    }else if (types === 'operator' && previousKey.type === 'operator') {
        userInput.textContent =
          inputDisplay.substring(0, inputDisplay.length - 2) + keyValue + ' ';
        data.operator = value;
        data.operatorsign = keyValue;

    }else if (types === 'decimal' && !isEqualsPressed && 
       !checkForDecimal.includes('.')) {
            userInput.textContent = (previousKey.type === 'operator')? 
               inputDisplay + '0' + keyValue :  inputDisplay + keyValue;
            displayResult.textContent = (checkForDecimal === '')?
               '0' + keyValue : resultDisplay + keyValue ;
			checkForDecimal = checkForDecimal + keyValue; 
        
    }else if(types === 'backspace' && inputDisplay !== '0' && !isEqualsPressed){
        if (previousKey.type === 'operator') return;
        userInput.textContent = (inputDisplay.length > 1)? 
            inputDisplay.substring(0, inputDisplay.length - 1) : '0';
        (resultDisplay.length > 1)? displayResult.textContent = 
             resultDisplay.substring(0, resultDisplay.length - 1) 
             : displayResult.innerHTML = '&nbsp;';
        checkForDecimal = checkForDecimal.substring(0,checkForDecimal.length-1);
        
	} else if(type === 'reset'){
			inputDisplay = '0';
			userInput.textContent = inputDisplay;
			displayResult.innerHTML = '&nbsp;';
			isEqualsPressed = false;
			checkForDecimal = '';
        
    }else if (types === 'equal') {
         
         if (isEqualsPressed) {
            userInput.textContent = data.result + ' ' + data.operatorsign
               + ' ' + data.second;
            data.result = operate(data.result, data.operator, data.second); 
         }else {
            if (previousKey.type === 'operator' || !isNaN(inputDisplay)) return;
            data.second = resultDisplay;
           data.result = operate(data.first, data.operator, data.second);
           isEqualsPressed = true;
       }
       
       data.result = setupresult(data.result);
       displayResult.textContent = data.result; 
       
    }

    previousKey.type = types;
}


function operate(firstNumber, operator, secondNumber)  {

    if (firstNumber === 'Undefined' || secondNumber === 'Undefined')
        return 'Undefined';

    firstNumber = Number(firstNumber);
    secondNumber = Number(secondNumber);
    
    if (operator === 'plus' || operator === '+')
       return add(firstNumber, secondNumber);
    else if (operator === 'minus' || operator === '-')
       return subtract(firstNumber, secondNumber);
    else if (operator === 'multiply' || operator === 'x')
       return multiply(firstNumber, secondNumber);
    else return divide(firstNumber, secondNumber);
     //(operator === 'divide' || operator === '/') 
}

function add(firstNumber, secondNumber) {
    return firstNumber + secondNumber;   
}
function subtract(firstNumber, secondNumber) {
    return firstNumber - secondNumber;   
}
function multiply(firstNumber, secondNumber) {
    return firstNumber * secondNumber;   
}
function divide(firstNumber, secondNumber) {
    if(secondNumber === 0) return 'Undefined';   
    return firstNumber / secondNumber;
}

function setupresult(result) {
  let resultstring = result.toString();
  if (resultstring.length > 16) {
      if (resultstring.includes('.')) {
          let decimalpt = resultstring.indexOf('.');
          if (decimalpt > 10) {
            return result.toExponential(2);  
          } else {
             return result.toFixed(16 - decimalpt); 
          }
      }else{
        return result.toExponential(2); 
      }
  }else{
    return result; 
  } 
  
}


// Event Listener for keyboard button press
document.addEventListener('keydown', (event) => {
	
	let getOperators = {
		'/': 'divide',
		'x': 'multiply',
		'*': 'multiply',
		'+': 'plus',
		'-': 'minus'
	}

	if(!isNaN(event.key) && event.key !== ' '){
		document.getElementById(`digit-${event.key}`).click();
	}
	if (['/', 'x', '+', '-', '*'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
	}
	if (event.key === 'Backspace' || event.key ==='c' || event.key === 'C') {
		document.getElementById('clear').click();	
	}
	if (event.key === '=' || event.key === 'Enter') {
		document.getElementById('equals').click();	
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();	
	}
});