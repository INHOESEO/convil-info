// 포트폴리오 기능 통합 스크립트
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
    
    // 전역으로 활성화된 필터를 추적하는 객체
    const activeFilters = {
        filters: new Set(['all']), // 기본적으로 'all' 필터 활성화
        
        // 필터 추가
        add(filter) {
            // 'all' 필터가 추가되면 모든 다른 필터를 제거
            if (filter === 'all') {
                this.filters.clear();
            } else {
                // 다른 필터가 추가되면 'all' 필터를 제거
                this.filters.delete('all');
            }
            this.filters.add(filter);
        },
        
        // 필터 제거
        remove(filter) {
            this.filters.delete(filter);
            // 필터가 없으면 'all' 필터를 다시 추가
            if (this.filters.size === 0) {
                this.filters.add('all');
            }
        },
        
        // 필터 토글(있으면 제거, 없으면 추가)
        toggle(filter) {
            if (this.filters.has(filter)) {
                this.remove(filter);
            } else {
                this.add(filter);
            }
        },
        
        // 필터가 활성화되어 있는지 확인
        has(filter) {
            return this.filters.has(filter);
        },
        
        // 현재 활성화된 모든 필터 가져오기
        getAll() {
            return Array.from(this.filters);
        },
        
        // 모든 필터 초기화(전체 필터로 설정)
        reset() {
            this.filters.clear();
            this.filters.add('all');
        }
    };
    
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
            return;
        }
        
        // 필터 버튼 요소들
        const allFilter = document.querySelector('.all-filter');
        const dinningFilter = document.querySelector('.dinning-filter');
        const beautyFilter = document.querySelector('.beauty-filter');
        const officeFilter = document.querySelector('.office-filter');
        const accommodationFilter = document.querySelector('.accommodation-filter');
        const houseFilter = document.querySelector('.house-filter');
        const etcFilter = document.querySelector('.etc-filter');
        const resetFilter = document.querySelector('.reset-filter');
        
        // 모든 필터 버튼을 배열로 모음
        const filterButtons = [
            { element: allFilter, key: 'all', tag: null },
            { element: dinningFilter, key: 'dinning', tag: '#식당/카페' },
            { element: beautyFilter, key: 'beauty', tag: '#뷰티/패션' },
            { element: officeFilter, key: 'office', tag: '#사무실' },
            { element: accommodationFilter, key: 'accommodation', tag: '#숙박업' },
            { element: houseFilter, key: 'house', tag: '#주거' },
            { element: etcFilter, key: 'etc', tag: '#기타' }
        ];
        
        // 포트폴리오 상태 및 페이지네이션 초기화
        const portfolioState = {
            videoGrid: videoGrid,
            currentPage: 1,
            itemsPerPage: 12,
            totalItems: videoPortfolioData.length,
            filteredData: [...videoPortfolioData] // 처음에는 모든 데이터 포함
        };
        
        // 초기 필터 UI 상태 설정
        updateFilterUI();
        
        // 필터 버튼 클릭 이벤트 설정
        filterButtons.forEach(button => {
            if (button.element) {
                button.element.addEventListener('click', function() {
                    // 'all' 필터 처리
                    if (button.key === 'all') {
                        activeFilters.reset();
                    } else {
                        activeFilters.toggle(button.key);
                    }
                    
                    // 필터 UI 업데이트
                    updateFilterUI();
                    
                    // 필터링된 데이터로 업데이트
                    applyFilter(portfolioState);
                    
                    // 첫 페이지로 이동
                    portfolioState.currentPage = 1;
                    
                    // 페이지네이션 다시 생성
                    createPaginationControls(portfolioState);
                    
                    // 포트폴리오 다시 렌더링
                    renderVideoPortfolio(portfolioState);
                });
            }
        });
        
        // 필터 초기화 버튼 이벤트
        if (resetFilter) {
            resetFilter.addEventListener('click', function() {
                activeFilters.reset();
                updateFilterUI();
                applyFilter(portfolioState);
                portfolioState.currentPage = 1;
                createPaginationControls(portfolioState);
                renderVideoPortfolio(portfolioState);
            });
        }
        
        // 필터 UI 업데이트 함수
        function updateFilterUI() {
            // 모든 필터 버튼 비활성화
            filterButtons.forEach(button => {
                if (button.element) {
                    button.element.classList.remove('active');
                }
            });
            
            // 활성화된 필터에 클래스 추가
            filterButtons.forEach(button => {
                if (button.element && activeFilters.has(button.key)) {
                    button.element.classList.add('active');
                }
            });
        }
        
        // 필터 적용 함수
        function applyFilter(state) {
            // 활성화된 필터에 따라 데이터 필터링
            if (activeFilters.has('all')) {
                // 전체 필터가 활성화되면 모든 데이터 표시
                state.filteredData = [...videoPortfolioData];
            } else {
                // 선택된 필터들에 맞는 태그를 가진 항목만 필터링
                const filterTags = filterButtons
                    .filter(button => activeFilters.has(button.key))
                    .map(button => button.tag)
                    .filter(tag => tag !== null);
                
                state.filteredData = videoPortfolioData.filter(item => {
                    // 항목의 해시태그 중 하나라도 활성화된 필터와 일치하면 포함
                    return item.hashtags.some(tag => filterTags.includes(tag));
                });
            }
            
            // 필터링된 데이터의 총 개수 업데이트
            state.totalItems = state.filteredData.length;
        }
        
        // 초기 필터 적용
        applyFilter(portfolioState);
        
        // 페이지네이션 컨트롤 생성
        createPaginationControls(portfolioState);
        
        // 포트폴리오 렌더링
        renderVideoPortfolio(portfolioState);
    }
    
    // 페이지네이션 컨트롤 생성 함수
    function createPaginationControls(state) {
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        
        // 페이지네이션 컨테이너 생성 또는 가져오기
        let paginationContainer = document.querySelector('.portfolio-pagination');
        
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'portfolio-pagination';
            
            // 비디오 그리드 후에 삽입
            state.videoGrid.parentNode.insertBefore(paginationContainer, state.videoGrid.nextSibling);
        } else {
            // 기존 페이지네이션이 있으면 내용 비우기
            paginationContainer.innerHTML = '';
        }
        
        // 아이템이 없거나 한 페이지 이하면 페이지네이션 표시 안함
        if (state.totalItems === 0 || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }
        
        // 이전 페이지 버튼
        const prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.className = 'pagination-btn prev-btn';
        prevButton.disabled = state.currentPage === 1;
        
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
        nextButton.disabled = state.currentPage === totalPages;
        
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
        const prevButton = document.querySelector('.prev-btn');
        const nextButton = document.querySelector('.next-btn');
        const pageButtons = document.querySelectorAll('.pagination-btn.page-btn');
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        
        // 이전/다음 버튼 상태 업데이트
        if (prevButton) prevButton.disabled = state.currentPage === 1;
        if (nextButton) nextButton.disabled = state.currentPage === totalPages;
        
        // 페이지 버튼 상태 업데이트
        pageButtons.forEach(button => {
            const page = parseInt(button.dataset.page);
            if (page === state.currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // 비디오 포트폴리오 그리드 렌더링 함수 - 필터링 지원 추가
    function renderVideoPortfolio(state) {
        try {
            // 상태 객체에서 그리드 요소 참조 가져오기
            const videoGrid = state.videoGrid;
            
            if (!videoGrid) {
                return;
            }
            
            // 기존 내용 비우기
            videoGrid.innerHTML = '';
            
            // 필터링된 데이터가 없으면 메시지 표시
            if (state.filteredData.length === 0) {
                const noResultsElement = document.createElement('div');
                noResultsElement.className = 'no-results-message';
                noResultsElement.style.width = '100%';
                noResultsElement.style.padding = '50px 20px';
                noResultsElement.style.textAlign = 'center';
                noResultsElement.style.fontSize = '18px';
                noResultsElement.style.color = '#666';
                noResultsElement.textContent = '해당 필터에 맞는 포트폴리오 항목이 없습니다.';
                
                videoGrid.appendChild(noResultsElement);
                return;
            }
            
            // 현재 페이지에 표시할 항목 계산
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = Math.min(startIndex + state.itemsPerPage, state.totalItems);
            
            // 현재 페이지의 항목만 렌더링
            for (let i = startIndex; i < endIndex; i++) {
                // 필터링된 데이터 배열의 범위를 벗어나지 않도록 확인
                if (i >= state.filteredData.length) break;
                
                const item = state.filteredData[i];
                
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
                            <img src="../source/svg/modal-close.svg" alt="닫기">
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
        } catch (error) { }
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
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "수직농장 카페",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/p-DP8srXtOc"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "30평 아파트",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/NyIKWMN4Vrw"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "독서실",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/QBKbKCB35qk"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "주택 및 아파트 인테리어",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/r_TRkAgXy54"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "플래그십 스토어",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/JtywnxPNJfA"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "사무실 모음",
        hashtags: ["#사무실"],
        videoUrl: "https://www.youtube.com/embed/43UQeqa1i-Q"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "창원 단감테마파크",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/mul0rU5WDtg"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "경주 펜션",
        hashtags: ["#숙박업"],
        videoUrl: "https://www.youtube.com/embed/HsEU12kb0w4"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "아파트 마감재 소개",
        hashtags: ["#주거", "#기타"],
        videoUrl: "https://www.youtube.com/embed/3lh6fC21wNc"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "로고부터 브랜딩 인테리어까지",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/nhITotEarak"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "뷰티샵",
        hashtags: ["#뷰티/패션"],
        videoUrl: "https://www.youtube.com/embed/goMFbib3eHY"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "고급 아파트",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/77bgOMYxkNc"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "피자 프랜차이즈",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/p-Gtlb_MI0w"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "감성술집",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/-rxHpcjyiYI"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "고깃집 브랜딩",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/hz92J2wCHRA"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "산후조리원",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/TZv_UHG7iTg"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "횟집 프랜차이즈",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/kGzhUH9mOKA"
    }
];

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
    } catch (error) { }
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

// 기존 IIFE 코드 끝에 추가
// 페이지 로드 후 직접 검사하는 코드

// 즉시 실행 함수로 감싸서 전역 충돌 방지
(function() {
    // 페이지 로드 후 실행
    window.addEventListener('load', function() {
        // 약간의 지연 후 모달 초기화 (DOM이 완전히 렌더링된 후)
        setTimeout(initializePortfolioModals, 500);
    });
    
    function initializePortfolioModals() {
        const portfolioElements = document.querySelectorAll('.portfolio-element');
        
        portfolioElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const modal = this.parentElement.querySelector('.portfolio-element-modal') || 
                              this.parentElement.querySelector('.modal');
                
                if (modal) {
                    modal.style.display = 'block';
                    addModalBackground();
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // 모달 닫기 버튼에 이벤트 추가
        const closeButtons = document.querySelectorAll('.modal-header img');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    removeModalBackground();
                    document.body.style.overflow = '';
                }
            });
        });
    }
})();