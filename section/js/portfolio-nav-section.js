// 포트폴리오 탭 전환 기능
(function() {
    // 페이지가 완전히 로드된 후 실행될 수 있도록 더 확실한 지연 추가
    window.addEventListener('load', function() {
        // 추가 지연으로 모든 DOM 요소가 확실히 로드되도록 함
        setTimeout(initializePortfolioTabs, 100);
    });
    
    function initializePortfolioTabs() {

        // 탭 버튼 요소 - 더 구체적인 선택자 사용
        const videoTab = document.querySelector('#portfolioNavSectionInner .portfolio-nav-content .video-portfolio-nav');
        const imageTab = document.querySelector('#portfolioNavSectionInner .portfolio-nav-content .image-portfolio-nav');
        
        // 콘텐츠 요소 - 더 구체적인 선택자 사용
        const videoContent = document.querySelector('#portfolioListSectionInner .video-portfolio-list');
        const imageContent = document.querySelector('#portfolioListSectionInner .image-portfolio-list');
        
        // 요소가 존재하는지 확인
        if (!videoTab || !imageTab) {
            return;
        }
        
        if (!videoContent || !imageContent) {
            return;
        }
        
        // 초기 상태 설정 (비디오 탭 활성화)
        videoTab.classList.add('active');
        videoContent.style.display = 'block';
        imageContent.style.display = 'none';
        
        // 비디오 탭 클릭 이벤트
        videoTab.addEventListener('click', function() {
            console.log('비디오 탭 클릭됨');
            // 이미 활성화된 상태면 아무것도 하지 않음
            if (videoTab.classList.contains('active')) return;
            
            // 탭 활성화 상태 변경
            videoTab.classList.add('active');
            imageTab.classList.remove('active');
            
            // 콘텐츠 표시 상태 변경
            videoContent.style.display = 'block';
            imageContent.style.display = 'none';
            
            console.log('비디오 포트폴리오 탭 활성화됨');
        });
        
        // 이미지 탭 클릭 이벤트
        imageTab.addEventListener('click', function() {
            console.log('이미지 탭 클릭됨');
            // 이미 활성화된 상태면 아무것도 하지 않음
            if (imageTab.classList.contains('active')) return;
            
            // 탭 활성화 상태 변경
            imageTab.classList.add('active');
            videoTab.classList.remove('active');
            
            // 콘텐츠 표시 상태 변경
            imageContent.style.display = 'block';
            videoContent.style.display = 'none';
        });
    }
})();