const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const form = document.querySelector("#post-room-form");

window.onload = async () => {
  await checkIsLoggedIn();
};

async function checkIsLoggedIn() {
  const userInLocalStorage = localStorage.getItem("isLoggingIn");

  if (userInLocalStorage) {
    navbarLinks.innerHTML = ` 
    <ul>
      <li><a href="./rooms.html">Rooms</a></li>
      <li><a href="./contact.html">Contact</a></li>
      <li><a href="./about-us.html">About Us</a></li>
      <li><a href="./faq.html">FAQ</a></li>
      <li><a href="/profile.html">Profile</a></li>
    </ul>`;

    return;
  }

  navbarLinks.innerHTML = `
  <ul>
    <li><a href="./rooms.html">Rooms</a></li>
    <li><a href="./contact.html">Contact</a></li>
    <li><a href="./about-us.html">About Us</a></li>
    <li><a href="./faq.html">FAQ</a></li>
    <li><a href="./login.html">Login</a></li>
  </ul>`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isHostingRoomResp = await fetch("/room/isHosting");
  const result = (await isHostingRoomResp.json()).result;

  if (result) {
    swal("You are hosting a room already", "", "error");
    form.reset();
    return;
  }

  if (form.image.files.length != 3) {
    swal("Please upload three photos of your room", "", "error");
    return;
  }

  const isConfirm = await swal("Post this room?", {
    buttons: {
      confirm: {
        text: "Confirm",
        value: true,
      },
      cancel: true,
    },
  });

  if (!isConfirm) {
    return;
  }

  const formData = new FormData();
  formData.append("district", form.district.value);
  formData.append("address", form.address.value);
  formData.append("size", form.size.value);
  formData.append("rent", form.rent.value);
  formData.append("member", form.member.value);
  formData.append("period", form.period.value);
  formData.append("rules", form.rules.value);
  formData.append("image", form.image.files[0]);
  formData.append("image", form.image.files[1]);
  formData.append("image", form.image.files[2]);
  // formData.append("image", form.image1.files[0]);
  // formData.append("image", form.image2.files[0]);
  // formData.append("image", form.image3.files[0]);
  formData.append("aircon", form.aircon.checked);
  formData.append("bed", form.bed.checked);
  formData.append("chair", form.chair.checked);
  formData.append("cooker", form.cooker.checked);
  formData.append("couch", form.couch.checked);
  formData.append("desk", form.desk.checked);
  formData.append("fans", form.fans.checked);
  formData.append("television", form.television.checked);
  formData.append("washer", form.washer.checked);
  formData.append("wifi", form.wifi.checked);

  const resp = await fetch("/room", {
    method: "POST",
    body: formData,
  });
  if (resp.status === 200) {
    swal("Done", "You have posted the room", "success");
    document.addEventListener("click", () => {
      window.location = "/";
    });
  }
});

toggleButton.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});
