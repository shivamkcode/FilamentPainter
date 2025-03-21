export function setupDragAndDrop(options, callback) {
    const draggableList = document.getElementById(options.listId);
    const addItemButton = document.getElementById(options.addItemButtonId);
    let draggedItem = null;
    let itemCounter = document.querySelectorAll(`.${options.itemClassName}`).length + 1;
    if (!draggableList || !addItemButton) {
        console.error("Drag and drop list or add button not found.");
        return;
    }
    const attachDragHandlers = (dragHandle) => {
        dragHandle.setAttribute('draggable', 'true');
        dragHandle.addEventListener('dragstart', (e) => {
            const target = e.target;
            if (target.classList.contains(options.dragHandleClassName)) {
                draggedItem = target.parentElement;
                if (draggedItem) {
                    draggedItem.classList.add('dragging');
                }
                else {
                    e.preventDefault();
                }
            }
        });
    };
    draggableList.querySelectorAll(`.${options.dragHandleClassName}`).forEach(attachDragHandlers);
    draggableList.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
        callback(draggableList);
    });
    draggableList.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const afterElement = getDragAfterElement(draggableList, e.clientY, options.itemClassName);
            if (afterElement == null) {
                draggableList.appendChild(draggedItem);
            }
            else {
                draggableList.insertBefore(draggedItem, afterElement);
            }
        }
    });
    addItemButton.addEventListener('click', () => {
        const newItem = document.createElement('li');
        newItem.classList.add(options.itemClassName);
        newItem.innerHTML = `
                <div 
                class="${options.dragHandleClassName}" 
                draggable="true"> </div> 
                <span>${options.newItemPrefix} ${itemCounter} OwO
                </span>`;
        if (draggableList.firstChild) {
            draggableList.insertBefore(newItem, draggableList.firstChild);
        }
        else {
            draggableList.appendChild(newItem);
        }
        itemCounter++;
        const newDragHandle = newItem.querySelector(`.${options.dragHandleClassName}`);
        if (newDragHandle) {
            attachDragHandlers(newDragHandle);
        }
    });
}
function getDragAfterElement(container, y, itemClassName) {
    const draggableElements = [...container.querySelectorAll(`.${itemClassName}:not(.dragging)`)];
    return Array.from(draggableElements).reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
