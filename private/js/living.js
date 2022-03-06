const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const logoutButton = document.querySelector(".logout");
const form = document.querySelector("#comment-form");

window.onload = async () => {
  await checkIsLoggedIn();
  await loadLivingRoomData();
};

const dash = document.querySelector(".list-group");
const btn = dash.querySelector(".list-group-item");
for (let i = 0; i < btn.length; i++) {
  btn[i].addEventListener("click", function () {
    var current = document.querySelector(".active");
    current.classList.remove("active");
    this.classList.add("active");
    console.log(current);
  });
}

const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

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

async function loadLivingRoomData() {
  const resp = await fetch(`/application/living`);
  const livingRoom = (await resp.json()).data;
  if (!livingRoom) {
    document.querySelector(".room-info-container").innerHTML = /*html*/ `
    <h5>You are not living in a room</h5>
    <a href="/rooms.html"><button class="btn btn-primary mt-3">FIND ROOM</button></a>
    `;
    document
      .querySelector(".room-info-container")
      .classList.add(
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      );
    document.querySelector(".roommates-container").remove();
    return;
  }

  const resp2 = await fetch(`/user/${livingRoom.host_id}`);
  const host = (await resp2.json()).user;

  const resp3 = await fetch(`/roommate/guest/${livingRoom.host_id}`);
  const roommates = (await resp3.json()).data;

  const resp4 = await fetch(`/roomImage/${livingRoom.room_id}`);
  const image = (await resp4.json()).data[0].img;

  let htmlStr = ``;
  let roommatesStr = ``;

  htmlStr += /*html*/ `
  <div class="container mx-auto mt-4">
  <div class="mb-4"><h4><strong>YOUR LIVING ROOM</strong></h4></div>
    <div class="row">
      <div class="col-4">
        <div class="card" style="width: 18rem;">
          <img src="${image}" class="card-img-top" alt="..." height="250">
          <div class="card-body text-center">
            <h5 class="card-title">${livingRoom.district}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${livingRoom.address}</h6>
            <p class="card-text">Size: ${livingRoom.size}ft</p>
            <a href="/room.html?id=${livingRoom.room_id}" class="btn mr-2"><i class="fas fa-link"></i>Read</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  document.querySelector(".living-room").innerHTML = htmlStr;

  roommatesStr += /*html*/ `

  <div class="container mx-auto mt-4">
  <div><h2>MY HOST</h2></div>
    <div class="row">
      <div class="col-4">
        <div class="card" style="width: 18rem;">
          <img src="${host.profile_img}" class="card-img-top" alt="..." height="250">
          <div class="card-body text-center">
            <h5 class="card-title">${host.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${host.email}</h6>
            <p class="card-text">${host.gender}</p>
            <a href="/user.html?id=${host.id}" class="btn mr-2"><i class="fas fa-link"></i>Read</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  if (roommates) {
    for (const roommate of roommates) {
      roommatesStr += /*html*/ `
      <div class="container mx-auto mt-4">
        <div><h2>MY ROOMMATE</h2></div>
          <div class="row">
            <div class="col-4">
             <div class="card" style="width: 18rem;">
              <img src="${roommate.profile_img}" class="card-img-top" alt="..." height="250">
              <div class="card-body text-center">
              <h5 class="card-title">${roommate.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${roommate.email}</h6>
              <p class="card-text">${roommate.gender}</p>
              <a href="/user.html?id=${roommate.applicant_id}" class="btn mr-2"><i class="fas fa-link"></i>Read</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    }
  }

  document.querySelector(".roommates-container").innerHTML = roommatesStr;
}

toggleButton.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});

logoutButton.addEventListener("click", () => {
  localStorage.clear();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isConfirm = await swal("Post this comment?", {
    buttons: {
      confirm: {
        text: "Confirm",
        value: true,
      },
      cancel: true,
    },
  });

  if (!isConfirm) {
    form.reset();
    return;
  }

  const formObject = {};
  formObject.title = form.title.value;
  formObject.message = form.message.value;

  const livingRoomResp = await fetch(`/application/living`);
  const livingRoom = (await livingRoomResp.json()).data;

  const resp = await fetch(`/comment/${livingRoom.room_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  if (resp.status === 200) {
    swal("Your comment has been posted", "", "success");
    form.reset();
    return;
  }
});
