
const inputDisplayer = document.querySelector('#user-input');
const resultDisplayer = document.querySelector('#result');
const allKeys = document.querySelectorAll('[data-type]');

    let keys = '';
	let keyValue = '';
    let inputText = '';
    let resultText = '';
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
    inputText = inputDisplayer.textContent;
    resultText = resultDisplayer.textContent;
    const { type } = key.dataset;
    types =  type ;
    value  = key.id;
    

    switch (type) {

        case 'number':
            if (checkForDecimal.length > 16) break;
            if(!isEqualsPressed) {
                inputDisplayer.textContent = (inputText !== '0')? 
                    inputText + keyValue : keyValue;
                resultDisplayer.textContent = 
                    (inputText !== '0' && previousKey.type !== 'operator')? 
                    resultText + keyValue : keyValue;
            }else if(isEqualsPressed) {
                inputDisplayer.textContent = keyValue;
                resultDisplayer.textContent = keyValue;
            }

            checkForDecimal = checkForDecimal + keyValue;
            isEqualsPressed = false;  
            break;

        case 'operator':
            if (previousKey.type === 'operator') {
                inputDisplayer.textContent =
                inputText.substring(0, inputText.length - 2) + keyValue + ' ';
                data.operator = value;
                data.operatorsign = keyValue;
                break;
            }

            if (!isEqualsPressed && isNaN(inputText) ) {
                data.second = resultText;
                data.result = operate(data.first, data.operator, data.second);
                inputDisplayer.textContent = data.result + ' ' + keyValue + ' '; 
                data.first = data.result;
            }else if (!isEqualsPressed && !isNaN(inputText) ) {
                inputDisplayer.textContent = inputText + ' ' + keyValue + ' ';
                data.first = inputText;
            }

            if (!isEqualsPressed ) {
                resultDisplayer.innerHTML = '&nbsp;';
                data.operator = value;
                data.operatorsign = keyValue; 
                checkForDecimal = '';  
            }else{
                if (resultText === 'Undefined') return;
                inputDisplayer.textContent = data.result + ' ' + keyValue + ' ';
                resultDisplayer.innerHTML = '&nbsp;';
                data.first = data.result;
                data.operator = value; 
                data.operatorsign = keyValue;
                checkForDecimal = ''; 
                isEqualsPressed = false; 
            }
            break;

        case 'decimal':
            if (checkForDecimal.includes('.') || isEqualsPressed) break;
            inputDisplayer.textContent = (previousKey.type === 'operator')?
               inputText + '0' + keyValue : inputText + keyValue;
            resultDisplayer.textContent = (checkForDecimal === '')?
               '0' + keyValue : resultText + keyValue ;
            checkForDecimal = checkForDecimal + keyValue; 
            break;

        case 'backspace':
            if (previousKey.type === 'operator') break;
            if (inputText !== '0' && !isEqualsPressed) {
                inputDisplayer.textContent = (inputText.length > 1)? 
                inputText.substring(0, inputText.length - 1) : '0';
                (resultText.length > 1)? resultDisplayer.textContent = 
                   resultText.substring(0, resultText.length - 1) 
                   : resultDisplayer.innerHTML = '&nbsp;';
            checkForDecimal = checkForDecimal.substring(0,checkForDecimal.length-1);
            }
            break;

        case 'reset':
            inputText = '0';
			inputDisplayer.textContent = inputText;
			resultDisplayer.innerHTML = '&nbsp;';
			isEqualsPressed = false;
			checkForDecimal = '';
            break;

        case 'equal':
            if (!isEqualsPressed && (previousKey.type === 'operator' || 
                 !isNaN(inputText))) break;
            if (isEqualsPressed) {
                inputDisplayer.textContent = data.result + ' ' + data.operatorsign
                    + ' ' + data.second + ' ' + '=';
                data.result = operate(data.result, data.operator, data.second); 
            }else {
                data.second = resultText;
                data.result = operate(data.first, data.operator, data.second);
                inputDisplayer.textContent = inputText + ' ' + '='; 
                isEqualsPressed = true;
            }
            data.result = setupresult(data.result);
            resultDisplayer.textContent = data.result;
            break;

        default:
            break;
    } // end of switch.

    previousKey.type = types;
}// end of when clicked.


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
     
}// end of operate.


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
  
}// end of setupresult.


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