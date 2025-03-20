document.addEventListener("DOMContentLoaded", function() {
document.getElementById("back-btn").addEventListener("click", function() {
    window.history.back();
});

document.getElementById("go-to-login").addEventListener("click", function() {
    console.log("로그인 페이지로 이동");
    window.location.href = "../html/Login.html";
});

document.getElementById("profile-preview").addEventListener("click", function() {
    document.getElementById("profile-img").click();
});

document.getElementById("profile-img").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("profile-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.innerHTML = ""; // + 아이콘 제거
        };
        reader.readAsDataURL(file);
    }
});

 // 회원가입 폼 제출 이벤트
 document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const profileImgInput = document.getElementById("profile-img");
    const profileImg = profileImgInput.files.length > 0 ? profileImgInput.files[0] : null;

    // 오류 메시지 초기화
    document.getElementById('email-help-text').textContent = '';
    document.getElementById('password-help-text').textContent = '';
    document.getElementById('confirm-password-help-text').textContent = '';
    document.getElementById('nickname-help-text').textContent = '';

    document.getElementById('email-help-text').style.display = 'none';
    document.getElementById('password-help-text').style.display = 'none';
    document.getElementById('confirm-password-help-text').style.display = 'none';
    document.getElementById('nickname-help-text').style.display = 'none';

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-help-text').textContent = '유효한 이메일을 입력해주세요.';
        document.getElementById('email-help-text').style.display = 'block';
        return;
    }

    // 비밀번호 유효성 검사: 최소 8자, 숫자, 특수문자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById('password-help-text').textContent = '비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다.';
        document.getElementById('password-help-text').style.display = 'block';
        return;
    }

    // 비밀번호 확인 검사
    if (password !== confirmPassword) {
        document.getElementById('password-help-text').textContent = '비밀번호가 일치하지 않습니다.';
        document.getElementById('confirm-password-help-text').textContent = '비밀번호 확인이 일치하지 않습니다.';
        document.getElementById('password-help-text').style.display = 'block';
        document.getElementById('confirm-password-help-text').style.display = 'block';
        return;
    }

    // 닉네임 유효성 검사
    if (nickname.length < 2 || nickname.length > 10) {
        document.getElementById('nickname-help-text').textContent = '닉네임은 2~10자 이내여야 합니다.';
        document.getElementById('nickname-help-text').style.display = 'block';
        return;
    }

    // 프로필 이미지 업로드
    let profileImageUrl = 'default_profile.png'; // 기본 이미지 URL
    if (profileImg) {
        profileImageUrl = URL.createObjectURL(profileImg);
    }

    // API 요청
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            nickname: nickname,
            profileImg: profileImageUrl
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('회원가입 실패');
        }
        return response.json();
    })
    .then(data => {
        console.log("회원가입 성공:", data);
        alert("회원가입이 완료되었습니다!");
        window.location.href = 'loginPage.html'; // 로그인 페이지로 이동
    })
    .catch(error => {
        console.error("회원가입 오류:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    });
});
});