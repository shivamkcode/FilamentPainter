export interface DragAndDropOptions {
    listId: string;
    addItemButtonId: string;
    itemClassName: string;
    dragHandleClassName: string;
    newItemPrefix: string;
}

export function setupDragAndDrop(options: DragAndDropOptions): void {
    const draggableList = document.getElementById(options.listId) as HTMLUListElement;
    const addItemButton = document.getElementById(options.addItemButtonId) as HTMLButtonElement;
    let draggedItem: HTMLElement | null = null;
    let itemCounter = document.querySelectorAll(`.${options.itemClassName}`).length + 1;

    if (!draggableList || !addItemButton) {
        console.error("Drag and drop list or add button not found.");
        return;
    }

    const attachDragHandlers = (dragHandle: HTMLElement) => {
        dragHandle.setAttribute('draggable', 'true');
        dragHandle.addEventListener('dragstart', (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains(options.dragHandleClassName)) {
                draggedItem = target.parentElement;
                if (draggedItem) {
                    draggedItem.classList.add('dragging');
                } else {
                    e.preventDefault();
                }
            }
        });
    };

    // @ts-ignore
    draggableList.querySelectorAll(`.${options.dragHandleClassName}`).forEach(attachDragHandlers);

    draggableList.addEventListener('dragend', (e: DragEvent) => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
    });

    draggableList.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        if (draggedItem) {
            const afterElement = getDragAfterElement(draggableList, e.clientY, options.itemClassName);
            if (afterElement == null) {
                draggableList.appendChild(draggedItem);
            } else {
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
        } else {
            draggableList.appendChild(newItem);
        }

        itemCounter++;

        const newDragHandle = newItem.querySelector(`.${options.dragHandleClassName}`) as HTMLElement;
        if (newDragHandle) {
            attachDragHandlers(newDragHandle);
        }
    });
}

function getDragAfterElement(container: HTMLUListElement, y: number, itemClassName: string): HTMLElement | null {
    const draggableElements = [...container.querySelectorAll(`.${itemClassName}:not(.dragging)`) as NodeListOf<HTMLElement>];

    interface ClosestElement {
        offset: number;
        element: HTMLElement | null;
    }

    return Array.from(draggableElements).reduce((closest: ClosestElement, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}