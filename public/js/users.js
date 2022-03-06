window.onload = async () => {
  const socket = io.connect();
  await loadUsersData();

  socket.on("new-user", () => {
    loadUsersData();
  });
};

async function loadUsersData() {
  const resp = await fetch("/user");
  const users = (await resp.json()).users;

  let htmlStr = ``;
  for (const user of users) {
    htmlStr += `<div class="container mt-7">
        <div class="row">
          <div class="col-xl-8 m-auto order-xl-2 mb-5 mb-xl-0">
            <div class="card card-profile shadow">
              <div class="row justify-content-center">
                <div class="col-lg-3 order-lg-2">
                  <div class="card-profile-image">
                    <a href="/user.html?id=${user.id}">
                    <img src="${user.profile_img}">
                    </a>
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
                      <div>
                        <span class="heading">${user.budget}</span>
                        <span class="description">Budget</span>
                      </div>
                      <div>
                        <span class="heading">${user.occupation}</span>
                        <span class="description">Occupation</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <h3>
                    ${user.name}
                    <span class="font-weight-light">, ${getAge(
                      user.birth_date.substring(0, 10)
                    )}</span>
                    <span class="font-weight-light">, ${user.gender}</span>
                  </h3>
                  <div class="h5">
                    <i class="mr-2"></i>${user.email}
                  </div>
                  <hr class="my-4">
                  <h3>Description: ${user.description}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  document.querySelector(".main-content").innerHTML = htmlStr;
}

const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
