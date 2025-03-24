// Create a Task class or object to represent a task.
class Task {
  constructor(title, details) {
    this.id = Date.now().toString();
    this.title = title;
    this.details = details;
    this.status = "pending";
  }
}

// Stores all tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("task-input-form");
const taskList = document.getElementById("task-items");
const filterDropdown = document.getElementById("filter-dropdown");

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  console.log("Filtered Tasks:", tasks.filter(task => { //debugging log
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status === "pending";
    return true;
  }));

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status === "pending";
    return true;
  });

  // Create and append task items to the list
  filteredTasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.className = task.status === "completed" ? "completed" : "";
    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.details}</p>
      </div>
      <div>
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
        <button class="toggle-status" data-id="${task.id}">
          ${task.status === "pending" ? "Mark Complete" : "Mark Pending"}
        </button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });

  // Add event listeners after rendering
  attachEventListeners();
}

function attachEventListeners() {
  taskList.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => deleteTask(button.dataset.id));
  });

  taskList.querySelectorAll(".toggle-status").forEach(button => {
    button.addEventListener("click", () => toggleTaskStatus(button.dataset.id));
  });

  taskList.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => openEditForm(button.dataset.id));
  });
}

// Add Task: Handles form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("input-title").value.trim();
  const details = document.getElementById("input-description").value.trim();

  // Validate input
  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  // Create a new task and add it to the list
  const newTask = new Task(title, details);
  console.log("New Task:", newTask); //debug log
  tasks.push(newTask);
  console.log("Tasks Array:", tasks); //debug log
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save to localStorage
  renderTasks(filterDropdown.value);
  taskForm.reset();
});

// Switches between completed and pending
function toggleTaskStatus(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.status = task.status === "pending" ? "completed" : "pending";
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(filterDropdown.value);
}

// Delete Task: Removes a task from the list
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(filterDropdown.value);
}

// Open Edit Form: Populates the form with task details
function openEditForm(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  document.getElementById("input-title").value = task.title;
  document.getElementById("input-description").value = task.details;

  // Change the form's submit button to "Save Changes"
  const submitButton = taskForm.querySelector("button");
  submitButton.textContent = "Save Changes";
  submitButton.onclick = (e) => {
    e.preventDefault();
    saveTaskChanges(id);
  };
}

// Save Task Changes: Updates the task with new details
function saveTaskChanges(id) {
  const title = document.getElementById("input-title").value.trim();
  const details = document.getElementById("input-description").value.trim();

  // Validate input
  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  // Update the task
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.title = title;
      task.details = details;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
  renderTasks(filterDropdown.value);

  // Reset the form
  taskForm.reset();
  const submitButton = taskForm.querySelector("button");
  submitButton.textContent = "Add Task";
  submitButton.onclick = (e) => {
    e.preventDefault();
    taskForm.dispatchEvent(new Event("submit"));
  };
}

// Filter Tasks: Displays tasks based on status
filterDropdown.addEventListener("change", () => renderTasks(filterDropdown.value));

renderTasks();