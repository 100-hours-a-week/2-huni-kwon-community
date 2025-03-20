document.addEventListener("DOMContentLoaded", async function () {
    const Token = localStorage.getItem("Token");
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId"); // URL에서 postId 가져오기

    const titleInput = document.querySelector(".form-control[type='text']");
    const contentTextarea = document.querySelector(".form-control[type='textarea']");
    const submitButton = document.querySelector(".submit-button");
    const backButton = document.querySelector(".back-button");
    const fileSelectButton = document.querySelector(".image-button:first-child");
    const fileOpenButton = document.querySelector(".image-button:last-child");
    
    let selectedImageFile = null; // 선택한 파일 저장
    let baseImageFile = null;

    //게시글 정보 조회
    async function fetchPostData() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${Token}` },
            });

            if (!response.ok) throw new Error("게시글 조회 실패");

            const postData = await response.json();
            console.log("게시글 조회 성공:", postData);

            // 제목, 내용 업데이트
            titleInput.value = postData.title;
            contentTextarea.value = postData.content;

            // 기존 이미지 저장
            baseImageFile = postData.contentImg;
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        }
    }

    titleInput.addEventListener("input", function () {
        if (this.value.length > 26) {
            this.value = this.value.substring(0, 26);
            alert("제목은 최대 26자까지 작성 가능합니다.");
        }
    });

    //파일 선택
    fileSelectButton.addEventListener("click", function () {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        
        fileInput.addEventListener("change", function (e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];

                // 이미지 파일인지 검증
                if (!file.type.startsWith("image/")) {
                    alert("이미지 파일만 업로드 가능합니다.");
                    return;
                }

                selectedImageFile = file;
                fileSelectButton.textContent = file.name;
                console.log("선택된 파일:", file.name);
            }
        });

        fileInput.click();
    });

    //기존 파일 열기
    fileOpenButton.addEventListener("click", function () {
        selectedImageFile = baseImageFile;
    });

    //게시글 수정 put api
    submitButton.addEventListener("click", async function () {
        if (!validateInputs()) return;

        const formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("content", contentTextarea.value);
        if (selectedImageFile) {
            formData.append("image", selectedImageFile); // 이미지 포함
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${Token}` },
                body: formData, // FormData 사용 (multipart/form-data)
            });

            if (!response.ok) throw new Error("게시글 수정 실패");

            console.log("게시글 수정 성공");
            alert("게시글이 성공적으로 수정되었습니다.");

            // 수정 완료 후 상세 페이지로 이동
            window.location.href = `../html/Post.html?postId=${postId}`;
        } catch (error) {
            console.error("게시글 수정 오류:", error);
        }
    });

    //입력값 유효 검증
    function validateInputs() {
        if (!titleInput.value.trim()) {
            alert("제목을 입력해주세요.");
            titleInput.focus();
            return false;
        }
        if (titleInput.value.length > 26) {
            alert("제목은 최대 26자까지 작성 가능합니다.");
            titleInput.focus();
            return false;
        }
        if (!contentTextarea.value.trim()) {
            alert("내용을 입력해주세요.");
            contentTextarea.focus();
            return false;
        }
        return true;
    }

    //뒤로가기 버튼
    backButton.addEventListener("click", function () {
        if (hasChanges()) {
            if (confirm("변경사항이 있습니다. 저장하지 않고 나가시겠습니까?")) {
                goBack();
            }
        } else {
            goBack();
        }
    });

    //변경사항 확인 메서드
    function hasChanges() {
        return (
            titleInput.value.trim() !== "" ||
            contentTextarea.value.trim() !== "" ||
            selectedImageFile !== null
        );
    }

    //뒤로가기 메서드
    function goBack() {
        console.log("이전 페이지로 이동");
        window.history.back();
    }

    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

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

    await fetchPostData();
});
