let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskContainer = document.getElementById("task-container");
const taskForm = document.getElementById("task-form");
const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));


function renderTasks(filter = "todas") {
	taskContainer.innerHTML = ""; 

	const filteredTasks =
		filter === "todas"
			? tasks
			: tasks.filter((task) => (filter === "concluidas" ? task.status === "concluida" : task.status === "naoConcluida"));

	filteredTasks.forEach((task, index) => {
		const taskDiv = document.createElement("div");
		taskDiv.classList.add("task");
		taskDiv.style.backgroundColor = task.status === "concluida" ? "var(--verde)" : "var(--lilas)";

		taskDiv.innerHTML = `
			<div class="title-div">
				<h5 onclick="openEditTask(${index})" class="task-title">${task.title}</h5>
			</div>
			<div class="task-tags">
            	${task.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
        	</div>
			<div class="task-actions">
				<img src="${task.status === "concluida" ? "imagens/delete-green.svg" : "imagens/delete.svg"}" 
					alt="Excluir" class="icon-btn" onclick="deleteTask(${index})">
				${
					task.status !== "concluida"
						? `<img src="imagens/check.svg" alt="Concluir" class="icon-btn" onclick="toggleStatus(${index})" title="Marcar como concluída">`
						: ""
				}
			</div>
		`;

		taskContainer.appendChild(taskDiv);
	});
}


function toggleStatus(index) {
	tasks[index].status = tasks[index].status === "concluida" ? "naoConcluida" : "concluida";
	saveTasksToLocalStorage();
	renderTasks();
}

function openAddTask() {
    
    document.getElementById("task-title").value = "";
    document.getElementById("task-tags").value = "";
    document.getElementById("task-status").value = "naoConcluida";

    
    taskForm.removeAttribute("data-edit-index");

  
    document.getElementById("taskModalLabel").textContent = "adicionar tarefa";

    taskModal.show();
}


function openEditTask(index) {
	const task = tasks[index];
	document.getElementById("task-title").value = task.title;
	document.getElementById("task-tags").value = task.tags;
	document.getElementById("task-status").value = task.status;

	taskForm.setAttribute("data-edit-index", index); // 
	document.getElementById("taskModalLabel").textContent = "editar tarefa";

	taskModal.show(); 
}


taskForm.addEventListener("submit", function (event) {
	event.preventDefault();

	const title = document.getElementById("task-title").value.trim();
	const tags = document.getElementById("task-tags").value.trim();
	const status = document.getElementById("task-status").value;

	if (title === "") return; 

	const editIndex = taskForm.getAttribute("data-edit-index");
	if (editIndex !== null) {
		tasks[editIndex] = { title, tags, status }; 
		taskForm.removeAttribute("data-edit-index"); 
	} else {
		tasks.push({ title, tags, status }); 
	}

	saveTasksToLocalStorage();
	renderTasks();
	taskModal.hide(); 
});


function deleteTask(index) {
	tasks.splice(index, 1);
	saveTasksToLocalStorage();
	renderTasks();
}


function filterTasks(filterType) {
	renderTasks(filterType);
}

function saveTasksToLocalStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}


document.addEventListener("DOMContentLoaded", () => {
	renderTasks();
});
