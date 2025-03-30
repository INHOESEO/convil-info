/**
 * 컨빌디자인 서비스 섹션 JavaScript
 * 인테리어/브랜딩 서비스 토글 및 슬라이드 기능
 */

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
    interiorContent.style.transform = 'translateY(0)';
    brandingContent.style.display = 'none';
    brandingContent.style.opacity = '0';
    brandingContent.style.transform = 'translateY(10px)';
    
    // 전환 애니메이션 적용
    interiorContent.style.transition = 'opacity 0.5s ease-in-out, transform 0.4s ease-in-out';
    brandingContent.style.transition = 'opacity 0.5s ease-in-out, transform 0.4s ease-in-out';
    
    // 서비스 상태 초기화 함수
    function clearServiceState() {
        // 인테리어 리스트 항목 초기화
        document.querySelectorAll('.interior-service-list ul > li').forEach(item => {
            item.classList.remove('active');
        });
        
        // 브랜딩 리스트 항목 초기화
        document.querySelectorAll('.branding-service-list ul > li').forEach(item => {
            item.classList.remove('active');
        });
        
        // 인테리어 정보 항목 초기화
        document.querySelectorAll('.interior-service-info > ul > li').forEach(item => {
            item.style.opacity = '0';
            item.style.display = 'none';
        });
        
        // 브랜딩 정보 항목 초기화
        document.querySelectorAll('.branding-service-info > ul > li').forEach(item => {
            item.style.opacity = '0';
            item.style.display = 'none';
        });
    }
    
    // 전환 이벤트 처리
    toggleInput.addEventListener('change', function() {
        // 먼저 모든 상태 초기화
        clearServiceState();
        
        if (this.checked) {
            // 브랜딩으로 전환 (페이드 효과 적용)
            interiorContent.style.opacity = '0';
            interiorContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                interiorContent.style.display = 'none';
                brandingContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void brandingContent.offsetWidth;
                
                brandingContent.style.opacity = '1';
                brandingContent.style.transform = 'translateY(0)';
                
                // 브랜딩 첫 번째 항목 활성화 (기존 상태 리셋 후)
                initServiceListItems('.branding-service-list', '.branding-service-info');
            }, 400); // 페이드 아웃 시간과 일치
        } else {
            // 인테리어로 전환 (페이드 효과 적용)
            brandingContent.style.opacity = '0';
            brandingContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                brandingContent.style.display = 'none';
                interiorContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void interiorContent.offsetWidth;
                
                interiorContent.style.opacity = '1';
                interiorContent.style.transform = 'translateY(0)';
                
                // 인테리어 첫 번째 항목 활성화 (기존 상태 리셋 후)
                initServiceListItems('.interior-service-list', '.interior-service-info');
            }, 400); // 페이드 아웃 시간과 일치
        }
    });
    
    // 인테리어 서비스 초기화 (기본값)
    initServiceListItems('.interior-service-list', '.interior-service-info');
    
    // 브랜딩 서비스 초기화 (토글로 전환될 때를 대비)
    initServiceListItems('.branding-service-list', '.branding-service-info', false);
}

// 서비스 리스트 아이템 초기화 및 이벤트 설정
function initServiceListItems(listSelector, infoSelector, activateFirst = true) {
    const listItems = document.querySelectorAll(`${listSelector} ul > li`);
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
        item.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
        item.style.opacity = '0';
        item.style.display = 'none';
        item.style.transform = 'translateY(10px)';
    });
    
    // 모든 활성 클래스 및 표시 상태 초기화
    function resetItems() {
        // 모든 리스트 항목의 active 클래스 제거
        listItems.forEach(item => item.classList.remove('active'));
        
        // 모든 info 항목을 숨김 처리
        infoItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.display = 'none';
        });
    }
    
    // 특정 인덱스 항목을 활성화하는 함수
    function activateItem(index) {
        // 범위 검사
        if (index < 0 || index >= listItems.length) return;
        
        // 모든 항목 상태 초기화
        resetItems();
        
        // 선택한 리스트 항목 활성화
        listItems[index].classList.add('active');
        
        // 선택한 info 항목 표시 및 페이드 인
        const newItem = infoItems[index];
        newItem.style.display = 'flex';
        
        // 강제 리플로우 트리거
        void newItem.offsetWidth;
        
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateY(0)';
        
        // 현재 인덱스 업데이트
        currentIndex = index;
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
        resetItems(); // 먼저 모든 항목 초기화
        
        listItems[0].classList.add('active');
        infoItems[0].style.display = 'flex';
        
        // 강제 리플로우 트리거
        void infoItems[0].offsetWidth;
        
        infoItems[0].style.opacity = '1';
        infoItems[0].style.transform = 'translateY(0)';
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

// 레이아웃 로드 시 초기화
document.addEventListener('layoutLoaded', function() {
    console.log('서비스 섹션 초기화 중...');
    
    setTimeout(() => {
        // 서비스 토글 및 텍스트 스크롤러 초기화
        initServiceToggle();
        initTextScroller();
    }, 500);
});