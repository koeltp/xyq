// 照片墙页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载JSON数据
    fetch('data/photos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载照片数据');
            }
            return response.json();
        })
        .then(data => {
            // 生成照片分类列表
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '';
            
            data.categories.forEach(category => {
                const categoryLink = document.createElement('a');
                categoryLink.href = `gallery-category.html?id=${category.id}`;
                categoryLink.className = 'gallery-item-link';
                
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const thumbnail = document.createElement('img');
                thumbnail.src = category.photos[0]?.src || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=xingyiquan%20practice&image_size=square';
                thumbnail.alt = category.name;
                
                const galleryInfo = document.createElement('div');
                galleryInfo.className = 'gallery-info';
                
                const categoryTitle = document.createElement('h4');
                categoryTitle.textContent = category.name;
                
                const categoryDesc = document.createElement('p');
                categoryDesc.textContent = category.description;
                
                galleryInfo.appendChild(categoryTitle);
                galleryInfo.appendChild(categoryDesc);
                
                galleryItem.appendChild(thumbnail);
                galleryItem.appendChild(galleryInfo);
                
                categoryLink.appendChild(galleryItem);
                galleryGrid.appendChild(categoryLink);
            });
        })
        .catch(error => {
            console.error('加载照片数据失败:', error);
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '<p>加载照片数据失败，请稍后再试。</p>';
        });
});
