let modalElement = document.querySelector(".modal-cont");
let addActionElem = document.querySelector(".plus");
let crossActionElem = document.querySelector(".cross");
let modalDisplay = false;
let crossIsActive = false;
let modalPriorityColorsElem = document.querySelectorAll(
  "div.priority-colors > .priority-color"
);
let mainContElem = document.querySelector(".main-cont");
let cardColor = "black";
let textAreaElem = document.querySelector(".task-area-text");
let colorsArr = ["lightpink", "lightblue", "lightgreen", "black"];
let taskArr =
  localStorage.getItem("Jira") === null
    ? []
    : JSON.parse(localStorage.getItem("Jira"));
let priorityColorElem = document.querySelectorAll(
  ".priority-cont > .priority-color"
);

if (taskArr.length != 0) {
  taskArr.forEach((card) =>
    createChildElement(card.textAreaValue, card.id, card.cardColor)
  );
}
addActionElem.addEventListener("click", (e) => {
  modalDisplay = !modalDisplay;

  if (modalDisplay) {
    modalElement.style.display = "flex";
  } else {
    cleanupModal();
  }
});

function cleanupModal() {
  modalElement.style.display = "none";
  modalPriorityColorsElem.forEach((colorCard) => {
    if (colorCard.classList.contains("border"))
      colorCard.classList.remove("border");
  });
  modalPriorityColorsElem[3].classList.add("border");
  textAreaElem.value = "";
  cardColor = "black";
}

modalPriorityColorsElem.forEach((priorityColor) => {
  priorityColor.addEventListener("click", function (e) {
    modalPriorityColorsElem.forEach((colorCard) => {
      if (colorCard.classList.contains("border"))
        colorCard.classList.remove("border");
    });
    cardColor = priorityColor.classList[0];
    priorityColor.classList.add("border");
  });
});

modalElement.addEventListener("keydown", function (e) {
  let key = e.key;
  let id = shortid();
  if (key === "Escape") {
    let textAreaValue = textAreaElem.value;
    createChildElement(textAreaValue, id, cardColor);
    taskArr.push({ cardColor, id, textAreaValue });
    localStorage.setItem("Jira", JSON.stringify(taskArr));
    cleanupModal();
  }
});

function createChildElement(textAreaValue, id, cardColor) {
  let divElem = document.createElement("div");
  divElem.setAttribute("class", "task-cont");
  divElem.innerHTML = `<div class="task-color ${cardColor}"></div>
        <div class="task-id">${id}</div>
        <div class="task-text">${textAreaValue}</div>
        <div class="task-lock"><i class="fa-solid fa-lock"></i></div>`;
  mainContElem.appendChild(divElem);
  handeColorChange(divElem, id);
  handleLock(divElem, id);
  handleRemoval(divElem, id);
}

function handleRemoval(elem, id) {
  elem.addEventListener("click", (e) => {
    if (crossIsActive) {
      elem.remove();
      let idx = taskArr.findIndex((task) => task.id === id);
      taskArr.splice(idx, 1);
      localStorage.setItem("Jira", JSON.stringify(taskArr));
    }
  });
}

function handleLock(elem, id) {
  let lockElem = elem.children[3];
  let textElem = elem.children[2];
  let isLock = true;
  lockElem.addEventListener("click", (e) => {
    isLock = !isLock;
    if (isLock) {
      lockElem.innerHTML = `<i class="fa-solid fa-lock"></i>`;
      textElem.setAttribute("contenteditable", "false");
      let changedText = textElem.innerText;
      updateTaskArrText(id, changedText);
    } else {
      lockElem.innerHTML = `<i class="fa-solid fa-unlock"></i>`;
      textElem.setAttribute("contenteditable", "true");
    }
  });
}

function updateTaskArrText(id, text) {
  taskArr.forEach((task) => {
    if (task.id === id) {
      task.textAreaValue = text;
    }
  });
  localStorage.setItem("Jira", JSON.stringify(taskArr));
}

function handeColorChange(elem, id) {
  let htmlElem = elem.children;
  let taskColorElem = htmlElem[0];

  taskColorElem.addEventListener("click", (e) => {
    let currentColor = e.target.classList[1];
    let currentColorIdx = colorsArr.findIndex(
      (color) => color === currentColor
    );
    let idx = (currentColorIdx + 1) % colorsArr.length;
    let newColor = colorsArr[idx];
    e.target.classList.remove(currentColor);
    e.target.classList.add(newColor);

    updateTaskArr(id, newColor);
  });
}

function updateTaskArr(id, color) {
  taskArr.forEach((task) => {
    if (task.id === id) {
      task.cardColor = color;
    }
  });
  localStorage.setItem("Jira", JSON.stringify(taskArr));
}

priorityColorElem.forEach((colorCard) => {
  colorCard.addEventListener("click", (e) => {
    let colorSelected = e.target.classList[0];
    let filteredArr = taskArr.filter((task) => {
      return task.cardColor === colorSelected;
    });
    clearCardsOnScreen();
    filteredArr.forEach((card) =>
      createChildElement(card.textAreaValue, card.id, card.cardColor)
    );
  });

  colorCard.addEventListener("dblclick", (e) => {
    clearCardsOnScreen();
    taskArr.forEach((card) =>
      createChildElement(card.textAreaValue, card.id, card.cardColor)
    );
  });
});

function clearCardsOnScreen() {
  let elems = document.querySelectorAll(".task-cont");
  elems.forEach((card) => card.remove());
}

crossActionElem.addEventListener("click", function (e) {
  crossIsActive = !crossIsActive;
  if (crossIsActive) {
    crossActionElem.style.backgroundColor = "#d2dae2";
  } else {
    crossActionElem.style.backgroundColor = "#3d3d3d";
  }
});
