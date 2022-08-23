const REQRES_BASE_URL = "https://reqres.in/api";
const JSONPH_BASE_URL = "https://jsonplaceholder.typicode.com";
const loginStatus = document.querySelector("#loginStatus");
const modalCloseBtn = document.querySelector(".btn-close");
const todoContent = document.querySelector(".todo-content");
const filters = document.querySelectorAll(".filters span");
let editTaskId = 0;

function handleRegisterationSubmit() {
  const form = document.forms;
  const emailInput = form[0]["inputEmail1"];
  const passwordInput = form[0]["inputPassword1"];
  const modalCloseBtn = document.querySelector(".btn-close")

  const errors = validateForm(emailInput, passwordInput);

  if (!Object.keys(errors).length) {
    axios
      .post(`${REQRES_BASE_URL}/register`, {
        email: emailInput.value,
        password: passwordInput.value,
      })
      .then((res) => {
        setCookie("email", emailInput.value);
        setCookie("token", res.data.token);
        changeLoginStatus(emailInput.value);
        modalCloseBtn.click();
        getTodosDataAPI(); //load todos upon successful registeration of the user
      });
  }
}

function handleLoginSubmit(){
  const form = document.forms;
  const emailInput = form[1]["inputEmail2"];
  const passwordInput = form[1]["inputPassword2"];
  const modalCloseBtn = document.querySelector("#login-btn-close")

  const errors = validateForm(emailInput, passwordInput);

  if (!Object.keys(errors).length) {
    axios
      .post(`${REQRES_BASE_URL}/login`, {
        email: emailInput.value,
        password: passwordInput.value,
      })
      .then((res) => {
        setCookie("email", emailInput.value);
        setCookie("token", res.data.token);
        changeLoginStatus(emailInput.value);
        modalCloseBtn.click();
      });
  }
}

function handleLogout() {
  const arrCookies = arrangedCookies();
  for (let cookie in arrCookies) {
    this.deleteCookie(cookie);
  }

  loginStatus.innerHTML = `
  <button class="btn btn-primary">Login</button>
  <button
    type="button"
    class="btn btn-secondary"
    data-bs-toggle="modal"
    data-bs-target="#registerModal"
  >
    Register
  </button>
    `;

  removeTodoList();
}

function validateForm(emailInput, passwordInput) {
  const errors = {};
  const emailRegex = /^\w+([\.-]?\w+)*@\w+[^.]([\-]?\w+)*(\.\w{2,})+$/;
  // At least 8 chars: must have one letter & one special character
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!emailRegex.test(emailInput.value)) {
    emailInput.classList.add("invalid");
    errors.email = "invalid";
  } else {
    emailInput.classList.remove("invalid");
    if (errors.email) delete errors.email;
  }
  if (!passwordRegex.test(passwordInput.value)) {
    passwordInput.classList.add("invalid");
    errors.password = "invalid";
  } else {
    passwordInput.classList.remove("invalid");
    if (errors.password) delete errors.password;
  }

  return errors;
}

function changeLoginStatus(email){
  loginStatus.innerHTML = `<p>Welcome, ${email.slice(
    0,
    email.indexOf("@")
  )}</p>
      <button
      type="button"
      class="btn btn-secondary"
      onclick="handleLogout()"
      >
      Logout
      </button>
      `;

  showTodoList();
}

(function checkLoginStatus(){
  const arrCookies = arrangedCookies();
  if(arrCookies.email && arrCookies.token){
    changeLoginStatus(arrCookies.email);
  }
})()

function showTodoList(filterId){
  // todoContent.innerHTML = `Here's your todo content`;
  todoContent.querySelector("h3").classList.add("d-none");
  todoContent.querySelector(".wrapper").classList.remove("d-none")
  const todosData = getTodosDataLocalStorage();
  const todosUl = todoContent.querySelector('.list-group');
  if(todosData?.length){
  if(filterId === "completed"){
    todosUl.innerHTML="";
  todosData.forEach(todo => {
    if(todo.completed){
      let todoItem = document.createElement("li");
      todoItem.setAttribute("id", `${todo.id}`);
      todoItem.classList.add("list-group-item", "d-flex", "justify-content-between");
      todoItem.innerHTML = `<div><span class="text-decoration-line-through">${todo.title}</span> <input id=${todo.id} onclick="toggleCheck(this)" type="checkbox" checked></div> <div><button class="btn btn-dark btn-sm" onclick="editTodo(this)">Edit</button> <button class="btn btn-danger btn-sm" onclick="removeTodo(this)">Delete</button></div>`;

      todosUl.append(todoItem);
    }
    })
    }
    else if(filterId === "pending"){
      todosUl.innerHTML="";
      todosData.forEach(todo => {
        if(!todo.completed){
        let todoItem = document.createElement("li");
        todoItem.setAttribute("id", todo.id);
        todoItem.classList.add("list-group-item", "d-flex", "justify-content-between");
        todoItem.innerHTML = `<div><span>${todo.title}</span> <input id=${todo.id} onclick="toggleCheck(this)" type="checkbox"></div> <div><button class="btn btn-dark btn-sm" onclick="editTodo(this)">Edit</button> <button class="btn btn-danger btn-sm" onclick="removeTodo(this)">Delete</button></div>`;
        todosUl.append(todoItem);
      }
      })
    }
    else{
      todosUl.innerHTML="";
      todosData.forEach(todo => {
        let todoItem = document.createElement("li");
        todoItem.setAttribute("id", todo.id);
        todoItem.classList.add("list-group-item", "d-flex", "justify-content-between");
        todoItem.innerHTML = `<div><span class=${todo.completed ? "text-decoration-line-through" : ""}>${todo.title}</span> <input id=${todo.id} onclick="toggleCheck(this)" type="checkbox" ${todo.completed?"checked":""}></div> <div><button class="btn btn-dark btn-sm" onclick="editTodo(this)">Edit</button> <button class="btn btn-danger btn-sm" onclick="removeTodo(this)">Delete</button></div>`;
        todosUl.append(todoItem);
      })
    }

  }
    
    if(!filterId){
      addFiltersEventListeners();
    }
}

function removeTodoList(){
  const todoContent = document.querySelector(".todo-content");
  todoContent.innerHTML = `<h3 class="mt-5">
  Welcome to ToDo App, Please login / register to access your ToDo List
  </h3>`;
}

function getTodosDataAPI(){
  axios.get(`${JSONPH_BASE_URL}/todos`)
  .then(res => {localStorage.setItem("todosData", JSON.stringify(res.data));})
}

function getTodosDataLocalStorage(){
  return JSON.parse(localStorage.getItem("todosData"));
}

function addFiltersEventListeners(){
  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      document.querySelector("span.active").classList.remove("active");
      filter.classList.add("active");
      showTodoList(filter.id);
    })
  })
}

function toggleCheck(targetTaskInput){
  let todosDataLocal = getTodosDataLocalStorage();
  let targetTaskLocal = todosDataLocal.find(todo => todo.id === +targetTaskInput.id);
  let targetTaskContent = targetTaskInput.parentElement.firstElementChild;
  targetTaskLocal.completed ? targetTaskContent.classList.remove("text-decoration-line-through") : targetTaskContent.classList.add("text-decoration-line-through");
  targetTaskLocal.completed = ! targetTaskLocal.completed;
  localStorage.setItem("todosData", JSON.stringify(todosDataLocal));
}

function removeTodo(removeTodo){
  let targetTodoItem = removeTodo.parentElement.parentElement;
  localStorage.setItem("todosData", JSON.stringify(getTodosDataLocalStorage().filter(todo => todo.id !== +targetTodoItem.id)))
  targetTodoItem.remove();
}

function editTodo(editTodoBtn){
  let targetTodoItem = editTodoBtn.parentElement.parentElement.firstElementChild.firstElementChild;
  editTaskId = editTodoBtn.parentElement.parentElement.id;
  let todoInput = todoContent.querySelector('.task-input');
  todoInput.firstElementChild.value = targetTodoItem.innerText;
}

function addEditTodo(){
  let todoInput = todoContent.querySelector('.task-input');
   let inputValue = todoInput.firstElementChild.value;
   let todosDataLocal = getTodosDataLocalStorage();
   if(editTaskId && inputValue.trim()){
    let targetTaskLocal = todosDataLocal.find(todo => todo.id = editTaskId);
    targetTaskLocal.title = inputValue.trim();
    localStorage.setItem("todosData", JSON.stringify(todosDataLocal));
    todoInput.firstElementChild.value = ""
    editTaskId = 0;
    showTodoList();
   }
   else{
   if(inputValue.trim()){
    let largestId = 0;
    if(todosDataLocal?.length){
      todosDataLocal.forEach(todo => {if(todo.id > largestId) largestId = todo.id});
      let newTodo = {userId: 1, id: largestId,title: inputValue.trim(), completed: false}
      localStorage.setItem("todosData", JSON.stringify([...todosDataLocal, newTodo]))
    }
    else{
      let newTodo = {userId: 1, id: largestId,title: inputValue.trim(), completed: false};
      localStorage.setItem("todosData", JSON.stringify([newTodo]));
    }
   }
   todoInput.firstElementChild.value = ""
   showTodoList();
  }
}

function clearAll(){
  const todosUl = todoContent.querySelector('.list-group');
  todosUl.innerHTML = "";
  localStorage.removeItem("todosData");
}

function setCookie(key, val) {
  document.cookie = `${key}=${val}`;
}

function deleteCookie(key) {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  document.cookie = `${key}='';expires=${date.toGMTString()}`;
}

function arrangedCookies() {
  let cookiesArr = [];
  let cookiesData = document.cookie.split(";");
  for (let i = 0; i < cookiesData.length; i++) {
    cookiesArr[cookiesData[i].trim().split("=")[0]] = cookiesData[i]
      .trim()
      .split("=")[1];
  }
  return cookiesArr;
}