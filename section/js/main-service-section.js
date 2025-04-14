/**
 * 컨빌디자인 서비스 섹션 JavaScript
 * 인테리어/브랜딩 서비스 토글 및 슬라이드 기능
 */

// 전역 인터벌 관리 변수
let interiorSlideInterval = null;
let brandingSlideInterval = null;

// 서비스 유형 전환 기능
function initServiceToggle() {
    const toggleInput = document.getElementById('service-toggle');
    const interiorContent = document.querySelector('.interior-service-content');
    const brandingContent = document.querySelector('.branding-service-content');
    
    // 요소가 존재하는지 확인
    if (!toggleInput || !interiorContent || !brandingContent) {
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
            
            // 모든 인테리어 항목 비활성화
            document.querySelectorAll('.interior-service-list ul > li').forEach(item => {
                item.classList.remove('active');
            });
            
            // 이전 슬라이드 중지
            if (interiorSlideInterval) {
                clearInterval(interiorSlideInterval);
                interiorSlideInterval = null;
            }
            
            setTimeout(() => {
                interiorContent.style.display = 'none';
                brandingContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void brandingContent.offsetWidth;
                
                brandingContent.style.opacity = '1';
                
                // 브랜딩 첫 번째 항목 활성화
                initServiceListItems('.branding-service-list', '.branding-service-info', true);
            }, 300);
        } else {
            // 인테리어로 전환 (페이드 효과 적용)
            brandingContent.style.opacity = '0';
            
            // 모든 브랜딩 항목 비활성화
            document.querySelectorAll('.branding-service-list ul > li').forEach(item => {
                item.classList.remove('active');
            });
            
            // 이전 슬라이드 중지
            if (brandingSlideInterval) {
                clearInterval(brandingSlideInterval);
                brandingSlideInterval = null;
            }
            
            setTimeout(() => {
                brandingContent.style.display = 'none';
                interiorContent.style.display = 'flex';
                
                // 강제 리플로우 트리거
                void interiorContent.offsetWidth;
                
                interiorContent.style.opacity = '1';
                
                // 인테리어 첫 번째 항목 활성화
                initServiceListItems('.interior-service-list', '.interior-service-info', true);
            }, 300);
        }
    });
    
    // 인테리어 서비스 초기화 (기본값)
    initServiceListItems('.interior-service-list', '.interior-service-info', true);
    
    // 브랜딩 서비스 초기화 (토글로 전환될 때 자동 활성화)
}

// 서비스 리스트 아이템 초기화 및 이벤트 설정
function initServiceListItems(listSelector, infoSelector, activateFirst = true) {
    const listItems = document.querySelectorAll(`${listSelector} ul > li`);
    const infoItems = document.querySelectorAll(`${infoSelector} > ul > li`);
    const prevButton = document.querySelector(`${listSelector} .service-list-prev:not(.slp-mob)`);
    const nextButton = document.querySelector(`${infoSelector} .service-list-next`);
    
    // 모바일 버튼 추가
    const prevButtonMobile = document.querySelector(`${listSelector} .slp-mob`);
    const nextButtonMobile = document.querySelector(`${listSelector} .sln-mob`);
    
    // 현재 활성화된 인덱스 추적
    let currentIndex = activateFirst ? 0 : -1;
    
    // 요소가 존재하는지 확인
    if (!listItems.length || !infoItems.length) {
        console.error(`서비스 리스트 또는 정보 요소를 찾을 수 없습니다: ${listSelector}, ${infoSelector}`);
        return;
    }
    
    // 각 info 항목에 트랜지션 추가
    infoItems.forEach(item => {
        item.style.transition = 'opacity 1s ease';
        item.style.opacity = '0';
        item.style.display = 'none';
    });
    
    // 모든 활성 클래스 및 표시 상태 초기화
    function resetItems() {
        listItems.forEach(item => item.classList.remove('active'));
        infoItems.forEach(item => {
            item.style.opacity = '0';
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
        // 기존 인터벌 제거
        stopAutoSlide();
        
        // 새 인터벌 설정
        if (listSelector.includes('interior')) {
            interiorSlideInterval = setInterval(nextSlide, 3000);
        } else {
            brandingSlideInterval = setInterval(nextSlide, 3000);
        }
    }
    
    // 자동 슬라이드 정지
    function stopAutoSlide() {
        if (listSelector.includes('interior')) {
            if (interiorSlideInterval) {
                clearInterval(interiorSlideInterval);
                interiorSlideInterval = null;
            }
        } else {
            if (brandingSlideInterval) {
                clearInterval(brandingSlideInterval);
                brandingSlideInterval = null;
            }
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
    
    // 이벤트 리스너 제거 및 추가를 위한 함수
    function removeAllListeners(element) {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
    }
    
    // 각 리스트 아이템에 클릭 이벤트 추가
    listItems.forEach((item, index) => {
        // 기존 이벤트 리스너를 제거하기 위한 더 안전한 방법
        item.onclick = null;
        
        item.addEventListener('click', function() {
            if (index !== currentIndex) {
                activateItem(index);
                // 클릭 시 자동 슬라이드 재시작
                stopAutoSlide();
                startAutoSlide();
            }
        });
    });
    
    // 이전 버튼 이벤트 처리
    if (prevButton) {
        prevButton.onclick = null;
        prevButton.addEventListener('click', function() {
            prevSlide();
            // 클릭 시 자동 슬라이드 재시작
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // 다음 버튼 이벤트 처리
    if (nextButton) {
        nextButton.onclick = null;
        nextButton.addEventListener('click', function() {
            nextSlide();
            // 클릭 시 자동 슬라이드 재시작
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // 모바일 이전 버튼 이벤트 처리
    if (prevButtonMobile) {
        prevButtonMobile.onclick = null;
        prevButtonMobile.addEventListener('click', function() {
            prevSlide();
            // 클릭 시 자동 슬라이드 재시작
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // 모바일 다음 버튼 이벤트 처리
    if (nextButtonMobile) {
        nextButtonMobile.onclick = null;
        nextButtonMobile.addEventListener('click', function() {
            nextSlide();
            // 클릭 시 자동 슬라이드 재시작
            stopAutoSlide();
            startAutoSlide();
        });
    }
}

// 브랜딩 서비스 정보 텍스트 좌우 무한 루프 기능
function initTextScroller() {
    // 브랜딩 서비스 정보의 p 태그들을 선택
    const brandingTextContainers = document.querySelectorAll('.branding-service-info > ul > li > p');
    
    if (!brandingTextContainers.length) {
        return;
    }
    
    brandingTextContainers.forEach(container => {
        // 이미 처리된 경우 스킵
        if (container.querySelector('.text-scroll-wrapper')) {
            return;
        }
        
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
    
    // CSS 애니메이션이 이미 추가되었는지 확인
    if (!document.getElementById('text-scroller-style')) {
        // CSS 애니메이션 추가
        const styleSheet = document.createElement('style');
        styleSheet.id = 'text-scroller-style';
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
}

// 레이아웃 로드 시 초기화
document.addEventListener('layoutLoaded', function() {
    setTimeout(() => {
        // 서비스 토글 및 텍스트 스크롤러 초기화
        initServiceToggle();
        initTextScroller();
    }, 500);
});