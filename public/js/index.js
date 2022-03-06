const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const subLinks = document.querySelector(".sub-links");

window.onload = async () => {
  await checkIsLoggedIn();
  await loadRoomsData();
};

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

    subLinks.innerHTML = `
    <a href="../post-room.html">Post Room</a>
    <a href="../rooms.html">Find Room</a>`;
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

  subLinks.innerHTML = `
    <a href="../login.html">Post Room</a>
    <a href="../rooms.html">Find Room</a>
    <a href="signup.html">Sign Up</a>`;
}

toggleButton.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});

async function loadRoomsData() {
  const resp = await fetch("/room");
  const rooms = (await resp.json()).data;

  let htmlStr = ``;
  for (const room of rooms) {
    const resp = await fetch(`/roomImage/${room.id}`);
    const roomImage = (await resp.json()).data[0].img;
    const userData = await fetch(`/user/${room.host_id}`);
    const user = (await userData.json()).user;

    htmlStr += `
    <div class="col-lg-4 col-md-6 d-flex justify-content-center">
    <div class="card">
      <div class="card-header">
        <img src="${roomImage}" />
      </div>
      <div class="card-body">
        <span class="tag tag-purple">${room.district}</span>
        <h4>${room.address}</h4>
        <span>Size: ${room.size}ft</span>
        <span><i class="fas fa-dollar-sign"></i>${room.monthly_rent} per month</span>
        <div class="user">
        <a href="/user.html?id=${user.id}"><img src="${user.profile_img}"></a>
          <div class="user-info">
            <h5>${user.name}</h5>
            <div style="width:450px" align="center">
              <a href="/room.html?id=${room.id}"><button type="button" class="btn btn-warning btn-sm">More Detail</button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  }

  document.querySelector(".main-content").innerHTML += htmlStr;
}
