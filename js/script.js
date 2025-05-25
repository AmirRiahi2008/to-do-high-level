"use strict";
// Filters Delete All Completed
const themeSwitcherBtn = document.getElementById("theme-switcher");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const clearCompleted = document.querySelector("#clear-completed");
const itemsLeft = document.querySelector("#items-left");
function themeSwitcher() {
  document.body.classList.toggle("light");

  const themeImage = themeSwitcherBtn.children[0];

  const themeState1 = themeImage.getAttribute("src").split("/");
  const themeState2 = themeState1[3].split("-");
  const themeState3 = themeState2[1].split(".");
  const themeState4 = themeState3[0];
  !localStorage.getItem("theme") ? 'moon' : localStorage.getItem("theme")
  localStorage.setItem("theme", themeState4);

  themeImage.setAttribute(
    "src",
    themeImage.getAttribute("src") === "./assets/images/icon-sun.svg"
      ? "./assets/images/icon-moon.svg"
      : "./assets/images/icon-sun.svg"
  );
}

window.addEventListener("load" , e => {

  const themeImage = themeSwitcherBtn.children[0];
  const theme = localStorage.getItem("theme")
  if (theme === "moon") {
    themeImage.setAttribute("src", "./assets/images/icon-sun.svg");
    document.body.classList.add("light");
  } else {
    themeImage.setAttribute("src", "./assets/images/icon-moon.svg");

    document.body.classList.remove("light");
  }
  localStorage.setItem("theme" , theme)
})


createHtml(JSON.parse(localStorage.getItem("todos")));
function addTodo() {
  const inp = todoInput.value.trim();
  if (inp) {
    const todos = !localStorage.getItem("todos")
      ? []
      : JSON.parse(localStorage.getItem("todos"));
    const structure = {
      todo: inp,
      isCompleted: false,
    };
    todos.push(structure);
    localStorage.setItem("todos", JSON.stringify(todos));
    createHtml([structure]);
    todoInput.value = "";
  }
}

filter.addEventListener("click", (e) => {
  const id = e.target.id;
  if (id) {
    document.querySelector(".on").classList.remove("on");
    e.target.classList.add("on");
    ul.className = `todos ${id}`;
  }
});

function deleteTodoFromLocalStorage(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function stateTodo(index, completed) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = completed;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function handleDragging(e) {
  if (
    e.target.classList.contains("card") &&
    !e.target.classList.contains("dragging")
  ) {
    const draggingCard = document.querySelector(".dragging");
    const allCards = [...document.querySelectorAll(".todos .card")];
    const curPos = allCards.indexOf(draggingCard);
    const newPos = allCards.indexOf(e.target);

    if (curPos > newPos) {
      ul.insertBefore(draggingCard, e.target);
    } else {
      ul.insertBefore(e.target, draggingCard);
    }

    const todos = JSON.parse(localStorage.getItem("todos"));
    const removed = todos.splice(curPos, 1);
    todos.splice(newPos, 0, removed[0]);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});
clearCompleted.addEventListener("click", (e) => {
  const indexes = [];

  const allCompletedCards = [...document.querySelectorAll(".todos .card")];
  document.querySelectorAll(".todos .card.checked").forEach((card, index) => {
    indexes.push(allCompletedCards.indexOf(card));
    card.classList.add("fall");
    card.addEventListener("animationend", (e) => {
      card.remove();
    });
  });
  clearCompleted_from_localStorage(indexes);
});

function clearCompleted_from_localStorage(indexes) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    // return !todo.isCompleted
    return !indexes.includes(index);
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function createHtml(todoArray) {
  if (!todoArray) {
    return null;
  }

  todoArray.forEach((todoObject, index) => {
    if (!todoObject) throw new Error("Debug Code");
    const li = document.createElement("li");
    li.classList.add("card");
    li.setAttribute("draggable", "true");
    const divCbContainer = document.createElement("div");
    divCbContainer.classList.add("cb-container");
    li.appendChild(divCbContainer);
    const inputCheckBox = document.createElement("input");
    inputCheckBox.classList.add("cb-input");
    inputCheckBox.setAttribute("type", "checkbox");
    const span = document.createElement("span");
    span.classList.add("check");
    divCbContainer.appendChild(inputCheckBox);
    divCbContainer.appendChild(span);

    const item = document.createElement("p");
    item.classList.add("item");
    item.textContent = todoObject.todo;
    li.appendChild(item);
    const btnClear = document.createElement("button");
    btnClear.classList.add("clear");
    const img = document.createElement("img");
    img.src = "./assets/images/icon-cross.svg";
    li.appendChild(btnClear);
    btnClear.appendChild(img);
    ul.appendChild(li);
    li.addEventListener("dragstart", (e) => {
      li.classList.add("dragging");
    });
    li.addEventListener("dragend", (e) => {
      li.classList.remove("dragging");
    });
    if (todoObject.isCompleted) {
      li.classList.add("checked");
      inputCheckBox.setAttribute("checked", "checked");
    }

    btnClear.addEventListener("click", (e) => {
      const curCard = e.target.parentElement.parentElement;

      const indexOfCarCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(curCard);
      deleteTodoFromLocalStorage(indexOfCarCard);
      curCard.classList.add("fall");
      setTimeout(() => {
        curCard.remove();
      }, 400);
      itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });
    inputCheckBox.addEventListener("click", (e) => {
      const curCard = e.target.parentElement.parentElement;
      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(curCard);
      const checked = inputCheckBox.checked;

      stateTodo(indexOfCurrentCard, checked);

      checked
        ? curCard.classList.add("checked")
        : curCard.classList.remove("checked");
      itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });
    li.addEventListener("dragover", handleDragging);
    itemsLeft.textContent = document.querySelectorAll(
      ".todos .card:not(.checked)"
    ).length;
  });
}

function init() {
  themeSwitcherBtn.addEventListener("click", themeSwitcher);
  addBtn.addEventListener("click", addTodo);
}
init();
