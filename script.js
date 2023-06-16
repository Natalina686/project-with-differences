'use strict';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const MIN_IN_MILLISECONDS = 60 * 1000;
const SEC_IN_MILLISECONDS = 1000;

const inputStart = document.querySelector(".inputStart");
const inputEnd = document.querySelector(".inputEnd");
const inputSelectedDays = document.querySelector(".selectedDays");
const inputDimension = document.querySelector(".dimension");
const inputPreset = document.querySelector(".preset");
const calculate = document.querySelector(".calculate");
const viewResult = document.querySelector(".viewResult");
const dateEnd = document.querySelector(".dateEnd");
const presetWeek = document.querySelector("#week");
const presetMonth = document.querySelector("#month");
const presetNone = document.querySelector("#none");
const startForLocal = document.querySelector(".startLocal");
const endForLocal = document.querySelector(".endLocal");
const resultForLocal = document.querySelector(".resultLocal");
const tableLocal = document.querySelector(".tableLocal");
let clear = document.querySelector(".clear");
let dimension = inputDimension.value;
let result;
let resultData = [];


presetMonth.addEventListener("change", () => {
  let date = new Date(inputStart.value);
  let inputEndTemp = new Date(date.setMonth(date.getMonth() + 1));
  inputEnd.value = formatDate(inputEndTemp);
  console.log(inputEnd.value);
  inputEnd.disabled = false;
});

presetNone.addEventListener("change", () => {
  inputEnd.value = "";
});

if (inputStart.value === "" || inputEnd.value === "") {
  calculate.disabled = true;
}

const renderHistoryTable = () => {
  const resultData = JSON.parse(localStorage.getItem("result"));

  tableLocal.innerHTML = "";

  resultData.forEach((resultObj, index) => {
    let newline = document.createElement("tr");
    newline.className = index;
    newline.innerHTML = `<th scope="row">${index + 1}</th> <td>${
      resultObj.startStorage}</td><td>${resultObj.endStorage}</td><td>${resultObj.result}</td>`;
    tableLocal.prepend(newline);
    if (localStorage.getItem("result") !== null) {
      renderHistoryTable();
    }
  });
  
};


const storeResultInLocalStorage = (result) => {
  const resultData = JSON.parse(localStorage.getItem("result")) || [];

  if (resultData.length >= 10) {
    resultData.shift();
  }

  resultData.push({
    startStorage: inputStart.value,
    endStorage: inputEnd.value,
    result: result
  });

  localStorage.setItem("result", JSON.stringify(resultData));
};

function viewResultField() {
  viewResult.style.display = "block";
}
 
function formatDate(inputEndTemp) {
  const date = new Date(inputEndTemp);

  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  let month = date.getMonth() + 1;
  if (month <10) { 
    month = "0"+ month;
  }

 let year= date.getFullYear();
 return `${day} - ${month} -${year}`;
}

function convertTime(day) {
  switch (inputDimension.value) {
    case "seconds":
      result = `${day * SECONDS_IN_DAY} SECONDS`;
      break;
    case "minuts":
      result = `${day * MINUTES_IN_DAY} MINUTS`;
      break;
    case "hours":
      result = `${day * HOURS_IN_DAY} HOURS`;
      break;
    case "days":
      result = `${day} DAYS`;
      break;
  }
  console.log(result);
  return result;
}

function isWeekend(date) {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}
function countWeekendsDays(start, end) {
  let resultMillisec = new Date(end) - new Date(start);
  let resultDay = resultMillisec / DAY_IN_MILLISECONDS;

  let day = 0;

  for (let i = 0; i <= resultDay; i++) {
    const newDate = new Date();
    newDate.setTime(Date.parse(start) + DAY_IN_MILLISECONDS * i);

    if (isWeekend(newDate)) {
      day++;
    }
  }

  return day;
}

function countWeekdaysDays(start, end) {
  let resultMillisec = new Date(end) - new Date(start);
  let resultDay = resultMillisec / DAY_IN_MILLISECONDS;

  let day = 0;

  for (let i = 0; i <= resultDay; i++) {
    const newDate = new Date();
    newDate.setTime(Date.parse(start) + DAY_IN_MILLISECONDS * i);

    if (!isWeekend(newDate)) {
      day++;
    }
  }

  return day;
}




inputStart.addEventListener("change", () => {
  inputEnd.disabled = false;
});

inputEnd.addEventListener("change", () => {
  if (Date.parse(inputEnd.value) < Date.parse(inputStart.value)) {
    calculate.disabled = true;
    dateEnd.style.display = "block";
  } else {
    calculate.disabled = false;
    dateEnd.style.display = "none";
  }
});

presetWeek.addEventListener("change", () => {
  let date = new Date(inputStart.value);
  let inputEndTemp = new Date(date.setDate(date.getDate() + 7));
  inputEnd.value = formatDate(inputEndTemp);
  console.log("inputEnd", inputEndTemp);
  inputEnd.disabled = false;
});
clear.addEventListener("click", () => {
  inputStart.value = "";
  inputEnd.value = "";
  inputEnd.disabled = true;
});

calculate.addEventListener("click", () => {
  let selectedDays = inputSelectedDays.value;
  let dimension = inputDimension.value;
  let resultMillisec = Date.parse(inputEnd.value) - Date.parse(inputStart.value);
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

    
  }
  if (selectedDays === "weekends") {
    result = convertTime(countWeekendsDays(inputStart.value, inputEnd.value));
    
    }
  
  if (selectedDays === "weekdays") {
    result = convertTime(countWeekdaysDays(inputStart.value, inputEnd.value));
    
    }

    viewResult.innerHTML = `RESULT: ${result}`;
  storeResultInLocalStorage(result);
  
  renderHistoryTable();
});
calculate.addEventListener("click", viewResultField);