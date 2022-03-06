const toggleButton = document.querySelector(".toggle-button");
const navbarLinks = document.querySelector(".nav-links");

window.onload = async () => {
  await checkIsLoggedIn();
  await loadRoomData();
  await loadCommentData();
};

async function loadRoomData() {
  const isLoggingInResp = await fetch("/checkIsLoggedIn");
  const isLoggingIn = (await isLoggingInResp.json()).result;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  const resp = await fetch(`/room/${id}`);
  const room = (await resp.json()).data;

  const resp2 = await fetch(`/roomImage/${id}`);
  const images = (await resp2.json()).data;
  const image1 = images[0].img;
  const image2 = images[1].img;
  const image3 = images[2].img;

  const hostResp = await fetch(`/user/${room.host_id}`);
  const host = (await hostResp.json()).user;

  let htmlStr = ``;
  htmlStr += /*html*/ `
    <div class="d-flex justify-content-center">
      <div class="card">
        <div class="card-header">
        <img src="${image1}" /> 
        <img src="${image2}" />
        <img src="${image3}" /> 
      </div>
        <div class="card-body">
          <span class="tag tag-purple">${room.district}</span>
          <h4>${room.address}</h4>
          <span>Size: ${room.size}ft</span>
          <span><i class="fas fa-dollar-sign"></i>${room.monthly_rent} per month</span>
          <span>Period: ${room.rental_period} month</span>
          <span>Tenant Number: ${room.tenant_number}</span>
          <span>Rules: ${room.rules}</span>
            <div class="user">
              <a href="/user.html?id=${room.host_id}"><img src="${host.profile_img}"></a> 
                <div class="user-info">
                <h5>${host.name}</h5>
                <div style="width:900px;" align="center">
                <button type="button" class="btn btn-danger" onclick="applyRoom(${room.id})">Apply</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.querySelector(".main-content").innerHTML = htmlStr;

  if (!isLoggingIn) {
    return;
  }
  const loggingInUserResp = await fetch(`/user/loggingIn`);
  const loggingInUser = (await loggingInUserResp.json()).user;

  const isApplyingRoomResp = await fetch(`/application/user/${room.id}`);
  const isApplyingRoom = (await isApplyingRoomResp.json()).result;

  const isLivingRoomResp = await fetch(`/application/isLiving/${room.id}`);
  const isLivingRoom = (await isLivingRoomResp.json()).data;

  if (room.host_id === loggingInUser.id || isLivingRoom) {
    document.querySelector(
      ".user"
    ).innerHTML = /*html*/ `<a href="/user.html?id=${room.host_id}"><img src="${host.profile_img}"></a>
    <div class="user-info">
    <h5>${host.name}</h5>`;
  }

  if (isApplyingRoom) {
    document.querySelector(".user").innerHTML = /*html*/ `
    <a href="/user.html?id=${room.host_id}"><img src="${host.profile_img}"></a> 
    <div class="user-info">
    <h5>${host.name}</h5>
    <div style="width:900px;" align="center">
    <button type="button" class="btn btn-danger">Pending</button>
    <div>
    `;
  }
}

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

toggleButton.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});

async function applyRoom(rid) {
  const isLoggingIn = window.localStorage.getItem("user");

  if (!isLoggingIn) {
    window.location = "/login.html";
    return;
  }

  swal("Apply this room?", {
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
        const resp = await fetch(`/application/apply/${rid}`);
        const result = await resp.json();

        if (resp.status === 200) {
          const message = result.message;
          swal(message, "", "success");
          document.addEventListener("click", async () => {
            await loadRoomData();
          });
        }
        break;
    }
  });

  // const resp = await fetch(`/application/apply/${rid}`);
  // const result = await resp.json();

  // if (resp.status === 200) {
  //   const message = result.message;
  //   swal(message, "", "success");
  //   document.addEventListener("click", () => {
  //     loadRoomData();
  //   });
  // }
}

function goBack() {
  window.history.back();
}

async function loadCommentData() {
  const isLoggingIn = window.localStorage.getItem("user");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  const resp = await fetch(`/comment/${id}`);
  const comments = (await resp.json()).data;
  console.log(comments);
  commentsStr = ``;

  if (comments.length == 0) {
    document.querySelector(".comment-container").remove();
    return;
  }

  for (const comment of comments) {
    console.log(new Date(comment.created_at));
    commentsStr += /*html*/ `
    <div class="comment-box">
  
      <div class="user-info">
        <div>
          <a href="/user.html?id=${
            comment.user_id
          }"><img class="profile-img" src="${comment.profile_img}"></a>
        </div>
        <div class="text-center">${comment.name}</div>
      </div>

      <div class="comment ms-2">
        <div class="header">
          <div class="title"><b>${comment.title}</b></div>
        </div>
        <hr>
        <div class="message">${comment.message}</div>
        <div class="msg-time">${String(new Date(comment.created_at)).slice(
          3,
          21
        )}</div>
      </div>
      
    </div>
    `;
  }

  document.querySelector(".comment-container").innerHTML = commentsStr;
}
