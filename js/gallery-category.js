// 照片分类页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 存储当前分类的照片数据
    let currentPhotos = [];
    let currentIndex = 0;
    
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
            
            // 存储当前分类的照片数据
            currentPhotos = category.photos;
            
            // 更新页面内容
            document.getElementById('categoryTitle').textContent = category.name;
            
            // 更新页面标题
            document.title = category.name + ' - 形意拳照片墙';
            
            // 生成照片列表
            const photosGrid = document.getElementById('photosGrid');
            photosGrid.innerHTML = '';
            
            category.photos.forEach((photo, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const photoElement = document.createElement('img');
                photoElement.src = photo.src;
                photoElement.alt = photo.alt;
                photoElement.style.cursor = 'pointer';
                
                // 添加点击事件，打开幻灯片
                photoElement.addEventListener('click', () => {
                    openSlideshow(index);
                });
                
                const galleryInfo = document.createElement('div');
                galleryInfo.className = 'gallery-info';
                
                const photoCaption = document.createElement('p');
                photoCaption.textContent = photo.caption;
                
                galleryInfo.appendChild(photoCaption);
                
                galleryItem.appendChild(photoElement);
                galleryItem.appendChild(galleryInfo);
                
                photosGrid.appendChild(galleryItem);
            });
            
            // 创建幻灯片模态框
            createSlideshowModal();
        })
        .catch(error => {
            console.error('加载照片数据失败:', error);
            document.getElementById('categoryTitle').textContent = '加载失败';
        });
    
    // 创建幻灯片模态框
    function createSlideshowModal() {
        const modal = document.createElement('div');
        modal.id = 'slideshowModal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closeSlideshow);
        
        const slideshowContainer = document.createElement('div');
        slideshowContainer.id = 'slideshowContainer';
        
        const slideshowImage = document.createElement('img');
        slideshowImage.id = 'slideshowImage';
        
        const captionText = document.createElement('div');
        captionText.id = 'slideshowCaption';
        
        const prevBtn = document.createElement('button');
        prevBtn.id = 'slideshowPrev';
        prevBtn.textContent = '‹';
        prevBtn.addEventListener('click', showPrevSlide);
        
        const nextBtn = document.createElement('button');
        nextBtn.id = 'slideshowNext';
        nextBtn.textContent = '›';
        nextBtn.addEventListener('click', showNextSlide);
        
        slideshowContainer.appendChild(prevBtn);
        slideshowContainer.appendChild(slideshowImage);
        slideshowContainer.appendChild(nextBtn);
        slideshowContainer.appendChild(captionText);
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(slideshowContainer);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // 点击模态框背景关闭
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeSlideshow();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', function(event) {
            if (document.getElementById('slideshowModal').style.display === 'block') {
                if (event.key === 'Escape') {
                    closeSlideshow();
                } else if (event.key === 'ArrowLeft') {
                    showPrevSlide();
                } else if (event.key === 'ArrowRight') {
                    showNextSlide();
                }
            }
        });
    }
    
    // 打开幻灯片
    function openSlideshow(index) {
        currentIndex = index;
        updateSlideshow();
        document.getElementById('slideshowModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭幻灯片
    function closeSlideshow() {
        document.getElementById('slideshowModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 显示上一张
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
        updateSlideshow();
    }
    
    // 显示下一张
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % currentPhotos.length;
        updateSlideshow();
    }
    
    // 更新幻灯片内容
    function updateSlideshow() {
        const photo = currentPhotos[currentIndex];
        document.getElementById('slideshowImage').src = photo.src;
        document.getElementById('slideshowImage').alt = photo.alt;
        document.getElementById('slideshowCaption').textContent = photo.caption;
    }
});
