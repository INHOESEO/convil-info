// 관리자 로그인 스크립트

// 상수 정의
const SESSION_KEY = 'adminSessionData';
const SESSION_DURATION = 60 * 60 * 1000; // 1시간 (밀리초 단위)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Codling@Convil';
const REDIRECT_URL = '../admin/index.html';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 이미 로그인되어 있는지 체크
    checkSession();
    
    // 로그인 폼 이벤트 리스너 설정
    setupLoginForm();
});

// 로그인 폼 이벤트 리스너 설정
function setupLoginForm() {
    const loginForm = document.querySelector('.admin-login-form');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const idInput = document.getElementById('adminIdInput');
    const pwInput = document.getElementById('adminPwInput');
    
    // 로그인 버튼 클릭 이벤트
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        attemptLogin();
    });
    
    // 비밀번호 입력 필드에서 엔터키 처리
    pwInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptLogin();
        }
    });
    
    // ID 입력 필드에서 엔터키 처리
    idInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // ID 입력 후 엔터키를 누르면 비밀번호 필드로 포커스 이동
            pwInput.focus();
        }
    });
}

// 로그인 시도
function attemptLogin() {
    const idInput = document.getElementById('adminIdInput');
    const pwInput = document.getElementById('adminPwInput');
    
    const username = idInput.value.trim();
    const password = pwInput.value.trim();
    
    // 입력값 검증
    if (!username || !password) {
        showError('아이디와 비밀번호를 모두 입력해주세요.');
        return;
    }
    
    // 아이디와 비밀번호 확인
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // 로그인 성공 - 세션 생성
        createSession();
        
        // 관리자 페이지로 리다이렉트
        window.location.href = REDIRECT_URL;
    } else {
        // 로그인 실패
        showError('아이디 또는 비밀번호가 올바르지 않습니다.');
        
        // 비밀번호 필드 초기화 및 포커스
        pwInput.value = '';
        pwInput.focus();
    }
}

// 세션 생성
function createSession() {
    const now = new Date();
    const sessionData = {
        username: ADMIN_USERNAME,
        loginTime: now.getTime(),
        expiryTime: now.getTime() + SESSION_DURATION
    };
    
    // 세션 데이터를 로컬 스토리지에 저장
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

// 세션 체크
function checkSession() {
    // 세션 데이터 가져오기
    const sessionDataJson = localStorage.getItem(SESSION_KEY);
    
    if (sessionDataJson) {
        try {
            const sessionData = JSON.parse(sessionDataJson);
            const now = new Date().getTime();
            
            // 세션이 유효한지 확인
            if (sessionData.expiryTime > now) {
                // 세션 유효 - 관리자 페이지로 리다이렉트
                window.location.href = REDIRECT_URL;
            } else {
                // 세션 만료 - 세션 데이터 삭제
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (e) {
            // JSON 파싱 오류
            localStorage.removeItem(SESSION_KEY);
            console.error('세션 데이터 파싱 오류:', e);
        }
    }
}

// 로그인 페이지에서 에러 메시지 표시
function showError(message) {
    // 이미 에러 메시지가 있으면 제거
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 새 에러 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.textAlign = 'center';
    
    // 로그인 폼에 에러 메시지 삽입
    const loginForm = document.querySelector('.admin-login-form');
    loginForm.appendChild(errorDiv);
    
    // 3초 후 에러 메시지 제거
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}