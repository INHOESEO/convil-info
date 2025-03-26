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
    brandingContent.style.display = 'none';
    
    // 전환 이벤트 처리
    toggleInput.addEventListener('change', function() {
        if (this.checked) {
            // 브랜딩으로 전환
            interiorContent.style.display = 'none';
            brandingContent.style.display = 'flex';
            
            // 브랜딩 첫 번째 항목 활성화
            initServiceListItems('.branding-service-list', '.branding-service-info');
        } else {
            // 인테리어로 전환
            interiorContent.style.display = 'flex';
            brandingContent.style.display = 'none';
            
            // 인테리어 첫 번째 항목 활성화
            initServiceListItems('.interior-service-list', '.interior-service-info');
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
    
    // 요소가 존재하는지 확인
    if (!listItems.length || !infoItems.length) {
        console.error(`서비스 리스트 또는 정보 요소를 찾을 수 없습니다: ${listSelector}, ${infoSelector}`);
        return;
    }
    
    // 모든 활성 클래스 및 표시 상태 초기화
    listItems.forEach(item => item.classList.remove('active'));
    infoItems.forEach(item => item.style.display = 'none');
    
    // 첫 번째 항목 활성화 (필요한 경우)
    if (activateFirst) {
        listItems[0].classList.add('active');
        infoItems[0].style.display = 'flex';
    }
    
    // 각 리스트 아이템에 클릭 이벤트 추가
    listItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // 모든 활성 상태 제거
            listItems.forEach(li => li.classList.remove('active'));
            infoItems.forEach(info => info.style.display = 'none');
            
            // 클릭한 항목 활성화
            this.classList.add('active');
            if (infoItems[index]) {
                infoItems[index].style.display = 'flex';
            }
        });
    });
}

// 레이아웃 로드 시 초기화
document.addEventListener('layoutLoaded', function() {
    console.log('Layout loaded, initializing service toggle and list items');
    
    // 로드 후 약간의 지연을 두고 초기화 (DOM이 완전히 로드되도록)
    setTimeout(() => {
        initServiceToggle();
    }, 500);
});