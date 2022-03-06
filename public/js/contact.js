const form = document.querySelector("#contact-us-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  swal("Your message has been sent. We will reply soon.", "", "success");
  document.addEventListener("click", () => {
    form.reset();
  });
});
