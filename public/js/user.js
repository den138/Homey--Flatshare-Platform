const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");

window.onload = async () => {
  await getUserData();
  await checkIsLoggedIn();
};

async function getUserData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  const resp = await fetch(`/user/${id}`);
  const user = (await resp.json()).user;

  let htmlStr = ``;
  htmlStr += /*html*/ `<div class="container mt-7">
        <div class="row">
          <div class="col-xl-8 m-auto order-xl-2 mb-5 mb-xl-0">
            <div class="card card-profile shadow">
              <div class="row justify-content-center">
                <div class="col-lg-3 order-lg-2">
                  <div class="card-profile-image">
                    <img class="profile-img" src="${user.profile_img}">
                  </div>
                </div>
              </div>
              <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div class="d-flex justify-content-between">
                </div>
              </div>
              <div class="card-body pt-0 pt-md-4">
                <div class="row">
                  <div class="col">
                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                     <div>${user.occupation}</div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <h3>
                    ${user.name}
                    <span class="font-weight-light">, ${getAge(
                      user.birth_date.substring(0, 10)
                    )}</span>
                  </h3>
                  <div class="h5">
                    <i class="mr-2"></i>${user.email}
                  </div>
                  <hr class="my-4">
                  <p>${user.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

  document.querySelector(".main-content").innerHTML = htmlStr;
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

function goBack() {
  window.history.back();
}
