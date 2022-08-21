const REQRES_BASE_URL = "https://reqres.in/api";
const loginStatus = document.querySelector("#loginStatus");

function handleRegisterationSubmit() {
  const form = document.forms;
  const emailInput = form[0]["inputEmail1"];
  const passwordInput = form[0]["inputPassword1"];

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
}

function setCookie(key, val) {
  document.cookie = `${key}=${val}`;
}
