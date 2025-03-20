document.addEventListener("DOMContentLoaded", async () => {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const imageUploadInput = document.getElementById("image-upload");
    const submitButton = document.getElementById("submit-btn");
    const backButton = document.getElementById("back-btn");

    const Token = localStorage.getItem("Token"); // 저장된 토큰

    // 뒤로 가기 버튼
    backButton.addEventListener("click", function () {
        window.history.back();
    });

    // 입력 값 변경 시 버튼 상태 업데이트
    function updateButtonState() {
        if (titleInput.value.trim() !== "" && contentInput.value.trim() !== "") {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#7F6AEE";
            submitButton.style.cursor = "pointer";
        } else {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#ACA0EB";
            submitButton.style.cursor = "auto";
        }
    }

    // 입력 필드 이벤트 리스너 추가
    titleInput.addEventListener("input", updateButtonState);
    contentInput.addEventListener("input", updateButtonState);

    // 폼 제출 이벤트 처리
    document.getElementById("post-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const imageFile = imageUploadInput.files[0];

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Token}` // 토큰 포함
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("게시글 작성 실패");
            }

            const data = await response.json();
            console.log("게시글 작성 성공", data);
            window.location.href = "../html/Posts.html"; // 게시글 목록 페이지로 이동
        } catch (error) {
            console.error("오류 발생:", error);
            alert("게시글 작성에 실패했습니다.");
        }
    });

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
});
