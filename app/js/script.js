const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
const commentsCtn = document.querySelector(".allCommentCtn");
const userImgEl = document.querySelector("#currentUserImg");


const openModal = (element) => {
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
let currentUser = {};

const updatelocalstorage = () => {
    localStorage.setItem("commentData", JSON.stringify(commentData));
    commentData = JSON.parse(localStorage.getItem("commentData"))
}

const setCurrentUser = () => {
  currentUser = commentData.currentUser;
    userImgEl.src = currentUser.image.webp;
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

      if (user.username !== currentUser.username) {
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
                   <i onclick="increaseScore(${i}, this)" class="bi bi-plus"></i>
                   <span class="count">${score}</span>
                   <i onclick="decreaseScore(${i}, this)" class="bi bi-dash"></i>
                   </div>
                   <div data-clicked="false" onclick="reply(this, ${i}, false)" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                   <i class="bi bi-reply-fill"></i>
                   <p>Reply</p>
                   </div>
               </div>
           </div>
   
           ${renderReplies(replies, i)}
   
      </section>
   
        `;
      } else {
          commentsCtn.innerHTML += /*html*/ `
          <section class="commentSection">
          
          <div id="${i}" class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">
              <div class="commentCard__header flex items-center gap-x-4 pb-4">
                  <img class="w-10" src="${user.image.webp}" alt="user profile avatar">
                  <p class="username font-semibold">${user.username}</p>
                  <p class="you text-white px-2 ml-[-10px] text-sm">you</p>
                  <p class="postedAt font-medium">${createdAt}</p>
              </div>
          <p class="commentCard__comment">
            ${content}
          </p>
          <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
          <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
              <i onclick="increaseScore(${i}, this)" class="bi bi-plus"></i>
              <span class="count">${score}</span>
              <i onclick="decreaseScore(${i}, this)" class="bi bi-dash"></i>
          </div>
          <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">
              <div onclick="openModal(this)" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">
              <i class="bi bi-trash-fill"></i>
              <p>DELETE</p>
              </div>
              <div class="edit flex items-center gap-x-1 cursor-pointer">
              <i class="bi bi-pen-fill"></i>
              <p>EDIT</p>
              </div>
          </div>
          </div>
      </div>

        ${renderReplies(replies, i)}
    </section>
        `;
     }
  });
};

const renderReplies = (data, commentIndex) => {

  let html = "";
  if (data.length > 0) {
    getSpaceBetweenElements(commentIndex);
    data.forEach((reply, i) => {
      const { content, createdAt, replyingTo, score, user } = reply;

        if (user.username !== currentUser.username) {
            html += /*html*/ `
            <section class="replySection">
            
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
                            <i onclick="increaseReplyScore(${i}, '${commentIndex}', this)" class="bi bi-plus"></i>
                            <span class="count">${score}</span>
                            <i onclick="decreaseReplyScore(${i}, '${commentIndex}', this)" class="bi bi-dash"></i>
                        </div>
                    <div data-clicked="false" onclick="reply(this, ${commentIndex}, true)" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                        <i class="bi bi-reply-fill"></i>
                        <p>Reply</p>
                    </div>
                  </div>
           </div>

            </section>
            `;
        } else {
            html += /*html*/ `
            <div class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">
            ${
                i === 0
                  ? /*html*/ `
              <span id="line" class="block absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-300"></span>
              `
                  : ""
              }
                <div class="commentCard__header flex items-center gap-x-4 pb-4">
                    <img class="w-10" src="${user.image.webp}" alt="user profile avatar">
                    <p class="username font-semibold">${user.username}</p>
                    <p class="you text-white px-2 ml-[-10px] text-sm">you</p>
                    <p class="postedAt font-medium">${createdAt}</p>
                </div>
                <p class="commentCard__comment">
                <span class="replyTo font-bold pr-1">@${replyingTo}</span>${content}
                </p>
                <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
                <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
                    <i onclick="increaseReplyScore(${i}, '${commentIndex}', this)" class="bi bi-plus"></i>
                    <span class="count">${score}</span>
                    <i  onclick="decreaseReplyScore(${i}, '${commentIndex}', this)" class="bi bi-dash"></i>
                </div>
                <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">
                    <div onclick="openModal(this)" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">
                        <i class="bi bi-trash-fill"></i>
                        <p>DELETE</p>
                    </div>
                    <div onclick="edit(this)" class="edit flex items-center gap-x-1 cursor-pointer">
                        <i class="bi bi-pen-fill"></i>
                        <p>EDIT</p>
                    </div>
                </div>
                </div>
          </div>
            `
     }
    });
  }

  return html;
};


const getSpaceBetweenElements = (commentIndex, minusValue = 13) => {
    let element1;
    let element2;
    let spaceBetweenElements;

    setTimeout(() => {
        element1 = document.getElementById(`${commentIndex}`);
        if (commentIndex !== commentData.comments.length - 1) {
          element2 = element1.nextElementSibling;
        } else {
          element2 = document.querySelector(".addComment");
        }
        spaceBetweenElements = element2.offsetTop - (element1.offsetTop + element1.offsetHeight)
        document.getElementById("line").style.height = `${spaceBetweenElements - minusValue}px`;
    });
}



const increaseScore = (commentIndex, element) => {
    const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
    comment.score++;
    element.nextElementSibling.textContent = comment.score;
    updatelocalstorage();
}


const decreaseScore = (commentIndex, element) => {
    const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
    comment.score > 0 && comment.score--;
    element.previousElementSibling.textContent = comment.score;
    updatelocalstorage();
}

const increaseReplyScore = (replyIndex, commentIndex, element) => {
    const thisReplies = commentData.comments[commentIndex].replies;
    const reply = thisReplies.find(reply => thisReplies.indexOf(reply) === replyIndex)
    reply.score++;
    element.nextElementSibling.textContent = reply.score;
    updatelocalstorage()
}

const decreaseReplyScore = (replyIndex, commentIndex, element) => {
    const thisReplies = commentData.comments[commentIndex].replies;
    const reply = thisReplies.find(reply => thisReplies.indexOf(reply) === replyIndex)
    reply.score > 0 && reply.score--;
    element.previousElementSibling.textContent = reply.score;
    updatelocalstorage()
}

window.addEventListener('resize', () => {
  commentData.comments.forEach((comment, i) => {
    const { replies } = comment

    if (replies.length > 0) {
      getSpaceBetweenElements(i, 45)
    }
  })
})


const reply = (element, commentIndex, isOnReply) => {
    let commentCard;

    let html = `
    <div class="addCommentCard bg-white px-5 lg:pr-4 rounded-xl flex flex-col lg:justify-end lg:flex-row gap-x-5 relative lg:pb-6 lg:pt-4 w-[95%] ml-auto lg:w-[88%] mt-5">
        <textarea name="comment" id="comment" cols="30" rows="2" class="w-full p-4 mt-5 lg:mt-4 rounded-lg lg:w-[70%]" placeholder="Add a comment..."></textarea>
        <div class="footer flex justify-between items-center lg:block py-3">
        <img class="w-10 lg:absolute left-5 top-8" src="./images/avatars/image-maxblagun.png" alt="">
        <button type="button" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium">REPLY</button>
        </div>
    </div>
    `
    if (!isOnReply) {
        commentCard =  element.closest(".commentSection");
    } else {
        commentCard = element.closest(".replySection");
    }
    
   const lastChild = commentCard.lastElementChild;
     
   const replyBtnClicked = element.getAttribute("data-clicked");

  if (replyBtnClicked == 'false') {
     console.log(replyBtnClicked)
     lastChild.insertAdjacentHTML("afterend", html);
     getSpaceBetweenElements(commentIndex, 45)
   }

   element.setAttribute("data-clicked", "true");
}