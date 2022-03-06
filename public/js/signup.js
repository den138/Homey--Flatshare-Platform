let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#confirm-password");
let form = document.querySelector("#signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (password.value.length < 6) {
    swal("Oops", "Passwords at least six characters", "error");
    return;
  }

  if (password.value !== confirmPassword.value) {
    swal("Oops", "Passwords don't match", "error");
    return;
  }

  const isConfirm = await swal(
    `By creating an account you agree to our Terms & Privacy`,
    {
      buttons: {
        confirm: {
          text: "Confirm",
          value: true,
        },
        cancel: true,
      },
    }
  );

  if (!isConfirm) {
    return;
  }

  const formData = new FormData();

  formData.append("email", form.email.value);
  formData.append("password", password.value);
  formData.append("name", form.name.value);
  formData.append("birthDate", form.birthDate.value);
  formData.append("gender", form.gender.value);
  formData.append("occupation", form.occupation.value);
  formData.append("budget", form.budget.value);
  formData.append("description", form.description.value);
  formData.append("image", form.image.files[0]);

  const resp = await fetch("/user", {
    method: "POST",
    body: formData,
  });
  if (resp.status === 200) {
    localStorage.setItem("user", form.email.value);
    localStorage.setItem("isLoggingIn", true);
    swal("Account has been registered", "", "success");
    document.addEventListener("click", () => {
      window.location = "/";
    });
    return;
  } else if (resp.status === 400) {
    const message = (await resp.json()).message;
    swal("Oops", message, "error");
  } else if (resp.status === 500) {
    const message = (await resp.json()).message;
    swal("Oops", message, "error");
  }
});
