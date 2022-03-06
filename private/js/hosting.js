const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const logoutButton = document.querySelector(".logout");

window.onload = async () => {
  await checkIsLoggedIn();
  await loadHostingRoomData();

  const socket = io.connect();
  socket.on("new-application", () => {
    loadHostingRoomData();
  });
  socket.on("delete-application", () => {
    loadHostingRoomData();
  });
};

async function loadHostingRoomData() {
  const resp = await fetch("/room/hosting");
  const data = await resp.json();
  const room = data.room;
  const apps = data.app;

  if (!room || !apps) {
    document.querySelector(".main-content").innerHTML = /*html*/ `
    <h5>You are not hosting any rooms</h5>
    <a href="/post-room.html"><button class="btn btn-primary mt-3">HOST ROOM</button></a>
    `;
    document
      .querySelector(".main-content")
      .classList.add(
        "d-flex",
        "align-items-center",
        "justify-content-center",
        "flex-column"
      );
    return;
  }

  const resp3 = await fetch(`/roomImage/${room.id}`);
  const image = (await resp3.json()).data[0].img;

  const resp2 = await fetch(`/roommate/host/${room.host_id}`);
  const guests = (await resp2.json()).data;

  let htmlStr = ``;
  let applicants = ``;
  let guestsStr = ``;

  for (const app of apps) {
    applicants += /*html*/ `
    <div class="container">
    <div><h2>APPLICATION</h2></div>
    <div class="box">
      <div class="heading">
        <h2>${app.name}</h2>
        <h4>${app.occupation}</h4>
      </div>
      <img src="${app.profile_img}" alt="">
      <div class="text">${app.email}</div>
      <div class="text">${app.gender}</div>
      <div class="text">Budget: <i class="fas fa-dollar-sign"></i>${app.budget}</div>
      <a href="/user.html?id=${app.uid}" class="btn btn-primary">more</a>
      <a href="#!" class="btn btn-success" onclick="acceptApplication(${app.aid})">Accept</a>
      <a href="#!" class="btn btn-danger" onclick="declineApplication(${app.aid})">Decline</a>
    </div>
  </div>
    `;
  }

  htmlStr += /*html*/ `
  <div class="container mx-auto mt-4">
  <h4 class="mb-4"><strong>YOUR HOSTING ROOM</strong></h4>
    <div class="row">
      <div class="col-4">
        <div class="card" style="width: 18rem;">
          <img src="${image}" class="card-img-top" alt="...">
          <div class="card-body text-center">
            <h5 class="card-title">${room.district}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${room.address}</h6>
            <p class="card-text">Size: ${room.size}ft</p>
            <a href="/room.html?id=${room.id}" class="btn mr-2"><i class="fas fa-link"></i>Read</a>
          </div>
        </div>
      </div>
      <div class="col-6"> 
      ${applicants}
      </div>
    </div>
  </div>
  `;

  document.querySelector(".main-content").innerHTML = htmlStr;

  if (guests) {
    for (const guest of guests) {
      guestsStr += /*html*/ `
      <div class="box">
      <div class="heading">
        <h2>${guest.name}</h2>
      </div>
      <img src="${guest.profile_img}" alt="">
      <div class="text">${guest.email}</div>
      <div class="text">${guest.gender}</div>
      <a href="/user.html?id=${guest.applicant_id}" class="btn btn-primary">more</a>
    </div>
    `;
    }

    document.querySelector(".roommates-container").innerHTML =
      `<div class="roommates me-3"><h2>YOUR GUESTS</h2></div>` +
      `<br />` +
      guestsStr;
  } else {
    document.querySelector(
      ".roommates-container"
    ).innerHTML = `<h5>Your don't have any guests in your hosting room</h5> `;
  }
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

async function acceptApplication(aid) {
  swal("Accept this application?", {
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
        const resp = await fetch(`/application/accept/${aid}`);
        const message = (await resp.json()).message;
        swal(`${message}`, "", "success");
        document.addEventListener("click", async () => {
          await loadHostingRoomData();
        });
        break;
    }
  });
}

async function declineApplication(aid) {
  swal("Decline this application?", {
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
        const resp = await fetch(`/application/decline/${aid}`);
        const message = (await resp.json()).message;
        swal(`${message}`, "", "error");
        document.addEventListener("click", async () => {
          await loadHostingRoomData();
        });
        break;
    }
  });
}
