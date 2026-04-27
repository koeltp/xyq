// 教学视频页面脚本
document.addEventListener('DOMContentLoaded', function() {
    let videoData = null;
    let currentCategory = null;
    
    // 加载JSON数据
    fetch('data/videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载视频数据');
            }
            return response.json();
        })
        .then(data => {
            videoData = data;
            
            // 生成分类导航
            generateCategoryNav(data.categories);
            
            // 检查URL哈希参数，优先显示哈希指定的分类
            const hash = window.location.hash.substring(1);
            if (hash && data.categories.some(c => c.id === hash)) {
                showCategoryVideos(hash);
            } else if (data.categories.length > 0) {
                // 默认显示第一个分类的视频
                showCategoryVideos(data.categories[0].id);
            }
        })
        .catch(error => {
            console.error('加载视频数据失败:', error);
            const videoGrid = document.getElementById('videoGrid');
            videoGrid.innerHTML = '<p>加载视频数据失败，请稍后再试。</p>';
        });
    
    // 生成分类导航
    function generateCategoryNav(categories) {
        const categoryNav = document.getElementById('categoryNav');
        categoryNav.innerHTML = '';
        
        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = category.name;
            a.dataset.categoryId = category.id;
            
            // 添加点击事件
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const categoryId = this.dataset.categoryId;
                showCategoryVideos(categoryId);
            });
            
            li.appendChild(a);
            categoryNav.appendChild(li);
        });
    }
    
    // 显示分类视频
    function showCategoryVideos(categoryId) {
        if (!videoData) return;
        
        // 找到对应的分类
        const category = videoData.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // 更新当前分类
        currentCategory = category;
        
        // 更新页面标题
        document.getElementById('categoryTitle').textContent = category.name;
        
        // 更新导航激活状态
        const navLinks = document.querySelectorAll('.category-nav a');
        navLinks.forEach(link => {
            if (link.dataset.categoryId === categoryId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // 生成视频列表
        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '';
        
        category.videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-wrapper';
            
            const videoThumbnail = document.createElement('img');
            videoThumbnail.src = video.thumbnail;
            videoThumbnail.alt = video.title;
            videoThumbnail.className = 'video-player';
            videoThumbnail.style.cursor = 'pointer';
            
            // 添加点击事件，跳转到视频详情页
            videoThumbnail.addEventListener('click', function() {
                window.location.href = `video-detail.html?id=${video.id}`;
            });
            
            // 创建播放按钮
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            playButton.innerHTML = '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.5)"/><path d="M10 8L16 12L10 16V8Z" fill="white"/></svg>';
            
            // 添加点击事件，跳转到视频详情页
            playButton.addEventListener('click', function() {
                window.location.href = `video-detail.html?id=${video.id}`;
            });
            
            const videoInfo = document.createElement('div');
            videoInfo.className = 'video-info';
            
            const videoTitle = document.createElement('a');
            videoTitle.href = `video-detail.html?id=${video.id}`;
            videoTitle.className = 'video-title-link';
            videoTitle.textContent = video.title;
            
            const videoDesc = document.createElement('p');
            videoDesc.textContent = video.description;
            
            videoInfo.appendChild(videoTitle);
            videoInfo.appendChild(videoDesc);
            
            videoWrapper.appendChild(videoThumbnail);
            videoWrapper.appendChild(playButton);
            videoItem.appendChild(videoWrapper);
            videoItem.appendChild(videoInfo);
            
            videoGrid.appendChild(videoItem);
        });
    }
});
