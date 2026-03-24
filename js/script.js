// 简单的页面交互功能

// 导航栏当前页面高亮
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // 子页面对应的父页面映射
    const pageMapping = {
        'category-videos.html': 'videos.html',
        'video-detail.html': 'videos.html',
        'gallery-category.html': 'gallery.html'
    };
    
    // 获取应该高亮的页面
    const highlightPage = pageMapping[currentPage] || currentPage;
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === highlightPage || 
            (highlightPage === '' && linkPage === 'index.html') ||
            (currentPage === highlightPage && linkPage === currentPage)) {
            link.classList.add('active');
        }
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
        header.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
    } else {
        header.style.backgroundColor = '#333';
    }
});

// 表单提交处理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('感谢您的留言，我们会尽快回复您！');
        this.reset();
    });
}
