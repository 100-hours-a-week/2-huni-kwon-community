document.addEventListener("DOMContentLoaded", async () => {
    const Token = localStorage.getItem("Token");

    // DOM 요소들
    const postTitle = document.querySelector(".title");
    const profileImg = document.querySelector(".profile-menu img");
    const author = document.querySelector(".author");
    const createdAt = document.querySelector(".post-meta p");
    const postImage = document.querySelector(".post-image img");
    const postContent = document.querySelector(".post-content");
    const likeBtn = document.getElementById("like-btn");
    const likeCount = document.getElementById("like-btn").childNodes[0];
    const visitCount = document.querySelector(".stat-cnt:nth-child(2) div");
    const commentCount = document.querySelector(".stat-cnt:nth-child(3) div");
    const commentsContainer = document.querySelector(".comment-list");
    const commentInput = document.getElementById("comment-input");
    const commentBtn = document.getElementById("comment-btn");
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");

    // URL에서 postId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");

    // 게시글 데이터 가져오기
    async function fetchPostData(postId) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("게시글 조회 실패");

            const data = await response.json();
            console.log("게시글 조회 성공:", data);

            // 게시글 정보 업데이트
            postTitle.textContent = data.title;
            author.textContent = data.username;
            createdAt.textContent = data.date;
            postImage.src = data.imageUrl || "../img/profile_img.webp"; // 기본 이미지 설정
            postContent.textContent = data.content;
            likeCount.textContent = data.likes;
            visitCount.childNodes[0].textContent = data.views;
            commentCount.childNodes[0].textContent = data.comments;

            // 사용자가 게시글 작성자인 경우 수정 및 삭제 버튼 활성화
            if (data.userId === Number(localStorage.getItem("userId"))) {
                editBtn.style.display = "inline-block";
                deleteBtn.style.display = "inline-block";
            }
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        }
    }

    // 게시글 수정 버튼 클릭 시
    editBtn.addEventListener("click", () => {
        localStorage.setItem("postId", postId);
        localStorage.setItem("postTitle", postTitle.textContent);
        localStorage.setItem("postContent", postContent.textContent);
        localStorage.setItem("postImage", postImage.src);
        window.location.href = "../html/EditPost.html";
    });

    // 게시글 삭제 버튼 클릭 시
    deleteBtn.addEventListener("click", async () => {
        if (confirm("정말 게시글을 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${Token}` },
                });

                if (!response.ok) throw new Error("게시글 삭제 실패");

                console.log("게시글 삭제 성공");
                window.location.href = "../html/Post.html";
            } catch (error) {
                console.error("게시글 삭제 오류:", error);
            }
        }
    });

    // 좋아요 버튼 클릭 시
    likeBtn.addEventListener("click", async () => {
        try {
            let response;
            if (likeBtn.classList.contains("enabled")) {
                // 이미 좋아요를 눌렀다면 DELETE 요청
                response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${Token}` },
                });

                if (!response.ok) throw new Error("좋아요 취소 실패");

                // 좋아요 버튼 상태 업데이트 (좋아요 취소)
                likeBtn.classList.remove("enabled");
                likeBtn.classList.add("disabled");
                likeCount.textContent = Math.max(0, Number(likeCount.textContent) - 1); // 0 이하로 내려가지 않게 처리
            } else {
                // 좋아요를 처음 누른 경우 POST 요청
                response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${Token}` },
                });

                if (!response.ok) throw new Error("좋아요 요청 실패");

                // 좋아요 버튼 상태 업데이트 (좋아요 추가)
                likeBtn.classList.remove("disabled");
                likeBtn.classList.add("enabled");
                likeCount.textContent = Number(likeCount.textContent) + 1;
            }
        } catch (error) {
            console.error("좋아요 오류:", error);
        }
    });

    // 댓글 조회 api
    async function fetchComments() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("댓글 조회 실패");

            const data = await response.json();
            console.log("댓글 조회 성공:", data);

            commentsContainer.innerHTML = "";
            data.forEach(comment => addCommentElement(comment));
            commentCount.childNodes[0].textContent = data.length;
        } catch (error) {
            console.error("댓글 조회 오류:", error);
        }
    }

    // 댓글 추가 메서드
    function addCommentElement(comment) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        commentDiv.innerHTML = `
            <div class="comment-header">
                <p class="comment-author"><strong>${comment.userName}</strong> · ${new Date(comment.date).toLocaleString()}</p>
            </div>
            <p class="comment-content">${comment.content}</p>
            <div class="comment-buttons">
                <button class="edit-comment-btn" data-id="${comment.commentSeq}">수정</button>
                <button class="delete-comment-btn" data-id="${comment.commentSeq}">삭제</button>
            </div>
        `;

        // 댓글 수정 버튼
        commentDiv.querySelector(".edit-comment-btn").addEventListener("click", () => {
            const newContent = prompt("댓글을 입력하세요.", comment.content);
            if (newContent) {
                editComment(comment.commentSeq, newContent);
            }
        });

        // 댓글 삭제 버튼
        commentDiv.querySelector(".delete-comment-btn").addEventListener("click", () => {
            if (confirm("댓글을 삭제하시겠습니까?")) {
                deleteComment(comment.commentSeq);
            }
        });

        commentsContainer.prepend(commentDiv);
    }

    // 댓글 입력 시 버튼 활성화
    commentInput.addEventListener("input", function () {
        commentBtn.disabled = commentInput.value.trim() === "";
        commentBtn.style.backgroundColor = commentBtn.disabled ? "#ACA0EB" : "#7F6AEE";
    });

    // 댓글 작성
    commentBtn.addEventListener("click", async () => {
        const content = commentInput.value.trim();
        if (!content) return alert("댓글을 입력해주세요.");

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error("댓글 작성 실패");

            commentInput.value = ""; // 입력창 비우기
            commentBtn.disabled = true; // 다시 비활성화
            commentBtn.style.backgroundColor = "#ACA0EB"; // 비활성화 스타일 적용

            await fetchComments(); // 댓글 새로고침
        } catch (error) {
            console.error("댓글 작성 오류:", error);
        }
    });

    // 댓글 수정
    async function editComment(commentId, newContent) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comment/${commentId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${Token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newContent }),
            });

            if (!response.ok) throw new Error("댓글 수정 실패");

            await fetchComments();
        } catch (error) {
            console.error("댓글 수정 오류:", error);
        }
    }

    // 댓글 삭제
    async function deleteComment(commentId) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comment/${commentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("댓글 삭제 실패");

            await fetchComments();
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
        }
    }

    // 유저 정보 가져오기 (프로필 이미지 변경)
    async function fetchUserProfile() {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Token}`
                }
            });

            if (!response.ok) throw new Error("유저 정보 조회 실패");

            const userData = await response.json();
            console.log("유저 정보 조회 성공:", userData);

            // 프로필 이미지 업데이트
            if (userData.profileImageUrl) {
                profileIcon.src = userData.profileImageUrl;
            } else {
                console.warn("프로필 이미지 없음, 기본 이미지 유지");
            }
        } catch (error) {
            console.error("유저 정보 조회 오류:", error);
            // API 실패 시 기본 이미지 유지
            profileIcon.src = "../images/profile_img.webp";
        }
    }

    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // 페이지 로드 시 유저 프로필 정보 가져오기
    await fetchUserProfile();

    // 초기 데이터 로드
    await fetchPostData(postId);
    await fetchComments();
});
