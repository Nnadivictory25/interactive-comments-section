const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
const commentsCtn = document.querySelector(".allCommentCtn");
const userImgEl = document.querySelector("#currentUserImg");
let heights = []
let replyToDelete;


const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

const openModal = (element) => {
  modal.classList.add("fade-in");
  overlay.classList.add("fade-in");
  modal.style.display = "block"; // make the modal visible
  overlay.style.display = "block"; // make the overlay visible
  body.classList.add("no-scroll");

  overlay.addEventListener("click", closeModal);
};

const closeModal = () => {
  modal.classList.add("fade-out");
  overlay.classList.add("fade-out");
  body.classList.remove("no-scroll");

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

// ! RENDER COMMENTS FUNCTION
const renderComments = () => {

  commentsCtn.innerHTML = "";

  commentData.comments.forEach((comment, i) => {
    const { content, createdAt, replies, score, upvoted, downvoted, user } = comment;

      if (user.username !== currentUser.username) {
        commentsCtn.innerHTML += /*html*/ `
        
        <section class="commentSection overflow-hidden">
           <div id="${i}" class="commentCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4">
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
                   <i onclick="increaseScore(${i}, this, ${upvoted})" class="bi bi-plus"></i>
                   <span class="count">${score}</span>
                   <i onclick="decreaseScore(${i}, this, ${downvoted})" class="bi bi-dash"></i>
                   </div>
                   <div data-clicked="false" onclick="reply(this, ${i}, false, '${user.username}')" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                   <i class="bi bi-reply-fill"></i>
                   <p>Reply</p>
                   </div>
               </div>
           </div>
   
           ${renderReplies(replies, i)}
   
      </section>
   
        `;
      } else {
          const id = i + 1;
          commentsCtn.innerHTML += /*html*/ `
          <section class="commentSection">
          
          <div id="${i}" class="commentCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto">
              <div class="commentCard__header flex items-center gap-x-4 pb-4">
                  <img class="w-10" src="${user.image.webp}" alt="user profile avatar">
                  <p class="username font-semibold">${user.username}</p>
                  <p class="you text-white px-2 ml-[-10px] text-sm">you</p>
                  <p class="postedAt font-medium">${isDate(createdAt) ? formatDate(createdAt) : createdAt}</p>
              </div>
          <p class="commentCard__comment">
            ${content}
          </p>
          <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
          <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
              <i onclick="increaseScore(${i}, this, ${upvoted})" class="bi bi-plus"></i>
              <span class="count">${score}</span>
              <i onclick="decreaseScore(${i}, this, ${downvoted})" class="bi bi-dash"></i>
          </div>
          <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">
              <div onclick="DELETE(this, ${i}, false, ${id})" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">
              <i class="bi bi-trash-fill"></i>
              <p>DELETE</p>
              </div>
              <div onclick="edit(this, ${i}, ${score}, false)" class="edit flex items-center gap-x-1 cursor-pointer">
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
  })


  commentData.comments.forEach((comment, i) => {
    const { replies } = comment
    if (replies.length > 0) {
      getSpaceBetweenElements(i)
      heights = []
    }
  })
};

// ! DATE FORMAT CHECKER
const isDate = (value) => {
  const date = new Date(value);
  return date.getTime() === date.getTime(); // Check if getTime() returns a valid timestamp
}

// ! REPLY RENDERING FUNCTION 
const renderReplies = (data, commentIndex) => {
  let html = "";
  if (data.length > 0) {

    data.forEach((reply, i) => {
      const { id, content, createdAt, replyingTo, score, upvoted, downvoted, user } = reply;

        if (user.username !== currentUser.username) {
            html += /*html*/ `
            <section class="replySection">
            
            <div class="replyCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 w-[95%] lg:w-[88%]">
                    ${
                      i === 0
                        ? /*html*/ `
                    <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-200"></span>
                    `
                        : ""
                    }
                    <div class="replyCard__header flex items-center gap-x-4 pb-4">
                        <img class="w-10" src="${user.image.webp}" alt="">
                        <p class="username font-semibold">${user.username}</p>
                        <p class="postedAt font-medium">${isDate(createdAt) ? formatDate(createdAt) : createdAt}</p>
                    </div>
                    <p class="replyCard__comment">
                     <span class="replyTo font-bold pr-1">@${replyingTo}</span>${content}
                    </p>
                    <div class="replyCard__footer flex items-center justify-between mt-5 lg:block">
                        <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
                            <i onclick="increaseReplyScore(${i}, '${commentIndex}', this, ${upvoted})" class="bi bi-plus"></i>
                            <span class="count">${score}</span>
                            <i onclick="decreaseReplyScore(${i}, '${commentIndex}', this, ${downvoted})" class="bi bi-dash"></i>
                        </div>
                    <div data-clicked="false" onclick="reply(this, ${commentIndex}, true, '${user.username}')" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">
                        <i class="bi bi-reply-fill"></i>
                        <p>Reply</p>
                    </div>
                  </div>
           </div>

            </section>
            `;
        } else {
            html += /*html*/ `
            <div class="commentCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">
            ${
                i === 0
                  ? /*html*/ `
              <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-200"></span>
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
                    <i onclick="increaseReplyScore(${i}, '${commentIndex}', this, ${upvoted})" class="bi bi-plus"></i>
                    <span class="count">${score}</span>
                    <i  onclick="decreaseReplyScore(${i}, '${commentIndex}', this, ${downvoted})" class="bi bi-dash"></i>
                </div>
                <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">
                    <div onclick="DELETE(this, ${commentIndex}, ${i}, '${id}')" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">
                        <i class="bi bi-trash-fill"></i>
                        <p>DELETE</p>
                    </div>
                    <div onclick="edit(this, ${commentIndex}, ${i}, ${score}, '${isDate(createdAt) ? formatDate(createdAt) : createdAt}', '${replyingTo}', true)" class="edit flex items-center gap-x-1 cursor-pointer">
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



const getSpaceBetweenElements = (commentIndex) => {
    let element1;
    let element2;
    let spaceBetweenElements;
    let length = commentData.comments.length

    setTimeout(() => {
        commentData.comments.forEach((comment, i) => {
          const { replies } = comment
          if (replies.length == 0) {
            length--
          }
        })
        const lines = Array.from(document.querySelectorAll('.line'))
        element1 = document.getElementById(`${commentIndex}`);
        if (commentIndex !== commentData.comments.length - 1) {
          element2 = element1.parentElement.nextElementSibling
        } else {
          element2 = document.querySelector(".addComment");
        }
        spaceBetweenElements = element2.offsetTop - (element1.offsetTop + element1.offsetHeight)
        heights.push(spaceBetweenElements)
        console.log(heights)
        for (let i = 0; i < length; i++) {
          lines[i].style.height = `${heights[i]}px`;
        }
    });
}



const increaseScore = (commentIndex, element, upvoted) => {
    const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
    comment.upvoted = true;
    !upvoted && comment.score++
    comment.downvoted = false;
    element.nextElementSibling.textContent = comment.score;
    updatelocalstorage()
    heights = []
    !upvoted && renderComments()
}


const decreaseScore = (commentIndex, element, downvoted) => {
    const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
    comment.downvoted = true;
    if (!downvoted && comment.score > 0) {
      comment.score--
    }
    comment.upvoted = false; 
    element.previousElementSibling.textContent = comment.score;
    updatelocalstorage();
    heights = []
    !downvoted && renderComments()
}

const increaseReplyScore = (replyIndex, commentIndex, element, upvoted) => {
    const thisReplies = commentData.comments[commentIndex].replies;
    const reply = thisReplies.find(reply => thisReplies.indexOf(reply) === replyIndex)
    reply.upvoted = true
    !upvoted && reply.score++;
    reply.downvoted = false
    element.nextElementSibling.textContent = reply.score;
    updatelocalstorage()
    heights = []
    !upvoted && renderComments()
}

const decreaseReplyScore = (replyIndex, commentIndex, element, downvoted) => {
    const thisReplies = commentData.comments[commentIndex].replies;
    const reply = thisReplies.find(reply => thisReplies.indexOf(reply) === replyIndex)
    reply.downvoted = true
    if (!downvoted && reply.score > 0) {
      reply.score--
    }
    reply.upvoted = false;
    element.previousElementSibling.textContent = reply.score;
    updatelocalstorage()
    heights = []
    !downvoted && renderComments()
}

window.addEventListener('resize', () => {
  commentData.comments.forEach((comment, i) => {
    heights = []
    const { replies } = comment
    if (replies.length > 0) {
      getSpaceBetweenElements(i)
    }
  })
})


const reply = (element, commentIndex, isOnReply, replyingTo) => {
  let commentCard;
  heights = []

    if (!isOnReply) {
        commentCard =  element.closest(".commentSection");
    } else {
        commentCard = element.closest(".replySection");
    }
    
    const commentCardChildren = Array.from(commentCard.children);
    const index  = commentCardChildren.length - 1;
    

    let html = /*html*/ `
    <div class="addCommentCard bg-white px-5 lg:pr-4 rounded-md flex flex-col lg:justify-end lg:flex-row gap-x-5 relative lg:pb-6 lg:pt-4 w-[95%] ml-auto lg:w-[88%] mt-5">
        ${
          index === 0
            ? /*html*/ `
        <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-200"></span>
        `
            : ""
        }
        <textarea name="comment" id="${isOnReply ? 'replyInput' : 'replyToCommentInput'}" cols="30" rows="3" class="textArea w-full px-4 py-1 mt-5 lg:mt-4 rounded-lg lg:w-[70%]" placeholder="Add a comment...">@${replyingTo + ''} </textarea>
        <div class="footer flex justify-between items-center lg:block py-3">
        <img class="w-10 lg:absolute left-5 top-8" src="${currentUser.image.webp}" alt="">
        <button onclick="preRenderReply(this, '${replyingTo}', ${isOnReply})" type="button" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium">REPLY</button>
        </div>
    </div>
    `
    
   const lastChild = commentCard.lastElementChild;
     
   const replyBtnClicked = element.getAttribute("data-clicked");

  if (replyBtnClicked == 'false') {
     lastChild.insertAdjacentHTML("afterend", html);
     commentData.comments.forEach((comment, i) => {
      const { replies } = comment
      if (replies.length > 0) {
        getSpaceBetweenElements(i)
      }
    })
     const textArea = document.getElementById(`${isOnReply? 'replyInput' : 'replyToCommentInput'}`)
     textArea.focus();
     textArea.selectionStart = replyingTo.length + 2;
     textArea.selectionEnd = replyingTo.length + 2;
   }

   element.setAttribute("data-clicked", "true");
}


const formatDate = (date, locale = navigator.language) => {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

  const daysPassed = calcDaysPassed(new Date(), date)
  switch (daysPassed) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    case daysPassed <= 7:
      return '1 week ago';
    case daysPassed <= 14:
      return '2 weeks ago';
    case daysPassed <= 21:
      return '3 weeks ago';
    case daysPassed <= 30:
      return '1 month ago';
    case daysPassed <= 60:
      return '2 months ago';
    case daysPassed <= 90:
      return '3 months ago';
    default:
      return new Intl.DateTimeFormat(locale).format(date)
  }
}

const preRenderReply = (element, replyingTo, isOnReply) => {
  heights = []
  let inputValue = element.parentElement.previousElementSibling.value.trim()
  inputValue = inputValue.replace(`@${replyingTo}`, "");

  let commentToInsertIn
  console.log(isOnReply)
  if (!isOnReply) {
   commentToInsertIn = commentData.comments.find(comment => comment.user.username === replyingTo)
  } else {
    commentToInsertIn = commentData.comments.find(comment => comment.replies.find(reply => reply.replyingTo == replyingTo))
  }

  commentToInsertIn.replies.push({
    id: generateUniqueId(),
    content: inputValue.trim(),
    createdAt: formatDate(new Date()),
    score: 0,
    replyingTo: replyingTo,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
  });

  updatelocalstorage()
  renderComments()
}

let replyToUpdate;
let inputValue;

const edit = (element, commentIndex, replyIndex, score, createdAt, replyingTo, isReply) => {
  const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
  const thisReplies = comment.replies
  const reply = thisReplies.find(reply => thisReplies.indexOf(reply) === replyIndex)
  replyToUpdate = reply
  inputValue = element.parentElement.parentElement.previousElementSibling.textContent.trim().replace(`@${replyingTo}`, "")
  const commentCard = element.closest(".commentCard")
  const commentSection = element.closest(".commentSection")
  let html;

  if (isReply) {
    
    html = /*html*/ `
    <div class="commentCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">
      ${
        replyIndex === 0
          ? /*html*/ `
      <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-200"></span>
      `
          : ""
      }
      <div class="commentCard__header flex items-center gap-x-4 pb-4">
      <img class="w-10" src="${currentUser.image.webp}" alt="user profile avatar">
        <p class="username font-semibold">juliosumo</p>
        <p class="you text-white px-2 ml-[-10px] text-sm bg-blue">you</p>
        <p class="postedAt font-medium">${createdAt}</p>
        </div>
      <textarea oninput="validateInput(this)" name="comment" id="update" cols="30" rows="4" class="w-full px-4 py-2 rounded-lg mb-3 lg:mb-0">@${replyingTo} ${inputValue}</textarea>
      <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
        <div class="score bg-grey flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
          <i class="bi bi-plus"></i>
          <span class="count">${score}</span>
          <i class="bi bi-dash"></i> 
        </div>
          <div class="updateBtn lg:text-right">
            <button disabled onclick="update(this, '${replyingTo}')" id="updateBtn" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium disabled:opacity-30 disabled:pointer-events-none">UPDATE</button>
          </div>
        </div>
      </div>
   </div>
    `

  } else {
    let commentCreatedAt = comment.createdAt
    let commentScore = comment.score
    let id = comment.id
    
    html = /*html*/ `
    <div class="commentCard bg-white rounded-md p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto">

      <div class="commentCard__header flex items-center gap-x-4 pb-4">
      <img class="w-10" src="${currentUser.image.webp}" alt="user profile avatar">
        <p class="username font-semibold">juliosumo</p>
        <p class="you text-white px-2 ml-[-10px] text-sm bg-blue">you</p>
        <p class="postedAt font-medium">${commentCreatedAt}</p>
        </div>
      <textarea oninput="validateInput(this)" name="comment" id="update" cols="30" rows="4" class="w-full px-4 py-2 rounded-lg mb-3 lg:mb-0"> ${inputValue}</textarea>
      <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">
        <div class="score bg-grey flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">
          <i class="bi bi-plus"></i>
          <span class="count">${commentScore}</span>
          <i class="bi bi-dash"></i> 
        </div>
          <div class="updateBtn lg:text-right">
            <button data-commentId="${id}" disabled onclick="update(this, false)" id="updateBtn" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium disabled:opacity-30 disabled:pointer-events-none">UPDATE</button>
          </div>
        </div>
      </div>
   </div>
    `
  }
  
  heights = []
  commentCard.remove()
  commentSection.insertAdjacentHTML("beforeend", html)
  commentData.comments.forEach((comment, i) => {
    const { replies } = comment
    if (replies.length > 0) {
      getSpaceBetweenElements(i)
    }
  })

  const textArea = document.getElementById("update")
  textArea.focus();
  textArea.selectionStart = textArea.value.length + 1;
  textArea.selectionEnd = textArea.value.length + 1;
}

const validateInput = (input) => {
  const btn = document.getElementById("updateBtn")
  if (input.value === inputValue) {
    btn.disabled = true;
  } else {
    btn.disabled = false;
  }
} 

const update = (element, replyingTo) => {
  let inputValue;
  heights = []
  if (replyingTo !== false) {
    inputValue  = element.parentElement.parentElement.previousElementSibling.value.trim().replace(`@${replyingTo}`, "")
    replyToUpdate.content = inputValue
    replyToUpdate.createdAt = formatDate(new Date())
  } else {
    inputValue = element.parentElement.parentElement.previousElementSibling.value.trim()
    const id = +element.getAttribute("data-commentId")
    const comment = commentData.comments.find(comment => comment.id === id)
    
    comment.content = inputValue
    comment.createdAt = formatDate(new Date())
  }
  updatelocalstorage()
  renderComments()
}

const DELETE = (element, commentIndex, replyIndex, id) => {
  const comment = commentData.comments.find(comment => comment.id === commentIndex + 1)
  let thisReplies = comment.replies
  const index = thisReplies.findIndex(reply => reply.id === id);
  console.log(index)
  if (replyIndex && index === -1) {
    // reply not found
    return;
  }

  openModal()

  const deleteBtn = document.getElementById("deleteBtn")

  deleteBtn.addEventListener("click", () => { 
    if (index !== -1) {
      element.parentElement.parentElement.parentElement.remove()
      thisReplies.splice(index, 1)
    } else {
      const INDEX = id - 1
      console.log(INDEX)
      commentData.comments.splice(INDEX, 1)
      element.parentElement.parentElement.parentElement.remove()
    }
    setTimeout(() => {
      updatelocalstorage()
      renderComments()
    });
    closeModal()
  })
}

// ! ADDING COMMENT
const commentInput = document.querySelector('.addCommentInput')

const addComment = (el) => {
  const inputValue = commentInput.value.trim();
  let length = commentData.comments.length + 1
  
  if (inputValue === "") {
    return;
  }
  
  commentData.comments.push({
    id: length,
    content: inputValue,
    createdAt: formatDate(new Date()),
    score: 0,
    upvoted: false,
    downvoted: false,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    replies: [],
  })
  
  commentInput.value = ''
  setTimeout(() => {
    updatelocalstorage()
    renderComments()
  });
  console.log(commentData.comments)
}
