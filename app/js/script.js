const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
const commentsCtn = document.querySelector(".allCommentCtn");
const userImgEl = document.querySelector("#currentUserImg");

const openModal = () => {
  modal.classList.add("fade-in");
  overlay.classList.add("fade-in");
  modal.style.display = "block"; // make the modal visible
  overlay.style.display = "block"; // make the overlay visible
  body.classList.toggle("no-scroll");

  overlay.addEventListener("click", closeModal);
};

const closeModal = () => {
  modal.classList.add("fade-out");
  overlay.classList.add("fade-out");
  body.classList.toggle("no-scroll");

  setTimeout(() => {
    modal.style.display = "none"; // hide the modal after the animation completes
    overlay.style.display = "none"; // hide the overlay after the animation completes
    modal.classList.remove("fade-out");
    overlay.classList.remove("fade-out");
  }, 300); // set the timeout to match the animation duration
};

let commentData = JSON.parse(localStorage.getItem("commentData")) || [];
let currenUser = {};

const setCurrentUser = () => {
  currenUser = commentData.currentUser;
  userImgEl.src = currenUser.image.webp;
};

if (commentData.length === 0) {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      commentData = data;
      localStorage.setItem("commentData", JSON.stringify(commentData));
      setTimeout(() => {
        setCurrentUser();
        renderComments();
      });
    })
    .catch((err) => console.log("something went wrong", err));
} else {
  setTimeout(() => {
    setCurrentUser();
    console.log(commentData.comments);
    renderComments();
  });
}

const renderComments = () => {
  commentsCtn.innerHTML = "";
  console.log("working");

  commentData.comments.forEach((comment, i) => {
    const { content, createdAt, replies, score, user } = comment;

    commentsCtn.innerHTML += /*html*/ `

     <section class="commentSection">
        <div id="${i}" class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4">
            <div class="commentCard__header flex items-center gap-x-4 pb-4">
                <img class="w-10" src="${
                  user.image.webp
                }" alt="profile img avatar">
                <p class="username font-semibold">${user.username}</p>
                <p class="postedAt font-medium">${createdAt}</p>
            </div>
            <p class="commentCard__comment">
                ${content}
            </p>
            <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
                <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
                <i onclick="increaseScore(${i})" class="bi bi-plus"></i>
                <span class="count">${score}</span>
                <i onclick="decreaseScore(${i})" class="bi bi-dash"></i>
                </div>
                <div  onclick="reply(this)" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                <i class="bi bi-reply-fill"></i>
                <p>Reply</p>
                </div>
            </div>
        </div>

        ${renderReplies(replies, i)}

   </section>

     `;
  });
};

const renderReplies = (data, commentIndex) => {

  let html = "";
  if (data.length > 0) {
    getSpaceBetweenElements(commentIndex);
    data.forEach((reply, i) => {
      const { content, createdAt, replyingTo, score, user } = reply;

      html += /*html*/ `
            <div class="replyCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 w-[95%] lg:w-[88%]">
                    ${
                      i === 0
                        ? /*html*/ `
                    <span id="line" class="block absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-300"></span>
                    `
                        : ""
                    }
                    <div class="replyCard__header flex items-center gap-x-4 pb-4">
                        <img class="w-10" src="${user.image.webp}" alt="">
                        <p class="username font-semibold">${user.username}</p>
                        <p class="postedAt font-medium">${createdAt}</p>
                    </div>
                    <p class="replyCard__comment">
                     <span class="replyTo font-bold pr-1">@${replyingTo}</span>${content}
                    </p>
                    <div class="replyCard__footer flex items-center justify-between mt-5 lg:block">
                        <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
                            <i onclick="increaseReplyScore(${i}, '${commentIndex}')" class="bi bi-plus"></i>
                            <span class="count">${score}</span>
                            <i onclick="decreaseReplyScore(${i}, '${commentIndex}')" class="bi bi-dash"></i>
                        </div>
                    <div onclick="reply(this)" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                        <i class="bi bi-reply-fill"></i>
                        <p>Reply</p>
                    </div>
                  </div>
          </div>
            `;
    });
  }

  return html;
};


const getSpaceBetweenElements = (commentIndex) => {
    let element1;
    let element2;
    let spaceBetweenElements;

    setTimeout(() => {
        element1 = document.getElementById(`${commentIndex}`);
        console.log(element1);
        if (commentIndex !== commentData.comments.length - 1) {
          element2 = element1.nextElementSibling;
        } else {
          element2 = document.querySelector(".addComment");
        }
        spaceBetweenElements = element2.offsetTop - (element1.offsetTop + element1.offsetHeight)
        document.getElementById("line").style.height = `${spaceBetweenElements - 13}px`;
    });
}