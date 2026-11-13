
// SCHOLARSPACE - ACADEMIC PLANNER

// 1. Select HTML elements
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskCategory = document.getElementById("task-category");
const taskDate = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// 2. Retrieve saved tasks
let tasks = JSON.parse(
    localStorage.getItem("scholarSpaceTasks")
) || [];

// Give older tasks IDs and completion status
tasks = tasks.map(function(task, index) {
    return {
        ...task,
        id: task.id || Date.now() + index,
        completed: Boolean(task.completed)
    };
});

// 3. Save tasks to browser storage
function saveTasks() {
    localStorage.setItem(
        "scholarSpaceTasks",
        JSON.stringify(tasks)
    );
}

// 4. Update academic statistics
function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("total-tasks").textContent = total;

    document.getElementById("completed-tasks").textContent = completed;

    document.getElementById("pending-tasks").textContent = pending;

    document.getElementById("progress-fill").style.width =
        percentage + "%";

    document.getElementById("progress-text").textContent =
        percentage + "% completed";
}

// 5. Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.appendChild(emptyMessage);
        updateStatistics();
        return;
    }

    tasks.forEach(function(task) {

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const details = document.createElement("p");
        details.textContent =
            task.category + " | " + (task.date || "No due date");

        taskInfo.appendChild(title);
        taskInfo.appendChild(details);

        // Create completion checkbox
        const completeLabel = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        completeLabel.appendChild(checkbox);
        completeLabel.append(" Completed");

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks();

        });

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-task";

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();

        });

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(completeLabel);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);

    });

    updateStatistics();
}

// 6. Add new academic tasks
if (taskForm) {

    taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newTask = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        category: taskCategory.value,
        date: taskDate.value,
        completed: false
    };

    if (newTask.title === "") {
        alert("Please enter a task title.");
        return;
    }

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskForm.reset();

});

}

// 7. Display saved tasks when the page opens
if (taskForm) {
    saveTasks();
    displayTasks();
}

// SCHOLARSPACE - CONTACT FORM VALIDATION

// 1. Select the contact form elements
const contactForm = document.getElementById("contact-form");

const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactPhone = document.getElementById("contact-phone");
const contactMessage = document.getElementById("contact-message");
const contactFeedback = document.getElementById("contact-feedback");

// 2. Listen for form submission
if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        // Prevent the page from refreshing
        event.preventDefault();

        // 3. Collect the visitor's information
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const phone = contactPhone.value.trim();
        const message = contactMessage.value.trim();

        // 4. Check for empty fields
        if (
            name === "" ||
            email === "" ||
            phone === "" ||
            message === ""
        ) {
            contactFeedback.textContent =
                "Please complete all fields.";

            contactFeedback.style.color = "red";
            return;
        }

        // 5. Validate the email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            contactFeedback.textContent =
                "Please enter a valid email address.";

            contactFeedback.style.color = "red";
            return;
        }

        // 6. Check that the phone number contains digits only
        const phonePattern = /^[0-9]+$/;

        if (!phonePattern.test(phone)) {

            contactFeedback.textContent =
                "Phone number must contain digits only.";

            contactFeedback.style.color = "red";
            return;
        }

        // 7. Display successful validation
        contactFeedback.textContent =
            "Thank you! Your message has passed validation.";

        contactFeedback.style.color = "green";

        // Clear the form
        contactForm.reset();

    });

}
