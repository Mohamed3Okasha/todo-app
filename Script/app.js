function handleRegisterationSubmit() {
  const form = document.forms;
  const emailInput = form[0]["inputEmail1"];
  const passwordInput = form[0]["inputPassword1"];

  const errors = validateForm(emailInput, passwordInput);
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
    console.log("Enter a vaid email");
  } else {
    emailInput.classList.remove("invalid");
    if (errors.email) delete errors.email;
  }
  if (!passwordRegex.test(passwordInput.value)) {
    passwordInput.classList.add("invalid");
    errors.password = "invalid";
    console.log(passwordInput.value, "Enter a valid password");
  } else {
    passwordInput.classList.remove("invalid");
    if (errors.password) delete errors.password;
  }

  return errors;
}
