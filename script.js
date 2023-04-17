'use strict';
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const MIN_IN_MILLISECONDS = 60 * 1000;
const SEC_IN_MILLISECONDS = 1000;

let inputStart = document.querySelector(".inputStart");
let inputEnd = document.querySelector(".inputEnd");
let persetWeek = document.querySelector('#week');
let persetMonth = document.querySelector("#month");
let persetNone = document.querySelector('#none');
let inputSelectedDays = document.querySelector(".selectedDays"); 
let inputDimension = document.querySelector(".dimension");
let inputPreset = document.querySelector(".preset")
let calculate = document.querySelector(".calculate");
let viewResult = document.querySelector(".viewResult");
let startForLocal = document.querySelector(".startLocal");
let endForLocal = document.querySelector(".endLocal");
let resultForLocal = document.querySelector(".resultLocal");
let tableLocal = document.querySelector(".tableLocal");
let dateEnd = document.querySelector(".dateEnd");
let clear = document.querySelector('.clear');
let dimension = inputDimension.value;
let result;
let resultData = [];
let j = 0;

if (localStorage.getItem('result') !== null) {
  resultData = JSON.parse(localStorage.getItem('result'));
  for (j = 0; j < resultData.length; j++) {
    let newline = document.createElement("tr");
    newline.className = `${j}`;
    newline.innerHTML = `<th scope="row">${j + 1}</th> <td>${resultData[j].startStorage}</td><td>${resultData[j].endStorage}</td><td>${resultData[j].result}</td>`;
    tableLocal.prepend(newline);
  } 
} 

inputStart.addEventListener("change", () => {
  inputEnd.disabled = false;
})
inputEnd.addEventListener("change", () => {
  if (Date.parse(inputEnd.value) < Date.parse(inputStart.value)) {
    calculate.disabled = true;
    dateEnd.style.display = "block";
  } else {
    calculate.disabled = false;
    dateEnd.style.display = "none";
  }
})
persetWeek.addEventListener("change", () => {
  let d = new Date(inputStart.value);
  let inputEndTemp = new Date(d.setDate(d.getDate() + 7));
  inputEnd.value = formatDate(inputEndTemp);
  console.log("inputEnd", inputEndTemp)
})
persetMonth.addEventListener("change", () => {
  let d = new Date(inputStart.value);
  let inputEndTemp = new Date(d.setMonth(d.getMonth() + 1));
  inputEnd.value = formatDate(inputEndTemp);
  console.log(inputEnd.value);
})
persetNone.addEventListener("change", () => {
  inputEnd.value = "";
})

if (inputStart.value === "" || inputEnd.value === "") {
  calculate.disabled = true;
}
clear.addEventListener('click', () => {
  inputStart.value ="";
  inputEnd.value = "";
  inputEnd.disabled = true;
})

calculate.addEventListener("click", () => {
  let start = Date.parse(inputStart.value);
  let end = Date.parse(inputEnd.value);
  let selectedDays = inputSelectedDays.value;
  let dimension = inputDimension.value;
  let resultMillisec = end - start;
  let result;
  if (selectedDays === "allDay") {
    switch (dimension) {
      case "seconds":
        result = `${resultMillisec / SEC_IN_MILLISECONDS} SECONDS`;
        break;
      case "minuts":
        result = `${resultMillisec / MIN_IN_MILLISECONDS} MINUTS`;
        break;
      case "hours":
        result = `${resultMillisec / HOUR_IN_MILLISECONDS} HOURS`;
        break;
      case "days":
        result = `${resultMillisec / DAY_IN_MILLISECONDS} DAYS`;
        break;
    }
    viewResult.innerHTML = `RESULT: ${result}`;
  }
  if (selectedDays === "weekends") {
    let resultDay = resultMillisec / 86400000;
    let day = 0;
    let currentlyDay;
    let getday = new Date();
    for (let i = 0; i <= resultDay; i++) {
      getday.setTime(start + 86400000 * i);
      currentlyDay = getday.getDay();
      if (currentlyDay === 0 || currentlyDay === 6) {
        day++;
      }
    }
    result = convertTime(day);
    console.log(result);
    viewResult.innerHTML = `RESULT: ${result}`;
  }
  if (selectedDays === "weekdays") {
    let resultDay = resultMillisec / 86400000;
    let day = 0;
    let currentlyDay;
    let getday = new Date();
    for (let i = 0; i <= resultDay; i++) {
      getday.setTime(start + 86400000 * i);
      currentlyDay = getday.getDay();
      if (currentlyDay === 1 || currentlyDay === 2 || currentlyDay === 3|| currentlyDay === 4|| currentlyDay === 5) {
        day++;
      }
    }
    result = convertTime(day);
    viewResult.innerHTML = `RESULT: ${result}`;
  }
  let resultStorage = {
    startStorage: inputStart.value,
    endStorage: inputEnd.value,
    result: result,
  }
  
  if (resultData.length >= 10) {
    resultData.shift();
  }
  resultData.push(resultStorage);

  localStorage.setItem("result", JSON.stringify(resultData));
  console.log(resultData);
  console.log();
  let newLineData = JSON.parse(localStorage.getItem('result'));
  if (result.length <= 10) {
    let newline = document.createElement("tr");
    newline.className = `${j}`;
    newline.innerHTML = `<th scope="row">${j + 1}</th> <td>${newLineData[j].startStorage}</td><td>${newLineData[j].endStorage}</td><td>${newLineData[j].result}</td>`;
    tableLocal.prepend(newline);
    j++;
  } else {
    
  }
  
})

function viewResultField() {
  viewResult.style.display = "block";
};

calculate.addEventListener('click', viewResultField);

function formatDate(inputEndTemp) {
  const date = new Date(inputEndTemp);
  let DD = date.getDate();
   if (DD <10) { 
    DD = "0"+ DD;
  }
  let MO = date.getMonth() + 1;
  if (MO <10) { 
    MO = "0"+ MO;
  }
  let YYYY= date.getFullYear();
  let inputEnd = YYYY + "-" + MO + "-" + DD ;
  return inputEnd;
}

function convertTime(day) {
  switch (inputDimension.value) {
    case "seconds":
      result = `${day * 86400} SECONDS`;
      break;
    case "minuts":
      result = `${day * 1440} MINUTS`;
      break;
    case "hours":
      result = `${day * 24} HOURS`;
      break;
    case "days":
      result = `${day} DAYS`;
      break;
  }
  console.log(result);
  return result;
}
