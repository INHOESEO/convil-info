/**
 * 헤더 스크롤 효과 JavaScript
 * 스크롤에 따라 헤더를 숨기거나 보여주는 기능
 */

// 헤더 스크롤 효과 초기화 함수
function initHeaderScroll() {
    const header = document.getElementById('headerInner').parentElement; // 헤더 요소
    let lastScrollTop = 0; // 마지막 스크롤 위치
    let isHeaderVisible = true; // 헤더 표시 상태
    let scrollTimer = null; // 스크롤 타이머
    
    // 요소가 존재하는지 확인
    if (!header) {
        console.error('헤더 요소를 찾을 수 없습니다.');
        return; // 필요한 요소가 없으면 함수 종료
    }
    
    // 헤더 스타일 초기화
    header.style.transition = 'transform 0.4s ease';
    header.style.transform = 'translateY(0)';
    
    // 스크롤 이벤트 처리 함수
    function handleScroll() {
        // 현재 스크롤 위치 가져오기
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 스크롤 방향 확인
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 아래로 스크롤 중이고, 상단에서 100px 이상 내려왔을 때 헤더 숨기기
            if (isHeaderVisible) {
                header.style.transform = 'translateY(-100%)';
                isHeaderVisible = false;
            }
        } else {
            // 위로 스크롤 중일 때 헤더 표시
            if (!isHeaderVisible) {
                header.style.transform = 'translateY(0)';
                isHeaderVisible = true;
            }
        }
        
        // 현재 스크롤 위치 저장
        lastScrollTop = scrollTop;
    }
    
    // 스크롤 이벤트에 디바운싱 적용
    window.addEventListener('scroll', function() {
        // 기존 타이머 취소
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        // 새 타이머 설정 (10ms 후에 실행)
        scrollTimer = setTimeout(handleScroll, 10);
    });
    
    // 윈도우 크기 변경 시에도 상태 유지
    window.addEventListener('resize', function() {
        // 헤더가 숨겨진 상태였다면 계속 숨겨진 상태 유지
        if (!isHeaderVisible) {
            header.style.transform = 'translateY(-100%)';
        }
    });
    
    // 페이지 가시성 변경 시 처리
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !isHeaderVisible) {
            // 페이지가 다시 보일 때 마지막 스크롤 위치 업데이트
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        }
    });
}

// 문서가 완전히 로드된 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('헤더 스크롤 효과 초기화 중...');
    
    // 약간의 지연 후 초기화 (다른 스크립트와의 충돌 방지)
    setTimeout(initHeaderScroll, 300);
});

// 레이아웃 로드 이벤트가 있다면 그것도 처리
document.addEventListener('layoutLoaded', function() {
    console.log('레이아웃 로드 후 헤더 스크롤 효과 초기화 중...');
    
    // 기존 초기화가 실패했거나 덮어쓰기 위해 다시 초기화
    setTimeout(initHeaderScroll, 500);
});