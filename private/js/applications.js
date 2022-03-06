const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const logoutButton = document.querySelector(".logout");

window.onload = async () => {
  await checkIsLoggedIn();
  await loadApplications();

  const socket = io.connect();
  socket.on("accept-application", () => {
    loadApplications();
  });
};

async function loadApplications() {
  const resp = await fetch("/application/user");
  const rooms = (await resp.json()).data;

  let htmlStr = ``;
  if (rooms) {
    for (const room of rooms) {
      const resp2 = await fetch(`/roomImage/${room.room_id}`);
      const roomImageData = (await resp2.json()).data;
      const roomImage1 = roomImageData[0].img;
      const roomImage2 = roomImageData[1].img;
      const roomImage3 = roomImageData[2].img;

      console.log(room);
      htmlStr += /*html*/ `
      <div class="col-4">
        <div class="card" style="width: 18rem;">
          <img src="${roomImage1}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title text-center">${room.district}</h5>
            <h6 class="card-subtitle mb-2 text-muted text-center">${room.address}</h6>
            <p class="card-text text-center">Size: ${room.size}ft</p>
            <div class="d-flex justify-content-evenly">
            <a href="/room.html?id=${room.room_id}" class="btn mr-2"><i class="fas fa-link"></i>More</a>
            <a href="#!" class="btn btn-warning" onclick="cancelApplication(${room.id})">Cancel application</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    }
    document.querySelector(".row").innerHTML = htmlStr;
  } else {
    htmlStr += /* html*/ `
    <h5>You don't have applications for any rooms</h5>
    <a href="/rooms.html"><button class="btn btn-primary mt-3">FIND ROOM</button></a>
    `;
    document.querySelector(".app-title").remove();
    document
      .querySelector(".main-content")
      .classList.add(
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      );
    document.querySelector(".main-content").innerHTML = htmlStr;
  }
  // document.querySelector(".row").innerHTML = htmlStr;
}

async function checkIsLoggedIn() {
  const userInLocalStorage = localStorage.getItem("user");

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

toggleButton.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});

logoutButton.addEventListener("click", () => {
  localStorage.clear();
});

async function cancelApplication(aid) {
  swal("Cancel this application?", {
    buttons: {
      confirm: {
        text: "Confirm",
        value: "confirm",
      },
      cancel: true,
    },
  }).then(async (value) => {
    switch (value) {
      case "confirm":
        const resp = await fetch(`/application/${aid}`, {
          method: "DELETE",
        });
        const message = (await resp.json()).message;
        swal(`${message}`, "", "success");

        document.addEventListener("click", async () => {
          await loadApplications();
        });
        break;
    }
  });
}
