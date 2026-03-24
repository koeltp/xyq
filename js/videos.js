// 教学视频页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载JSON数据
    fetch('data/videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载视频数据');
            }
            return response.json();
        })
        .then(data => {
            // 生成视频分类列表
            const videoGrid = document.getElementById('videoGrid');
            videoGrid.innerHTML = '';
            
            data.categories.forEach(category => {
                const videoLink = document.createElement('a');
                videoLink.href = `category-videos.html?id=${category.id}`;
                videoLink.className = 'video-item-link';
                
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                
                const thumbnail = document.createElement('img');
                thumbnail.src = category.videos[0]?.thumbnail || 'images/wuxinquan/五行拳.jpg';
                thumbnail.alt = category.name;
                
                const videoInfo = document.createElement('div');
                videoInfo.className = 'video-info';
                
                const videoTitle = document.createElement('h4');
                videoTitle.textContent = category.name;
                
                const videoDesc = document.createElement('p');
                videoDesc.textContent = category.description;
                
                videoInfo.appendChild(videoTitle);
                videoInfo.appendChild(videoDesc);
                
                videoItem.appendChild(thumbnail);
                videoItem.appendChild(videoInfo);
                
                videoLink.appendChild(videoItem);
                videoGrid.appendChild(videoLink);
            });
        })
        .catch(error => {
            console.error('加载视频数据失败:', error);
            const videoGrid = document.getElementById('videoGrid');
            videoGrid.innerHTML = '<p>加载视频数据失败，请稍后再试。</p>';
        });
});
