document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const submitBtn = document.getElementById("submit-btn");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const toastMessage = document.getElementById("toast-message");

    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    // 프로필 아이콘 클릭 시 드롭다운 메뉴 보이기/숨기기
    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // 클릭 이벤트가 document까지 전달되지 않도록 방지
        dropdownMenu.classList.toggle("show");
    });

    // 문서의 다른 곳을 클릭하면 드롭다운 메뉴 숨기기
    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && !profileIcon.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // 비밀번호 유효성 검사 정규식
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    function validateInputs() {
        let isValid = true;
        let password = passwordInput.value.trim();
        let confirmPassword = confirmPasswordInput.value.trim();

        // 비밀번호 유효성 검사
        if (!password) {
            passwordError.textContent = "*비밀번호를 입력해주세요.";
            passwordError.style.display = "block";
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            passwordError.textContent = "*비밀번호는 8~20자이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
            passwordError.style.display = "block";
            isValid = false;
        } else {
            passwordError.textContent = "";
            passwordError.style.display = "none";
        }

        // 비밀번호 확인 검사
        if (!confirmPassword) {
            confirmPasswordError.textContent = "*비밀번호를 한 번 더 입력해주세요.";
            confirmPasswordError.style.display = "block";
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = "*비밀번호와 다릅니다.";
            confirmPasswordError.style.display = "block";
            isValid = false;
        } else {
            confirmPasswordError.textContent = "";
            confirmPasswordError.style.display = "none";
        }

        // 모든 검사가 통과되면 버튼 활성화
        submitBtn.disabled = !isValid;
        submitBtn.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    }

    // 입력 필드 이벤트 리스너 추가
    passwordInput.addEventListener("input", validateInputs);
    confirmPasswordInput.addEventListener("input", validateInputs);

    // 폼 제출 이벤트 리스너 추가
    document.getElementById("password-form").addEventListener("submit", function (event) {
        event.preventDefault();

        if (submitBtn.disabled) return;

        const password = passwordInput.value.trim();

        // API 요청
        fetch("/users/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer xxx",
            },
            body: JSON.stringify({
                password: password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("비밀번호 변경 실패");
            }
            return response.json();
        })
        .then(data => {
            console.log("비밀번호 변경 성공:", data);

            // 토스트 메시지 표시
            toastMessage.classList.add("show");

            setTimeout(() => {
                toastMessage.classList.remove("show");
            }, 3000);

            // 입력 필드 초기화
            passwordInput.value = "";
            confirmPasswordInput.value = "";
            validateInputs();
        })
        .catch(error => {
            console.error("비밀번호 수정 중 오류 발생:", error);

            // 실패 시 토스트 메시지 표시
            toastMessage.textContent = "비밀번호 변경 실패";
            toastMessage.classList.add("show");

            setTimeout(() => {
                toastMessage.classList.remove("show");
                toastMessage.textContent = "수정 완료"; // 원래 메시지로 복구
            }, 3000);
        });
    });
});