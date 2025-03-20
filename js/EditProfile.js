document.addEventListener("DOMContentLoaded", async function () {
    const Token = localStorage.getItem("Token"); // 사용자 인증 토큰
    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const profilePreview = document.getElementById("profile"); // div (배경 이미지)
    const profileUpload = document.getElementById("profile-upload"); // input[type=file]
    const nicknameInput = document.getElementById("nickname");
    const editBtn = document.getElementById("edit-btn");
    const toastMessage = document.getElementById("toast-message");
    const withdrawModal = document.getElementById("withdraw-modal");
    const withdrawBtn = document.getElementById("withdraw-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const confirmBtn = document.getElementById("confirm-btn");

    let selectedImageFile = null; // 선택된 이미지 파일

    //유저 정보 불러오기
    async function fetchUserProfile() {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "GET",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("유저 정보 조회 실패");

            const userData = await response.json();
            console.log("유저 정보 조회 성공:", userData);

            // 이메일 업데이트
            document.querySelector(".email").textContent = userData.email;

            // 닉네임 업데이트
            nicknameInput.value = userData.nickname || "";

            // 프로필 이미지 업데이트 (div의 backgroundImage 변경)
            const profileImageUrl = userData.profileImageUrl || "../images/profile_img.webp";
            profileIcon.src = profileImageUrl;
            profilePreview.style.backgroundImage = `url('${profileImageUrl}')`;
            profilePreview.style.backgroundSize = "cover";
            profilePreview.style.backgroundPosition = "center";
        } catch (error) {
            console.error("유저 정보 조회 오류:", error);
            profileIcon.src = "../images/profile_img.webp";
            profilePreview.style.backgroundImage = "url('../images/profile_img.webp')";
            profilePreview.style.backgroundSize = "cover";
            profilePreview.style.backgroundPosition = "center";
        }
    }

    //파일 업로드 창 열기
    profilePreview.addEventListener("click", function () {
        profileUpload.click(); // 파일 선택 창 열기
    });

    //미리보기 적용
    profileUpload.addEventListener("change", function (event) {
        selectedImageFile = event.target.files[0];
        if (selectedImageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePreview.style.backgroundImage = `url('${e.target.result}')`;
                profilePreview.style.backgroundSize = "cover";
                profilePreview.style.backgroundPosition = "center";
            };
            reader.readAsDataURL(selectedImageFile);
        }
    });

    //닉네임 입력 시 버튼 활성화
    nicknameInput.addEventListener("input", function() {
        let nickname = nicknameInput.value.trim();
            editBtn.disabled = true;
        if (nickname === "중복된닉네임" || nickname === "" || nickname.length > 10) {
            editBtn.disabled = true;
        } else {
            editBtn.disabled = false;
        }
    });

    //회원정보 수정 api
    editBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        let nickname = nicknameInput.value.trim();
        if (nickname === "" || nickname.length > 10) {
            alert("*닉네임은 1~10자 내로 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("nickname", nickname);
        if (selectedImageFile) {
            formData.append("profileImage", selectedImageFile); // 선택한 이미지 추가
        }

        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${Token}` },
                body: formData, // FormData
            });

            if (!response.ok) throw new Error("회원정보 수정 실패");

            const updatedUser = await response.json();
            console.log("회원정보 수정 성공:", updatedUser);

            // UI 업데이트
            profileIcon.src = updatedUser.profileImageUrl;
            profilePreview.style.backgroundImage = `url('${updatedUser.profileImageUrl}')`;
            profilePreview.style.backgroundSize = "cover";
            profilePreview.style.backgroundPosition = "center";
            nicknameInput.value = updatedUser.nickname;

            toastMessage.classList.add("show");
            setTimeout(() => toastMessage.classList.remove("show"), 3000);

        } catch (error) {
            console.error("회원정보 수정 오류:", error);
        }
    });

    withdrawModal.style.display = "none";

    withdrawBtn.addEventListener("click", function () {
        withdrawModal.style.display = "flex";
    });

    cancelBtn.addEventListener("click", function () {
        withdrawModal.style.display = "none";
    });

    //회원 탈퇴 api
    confirmBtn.addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3000/users", {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("회원 탈퇴 실패");

            console.log("회원 탈퇴 성공. 로그인 페이지로 이동");
            withdrawModal.style.display = "none";
            localStorage.removeItem("Token");
            window.location.href = "../html/Login.html";

        } catch (error) {
            console.error("회원 탈퇴 오류:", error);
        }
    });

    //프로필 아이콘 클릭 시 드롭다운 메뉴 토글
    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    await fetchUserProfile();
});
