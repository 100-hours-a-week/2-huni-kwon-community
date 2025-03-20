// document.addEventListener("DOMContentLoaded", function () {

//     const profileIcon = document.getElementById("profile-icon");
//     const dropdownMenu = document.getElementById("dropdown-menu");

//     // 프로필 아이콘 클릭 시 드롭다운 메뉴 보이기/숨기기
//     profileIcon.addEventListener("click", function (event) {
//         event.stopPropagation(); // 클릭 이벤트가 document까지 전달되지 않도록 방지
//         dropdownMenu.classList.toggle("show");
//     });

//     // 문서의 다른 곳을 클릭하면 드롭다운 메뉴 숨기기
//     document.addEventListener("click", function (event) {
//         if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
//             dropdownMenu.classList.remove("show");
//         }
//     });
//     document.getElementById("create-post-btn").addEventListener("click", function() {
//         console.log("게시글 작성 페이지로 이동");
//         window.location.href = "../html/MakePost.html";
//     });

//     const postList = document.getElementById("post-list");

//     // 더미 데이터 생성
//     const posts = [
//         { title: "게시글 제목입니다. 너무 길면 잘립니다!", author: "테스트 작성자", likes: 1200, comments: 15, views: 23000, date: "2021-01-01 00:00:00" },
//         { title: "짧은 제목", author: "작성자2", likes: 50, comments: 2, views: 800, date: "2021-01-02 12:30:00" },
//         { title: "또 다른 게시글입니다", author: "작성자3", likes: 11000, comments: 120, views: 102000, date: "2021-01-03 18:45:00" }
//     ];

//     // 숫자 단위 변환 (1k, 10k, 100k)
//     function formatNumber(num) {
//         if (num >= 100000) return Math.floor(num / 1000) + "k";
//         if (num >= 10000) return Math.floor(num / 1000) + "k";
//         if (num >= 1000) return Math.floor(num / 1000) + "k";
//         return num;
//     }

//     // 게시글 동적 생성
//     posts.forEach(post => {
//         const postCard = document.createElement("div");
//         postCard.classList.add("post-card");
//         postCard.innerHTML = `
//             <h3>${post.title.length > 26 ? post.title.substring(0, 26) + "..." : post.title}</h3>
//             <p class="meta">
//                 좋아요 ${formatNumber(post.likes)} · 댓글 ${formatNumber(post.comments)} · 조회수 ${formatNumber(post.views)}
//             </p>
//             <p class="meta">${post.date}</p>
//             <p class="meta">${post.author}</p>
//         `;

//         postCard.addEventListener("click", function() {
//             console.log("게시글 상세 조회 페이지로 이동");
//         });

//         postList.appendChild(postCard);
//     });
// });

document.addEventListener("DOMContentLoaded", async function () {
    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const createPostBtn = document.getElementById("create-post-btn");
    const postList = document.getElementById("post-list");

    const Token = localStorage.getItem("Token");

    // 프로필 아이콘 클릭 시 드롭다운 메뉴 토글
    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    // 문서의 다른 곳을 클릭하면 드롭다운 메뉴 숨기기
    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // 게시글 작성 페이지로 이동
    createPostBtn.addEventListener("click", function () {
        window.location.href = "../html/MakePost.html";
    });

    // 숫자 단위 변환 (1k, 10k, 100k)
    function formatNumber(num) {
        if (num >= 1000) return Math.floor(num / 1000) + "k";
        return num;
    }

    // 기본 더미 데이터
    const defaultPosts = [
        { postId: 1, title: "임시 글 1", author: "익명 사용자", likes: 1200, comments: 15, views: 22220, date: "2025-03-10 12:00:00", profileImageUrl: "../images/profile.img.webp" },
        { postId: 2, title: "임시 글 2", author: "익명 사용자", likes: 7700, comments: 14, views: 11440, date: "2025-03-10 12:00:00", profileImageUrl: "../images/profile.img.webp" },
        { postId: 3, title: "임시 글 3", author: "익명 사용자", likes: 5300, comments: 11, views: 8000, date: "2025-03-10 12:00:00", profileImageUrl: "../images/profile.img.webp" },
        { postId: 4, title: "임시 글 4", author: "익명 사용자", likes: 400, comments: 22, views: 2000, date: "2025-03-10 12:00:00", profileImageUrl: "../images/profile.img.webp" }
    ];

    // 게시글 요소 생성 함수
    function createPostElement(post) {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");
        postCard.setAttribute("data-post-id", post.postId);

        postCard.innerHTML = `
            <h3>${post.title.length > 26 ? post.title.substring(0, 26) + "..." : post.title}</h3>
            <p class="meta">
                좋아요 ${formatNumber(post.likes)} · 댓글 ${formatNumber(post.comments)} · 조회수 ${formatNumber(post.views)}
            </p>
            <p class="meta">${post.date}</p>
            <p class="meta">${post.author}</p>
        `;

        // 게시글 클릭 시 상세 페이지로 이동
        postCard.addEventListener("click", function () {
            window.location.href = `../html/Post.html?postId=${post.postId}`;
        });

        postList.appendChild(postCard);
    }

    // API에서 게시글 가져오기
    async function fetchPosts() {
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: "GET",
                headers: Token ? { "Authorization": `Bearer ${Token}` } : {}
            });

            if (!response.ok) throw new Error("API 요청 실패");

            const data = await response.json();
            console.log("게시글 조회 성공:", data);

            if (data.posts.length > 0) {
                data.posts.map(post => createPostElement(post)); // API 응답 데이터로 게시글 추가
            }
        } catch (error) {
            console.error("게시글 조회 실패, 기본 데이터 로드");
            defaultPosts.map(post => createPostElement(post)); // 기본 더미 데이터 로드
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

    // 페이지 로드 시 유저 프로필 정보 가져오기
    await fetchUserProfile();

    // 게시글 불러오기 실행
    await fetchPosts();
});
