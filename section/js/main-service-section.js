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
    
    // 첫 번째 항목 활성화 (필요한 경우)
    if (activateFirst && listItems[0] && infoItems[0]) {
        // 첫 활성화에는 즉시 보여주기
        listItems[0].classList.add('active');
        infoItems[0].style.display = 'flex';
        infoItems[0].style.opacity = '1';
        currentIndex = 0;
    }
    
    // 각 리스트 아이템에 클릭 이벤트 추가
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            if (index !== currentIndex) {
                activateItem(index);
            }
        });
    });
    
    // 이전 버튼 이벤트 처리
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = listItems.length - 1; // 마지막 항목으로 순환
            }
            activateItem(prevIndex);
        });
    }
    
    // 다음 버튼 이벤트 처리
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= listItems.length) {
                nextIndex = 0; // 첫 번째 항목으로 순환
            }
            activateItem(nextIndex);
        });
    }
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

// 레이아웃 로드 시 초기화에 추가
document.addEventListener('layoutLoaded', function() {
    console.log('Layout loaded, initializing all features');
    
    setTimeout(() => {
        initServiceToggle();
        initTextScroller(); // 텍스트 스크롤러 초기화 추가
    }, 500);
});