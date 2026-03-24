// 分类视频页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取分类ID参数
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    if (!categoryId) {
        document.getElementById('categoryTitle').textContent = '分类ID未指定';
        return;
    }
    
    // 加载JSON数据
    fetch('data/videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载视频数据');
            }
            return response.json();
        })
        .then(data => {
            // 查找对应的分类
            const category = data.categories.find(c => c.id === categoryId);
            
            if (!category) {
                document.getElementById('categoryTitle').textContent = '分类未找到';
                return;
            }
            
            // 更新页面内容
            document.getElementById('categoryTitle').textContent = category.name;
            
            // 更新页面标题
            document.title = category.name + ' - 形意拳';
            
            // 生成视频列表
            const videoGrid = document.getElementById('videoGrid');
            videoGrid.innerHTML = '';
            
            category.videos.forEach((video, index) => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'video-wrapper';
                
                const videoElement = document.createElement('video');
                videoElement.src = video.videoSrc;
                videoElement.controls = true;
                videoElement.className = 'video-player';
                
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
                
                videoWrapper.appendChild(videoElement);
                videoItem.appendChild(videoWrapper);
                videoItem.appendChild(videoInfo);
                
                videoGrid.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('加载视频数据失败:', error);
            document.getElementById('categoryTitle').textContent = '加载失败';
        });
});
