import { updateAllQuantity, updateCompletedQuantity } from "./module.js";

const root = document.querySelector("#root");
let todos = [];

//  функции для работы с localstorage

function setDataToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getDataToLocalStorage() {
    if (localStorage.getItem("todos")) {
        todos = JSON.parse(localStorage.getItem("todos"))
        for(let i = 0; i < todos.length; i++) {
            createOneTodo(todos[i]);
        }
    }
    updateAllQuantity(todos);
    updateCompletedQuantity(todos);
}

// функция для создания элементов
function createElement(tag, className, placeAppend, text){
    const element = document.createElement(tag);
    element.classList.add(className);
    element.innerHTML = text;
    placeAppend.append(element);
    return element;
}


// создал блок навигации 
function createNavBlock(){
    const main = createElement("main", "main", root, ``);
    const mainContainer = createElement("div", "main-container", main, ``);
    const navigationBlock = createElement("nav", "navigation", mainContainer, '');
    
    // создал все элементы блока
    const deleteAllButton = createElement("button", "navigation__button", navigationBlock, "Delete All");
    const deleteLastButton = createElement("button", "navigation__button", navigationBlock, "Delete Last");
    const enterTodo = createElement("input", "navigation__input", navigationBlock, ``);
    enterTodo.placeholder = "Enter todo ...";
    const addButton = createElement("button", "navigation__button", navigationBlock, "Add")
    // нижний nav block
    const navigationBlockAdditional = createElement("nav", "navigation", mainContainer, '');
    const allQuantity = createElement("p", "navigation__info", navigationBlockAdditional, `All: ${todos.length}`);
    const completedQuantity = createElement("p", "navigation__info", navigationBlockAdditional, `Completed: 0`);
    completedQuantity.setAttribute("id", "completed"); // добавил id для того чтобы потом найти его в function updateCompletedQuantity()
    const showAllButton = createElement("button", "navigation__button", navigationBlockAdditional, "Show All");
    const showCompletedButton = createElement("button", "navigation__button", navigationBlockAdditional, "Show Completed");
    const searchTodo = createElement("input", "navigation__input", navigationBlockAdditional, ``);
    searchTodo.placeholder = "Search ...";
    const list = createElement("ul", "list", mainContainer, ``);

    // добавил дополнительные class-ы для стилизации полей разных размером
    deleteAllButton.classList.add("navigation__button_small");
    deleteLastButton.classList.add("navigation__button_small");
    enterTodo.classList.add("navigation__input_large");
    addButton.classList.add("navigation__button_small");
    showAllButton.classList.add("navigation__button_large");
    showCompletedButton.classList.add("navigation__button_large");
    searchTodo.classList.add("navigation__input_small");

    // события
    deleteAllButton.addEventListener("click", function(){
        list.innerHTML = '';
        todos = [];
        setDataToLocalStorage();
        updateAllQuantity(todos);
        updateCompletedQuantity(todos);
    })
    deleteLastButton.addEventListener("click", function(){
        todos.pop();
        setDataToLocalStorage();
        const allLi = document.querySelectorAll("li");
        if (allLi.length !== 0){
            const lastLi = allLi[allLi.length - 1];
            lastLi.remove();
        } else {
            alert("Don't have last element");
        }
        updateAllQuantity(todos);
        updateCompletedQuantity(todos);
    })
    addButton.addEventListener("click", function(){
        const inputValue = enterTodo.value;
        enterTodo.value = "";
        const tempDate = new Date();
        let obj = {
            text: inputValue,
            id: Date.now(),
            date: `${tempDate.getDate()}.${tempDate.getMonth() + 1}.${tempDate.getFullYear()}`,
            isChecked: false,
        }
        createOneTodo(obj);
        todos.push(obj);
        setDataToLocalStorage();
        updateAllQuantity(todos);
    });
    // событие для того чтобы после ввода в input и нажатии на Enter добавлялось todo
    enterTodo.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            // Вызывает событие addButton.click() после нажатия Enter
            addButton.click();
        }
    });
    // событие длф поиска
    searchTodo.addEventListener("input", function() {
        const query = searchTodo.value.toLowerCase();
        const items = document.querySelectorAll('.item__caption');
    
        items.forEach(item => {
            const text = item.value.toLowerCase();
            const listItem = item.parentElement;
    
            if (text.indexOf(query) !== -1) {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        });
    });
    // событие для all / completed
    showCompletedButton.addEventListener("click", function(){
        todos.forEach(todo => {
            const item = document.getElementById(todo.id);
            if (item) {
                item.style.display = todo.isChecked ? 'block' : 'none';
            }
        });
    });
    showAllButton.addEventListener("click", function(){
        const items = document.querySelectorAll(".item");
        items.forEach(item => {
            item.style.display = 'block';
        })
    })
}
createNavBlock()


function createOneTodo(obj){
    // деструктуризация
    let {text, id, date, isChecked} = obj;

    // добавил блок для элементов
    const list = document.querySelector(".list");
    const item = createElement("li", "item", list, ``);
    // добавление каждому todo уникального id
    item.setAttribute("id", id)
    // добавил элементы для todo
    const checkbox = createElement("input", "item__checkbox", item, ``);
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    const todoText = createElement("input", "item__caption", item, ``);
    todoText.value = text;
    const deleteButton = createElement("button", "item__button", item, "X");
    const dateNow = createElement("div", "item__info", item, `${date}`);
    
    // условие для восстановления completed классов
    if (isChecked) {
        item.classList.add("item_completed");
        todoText.classList.add("item__caption_completed");
    }

    // события
    deleteButton.addEventListener("click", function(){
        const indexToDelete = todos.findIndex(todo => todo.id === id);
        todos.splice(indexToDelete, 1);
        setDataToLocalStorage();
        item.remove();
        const allQuantity = document.querySelector(".navigation__info");
        allQuantity.textContent = `All: ${todos.length}`;
        updateCompletedQuantity(todos);
    });
    checkbox.addEventListener("click", function(){
        const indexToUpdate = todos.findIndex(todo => todo.id === id);
        if (indexToUpdate !== -1) {
            todos[indexToUpdate].isChecked = !todos[indexToUpdate].isChecked;
        }
        item.classList.toggle("item_completed");
        todoText.classList.toggle("item__caption_completed");
        updateCompletedQuantity(todos);
        setDataToLocalStorage(); 
    });
    // при изменении текста в todo значение сохраняется
    todoText.addEventListener("input", function(){
        text = todoText.value;
        const indexToUpdate = todos.findIndex(todo => todo.id === id);
        if(indexToUpdate !== -1){
            todos[indexToUpdate].text = text;
            setDataToLocalStorage();
        }
    });
}

getDataToLocalStorage();