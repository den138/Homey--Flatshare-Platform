const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");
const logoutButton = document.querySelector(".logout");

window.onload = async () => {
  await getUserData();
  await checkIsLoggedIn();
};

async function getUserData() {
  const resp = await fetch(`/user/profile`);
  const user = (await resp.json()).user;

  let htmlStr = ``;
  htmlStr += `        <div class="cardx">
  <div class="profile-sidebar">
      <div class="profile-img-container"><img class="profile-img"src="${
        user.profile_img
      }" alt=""></div>
                  
  </div>

  <div class="profile-main">
      <h2 class=profile-name>${user.name}</h2>
      <div class="profile-position">${user.occupation}</div>
      <br>
      <div class="profile-body">${getAge(
        user.birth_date.substring(0, 10)
      )} Years Old</div>
      <div class="profile-body">${user.email}</div>  
  </div>
</div>`;

  // <div class="container mt-7">
  //   <div class="row">
  //     <div class="col-xl-8 m-auto order-xl-2 mb-5 mb-xl-0">
  //       <div class="card card-profile shadow">
  //         <div class="row justify-content-center">
  //           <div class="col-lg-4 order-lg-2">
  //             <div class="card-profile-image">
  //               <img src="${user.profile_img}">
  //             </div>
  //           </div>
  //         </div>
  //         <div class="card-body pt-0 pt-md-4">
  //           <div class="text-center">
  //             <h3>
  //               ${user.name}
  //               <span class="font-weight-light">, ${getAge(
  //                 user.birth_date.substring(0, 10)
  //               )}</span>
  //               <span class="font-weight-light">, ${user.gender}</span>
  //             </h3>
  //             <div class="h5">
  //               <i class="mr-2"></i>${user.occupation}
  //             </div>
  //             <div class="h5">
  //               <i class="mr-2"></i>${user.email}
  //             </div>
  //             <div class="h5 mt-2">
  //               <i class="mr-2"></i>Rating (star / score)
  //             </div>
  //             <hr class="my-4">
  //             <p>${user.description}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>`;

  document.querySelector(".cardx-container").innerHTML = htmlStr;
}
// const dash = document.querySelector(".list-group");
// const btn = dash.querySelector(".list-group-item");
// for (let i = 0; i < btn.length; i++) {
//   btn[i].addEventListener("click", function () {
//     var current = document.querySelector(".active");
//     current.classList.remove("active");
//     this.classList.add("active");
//     console.log(current);
//   });
// }
const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

async function checkIsLoggedIn() {
  // const resp = await fetch("/checkIsLoggedIn");
  // const respObj = await resp.json();
  // const result = respObj.result;
  // const uid = respObj.uid;

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
