$(document).ready(function() {
  const result    = $('#result');
  const history   = $('#history');

  const operators = ['addBtn', 'substractBtn', 'multiplyBtn', 'divideBtn', 'equalBtn'];

  // Keep this single element in array before pressing any operator buttons
  let enterString = '';
  // Show history on panel
  let historyLog  = '';
  // Array to store input values before pressing equal/ operator buttons
  let processor   = [];
  // Check if result is sent
  let isComputed  = false;

  let inputResultCounter  = 0;
  let inputHistoryCounter = 0;

  // limit inputs length (9 digits) & historyLog (22 digits)
  function checkInputCount() {
    if (inputResultCounter > 9 || inputHistoryCounter > 22) {
      enterString = ''; historyLog = ''; processor = [];
      result.text(0); history.text('Digit Limit Met');
      inputResultCounter = 0; inputHistoryCounter = 0;
    }
    inputHistoryCounter = historyLog.length;
  }

  function resetProcessor() {
    enterString = ''; historyLog = ''; processor = [];
    inputResultCounter = 0; inputHistoryCounter = 0;
    result.text(0); history.text(0);
  }

  // If the button value is valid, add value to enterString
  function addElement(val) {
    // console.log('processor: ', processor);
    var lastElHistory = historyLog[historyLog.length-1];
    var checkDotInd   = enterString.indexOf('.');
    isComputed= false;
    // If input is an operator
    if (isNaN(Number(val)) && val !== '.') {
      checkDotInd = 0;
      // If the last element is an operator, don't add to historyLog
      if (lastElHistory !== '+' && lastElHistory !== '-'  && lastElHistory !== '×'  && lastElHistory !== '÷' ) {
        if (enterString == '') {
          result.text(val);
          addToHistory('0'+ val);
          processor[0] = '0';
        } else {
          result.text(val);
          addToHistory(val);
        }
        pushToProcessor(val);
      }
    } else if (val == '.') {
      // If . already exist
      if (checkDotInd < 0) {
        if (isNaN(Number(lastElHistory))) {
          enterString += '0.';
          addToHistory('0.');
        } else {
          enterString += '.';
          addToHistory('.');
        }
        result.text(enterString);
      }
    } else {
      // When press 0 button, check if it's the last element in historyLog is a number or not
      // If it's an operator, disable 0 button, if it's a number or dot, add 0 after
      if (Number(val) == 0) {
        if (isNaN(lastElHistory) && lastElHistory !== '.') {
          return;
        } else {
          enterString += '0';
        }
      } else {
        enterString += val;
      }
      result.text(enterString);
      addToHistory(val);
    }
    inputResultCounter++;
    checkInputCount();
  }

  function addToHistory(val) {
    historyLog += val;
    history.text(historyLog);
  }

  // Push enterString to processor after pressing operator buttons
  function pushToProcessor(opVal) {
    processor.push(enterString, opVal);
    enterString = '';
  }

  function removeElement() {
    enterString = (enterString.length > 0)? enterString = enterString.substr(0, enterString.length-1) : '';
    result.text(enterString);
    inputResultCounter--;
  }

  function removeFromHistory() {
    // Remove input number till it reaches the last operator
    let lastOp = processor[processor.length-1];
    let lastOpInd = historyLog.lastIndexOf(lastOp) + 1;

    historyLog = (historyLog.length > lastOpInd)? historyLog.substr(0, historyLog.length-1) : historyLog;
    history.text(historyLog);

    (inputHistoryCounter > historyLog.length)? inputHistoryCounter-- : inputHistoryCounter = historyLog.length;
    // console.log('Remove history counter: ' + inputHistoryCounter);
  }


  // When press equal button
  function computeResult() {
    let lastItem    = processor[processor.length-1];
    let lastOpInd   = historyLog.lastIndexOf(lastItem);
    let lastNumber  = historyLog.slice(lastOpInd+1, historyLog.length);
    // Add the last number to processor
    processor.push(lastNumber);

    var printResult = Number(processor[0]);

    processor.forEach(function(el, i) {
      let selectItem  = processor[i];
      let nextItem    = Number(processor[i+1]);
      // If current value is an operator, compute through processor
      switch (selectItem) {
        case '+':
        printResult += nextItem; break;
        case '-':
        printResult -= nextItem; break;
        case '×':
        printResult *= nextItem; break;
        case '÷':
        printResult /= nextItem;
      }
    });

    // Show result correctly (2 numbers after dot)
    printResult = Number.isInteger(printResult)? printResult : printResult.toFixed(2);
    printResult = (printResult[printResult.length-1] == 0)? Number(printResult).toFixed(1) : printResult;

    // Show result in panel, and clear values in processor
    enterString = ''; historyLog = ''; processor = [];
    enterString += printResult; historyLog  += printResult;

    // If result reaches digit limit
    if (printResult.toString().length > 9) {
      result.text(0); history.text('Digit Limit Met');
      historyLog = ''; enterString = ''; processor = [];
    } else {
      result.text(printResult); history.text(printResult);
    }
  }

  $('button').on('click', function(e) {
    e.preventDefault();
    // If id doesn't exist, then it's a normal number, simpily output number
    let selectedBtn = e.target;

    // If selected button is not a normal number
    if (selectedBtn.id !== '') {
      if (selectedBtn.id == 'ac') resetProcessor();
      if (selectedBtn.id == 'ce') {
        removeElement();
        removeFromHistory();
      }

      if (operators.includes(selectedBtn.id)) {
        let selectedOp = selectedBtn.id;

        switch (selectedOp) {
          case 'addBtn':
            addElement('+');
            inputHistoryCounter++;
            break;
          case 'substractBtn':
            addElement('-');
            inputHistoryCounter++;
            break;
          case 'multiplyBtn':
            addElement('×');
            inputHistoryCounter++;
            break;
          case 'divideBtn':
            addElement('÷');
            inputHistoryCounter++;
            break;
          case 'equalBtn':
            isComputed = true;
            computeResult();
        }

        inputResultCounter = 0;
        checkInputCount();
      }

      if (selectedBtn.id == 'zeroBtn' || selectedBtn.id == 'dotBtn') {
        isComputed == true ? resetProcessor() : false;
        addElement(selectedBtn.value);
        inputHistoryCounter++;
      }
    } else {
      // If selected button is a normal number
      isComputed == true ? resetProcessor() : false;
      addElement(selectedBtn.value);
      inputHistoryCounter++;
    }
    // console.log('InputHistoryCounter: ' + inputHistoryCounter);
  });

  // Enable key input
  $('body').keydown(function(e) {
    e.preventDefault();
    e.which == 8   ? $('#ce').click().addClass('ceBtn-fade') : true;
    e.which == 96  ? $('#zeroBtn').click().addClass('ani-fade') : true;
    e.which == 97  ? $('.btn1').click().addClass('ani-fade') : true;
    e.which == 98  ? $('.btn2').click().addClass('ani-fade') : true;
    e.which == 99  ? $('.btn3').click().addClass('ani-fade') : true;
    e.which == 100 ? $('.btn4').click().addClass('ani-fade') : true;
    e.which == 101 ? $('.btn5').click().addClass('ani-fade') : true;
    e.which == 102 ? $('.btn6').click().addClass('ani-fade') : true;
    e.which == 103 ? $('.btn7').click().addClass('ani-fade') : true;
    e.which == 104 ? $('.btn8').click().addClass('ani-fade') : true;
    e.which == 105 ? $('.btn9').click().addClass('ani-fade') : true;
    e.which == 106 ? $('#multiplyBtn').click().removeClass('op-btn').addClass('op-fade'): true;
    e.which == 107 ? $('#addBtn').click().removeClass('op-btn').addClass('op-fade'): true;
    e.which == 109 ? $('#substractBtn').click().removeClass('op-btn').addClass('op-fade'): true;
    e.which == 110 ? $('#dotBtn').click().addClass('ani-fade') : true;
    e.which == 111 ? $('#divideBtn').click().removeClass('op-btn').addClass('op-fade'): true;
    e.which == 13  ? $('#equalBtn').click().addClass('equalBtn-fade') : true;
    e.which == 116 ? window.location.reload(true) : true;
  }).keyup(function(e) {
    e.preventDefault();
    switch (e.which) {
      case 8:  $('#ce').removeClass('ceBtn-fade'); break;
      case 13: $('#equalBtn').removeClass('equalBtn-fade'); break;
      case 96: case 97: case 98: case 99: case 100:
      case 101: case 102:case 103:case 104: case 105:
      case 110: $('button').removeClass('ani-fade'); break;
      case 106: $('#multiplyBtn').removeClass('op-fade').addClass('op-btn'); break;
      case 107: $('#addBtn').removeClass('op-fade').addClass('op-btn'); break;
      case 109: $('#substractBtn').removeClass('op-fade').addClass('op-btn'); break;
      case 111: $('#divideBtn').removeClass('op-fade').addClass('op-btn');
    }
  });

});
