"use strict";var modal=document.querySelector(".modal"),overlay=document.querySelector(".overlay"),body=document.querySelector("body"),commentsCtn=document.querySelector(".allCommentCtn"),userImgEl=document.querySelector("#currentUserImg"),openModal=function(e){modal.classList.add("fade-in"),overlay.classList.add("fade-in"),modal.style.display="block",overlay.style.display="block",body.classList.toggle("no-scroll"),overlay.addEventListener("click",closeModal)},closeModal=function(){modal.classList.add("fade-out"),overlay.classList.add("fade-out"),body.classList.toggle("no-scroll"),setTimeout((function(){modal.style.display="none",overlay.style.display="none",modal.classList.remove("fade-out"),overlay.classList.remove("fade-out")}),300)},commentData=JSON.parse(localStorage.getItem("commentData"))||[],currentUser={},updatelocalstorage=function(){localStorage.setItem("commentData",JSON.stringify(commentData)),commentData=JSON.parse(localStorage.getItem("commentData"))},setCurrentUser=function(){currentUser=commentData.currentUser,userImgEl.src=currentUser.image.webp};0===commentData.length?fetch("./data.json").then((function(e){return e.json()})).then((function(e){commentData=e,localStorage.setItem("commentData",JSON.stringify(commentData)),setTimeout((function(){setCurrentUser(),renderComments()}))})).catch((function(e){return console.log("something went wrong",e)})):setTimeout((function(){setCurrentUser(),console.log(commentData.comments),renderComments()}));var renderComments=function(){commentsCtn.innerHTML="",console.log("working"),commentData.comments.forEach((function(e,t){var n=e.content,o=e.createdAt,c=e.replies,a=e.score,s=e.upvoted,l=e.downvoted,i=e.user;i.username!==currentUser.username?commentsCtn.innerHTML+='\n        \n        <section class="commentSection overflow-hidden">\n           <div id="'.concat(t,'" class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4">\n               <div class="commentCard__header flex items-center gap-x-4 pb-4">\n                   <img class="w-10" src="').concat(i.image.webp,'" alt="profile img avatar">\n                   <p class="username font-semibold">').concat(i.username,'</p>\n                   <p class="postedAt font-medium">').concat(o,'</p>\n               </div>\n               <p class="commentCard__comment">\n                   ').concat(n,'\n               </p>\n               <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">\n                   <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">\n                   <i onclick="increaseScore(').concat(t,", this, ").concat(s,')" class="bi bi-plus"></i>\n                   <span class="count">').concat(a,'</span>\n                   <i onclick="decreaseScore(').concat(t,", this, ").concat(l,')" class="bi bi-dash"></i>\n                   </div>\n                   <div data-clicked="false" onclick="reply(this, ').concat(t,", false, '").concat(i.username,'\')" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">\n                   <i class="bi bi-reply-fill"></i>\n                   <p>Reply</p>\n                   </div>\n               </div>\n           </div>\n   \n           ').concat(renderReplies(c,t),"\n   \n      </section>\n   \n        "):commentsCtn.innerHTML+='\n          <section class="commentSection">\n          \n          <div id="'.concat(t,'" class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">\n              <div class="commentCard__header flex items-center gap-x-4 pb-4">\n                  <img class="w-10" src="').concat(i.image.webp,'" alt="user profile avatar">\n                  <p class="username font-semibold">').concat(i.username,'</p>\n                  <p class="you text-white px-2 ml-[-10px] text-sm">you</p>\n                  <p class="postedAt font-medium">').concat(o,'</p>\n              </div>\n          <p class="commentCard__comment">\n            ').concat(n,'\n          </p>\n          <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">\n          <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">\n              <i onclick="increaseScore(').concat(t,", this, ").concat(s,')" class="bi bi-plus"></i>\n              <span class="count">').concat(a,'</span>\n              <i onclick="decreaseScore(').concat(t,", this, ").concat(l,')" class="bi bi-dash"></i>\n          </div>\n          <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">\n              <div onclick="openModal(this)" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">\n              <i class="bi bi-trash-fill"></i>\n              <p>DELETE</p>\n              </div>\n              <div onclick="editComment(this, ').concat(t,", ").concat(a,')" class="edit flex items-center gap-x-1 cursor-pointer">\n              <i class="bi bi-pen-fill"></i>\n              <p>EDIT</p>\n              </div>\n          </div>\n          </div>\n      </div>\n\n        ').concat(renderReplies(c,t),"\n    </section>\n        ")}))},isDate=function(e){var t=new Date(e);return t.getTime()==t.getTime()},renderReplies=function(e,t){var n="";return e.length>0&&(getSpaceBetweenElements(t),e.forEach((function(e,o){var c=e.content,a=e.createdAt,s=e.replyingTo,l=e.score,i=e.upvoted,r=e.downvoted,m=e.user;m.username!==currentUser.username?n+='\n            <section class="replySection">\n            \n            <div class="replyCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 w-[95%] lg:w-[88%]">\n                    '.concat(0===o?'\n                    <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-300"></span>\n                    ':"",'\n                    <div class="replyCard__header flex items-center gap-x-4 pb-4">\n                        <img class="w-10" src="').concat(m.image.webp,'" alt="">\n                        <p class="username font-semibold">').concat(m.username,'</p>\n                        <p class="postedAt font-medium">').concat(isDate(a)?formatDate(a):a,'</p>\n                    </div>\n                    <p class="replyCard__comment">\n                     <span class="replyTo font-bold pr-1">@').concat(s,"</span>").concat(c,'\n                    </p>\n                    <div class="replyCard__footer flex items-center justify-between mt-5 lg:block">\n                        <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">\n                            <i onclick="increaseReplyScore(').concat(o,", '").concat(t,"', this, ").concat(i,')" class="bi bi-plus"></i>\n                            <span class="count">').concat(l,'</span>\n                            <i onclick="decreaseReplyScore(').concat(o,", '").concat(t,"', this, ").concat(r,')" class="bi bi-dash"></i>\n                        </div>\n                    <div data-clicked="false" onclick="reply(this, ').concat(t,", true, '").concat(m.username,'\')" class="replyBtn flex items-center gap-x-1 font-medium lg:absolute top-7 right-10 cursor-pointer">\n                        <i class="bi bi-reply-fill"></i>\n                        <p>Reply</p>\n                    </div>\n                  </div>\n           </div>\n\n            </section>\n            '):n+='\n            <div class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">\n            '.concat(0===o?'\n              <span id="line" class="block line absolute top-0 w-[2px] left-[-.95rem] lg:left-[-3rem] bg-slate-300"></span>\n              ':"",'\n                <div class="commentCard__header flex items-center gap-x-4 pb-4">\n                    <img class="w-10" src="').concat(m.image.webp,'" alt="user profile avatar">\n                    <p class="username font-semibold">').concat(m.username,'</p>\n                    <p class="you text-white px-2 ml-[-10px] text-sm">you</p>\n                    <p class="postedAt font-medium">').concat(a,'</p>\n                </div>\n                <p class="commentCard__comment">\n                <span class="replyTo font-bold pr-1">@').concat(s,"</span>").concat(c,'\n                </p>\n                <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">\n                <div class="score flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">\n                    <i onclick="increaseReplyScore(').concat(o,", '").concat(t,"', this, ").concat(i,')" class="bi bi-plus"></i>\n                    <span class="count">').concat(l,'</span>\n                    <i  onclick="decreaseReplyScore(').concat(o,", '").concat(t,"', this, ").concat(r,')" class="bi bi-dash"></i>\n                </div>\n                <div class="crudBtns flex items-center gap-x-3 lg:gap-x-5 font-medium lg:absolute top-7 right-10">\n                    <div onclick="openModal(this)" class="delete flex items-center gap-x-1 text-red-500 cursor-pointer">\n                        <i class="bi bi-trash-fill"></i>\n                        <p>DELETE</p>\n                    </div>\n                    <div onclick="editReply(this, ').concat(t,", ").concat(o,", ").concat(l,')" class="edit flex items-center gap-x-1 cursor-pointer">\n                        <i class="bi bi-pen-fill"></i>\n                        <p>EDIT</p>\n                    </div>\n                </div>\n                </div>\n          </div>\n            ')}))),n},heights=[],getSpaceBetweenElements=function(e){var t,n,o;setTimeout((function(){var c=Array.from(document.querySelectorAll(".line"));t=document.getElementById("".concat(e)),n=e!==commentData.comments.length-1?t.parentElement.nextElementSibling:document.querySelector(".addComment"),o=n.offsetTop-(t.offsetTop+t.offsetHeight),heights.push(o),console.log(heights);for(var a=0;a<heights.length;a++)c[a].style.height="".concat(heights[a],"px")}))},increaseScore=function(e,t,n){var o=commentData.comments.find((function(t){return t.id===e+1}));o.upvoted=!0,!n&&o.score++,o.downvoted=!1,t.nextElementSibling.textContent=o.score,updatelocalstorage(),heights=[],!n&&renderComments()},decreaseScore=function(e,t,n){var o=commentData.comments.find((function(t){return t.id===e+1}));o.downvoted=!0,!n&&o.score>0&&o.score--,o.upvoted=!1,t.previousElementSibling.textContent=o.score,updatelocalstorage(),heights=[],!n&&renderComments()},increaseReplyScore=function(e,t,n,o){var c=commentData.comments[t].replies,a=c.find((function(t){return c.indexOf(t)===e}));a.upvoted=!0,!o&&a.score++,a.downvoted=!1,n.nextElementSibling.textContent=a.score,updatelocalstorage(),heights=[],!o&&renderComments()},decreaseReplyScore=function(e,t,n,o){var c=commentData.comments[t].replies,a=c.find((function(t){return c.indexOf(t)===e}));a.downvoted=!0,!o&&a.score>0&&a.score--,a.upvoted=!1,n.previousElementSibling.textContent=a.score,updatelocalstorage(),heights=[],!o&&renderComments()};window.addEventListener("resize",(function(){heights=[],commentData.comments.forEach((function(e,t){e.replies.length>0&&getSpaceBetweenElements(t)}))}));var reply=function(e,t,n,o){heights=[];var c='\n    <div class="addCommentCard bg-white px-5 lg:pr-4 rounded-xl flex flex-col lg:justify-end lg:flex-row gap-x-5 relative lg:pb-6 lg:pt-4 w-[95%] ml-auto lg:w-[88%] mt-5">\n        <textarea name="comment" id="'.concat(n?"replyInput":"replyToCommentInput",'" cols="30" rows="3" class="textArea w-full px-4 py-1 mt-5 lg:mt-4 rounded-lg lg:w-[70%]" placeholder="Add a comment...">@').concat(o+"",' </textarea>\n        <div class="footer flex justify-between items-center lg:block py-3">\n        <img class="w-10 lg:absolute left-5 top-8" src="').concat(currentUser.image.webp,'" alt="">\n        <button onclick="preRenderReply(this, \'').concat(o,"', ").concat(n,')" type="button" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium">REPLY</button>\n        </div>\n    </div>\n    '),a=(n?e.closest(".replySection"):e.closest(".commentSection")).lastElementChild;if("false"==e.getAttribute("data-clicked")){a.insertAdjacentHTML("afterend",c),commentData.comments.forEach((function(e,t){e.replies.length>0&&getSpaceBetweenElements(t)}));var s=document.getElementById("".concat(n?"replyInput":"replyToCommentInput"));s.focus(),s.selectionStart=o.length+2,s.selectionEnd=o.length+2}e.setAttribute("data-clicked","true")},formatDate=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:navigator.language,n=function(e,t){return Math.round(Math.abs(t-e)/864e5)},o=n(new Date,e);switch(o){case 0:return"Today";case 1:return"Yesterday";case o<=7:return"1 week ago";case o<=14:return"2 weeks ago";case o<=21:return"3 weeks ago";case o<=30:return"1 month ago";case o<=60:return"2 months ago";case o<=90:return"3 months ago";default:return new Intl.DateTimeFormat(t).format(e)}},preRenderReply=function(e,t,n){var o,c=e.parentElement.previousElementSibling.value.trim();c=c.replace("@".concat(t),""),console.log(n),o=n?commentData.comments.find((function(e){return e.replies.find((function(e){return e.replyingTo==t}))})):commentData.comments.find((function(e){return e.user.username===t})),o.replies.push({content:c,createdAt:formatDate(new Date),score:0,replyingTo:t,user:{image:{png:"./images/avatars/image-juliusomo.png",webp:"./images/avatars/image-juliusomo.webp"},username:"juliusomo"}}),heights=[],updatelocalstorage(),renderComments(),commentData.comments.forEach((function(e,t){e.replies.length>0&&getSpaceBetweenElements(t)}))},editReply=function(e,t,n,o){var c=commentData.comments.find((function(e){return e.id===t+1})).replies,a=(c.find((function(e){return c.indexOf(e)===n})),e.parentElement.parentElement.previousElementSibling.textContent.trim()),s=e.closest(".commentCard"),l=e.closest(".commentSection"),i='\n  <div class="commentCard bg-white rounded-xl p-5 relative lg:pr-20 lg:pl-24 lg:pb-4 mt-5 ml-auto w-[95%] lg:w-[88%]">\n    <div class="commentCard__header flex items-center gap-x-4 pb-4">\n    <img class="w-10" src="'.concat(currentUser.image.webp,'" alt="user profile avatar">\n      <p class="username font-semibold">juliosumo</p>\n      <p class="you text-white px-2 ml-[-10px] text-sm bg-blue">you</p>\n      <p class="postedAt font-medium">2 days ago</p>\n      </div>\n    <textarea name="comment" id="update" cols="30" rows="4" class="w-full px-4 py-2 mt-4 lg:mt-2 rounded-lg mb-3 lg:mb-0">').concat(a,'</textarea>\n    <div class="commentCard__footer flex items-center justify-between mt-5 lg:block">\n      <div class="score bg-grey flex items-center gap-x-3 font-medium rounded-lg px-4 py-2 lg:absolute left-7 lg:flex-col top-5 lg:py-4 lg:px-3">\n        <i class="bi bi-plus"></i>\n        <span class="count">').concat(o,'</span>\n        <i class="bi bi-dash"></i>\n      </div>\n        <div class="updateBtn lg:text-right">\n          <button onclick="updateReply(this)" class="px-7 py-3 lg:py-2 lg:mt-1 text-white rounded-lg font-medium">UPDATE</button>\n        </div>\n      </div>\n    </div>\n </div>\n  ');heights=[],s.remove(),l.insertAdjacentHTML("beforeend",i),commentData.comments.forEach((function(e,t){e.replies.length>0&&getSpaceBetweenElements(t)}));var r=document.getElementById("update");r.focus(),r.selectionStart=a.length+1,r.selectionEnd=a.length+1};