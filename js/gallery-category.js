// 照片分类页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取分类ID参数
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    
    if (!categoryId) {
        document.getElementById('categoryTitle').textContent = '分类ID未指定';
        return;
    }
    
    // 加载JSON数据
    fetch('data/photos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载照片数据');
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
            document.title = category.name + ' - 形意拳照片墙';
            
            // 生成照片列表
            const photosGrid = document.getElementById('photosGrid');
            photosGrid.innerHTML = '';
            
            category.photos.forEach(photo => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const photoElement = document.createElement('img');
                photoElement.src = photo.src;
                photoElement.alt = photo.alt;
                
                const galleryInfo = document.createElement('div');
                galleryInfo.className = 'gallery-info';
                
                const photoCaption = document.createElement('p');
                photoCaption.textContent = photo.caption;
                
                galleryInfo.appendChild(photoCaption);
                
                galleryItem.appendChild(photoElement);
                galleryItem.appendChild(galleryInfo);
                
                photosGrid.appendChild(galleryItem);
            });
        })
        .catch(error => {
            console.error('加载照片数据失败:', error);
            document.getElementById('categoryTitle').textContent = '加载失败';
        });
});
