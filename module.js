// функция для обновления строки All
export function updateAllQuantity(array) {
    const allQuantity = document.querySelector(".navigation__info")
    allQuantity.textContent = `All: ${array.length}`;
}

// функция для обновления строки Completed
export function updateCompletedQuantity(array) {
    let counter = 0;
    array.forEach(todo => {
        if (todo.isChecked){
            counter++;
        }
    })
    const completedQuantity = document.querySelector("#completed");
    completedQuantity.textContent = `Completed: ${counter}`;
}