// 页面交互功能

// 导航栏当前页面高亮
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav > ul > li > a');
    
    // 子页面对应的父页面映射
    const pageMapping = {
        'video-detail.html': 'videos.html'
    };
    
    // 判断是否在文章页面（路径包含 /articles/）
    const isArticlePage = currentPath.includes('/articles/');
    
    // 获取应该高亮的页面
    const highlightPage = pageMapping[currentPage] || currentPage;
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // 文章页面高亮"文章"下拉按钮
        if (isArticlePage && link.classList.contains('dropdown-toggle')) {
            link.classList.add('active');
            return;
        }
        if (linkPage === highlightPage || 
            (highlightPage === '' && linkPage === 'index.html') ||
            (currentPage === highlightPage && linkPage === currentPage)) {
            link.classList.add('active');
        }
    });

    // 移动端：点击下拉菜单切换展开
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // 仅在移动端阻止默认跳转并切换展开
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.closest('.nav-dropdown').classList.toggle('open');
            }
        });
    });
});

// 平滑滚动（排除 href="#" 的链接）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    // 跳过 href="#" 的情况
    if (href === '#' || href.length < 2) return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = '#ffffff';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});
