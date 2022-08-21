const REQRES_BASE_URL = "https://reqres.in/api";
const loginStatus = document.querySelector("#loginStatus");
const modalCloseBtn = document.querySelector(".btn-close")

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

function showTodoList(){
  const todoContent = document.querySelector(".todo-content");
  todoContent.innerHTML = `Here's your todo content`
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