// 照片墙页面脚本
document.addEventListener('DOMContentLoaded', function() {
    let photoData = null;
    let currentCategory = null;
    let currentPhotos = [];
    let currentIndex = 0;
    
    // 拖动相关变量
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let startTime = 0;
    let startOffset = 0;
    let containerWidth = 0;
    const SWIPE_THRESHOLD = 30;
    const VELOCITY_THRESHOLD = 0.45;

    // 创建幻灯片模态框
    createSlideshowModal();

    // 加载JSON数据
    fetch('data/photos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载照片数据');
            }
            return response.json();
        })
        .then(data => {
            photoData = data;

            // 生成分类导航
            generateCategoryNav(data.categories);

            // 检查URL哈希参数，优先显示哈希指定的分类
            const hash = window.location.hash.substring(1);
            if (hash && data.categories.some(c => c.id === hash)) {
                showCategoryPhotos(hash);
            } else if (data.categories.length > 0) {
                // 默认显示第一个分类的照片
                showCategoryPhotos(data.categories[0].id);
            }
        })
        .catch(error => {
            console.error('加载照片数据失败:', error);
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = '<p>加载照片数据失败，请稍后再试。</p>';
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
                showCategoryPhotos(categoryId);
            });

            li.appendChild(a);
            categoryNav.appendChild(li);
        });
    }

    // 显示分类照片
    function showCategoryPhotos(categoryId) {
        if (!photoData) return;

        // 找到对应的分类
        const category = photoData.categories.find(c => c.id === categoryId);
        if (!category) return;

        // 更新当前分类
        currentCategory = category;
        currentPhotos = category.photos;

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

        // 生成照片列表
        const galleryGrid = document.getElementById('galleryGrid');
        galleryGrid.innerHTML = '';

        category.photos.forEach((photo, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const photoLink = document.createElement('a');
            photoLink.href = '#';
            photoLink.className = 'gallery-item-link';

            // 添加点击事件，打开幻灯片
            photoLink.addEventListener('click', function(e) {
                e.preventDefault();
                openSlideshow(index);
            });

            const photoElement = document.createElement('img');
            photoElement.src = photo.src;
            photoElement.alt = photo.alt;

            const photoInfo = document.createElement('div');
            photoInfo.className = 'gallery-info';

            const photoCaption = document.createElement('p');
            photoCaption.textContent = photo.caption;

            photoInfo.appendChild(photoCaption);

            photoLink.appendChild(photoElement);
            photoLink.appendChild(photoInfo);
            galleryItem.appendChild(photoLink);

            galleryGrid.appendChild(galleryItem);
        });
    }

    // 创建幻灯片模态框
    function createSlideshowModal() {
        // 检查是否已经存在模态框
        if (document.getElementById('slideshowModal')) return;

        const modal = document.createElement('div');
        modal.id = 'slideshowModal';
        modal.className = 'modal';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="slideshowContainer">
                    <img id="slideshowImage" src="" alt="">
                    <div id="slideshowCaption"></div>
                    <div id="slideshowCounter"></div>
                    <div id="slideshowHint">← 拖拽或箭头 →</div>
                    <button id="slideshowPrev">‹</button>
                    <button id="slideshowNext">›</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加事件监听器
        document.getElementById('slideshowModal').addEventListener('click', function(e) {
            if (e.target === this || e.target === document.getElementById('slideshowContainer')) {
                closeSlideshow();
            }
        });

        document.querySelector('#slideshowModal .close').addEventListener('click', closeSlideshow);
        document.getElementById('slideshowPrev').addEventListener('click', showPrevPhoto);
        document.getElementById('slideshowNext').addEventListener('click', showNextPhoto);

        // 鼠标拖动事件
        const slideshowImage = document.getElementById('slideshowImage');
        if (slideshowImage) {
            console.log('Adding drag event listeners to slideshowImage');
            
            // 使用捕获模式确保事件能够被正确触发
            slideshowImage.addEventListener('mousedown', startDrag, { capture: true });
            document.addEventListener('mousemove', drag, { capture: true });
            document.addEventListener('mouseup', endDrag, { capture: true });
            document.addEventListener('mouseleave', endDrag, { capture: true });

            // 触摸事件支持
            slideshowImage.addEventListener('touchstart', startDrag, { capture: true, passive: false });
            document.addEventListener('touchmove', drag, { capture: true, passive: false });
            document.addEventListener('touchend', endDrag, { capture: true });
        } else {
            console.error('slideshowImage not found when adding event listeners');
        }

        // 键盘事件
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSlideshow();
            } else if (e.key === 'ArrowLeft') {
                showPrevPhoto();
            } else if (e.key === 'ArrowRight') {
                showNextPhoto();
            }
        });
    }

    // 开始拖动
    function startDrag(e) {
        if (isDragging) return;
        e.preventDefault();
        
        isDragging = true;
        startTime = Date.now();
        
        // 处理触摸事件
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
        }
        
        const slideshowImage = document.getElementById('slideshowImage');
        if (slideshowImage) {
            slideshowImage.style.cursor = 'grabbing';
            slideshowImage.style.transition = 'none';
        }
    }

    // 拖动中
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        // 处理触摸事件
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX;
        } else {
            currentX = e.clientX;
        }
        
        const deltaX = currentX - startX;
        
        const slideshowImage = document.getElementById('slideshowImage');
        if (slideshowImage) {
            // 直接应用拖动距离，支持循环切换的视觉效果
            slideshowImage.style.transform = `translateX(${deltaX}px)`;
        }
    }

    // 结束拖动
    function endDrag() {
        if (!isDragging) return;
        
        const slideshowImage = document.getElementById('slideshowImage');
        if (slideshowImage) {
            slideshowImage.style.cursor = 'grab';
        }
        
        const deltaX = currentX - startX;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / duration;
        
        // 判断是否切换图片
        if (Math.abs(deltaX) > 50 || velocity > 0.5) {
            if (deltaX > 0) {
                // 向右拖动，显示上一张
                showPrevPhoto();
            } else {
                // 向左拖动，显示下一张
                showNextPhoto();
            }
        } else {
            // 拖动距离不足，回到原位
            if (slideshowImage) {
                slideshowImage.style.transition = 'transform 0.2s ease-out';
                slideshowImage.style.transform = 'translateX(0)';
            }
        }
        
        isDragging = false;
    }

    // 打开幻灯片
    function openSlideshow(index) {
        if (currentPhotos.length === 0) return;

        currentIndex = index;
        updateSlideshow();

        const modal = document.getElementById('slideshowModal');
        const img = document.getElementById('slideshowImage');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // 触发显示动画
        requestAnimationFrame(() => {
            modal.classList.add('show');
            img.classList.add('show');
        });
    }

    // 关闭幻灯片
    function closeSlideshow() {
        const modal = document.getElementById('slideshowModal');
        const img = document.getElementById('slideshowImage');

        modal.classList.remove('show');
        img.classList.remove('show');

        // 等待动画完成后隐藏
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }

    // 显示上一张照片
    function showPrevPhoto() {
        currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
        updateSlideshow(true, 'prev');
    }

    // 显示下一张照片
    function showNextPhoto() {
        currentIndex = (currentIndex + 1) % currentPhotos.length;
        updateSlideshow(true, 'next');
    }

    // 更新幻灯片内容
    function updateSlideshow(animate = false, direction = 'next') {
        const photo = currentPhotos[currentIndex];
        if (!photo) return;

        const img = document.getElementById('slideshowImage');
        const caption = document.getElementById('slideshowCaption');
        const counter = document.getElementById('slideshowCounter');

        if (animate) {
            // 隐藏图片（带方向动画）
            if (direction === 'next') {
                img.style.transform = 'scale(0.9) translateX(-100px)';
            } else {
                img.style.transform = 'scale(0.9) translateX(100px)';
            }
            img.style.opacity = '0';
            img.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            // 等待动画完成后更新内容
            setTimeout(() => {
                img.src = photo.src;
                img.alt = photo.alt;
                caption.textContent = photo.caption;
                counter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;

                // 显示新图片（带方向动画）
                requestAnimationFrame(() => {
                    if (direction === 'next') {
                        img.style.transform = 'scale(0.9) translateX(100px)';
                    } else {
                        img.style.transform = 'scale(0.9) translateX(-100px)';
                    }
                    img.style.opacity = '0';
                    img.style.transition = 'none';

                    // 触发重排
                    img.offsetWidth;

                    img.style.transform = 'scale(1) translateX(0)';
                    img.style.opacity = '1';
                    img.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                });
            }, 300);
        } else {
            // 重置transform属性
            img.style.transform = 'scale(1) translateX(0)';
            img.style.opacity = '1';
            img.src = photo.src;
            img.alt = photo.alt;
            caption.textContent = photo.caption;
            counter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;
        }
    }
});
