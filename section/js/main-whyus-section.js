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

// 개선된 수직 무한 루프 애니메이션 함수
function initVerticalLoop() {
    console.log('Initializing vertical loop animation');
    
    const loopContainer = document.querySelector('.whyus-vertical-loop');
    const rightSection = document.querySelector('.whyus-section-right');
    
    if (!loopContainer || !rightSection) {
        console.error('Vertical loop container or right section not found');
        return;
    }
    
    // 컨테이너 스타일 설정
    loopContainer.style.position = 'relative';
    
    // 원본 요소 배열
    const originalItems = Array.from(loopContainer.querySelectorAll('.whyus-loop-element'));
    const totalItems = originalItems.length;
    
    // 두 세트의 아이템을 만들어 부드러운 전환 보장
    // 첫 번째 세트를 복제해서 두 번째 세트로 추가
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        loopContainer.appendChild(clone);
    });
    
    // 세 번째 세트의 처음 몇 개 아이템도 추가 (더 부드러운 전환을 위해)
    // 첫 번째와 두 번째 아이템을 추가로 복제
    for (let i = 0; i < 2; i++) {
        const clone = originalItems[i].cloneNode(true);
        loopContainer.appendChild(clone);
    }
    
    // 각 아이템의 높이를 계산 (첫 세트만)
    let totalHeight = 0;
    originalItems.forEach(item => {
        totalHeight += item.offsetHeight;
    });
    
    console.log(`Found ${totalItems} loop items with total height ${totalHeight}px`);
    
    // 애니메이션 속도 (밀리초) - 높이에 비례하여 설정
    const animationDuration = totalHeight * 30; // 픽셀당 30ms (속도 조절 가능)
    
    let isRunning = true;
    let currentPosition = 0;
    let animationId = null;
    
    // 부드러운 애니메이션을 위해 requestAnimationFrame 사용
    function startAnimation() {
        let lastTime = null;
        const pixelsPerSecond = totalHeight / (animationDuration / 1000); // 초당 몇 픽셀 이동할지
        
        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;
            lastTime = timestamp;
            
            if (isRunning) {
                // 시간에 따른 이동 거리 계산
                const moveAmount = (pixelsPerSecond * elapsed) / 1000;
                currentPosition += moveAmount;
                
                // 첫 번째 세트의 높이를 넘어가면 위치 재설정
                if (currentPosition >= totalHeight) {
                    // 정확히 한 세트의 높이만큼 위치 조정 (나머지만 유지)
                    currentPosition = currentPosition % totalHeight;
                }
                
                // 실제 위치 적용
                loopContainer.style.transform = `translateY(-${currentPosition}px)`;
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 애니메이션 시작
    startAnimation();
    
    // 사용자가 hover하면 애니메이션 일시 정지
    loopContainer.addEventListener('mouseenter', () => {
        isRunning = false;
    });
    
    loopContainer.addEventListener('mouseleave', () => {
        isRunning = true;
    });
    
    // 페이지 가시성 변경 시 애니메이션 최적화
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 페이지가 보이지 않을 때 애니메이션 중지
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!animationId) {
            // 페이지가 다시 보일 때 애니메이션 재시작
            startAnimation();
        }
    });
    
    console.log('Smooth vertical loop animation started');
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
    
    // 무한 수직 루프 초기화
    const checkLoopInterval = setInterval(() => {
        const loopContainer = document.querySelector('.whyus-vertical-loop');
        
        if (loopContainer && loopContainer.children.length > 0) {
            clearInterval(checkLoopInterval);
            console.log('Loop container found, initializing');
            
            // DOM이 완전히 렌더링 된 후 약간의 지연을 두고 초기화
            setTimeout(() => {
                initVerticalLoop();
            }, 500);
        }
    }, 100);
    
    // 10초 후에도 요소를 찾지 못하면 인터벌 제거
    setTimeout(() => {
        clearInterval(checkLoopInterval);
        console.log('Timed out waiting for loop container');
    }, 10000);
});