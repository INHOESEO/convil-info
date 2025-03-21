// 폴백 메커니즘이 있는 더 견고한 애니메이션 코드
(function() {
    // 애니메이션 초기화 함수
    function initAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // 관찰할 요소들 선택
        const elements = document.querySelectorAll(`
            #counselFormSectionInner .section-header h2, 
            #counselFormSectionInner .section-header p,
            #counselFormSectionInner .counsel-form > ul > li > h3
        `);
        
        if (elements.length > 0) {
            elements.forEach(element => {
                observer.observe(element);
            });
            return true; // 성공적으로 초기화됨
        } else {
            return false; // 초기화 실패
        }
    }

    // 여러 이벤트에 대응하여 초기화 시도
    let initialized = false;
    
    // DOMContentLoaded 이벤트 (HTML 파싱 완료 시)
    document.addEventListener('DOMContentLoaded', function() {
        initialized = initAnimation();
    });
    
    // window.onload 이벤트 (모든 리소스 로드 완료 시)
    window.onload = function() {
        if (!initialized) {
            initialized = initAnimation();
        }
    };
    
    // 백업 타이머: 여전히 초기화되지 않았다면 주기적으로 시도
    let attempts = 0;
    const maxAttempts = 5;
    const checkInterval = setInterval(function() {
        if (initialized || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            return;
        }
        
        attempts++;
        initialized = initAnimation();
    }, 500); // 500ms마다 시도
})();