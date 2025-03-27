// 서비스 유형 전환 기능
function initServiceToggle() {
    const toggleInput = document.getElementById('service-toggle');
    const interiorContent = document.querySelector('.interior-service-content');
    const brandingContent = document.querySelector('.branding-service-content');
    
    // 요소가 존재하는지 확인
    if (!toggleInput || !interiorContent || !brandingContent) {
        console.error('서비스 토글에 필요한 요소를 찾을 수 없습니다.');
        return; // 필요한 요소가 없으면 함수 종료
    }
    
    // 초기 상태 설정 (인테리어 활성화)
    interiorContent.style.display = 'flex';
    interiorContent.style.opacity = '1';
    brandingContent.style.display = 'none';
    brandingContent.style.opacity = '0';
    
    // 전환 애니메이션 적용
    interiorContent.style.transition = 'opacity 0.5s ease';
    brandingContent.style.transition = 'opacity 0.5s ease';
    
    // 전환 이벤트 처리
    toggleInput.addEventListener('change', function() {
        if (this.checked) {
            // 브랜딩으로 전환 (페이드 효과 적용)
            interiorContent.style.opacity = '0';
            setTimeout(() => {
                interiorContent.style.display = 'none';
                brandingContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void brandingContent.offsetWidth;
                
                brandingContent.style.opacity = '1';
                
                // 브랜딩 첫 번째 항목 활성화
                initServiceListItems('.branding-service-list', '.branding-service-info');
            }, 300); // 페이드 아웃 시간의 절반 후 전환
        } else {
            // 인테리어로 전환 (페이드 효과 적용)
            brandingContent.style.opacity = '0';
            setTimeout(() => {
                brandingContent.style.display = 'none';
                interiorContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void interiorContent.offsetWidth;
                
                interiorContent.style.opacity = '1';
                
                // 인테리어 첫 번째 항목 활성화
                initServiceListItems('.interior-service-list', '.interior-service-info');
            }, 300); // 페이드 아웃 시간의 절반 후 전환
        }
    });
    
    // 인테리어 서비스 초기화 (기본값)
    initServiceListItems('.interior-service-list', '.interior-service-info');
    
    // 브랜딩 서비스 초기화 (토글로 전환될 때를 대비)
    initServiceListItems('.branding-service-list', '.branding-service-info', false);
}

// 서비스 리스트 아이템 초기화 및 이벤트 설정
function initServiceListItems(listSelector, infoSelector, activateFirst = true) {
    const listItems = document.querySelectorAll(`${listSelector} > ul > li`);
    const infoItems = document.querySelectorAll(`${infoSelector} > ul > li`);
    const prevButton = document.querySelector(`${listSelector} .service-list-prev`);
    const nextButton = document.querySelector(`${infoSelector} .service-list-next`);
    
    // 현재 활성화된 인덱스 추적
    let currentIndex = activateFirst ? 0 : -1;
    
    // 자동 슬라이드를 위한 인터벌 ID
    let autoSlideInterval = null;
    
    // 요소가 존재하는지 확인
    if (!listItems.length || !infoItems.length) {
        console.error(`서비스 리스트 또는 정보 요소를 찾을 수 없습니다: ${listSelector}, ${infoSelector}`);
        return;
    }
    
    // 각 info 항목에 트랜지션 추가
    infoItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease';
        item.style.opacity = '0';
        item.style.display = 'none';
    });
    
    // 모든 활성 클래스 및 표시 상태 초기화
    listItems.forEach(item => item.classList.remove('active'));
    
    // 특정 인덱스 항목을 활성화하는 함수
    function activateItem(index) {
        // 범위 검사
        if (index < 0 || index >= listItems.length) return;
        
        // 현재 활성화된 항목 페이드 아웃
        if (currentIndex >= 0 && currentIndex < infoItems.length) {
            const currentItem = infoItems[currentIndex];
            currentItem.style.opacity = '0';
            
            setTimeout(() => {
                currentItem.style.display = 'none';
                
                // 새 항목으로 전환
                showNewItem(index);
            }, 200);
        } else {
            // 첫 활성화 시에는 즉시 보여주기
            showNewItem(index);
        }
        
        // 새 항목 보여주기 함수
        function showNewItem(idx) {
            // 모든 리스트 항목 비활성화
            listItems.forEach(li => li.classList.remove('active'));
            
            // 선택한 리스트 항목 활성화
            listItems[idx].classList.add('active');
            
            // 선택한 info 항목 표시 및 페이드 인
            const newItem = infoItems[idx];
            newItem.style.display = 'flex';
            
            // 강제 리플로우 트리거
            void newItem.offsetWidth;
            
            newItem.style.opacity = '1';
            
            // 현재 인덱스 업데이트
            currentIndex = idx;
        }
    }
    
    // 다음 항목으로 이동하는 함수
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= listItems.length) {
            nextIndex = 0; // 첫 번째 항목으로 순환
        }
        activateItem(nextIndex);
    }
    
    // 이전 항목으로 이동하는 함수
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = listItems.length - 1; // 마지막 항목으로 순환
        }
        activateItem(prevIndex);
    }
    
    // 자동 슬라이드 시작
    function startAutoSlide() {
        stopAutoSlide(); // 기존 인터벌 제거
        autoSlideInterval = setInterval(nextSlide, 3000); // 3초마다 자동 전환
    }
    
    // 자동 슬라이드 정지
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // 첫 번째 항목 활성화 (필요한 경우)
    if (activateFirst && listItems[0] && infoItems[0]) {
        // 첫 활성화에는 즉시 보여주기
        listItems[0].classList.add('active');
        infoItems[0].style.display = 'flex';
        infoItems[0].style.opacity = '1';
        currentIndex = 0;
        
        // 자동 슬라이드 시작
        startAutoSlide();
    }
    
    // 각 리스트 아이템에 클릭 이벤트 추가
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (index !== currentIndex) {
                activateItem(index);
                // 클릭 시 자동 슬라이드 재시작
                startAutoSlide();
            }
        });
        
        // 마우스 호버 시 자동 슬라이드 중지
        item.addEventListener('mouseenter', stopAutoSlide);
        item.addEventListener('mouseleave', startAutoSlide);
    });
    
    // 이전 버튼 이벤트 처리
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            // 클릭 시 자동 슬라이드 재시작
            startAutoSlide();
        });
        
        // 마우스 호버 시 자동 슬라이드 중지
        prevButton.addEventListener('mouseenter', stopAutoSlide);
        prevButton.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 다음 버튼 이벤트 처리
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            // 클릭 시 자동 슬라이드 재시작
            startAutoSlide();
        });
        
        // 마우스 호버 시 자동 슬라이드 중지
        nextButton.addEventListener('mouseenter', stopAutoSlide);
        nextButton.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 인포 항목에도 마우스 호버 이벤트 추가
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', stopAutoSlide);
        item.addEventListener('mouseleave', startAutoSlide);
    });
    
    // 페이지 가시성 변경 시 자동 슬라이드 제어
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide(); // 페이지가 보이지 않을 때 중지
        } else {
            startAutoSlide(); // 페이지가 다시 보일 때 재시작
        }
    });
}

// 브랜딩 서비스 정보 텍스트 좌우 무한 루프 기능
function initTextScroller() {
    // 브랜딩 서비스 정보의 p 태그들을 선택
    const brandingTextContainers = document.querySelectorAll('.branding-service-info > ul > li > p');
    
    if (!brandingTextContainers.length) {
        console.error('브랜딩 서비스 정보 텍스트 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    brandingTextContainers.forEach(container => {
        // 스크롤을 위한 래퍼 생성
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'text-scroll-wrapper';
        scrollWrapper.style.cssText = `
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: relative;
        `;
        
        // 스크롤 내용을 담을 컨테이너
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'text-scroll-container';
        scrollContainer.style.cssText = `
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            white-space: nowrap;
            animation: scrollText 15s linear infinite;
        `;
        
        // 원래 span들을 복제하여 스크롤 컨테이너에 추가
        const spans = container.querySelectorAll('span');
        spans.forEach(span => {
            span.style.marginRight = '50px';
            scrollContainer.appendChild(span.cloneNode(true));
        });
        
        // 연속적인 스크롤을 위해 같은 내용을 한 번 더 추가
        spans.forEach(span => {
            const clone = span.cloneNode(true);
            clone.style.marginRight = '50px';
            scrollContainer.appendChild(clone);
        });
        
        // 원래 내용 비우고 새 구조 추가
        container.innerHTML = '';
        scrollWrapper.appendChild(scrollContainer);
        container.appendChild(scrollWrapper);
        
        // 스크롤 중지/시작 기능 (hover 시)
        scrollContainer.addEventListener('mouseenter', () => {
            scrollContainer.style.animationPlayState = 'paused';
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            scrollContainer.style.animationPlayState = 'running';
        });
    });
    
    // CSS 애니메이션 추가
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes scrollText {
            0% {
                transform: translateX(0%);
            }
            100% {
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// 수직 무한 루프 애니메이션 함수
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

// 레이아웃 로드 시 초기화
document.addEventListener('layoutLoaded', function() {
    console.log('Layout loaded, initializing all features');
    
    setTimeout(() => {
        // 서비스 토글 및 텍스트 스크롤러 초기화
        initServiceToggle();
        initTextScroller();
        
        // 수직 루프 애니메이션 초기화
        initVerticalLoop();
        
        // 카운터 애니메이션 초기화
        initCounterAnimation();
    }, 500);
});