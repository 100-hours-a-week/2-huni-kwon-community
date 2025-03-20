document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const loginButton = document.getElementById("login-btn");
    const signinButton = document.getElementById("register-btn");

    // 정규식 패턴 정의
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    // 입력 시 실시간 유효성 검사
    function validateInputs() {
        const isEmailValid = emailPattern.test(emailInput.value);
        const isPasswordValid = passwordPattern.test(passwordInput.value);
        let isValid = true;

        // 이메일 유효성 검사
        if (!isEmailValid) {
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }

        // 비밀번호 유효성 검사
        if (!isPasswordValid) {
            passwordError.style.display = "block";
            isValid = false;
        } else {
            passwordError.style.display = "none";
        }

        // 버튼 활성화/비활성화
        if (isValid) {
            loginButton.style.backgroundColor = "#7F6AEE"; // 활성화 시 색 변경
            loginButton.disabled = false;
        } else {
            loginButton.style.backgroundColor = "#ACA0EB"; // 기본 색상
            loginButton.disabled = true;
        }
    }

    // 입력 필드 이벤트 리스너 추가
    emailInput.addEventListener("input", validateInputs);
    passwordInput.addEventListener("input", validateInputs);

    // 로그인 버튼 클릭 이벤트 (API 요청)
    loginButton.addEventListener("click", async function(event) {
        event.preventDefault(); // 기본 제출 방지

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            // 실제 API 요청
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("API 요청 실패");
            }

            const data = await response.json();
            console.log("로그인 성공:", data);

            // userId가 존재하면 로그인 성공 처리
            if (data.userId) {
                window.location.href = `../html/Posts.html?userId=${data.userId}`;
            } else {
                throw new Error("로그인 실패");
            }
        } catch (error) {
            console.log("API 요청 실패");

            // 로컬 인증 (테스트 계정)
            if (email === "test11@email.com" && password === "Pass1111!") {
                window.location.href = "../html/Posts.html?userId=1";
            } else {
                emailError.textContent = "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.";
                emailError.style.display = "block";
            }
        }
    });

    signinButton.addEventListener("click", function () {
        window.location.href = "../html/Signin.html";
    });

    // 초기 버튼 비활성화
    loginButton.style.backgroundColor = "#ACA0EB";
    loginButton.disabled = true;
});
