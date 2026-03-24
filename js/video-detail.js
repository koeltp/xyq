// 视频详情页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取视频ID参数
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    
    if (!videoId) {
        document.getElementById('videoTitle').textContent = '视频ID未指定';
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
            // 在所有分类中查找对应的视频
            let video = null;
            for (const category of data.categories) {
                const foundVideo = category.videos.find(v => v.id === videoId);
                if (foundVideo) {
                    video = foundVideo;
                    break;
                }
            }
            
            if (!video) {
                document.getElementById('videoTitle').textContent = '视频未找到';
                return;
            }
            
            // 更新页面内容
            document.getElementById('videoTitle').textContent = video.title;
            document.getElementById('videoDescription').textContent = video.description;
            document.getElementById('videoContent').textContent = video.content;
            
            // 更新视频源
            const videoSource = document.getElementById('videoSource');
            videoSource.src = video.videoSrc;
            
            // 重新加载视频
            const videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.load();
            
            // 更新重点内容列表
            const keyPointsList = document.getElementById('videoKeyPoints');
            keyPointsList.innerHTML = '';
            video.keyPoints.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                keyPointsList.appendChild(li);
            });
            
            // 更新页面标题
            document.title = video.title + ' - 形意拳';
        })
        .catch(error => {
            console.error('加载视频数据失败:', error);
            document.getElementById('videoTitle').textContent = '加载失败';
        });
});
