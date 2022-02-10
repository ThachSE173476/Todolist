const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const content = $('.content')
const addBtn = $('.header-icon')
const editPlace =  $('.edit-place')
const nameInput = $('.todo-input')
const desInput = $('.input-des')
const saveBtn = $('.input-save')
const cancelBtn = $('.input-cancel')
const editMarks = $$('.todo-block-edit .mark-item-bullet')
const markItems = $$('.sidebar .mark-item')
const sidebarHide = $('.sidebar-hide')


// Event Listener
window.addEventListener('load', setFromLocalStorage)
autoResizeTextarea(desInput)
desInput.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
    
        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
          "\t" + this.value.substring(end);
    
        // put caret at right position again
        this.selectionStart =
          this.selectionEnd = start + 1;
      }
})
addBtn.addEventListener('click', function() {
    if (editPlace.classList.contains('display-none')) {
        editPlace.classList.remove('display-none')
    }
})

editMarks.forEach(function(editMark) {
    editMark.addEventListener('click', function() {
        editMark.classList.toggle('choose')
    })
})

cancelBtn.addEventListener('click', function() {
    editPlace.classList.add('display-none')
    resetInput()
})

saveBtn.addEventListener('click', function() {
    let listMarks = []
    editMarks.forEach(function(editMark) {
        if (editMark.classList.contains('choose')) {
            listMarks.push(editMark.classList[1])
        }
    })

    render(nameInput.value, desInput.value, listMarks)
    resetInput()
    editPlace.classList.add('display-none')
})

// Filter
markItems.forEach(function(markItem) {
    let isFilter = false
    markItem.addEventListener('click', function() {
        if (isFilter == false) {
            const markFiler = markItem.classList[1]
            const todoList = document.querySelectorAll('.todo-block')
            todoList.forEach(function(todoItem) {
                todoItem.classList.add('display-none')
                let marks = todoItem.querySelectorAll('.mark-item-bullet')
                marks.forEach(function(mark) {
                    if (mark.classList[1] == markFiler) {
                        todoItem.classList.remove('display-none')
                    }
                })
            })
            isFilter = true
        } else if(isFilter == true) {
            const todoList = document.querySelectorAll('.todo-block')
            todoList.forEach(function(todoItem) {
                todoItem.classList.remove('display-none')
            })
            isFilter = false
        }
    })
})

let isDoneFilter = false
sidebarHide.addEventListener('click', function() {
    sidebarHide.classList.toggle('checked')
    const blocks = document.querySelectorAll('.todo-block')
    if (isDoneFilter == false) {
        blocks.forEach(function(block) {
            if (block.classList.contains('done')) {
                block.classList.add('display-none')
            }
        })
        isDoneFilter = true
    } else {
        blocks.forEach(function(block) {
            block.classList.remove('display-none')
        })
        isDoneFilter = false
    }
})

function render(name, des, marks) {
    htmls = `
    <div class="todo">
        <div class="todo-header">
            <h1>${name}</h1>
            <i class="fa-solid fa-ellipsis"></i>
            <ul class="todo-edit">
                <li class="edit">Edit</li>
                <li class="delete">Delete</li>
            </ul>
        </div>
        <div class="todo-des">
            <p>${des}</p>
        </div>
        <div class="todo-footer">
            <div class="todo-footer-mark">
                <div class="mark-item-bullet exercise display-none"></div>
                <div class="mark-item-bullet study display-none"></div>
                <div class="mark-item-bullet important display-none"></div>
            </div>
            <div class="hide-done todo-hide">
                <div class="check">
                    <i class="fas fa-check"></i>
                </div>
                <p>Done</p>
            </div>
        </div>
    </div>`
    // Render HTML
    let newBlock = document.createElement('div')
    newBlock.classList.add('todo-block')
    newBlock.innerHTML = htmls
    const footerMarks = newBlock.querySelector('.todo-footer-mark')

    let newMarks = []
    marks.forEach(function(mark) {
        newMarks.push(footerMarks.querySelector(`.${mark}`))
    })

    newMarks.forEach(function(newMark) {
        if (newMark.classList.contains('exercise')) {
            footerMarks.querySelector('.exercise').classList.remove('display-none')
        }
        else if (newMark.classList.contains('study')) {
            footerMarks.querySelector('.study').classList.remove('display-none')
        }
        else if (newMark.classList.contains('important')) {
            footerMarks.querySelector('.important').classList.remove('display-none')
        }
    })
    // Render marks
    const newMarksFilter = footerMarks.querySelectorAll('.mark-item-bullet')
    newMarksFilter.forEach(function(newMark) {
        if (newMark.classList.contains('display-none')) {
            footerMarks.removeChild(newMark)
        }
    })
    addToLocalStorage(name, des, marks)
    content.appendChild(newBlock)
    // Done Button
    const hideBtn = newBlock.querySelector('.hide-done')
    let isDone = false
    hideBtn.addEventListener('click', function() {
        if (isDone == false) {
            newBlock.classList.add('done')
            hideBtn.classList.add('checked')
            isDone = true
        } else {
            newBlock.classList.remove('done')
            hideBtn.classList.remove('checked')
            isDone = false
        }
        if (isDoneFilter == true) {
            hideBtn.parentElement.parentElement.parentElement.classList.add('display-none')
        }
    })
    // Edit and Delete
    const todoEdit = newBlock.querySelector('.todo-edit')
    const settings = newBlock.querySelector('.todo-header i')
    const editBtn = newBlock.querySelector('.edit')
    const deleteBtn = newBlock.querySelector('.delete')
    
    let isEdit = false
    settings.addEventListener('click',function() {
        if (!isEdit) {
            todoEdit.classList.add('editing')
            isEdit = true
        } else {
            todoEdit.classList.remove('editing')
            isEdit = false
        }
    })

    deleteBtn.addEventListener('click', function() {
        content.removeChild(newBlock)
        removeFromLocalStorage(name, des, marks)
    })

    editBtn.addEventListener('click', function() {
        renderInput(name, des, marks)
        content.removeChild(newBlock)
    })
}

function resetInput() {
    nameInput.value = ''
    desInput.value = ''
    editMarks.forEach(function(editMark) {
        editMark.classList.remove('choose')
    })
}

function renderInput(name, des, marks) {
    let htmls = `
    <div class="todo">
        <div class="todo-header">
            <input type="text" class="todo-input" required placeholder="Name">
            <i class="fa-solid fa-ellipsis"></i>
            <ul class="todo-edit">
                <li class="edit">Edit</li>
                <li class="delete">Delete</li>
            </ul>
        </div>
        <div class="todo-des">
            <textarea class="todo-input input-des" placeholder="Edit description"></textarea>
        </div>
        <div class="todo-footer">
            <div class="todo-footer-mark">
                <div class="mark-item-bullet exercise"></div>
                <div class="mark-item-bullet study"></div>
                <div class="mark-item-bullet important"></div>
            </div>
            <div class="todo-footer--save">
                <button class="input-save">Save</button>
                <button class="input-cancel">Cancel</button>
            </div>
        </div>
    </div>
    `

    const content = $('.content')
    let editingBlock = document.createElement('div')
    editingBlock.innerHTML = htmls
    let editInput = editingBlock.querySelector('.todo-input')
    let editText = editingBlock.querySelector('.input-des')

    editingBlock.classList.add('todo-block')
    editingBlock.classList.add('todo-block-edit')
    
    editText.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;
        
            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
              "\t" + this.value.substring(end);
        
            // put caret at right position again
            this.selectionStart =
              this.selectionEnd = start + 1;
          }
    })
    autoResizeTextarea(editText)
    editInput.value += name
    editText.value += des

    const footerMarks = editingBlock.querySelector('.todo-footer-mark')
    let newMarks = []
    marks.forEach(function(mark) {
        newMarks.push(footerMarks.querySelector(`.${mark}`))
    })

    newMarks.forEach(function(newMark) {
        if (newMark.classList.contains('exercise')) {
            footerMarks.querySelector('.exercise').classList.add('choose')
        }
        else if (newMark.classList.contains('study')) {
            footerMarks.querySelector('.study').classList.add('choose')
        }
        else if (newMark.classList.contains('important')) {
            footerMarks.querySelector('.important').classList.add('choose')
        }
    })

    const newMarksFilter = footerMarks.querySelectorAll('.mark-item-bullet')
    newMarksFilter.forEach(function(footerMark) {
        footerMark.addEventListener('click', function() {
            footerMark.classList.toggle('choose')
        })
    })
    content.appendChild(editingBlock)

    const saveBtn = editingBlock.querySelector('.input-save')
    const cancelBtn = editingBlock.querySelector('.input-cancel')

    saveBtn.addEventListener('click', function() {
        const MarksFilter = footerMarks.querySelectorAll('.mark-item-bullet')
        let listMarks = []
        MarksFilter.forEach(function(newMark) {
            if (newMark.classList.contains('choose')) {
                listMarks.push(newMark.classList[1])
            }
        })
        render(editInput.value, editText.value, listMarks)
        removeFromLocalStorage(name, des, marks)
        content.removeChild(editingBlock)
    })
    
    cancelBtn.addEventListener('click', function() {
        content.removeChild(editingBlock)
        render(name, des, marks)
    })
}

function addToLocalStorage(name, des, marks) {
    let store;
    let item = [name, des, marks]
    if (localStorage.getItem('store') === null) {
        store = []
    } else {
        store = JSON.parse(localStorage.getItem('store'))
    }

    store.push(item)
    localStorage.setItem('store', JSON.stringify(store))
}

function removeFromLocalStorage(name, des, marks) {
    let store;
    let item = [name, des, marks]
    if (localStorage.getItem('store') === null) {
        store = []
    } else {
        store = JSON.parse(localStorage.getItem('store'))
    }
    store.splice(store.indexOf(item), 1)
    localStorage.setItem('store', JSON.stringify(store))
}

function setFromLocalStorage() {
    let store;
    if (localStorage.getItem('store') === null) {
        store = []
    } else {
        store = JSON.parse(localStorage.getItem('store'))
    }
    store.forEach(function(item) {
        render(...item)
        removeFromLocalStorage(...item)
    })
}

function autoResizeTextarea(textarea) {
    textarea.addEventListener('keyup', function(e){
        textarea.style.height = '20px'
        let scHeight = e.target.scrollHeight;
        textarea.style.height = `${scHeight}px`
    }) 
}

