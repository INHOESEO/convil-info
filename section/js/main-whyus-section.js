// 카운터 롤링 애니메이션 함수
function animateCounter(elementSelector, endValue, duration = 2000) {
    const element = document.querySelector(elementSelector);
    console.log('Counter element:', elementSelector, element);
    
    if (!element) {
        console.error('Element not found:', elementSelector);
        return;
    }
    
    let startValue = 0;
    let currentValue = startValue;
    const increment = Math.ceil(endValue / (duration / 16));
    
    // 초기값 설정
    element.textContent = startValue;
    
    // 애니메이션 타이머
    const timer = setInterval(() => {
        currentValue += increment;
        
        // 목표값에 도달하거나 초과하면 애니메이션 종료
        if (currentValue >= endValue) {
            clearInterval(timer);
            element.textContent = endValue + "+";
        } else {
            element.textContent = currentValue;
        }
    }, 16);
    
    return timer;
}

// 섹션이 화면에 보일 때 애니메이션 시작하는 함수
function initCounterAnimation() {
    console.log('Setting up intersection observer for counter');
    
    // 관찰할 요소 (whyus-section-left-bottom 또는 상위 컨테이너)
    const targetSection = document.querySelector('.whyus-section-left-bottom');
    
    if (!targetSection) {
        console.error('Target section for animation not found');
        return;
    }
    
    // 애니메이션이 이미 실행되었는지 추적
    let animationTriggered = false;
    
    // IntersectionObserver 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 요소가 화면에 보이고, 아직 애니메이션이 실행되지 않았을 때
            if (entry.isIntersecting && !animationTriggered) {
                console.log('Section now visible, starting animations');
                
                // 애니메이션 실행 플래그 설정
                animationTriggered = true;
                
                // 카운터 애니메이션 시작
                animateCounter('.store-client-count', 200);
                animateCounter('.house-client-count', 100);
                animateCounter('.organ-client-count', 50);
                
                // 한 번 실행 후 관찰 중단
                observer.disconnect();
            }
        });
    }, {
        // 옵션: 요소가 30% 이상 보일 때 트리거
        threshold: 0.3
    });
    
    // 요소 관찰 시작
    observer.observe(targetSection);
    console.log('Observer started');
}

// layoutLoaded 이벤트 사용 (기존 코드와 동일한 방식)
document.addEventListener('layoutLoaded', function() {
    console.log('Layout loaded - checking for counter elements');
    
    // 요소가 있는지 확인하는 인터벌 설정
    const checkInterval = setInterval(() => {
        const storeElement = document.querySelector('.store-client-count');
        const houseElement = document.querySelector('.house-client-count');
        const organElement = document.querySelector('.organ-client-count');
        
        if (storeElement && houseElement && organElement) {
            clearInterval(checkInterval);
            console.log('Counter elements found, setting up intersection observer');
            
            // 요소가 모두 존재하면 IntersectionObserver 초기화
            initCounterAnimation();
        }
    }, 100);
    
    // 10초 후에도 요소를 찾지 못하면 인터벌 제거 (무한 실행 방지)
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('Timed out waiting for counter elements');
    }, 10000);
});