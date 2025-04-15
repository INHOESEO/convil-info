// 페이지 로드 시 실행되는 즉시 실행 함수
(function() {
    // DOM이 완전히 로드되었는지 확인하고 약간의 지연 추가
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // DOM이 로드된 후 약간의 지연 추가
            setTimeout(initializePortfolio, 100);
        });
    } else {
        // 이미 DOM이 로드되었다면 약간의 지연 후 실행
        setTimeout(initializePortfolio, 100);
    }
    
    function initializePortfolio() {
        // 엄격한 선택자로 요소 찾기 시도
        let videoGrid = document.querySelector('#portfolioListSectionInner .video-portfolio-list .grid-row.video-portfolio-grid');
        
        if (!videoGrid) {
            // 두 번째 시도: 덜 엄격한 선택자
            videoGrid = document.querySelector('.video-portfolio-grid');
        }
        
        if (!videoGrid) {
            // 세 번째 시도: grid-row 클래스가 있는 요소 중 첫 번째
            videoGrid = document.querySelector('.video-portfolio-list .grid-row');
        }
        
        if (!videoGrid) {
            console.error('비디오 포트폴리오 그리드를 찾을 수 없습니다!');
            return;
        }
        
        // 레퍼런스 저장 및 페이지네이션 초기화
        const portfolioState = {
            videoGrid: videoGrid,
            currentPage: 1,
            itemsPerPage: 12,
            totalItems: videoPortfolioData.length
        };
        
        // 페이지네이션 요소 생성
        createPaginationControls(portfolioState);
        
        // 포트폴리오 렌더링
        renderVideoPortfolio(portfolioState);
    }
})();

// 수정된 비디오 포트폴리오 데이터 배열
const videoPortfolioData = [
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "[종합 사례] Before&After를 한 눈에",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/XmxkLfo5j2s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "3000만원 이상 공사 절약 후기",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/BH7JEFf-cC8"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "실내 캠핑장",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/peXt7BhASNI"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "샤브샤브 가게",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/S5Gqotu5770"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "주택 인테리어",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/KQc85H-a8PA"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "한식집",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/Qkh5rjPF_8Q"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "교회 리모델링",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/vEm3Cpo20tI"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "세신샵",
        hashtags: ["#뷰티/패션", "#기타"],
        videoUrl: "https://www.youtube.com/embed/G7WqNntiPv0"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "아파트",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/CFj4UrsoI0s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "고깃집",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/WgYJW0vYbII" 
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "침실 인테리어",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/5QOBCGjJg3o"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "한식당",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/Aaj-awEHyoQ"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "사옥 리모델링",
        hashtags: ["#사무실"],
        videoUrl: "https://www.youtube.com/embed/hA03W6_tX8s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "100평 사무실",
        hashtags: ["#사무실"],
        videoUrl: "https://www.youtube.com/embed/btuu4z_LiU0"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "교회",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/GSaeGFK5-xw"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "카페",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/1mAuXMlrDyM"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "워독 플래그십 스토어 백화점",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/hbyLqxz5skY"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "무인문구점 브랜딩부터 인테리어",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/hSSzdRrl2TE"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "치킨 프랜차이즈",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/3oMRJ9O9bnE"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "뷰티샵",
        hashtags: ["#뷰티/패션"],
        videoUrl: "https://www.youtube.com/embed/iCFXLP3FUJk"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "실내 캠핑장 컨설팅 전/후",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/MFd8xs_2RNU"
    }
];

// 페이지네이션 컨트롤 생성 함수
function createPaginationControls(state) {
    const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
    if (totalPages <= 1) return; // 페이지가 하나면 페이지네이션 필요 없음
    
    // 페이지네이션 컨테이너 생성
    let paginationContainer = document.querySelector('.portfolio-pagination');
    
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'portfolio-pagination';
        
        // 스타일 추가
        paginationContainer.style.display = 'flex';
        paginationContainer.style.justifyContent = 'center';
        paginationContainer.style.margin = '30px 0';
        paginationContainer.style.gap = '10px';
        
        // 비디오 그리드 후에 삽입
        state.videoGrid.parentNode.insertBefore(paginationContainer, state.videoGrid.nextSibling);
    } else {
        // 기존 페이지네이션이 있으면 내용 비우기
        paginationContainer.innerHTML = '';
    }
    
    // 이전 페이지 버튼
    const prevButton = document.createElement('button');
    prevButton.textContent = '이전';
    prevButton.className = 'pagination-btn prev-btn';
    prevButton.style.padding = '8px 15px';
    prevButton.style.border = '1px solid #ddd';
    prevButton.style.backgroundColor = '#f8f8f8';
    prevButton.style.cursor = 'pointer';
    prevButton.style.borderRadius = '4px';
    
    prevButton.addEventListener('click', function() {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderVideoPortfolio(state);
            updatePaginationActive(state);
        }
    });
    
    paginationContainer.appendChild(prevButton);
    
    // 페이지 번호 버튼들
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `pagination-btn page-btn ${i === state.currentPage ? 'active' : ''}`;
        pageButton.dataset.page = i;
        
        // 스타일 설정
        pageButton.style.padding = '8px 15px';
        pageButton.style.border = '1px solid #ddd';
        pageButton.style.backgroundColor = i === state.currentPage ? '#007bff' : '#f8f8f8';
        pageButton.style.color = i === state.currentPage ? 'white' : 'black';
        pageButton.style.cursor = 'pointer';
        pageButton.style.borderRadius = '4px';
        
        pageButton.addEventListener('click', function() {
            state.currentPage = parseInt(this.dataset.page);
            renderVideoPortfolio(state);
            updatePaginationActive(state);
        });
        
        paginationContainer.appendChild(pageButton);
    }
    
    // 다음 페이지 버튼
    const nextButton = document.createElement('button');
    nextButton.textContent = '다음';
    nextButton.className = 'pagination-btn next-btn';
    nextButton.style.padding = '8px 15px';
    nextButton.style.border = '1px solid #ddd';
    nextButton.style.backgroundColor = '#f8f8f8';
    nextButton.style.cursor = 'pointer';
    nextButton.style.borderRadius = '4px';
    
    nextButton.addEventListener('click', function() {
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderVideoPortfolio(state);
            updatePaginationActive(state);
        }
    });
    
    paginationContainer.appendChild(nextButton);
}

// 페이지네이션 활성화 상태 업데이트
function updatePaginationActive(state) {
    const pageButtons = document.querySelectorAll('.pagination-btn.page-btn');
    pageButtons.forEach(button => {
        const page = parseInt(button.dataset.page);
        if (page === state.currentPage) {
            button.classList.add('active');
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
        } else {
            button.classList.remove('active');
            button.style.backgroundColor = '#f8f8f8';
            button.style.color = 'black';
        }
    });
}

// 비디오 포트폴리오 그리드 렌더링 함수 - 페이지네이션 지원 추가
function renderVideoPortfolio(state) {
    try {
        // 상태 객체에서 그리드 요소 참조 가져오기
        const videoGrid = state.videoGrid;
        
        if (!videoGrid) {
            console.error('렌더링 함수에서 비디오 그리드를 찾을 수 없습니다!');
            return;
        }
        
        // 기존 내용 비우기
        videoGrid.innerHTML = '';
        
        // 현재 페이지에 표시할 항목 계산
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = Math.min(startIndex + state.itemsPerPage, state.totalItems);
        
        // 현재 페이지의 항목만 렌더링
        for (let i = startIndex; i < endIndex; i++) {
            const item = videoPortfolioData[i];
            
            const portfolioElement = document.createElement('div');
            portfolioElement.className = 'grid33';
            
            // 해시태그 HTML 생성
            const hashtagsHtml = item.hashtags.map(tag => `<li>${tag}</li>`).join('');
            
            // YouTube URL이 Shorts인지 확인하고 조정
            const videoUrl = processYouTubeUrl(item.videoUrl);
            
            // 포트폴리오 요소 HTML 구조 생성
            portfolioElement.innerHTML = `
                <div class="portfolio-element">
                    <img class="portfolio-element-thumb" src="${item.thumbnail}" alt="${item.title}">
                    <h3 class="portfolio-element-title">${item.title}</h3>
                    <ul class="portfolio-element-hashtag">
                        ${hashtagsHtml}
                    </ul>
                </div>
                <div class="modal portfolio-element-modal">
                    <div class="modal-header">
                        <p>${item.title}</p>
                        <img src="../source/svg/portfolio-list-modal-close.svg" alt="닫기">
                    </div>
                    <div class="modal-body">
                        <iframe width="100%" height="500" src="${videoUrl}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            
            videoGrid.appendChild(portfolioElement);
        }
        
        // 모달 기능 초기화
        initializeModals();
        
        // 페이지네이션 상태 업데이트
        updatePaginationActive(state);
    } catch (error) {
        console.error('렌더링 함수에서 오류 발생:', error);
    }
}

// YouTube URL 처리 함수
function processYouTubeUrl(url) {
    try {
        // 이미 수정된 임베드 URL이면 그대로 반환
        if (url.includes('/embed/')) {
            return url;
        }
        
        // URL에서 비디오 ID 추출
        let videoId = '';
        
        // shorts URL 처리
        if (url.includes('/shorts/')) {
            videoId = url.split('/shorts/')[1];
            // URL 매개변수 제거
            if (videoId.includes('?')) {
                videoId = videoId.split('?')[0];
            }
        } 
        // 일반 YouTube URL 처리
        else if (url.includes('watch?v=')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        }
        // 짧은 youtu.be URL 처리
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
            if (videoId.includes('?')) {
                videoId = videoId.split('?')[0];
            }
        }
        
        // 비디오 ID가 추출되었으면 임베드 URL 생성
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        // 추출 실패 시 원래 URL 반환
        return url;
    } catch (error) {
        console.error('YouTube URL 처리 중 오류:', error);
        return url; // 오류 발생 시 원래 URL 반환
    }
}

// 모달 기능 초기화 함수
function initializeModals() {
    try {
        // 모든 포트폴리오 요소 선택
        const portfolioElements = document.querySelectorAll('.portfolio-element');
        
        // 모달 열기 이벤트 추가
        portfolioElements.forEach((element, index) => {
            element.addEventListener('click', function(e) {
                const modal = this.parentElement.querySelector('.portfolio-element-modal');
                if (modal) {
                    modal.style.display = 'block';
                    
                    // 모달 배경 추가
                    addModalBackground();
                    
                    // 스크롤 방지
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // 모달 닫기 버튼에 이벤트 추가
        const closeButtons = document.querySelectorAll('.modal-header img');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 이벤트 버블링 방지
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    
                    // 모달 배경 제거
                    removeModalBackground();
                    
                    // 스크롤 복원
                    document.body.style.overflow = '';
                }
            });
        });
    } catch (error) {
        console.error('모달 초기화 중 오류 발생:', error);
    }
}

// 모달 배경 추가 함수
function addModalBackground() {
    // 이미 배경이 있는지 확인
    if (!document.querySelector('.modal-background')) {
        const background = document.createElement('div');
        background.className = 'modal-background';
        
        document.body.appendChild(background);
        
        // 배경 클릭 시 모달 닫기
        background.addEventListener('click', function() {
            const openModals = document.querySelectorAll('.modal[style="display: block;"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            removeModalBackground();
            
            // 스크롤 복원
            document.body.style.overflow = '';
        });
    }
}

// 모달 배경 제거 함수
function removeModalBackground() {
    const background = document.querySelector('.modal-background');
    if (background) {
        document.body.removeChild(background);
    }
}