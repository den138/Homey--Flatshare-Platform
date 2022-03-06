let form = document.querySelector("#login-form");

window.onload = () => {
  checkIsLoggedIn();
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formObject = {};

  formObject.email = form.email.value;
  formObject.password = form.password.value;

  const resp = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  if (resp.status === 200) {
    window.location = "/";
    localStorage.setItem("user", form.email.value);
    localStorage.setItem("isLoggingIn", true);
  } else if (resp.status === 400) {
    const message = (await resp.json()).message;
    swal("Oops", message, "error");
  }
});

async function checkIsLoggedIn() {
  const resp2 = await fetch("/checkIsLoggedIn");
  const result = (await resp2.json()).result;

  if (!result) {
    localStorage.clear();
  }
}
