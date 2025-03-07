
document.addEventListener('layoutLoaded', function() {
    
    const checkInterval = setInterval(() => {
        const slider = document.querySelector('#udf-slider');
        
        if (slider) {
            clearInterval(checkInterval);
            console.log('Slider found, initializing');
            initSlider(slider);
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 10000);
});

function initSlider(slider) {
    const wrapper = slider.querySelector('.udf-slide-wrapper');
    const slides = slider.querySelectorAll('.udf-slide-element');
    const dotContainer = slider.querySelector('.udf-slide-dot');
    const prevBtn = slider.querySelector('.udf-sldier-prev');
    const nextBtn = slider.querySelector('.udf-sldier-next');
    
    console.log('Found elements:', {
        slides: slides.length,
        dotContainer,
        prevBtn,
        nextBtn
    });

    
    let currentIndex = 0;
    const slideCount = slides.length;
    let isMobile = window.innerWidth <= 1024;
    
    // 화면 크기 변경 감지
    window.addEventListener('resize', function() {
        const waseMobile = isMobile;
        isMobile = window.innerWidth <= 1024;
        
        // 모바일/PC 전환 시 슬라이더 리셋
        if (waseMobile !== isMobile) {
            resetSlider();
        }
    });
    
    function resetSlider() {
        // 현재 활성화된 슬라이드 초기화
        slides.forEach(slide => slide.classList.remove('active'));
        slides[0].classList.add('active');
        currentIndex = 0;
        updateDots();
        resetAutoSlide();
    }
    
    // 기존 슬라이더 코드는 그대로 유지
    function updateDots() {
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    let isMoving = false;
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 4000);
    }
    
    function moveToIndex(index) {
        if (isMoving) return;
        isMoving = true;
        
        slides[currentIndex].classList.remove('active');
        
        let newIndex = index;
        if (index >= slideCount) {
            newIndex = 0;
        } else if (index < 0) {
            newIndex = slideCount - 1;
        }
        
        slides[newIndex].classList.add('active');
        currentIndex = newIndex;
        updateDots();
        
        setTimeout(() => {
            isMoving = false;
        }, 500);
        
        resetAutoSlide();
    }
    
    function nextSlide() {
        moveToIndex(currentIndex + 1);
    }
    
    function prevSlide() {
        moveToIndex(currentIndex - 1);
    }
    
    function goToSlide(index) {
        if (index === currentIndex) return;
        moveToIndex(index);
    }
    
    // 초기 설정
    slides[0].classList.add('active');
    
    // 도트 생성
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotContainer.appendChild(dot);
    });
    
    // 이벤트 리스너
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // 컨트롤 요소 hover 이벤트
    const controlElements = [prevBtn, nextBtn, dotContainer];
    controlElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        element.addEventListener('mouseleave', () => {
            resetAutoSlide();
        });
    });
    
    let autoSlideInterval = setInterval(nextSlide, 4000);
}