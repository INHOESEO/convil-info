function setHeaderMargin() {
    console.log('function 내부');

    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const container = document.getElementById('container');
    const banner = document.getElementById('bannerContainer');

    // 각 요소가 존재할 때만 해당 스타일 적용
    if (header && container) {
        console.log('header와 container 스타일 적용');
        const headerHeight = header.offsetHeight;
        container.style.marginTop = headerHeight + 'px';
    }
    
    if (footer && container) {
        console.log('footer와 container 스타일 적용');
        const footerHeight = footer.offsetHeight;
        container.style.paddingBottom = footerHeight + 'px';
    }
    
    if (header && banner) {
        console.log('header와 banner 스타일 적용');
        const headerHeight = header.offsetHeight;
        banner.style.marginTop = headerHeight + 'px';
    }
}

// 레이아웃이 로드된 후 마진 설정
document.addEventListener('layoutLoaded', setHeaderMargin);

// 윈도우 리사이즈시에도 마진 재설정
window.addEventListener('resize', setHeaderMargin);

