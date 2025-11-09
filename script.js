let diwali = document.getElementById('diwali');
let holi = document.getElementById('holi');
let makarSankranti = document.getElementById('makar-sankranti');
let chhathPuja = document.getElementById('chhath-puja');
let durgaPuja = document.getElementById('durga-puja');
let eidOtherFestivals = document.getElementById('eid-other-festivals');

// Mapping of festival IDs to folder names
const festivalFolderMap = {
    'diwali': 'diwali',
    'holi': 'holi',
    'chhath-puja': 'chhat',
    'durga-puja': 'durga puja',
    'makar-sankranti': 'makar sankranti',
    'eid-other-festivals': 'holi'
};

/**
 * Get all image paths from a festival folder
 * @param {string} folderName - Name of the festival folder
 * @param {number} maxImages - Maximum number of images to check (default: 10)
 * @returns {Array<string>} Array of image paths
 */
function getFestivalImages(folderName, maxImages = 10) {
    if (!folderName) return [];
    
    const images = [];
    // Assuming images are named img1.webp, img2.webp, etc.
    // Based on your folder structure, each festival has 6 images
    for (let i = 1; i <= maxImages; i++) {
        const imagePath = `images/festivals/${folderName}/img${i}.webp`;
        images.push(imagePath);
    }
    return images;
}

/**
 * Set background image for a festival div
 * @param {HTMLElement} festivalElement - The festival div element
 * @param {string} folderName - Name of the festival folder
 * @param {string} mode - 'random' to pick random image, 'first' to use first image, 'cycle' to cycle through images (default: 'random')
 * @param {number} cycleInterval - Interval in milliseconds for cycling images (default: 2000)
 * @param {number} overlayDelay - Delay in milliseconds before overlay starts fading (default: 1500)
 */
function setFestivalBackground(festivalElement, folderName, mode = 'random', cycleInterval = 2000, overlayDelay = 1500) {
    if (!festivalElement || !folderName) return;
    
    // Based on your folder structure, each festival has 6 images (img1.webp through img6.webp)
    const images = getFestivalImages(folderName, 6);
    if (images.length === 0) return;
    
    // Apply background using the images
    applyBackground(festivalElement, images, mode, cycleInterval, overlayDelay);
}

/**
 * Create or update othersImagesHolder for a festival card
 * @param {HTMLElement} element - The festival card element
 * @param {Array<string>} images - Array of image paths
 * @param {string} festivalName - Name of the festival for alt text
 */
function createOthersImagesHolder(element, images, festivalName) {
    if (!element || images.length === 0) return;
    
    // Find or create the content container
    let contentContainer = element.querySelector('.festival-card-content');
    if (!contentContainer) {
        contentContainer = element;
    }
    
    // Check if othersImagesHolder already exists (either in content or directly in element)
    let imagesHolder = contentContainer.querySelector('.othersImagesHolder') || 
                      element.querySelector('.othersImagesHolder');
    
    if (!imagesHolder) {
        // Create new othersImagesHolder
        imagesHolder = document.createElement('div');
        imagesHolder.className = 'othersImagesHolder';
        contentContainer.appendChild(imagesHolder);
    } else {
        // If it exists but is outside content container, move it to content container
        if (!contentContainer.contains(imagesHolder) && imagesHolder.parentNode) {
            imagesHolder.parentNode.removeChild(imagesHolder);
            contentContainer.appendChild(imagesHolder);
        }
        // Clear existing images to update with new ones
        imagesHolder.innerHTML = '';
    }
    
    // Add all images to the holder
    images.forEach((imagePath, index) => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `${festivalName} - Image ${index + 1}`;
        img.loading = 'lazy';
        img.setAttribute('data-handler-attached', 'true');
        
        // Add click handler to set as background
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            element.style.backgroundImage = `url('${imagePath}')`;
            // Add a visual feedback
            img.style.transform = 'scale(0.95)';
            setTimeout(() => {
                img.style.transform = '';
            }, 200);
        });
        
        // Handle image load errors
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
        
        imagesHolder.appendChild(img);
    });
}

/**
 * Apply background image to element with animated overlay
 * @param {HTMLElement} element - The element to style
 * @param {Array<string>} images - Array of valid image paths
 * @param {string} mode - Display mode
 * @param {number} cycleInterval - Cycle interval in milliseconds
 * @param {number} overlayDelay - Delay in milliseconds before overlay starts fading
 */
function applyBackground(element, images, mode, cycleInterval, overlayDelay = 1500) {
    if (images.length === 0) return;
    
    // Get festival name from the h3 element or use a default
    const festivalNameElement = element.querySelector('h3');
    const festivalName = festivalNameElement ? festivalNameElement.textContent.trim() : 'Festival';
    
    // Wrap content in a container for better layering (only if not already wrapped)
    if (!element.querySelector('.festival-card-content')) {
        const content = document.createElement('div');
        content.className = 'festival-card-content';
        
        // Store all child nodes in an array first to avoid issues during iteration
        const children = Array.from(element.childNodes);
        children.forEach(child => {
            // Only move element nodes, not text nodes or comments
            if (child.nodeType === 1 && !child.classList.contains('othersImagesHolder')) {
                content.appendChild(child);
            }
        });
        
        // Only append if we have content
        if (content.children.length > 0) {
            element.appendChild(content);
        }
    }
    
    // Create or update othersImagesHolder
    createOthersImagesHolder(element, images, festivalName);
    
    // Set common background styles with smooth transitions
    const setBackgroundStyle = (imagePath) => {
        // Create a new image element to preload
        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url('${imagePath}')`;
        };
        img.src = imagePath;
        
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.transition = 'background-image 0.8s ease-in-out';
    };
    
    // Set initial background
    switch (mode) {
        case 'random':
            // Pick a random image
            const randomIndex = Math.floor(Math.random() * images.length);
            setBackgroundStyle(images[randomIndex]);
            break;
        case 'first':
            // Use the first image
            setBackgroundStyle(images[0]);
            break;
        case 'cycle':
            // Cycle through images
            let currentIndex = 0;
            setBackgroundStyle(images[0]); // Set initial image
            
            const cycleTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                setBackgroundStyle(images[currentIndex]);
            }, cycleInterval);
            
            // Store timer on element for potential cleanup
            element._cycleTimer = cycleTimer;
            break;
        default:
            setBackgroundStyle(images[0]);
    }
    
    // Ensure overlay starts visible
    element.classList.remove('overlay-fade-out');
    
    // Animate overlay fade-out after a delay
    setTimeout(() => {
        element.classList.add('overlay-fade-out');
    }, overlayDelay);
    
    // Add click handler to create a toggle button
    if (!element.hasAttribute('data-gallery-handler')) {
        element.setAttribute('data-gallery-handler', 'true');
        
        // Check if button already exists (in case of re-initialization)
        let toggleButton = element.querySelector('.festival-images-toggle');
        
        if (!toggleButton) {
            // Create toggle button
            toggleButton = document.createElement('button');
            toggleButton.className = 'festival-images-toggle';
            toggleButton.setAttribute('aria-label', 'Toggle festival images');
            toggleButton.setAttribute('type', 'button');
            toggleButton.innerHTML = '<span class="toggle-text">👆 Click to view images</span>';
            // Append to the element (not content container, so it's positioned relative to card)
            element.appendChild(toggleButton);
        }
        
        // Update button text based on state
        const updateButtonText = () => {
            const toggleText = toggleButton.querySelector('.toggle-text');
            if (toggleText) {
                if (element.classList.contains('show-images')) {
                    toggleText.textContent = '👆 Click to hide images';
                } else {
                    toggleText.textContent = '👆 Click to view images';
                }
            }
        };
        
        // Remove any existing event listeners by cloning and replacing
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
        toggleButton = newToggleButton;
        
        // Handle button click
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            element.classList.toggle('show-images');
            updateButtonText();
        });
        
        // Prevent card click from interfering
        element.addEventListener('click', (e) => {
            // Don't do anything if clicking on the toggle button or images
            if (e.target.closest('.festival-images-toggle') || 
                e.target.closest('.othersImagesHolder')) {
                return;
            }
        }, true); // Use capture phase to handle before other handlers
    }
}

/**
 * Set background for a specific festival by festival ID
 * @param {string} festivalId - The ID of the festival div (e.g., 'diwali', 'holi')
 * @param {string} mode - 'random', 'first', or 'cycle' (default: 'random')
 * @param {number} cycleInterval - Interval in milliseconds for cycling images (default: 3000)
 */
function festivalBackground(festivalId, mode = 'random', cycleInterval = 3000) {
    const folderName = festivalFolderMap[festivalId];
    const festivalElement = document.getElementById(festivalId);
    
    if (festivalElement && folderName) {
        setFestivalBackground(festivalElement, folderName, mode, cycleInterval);
    } else {
        console.warn(`Festival "${festivalId}" not found or has no folder mapped.`);
    }
}

/**
 * Initialize all festival backgrounds
 * @param {string} mode - 'random', 'first', or 'cycle' (default: 'random')
 * @param {number} overlayDelay - Delay before overlay fades out in milliseconds (default: 1500)
 */
function initializeFestivalBackgrounds(mode = 'random', overlayDelay = 1500) {
    // Set background for each festival that has a folder
    Object.keys(festivalFolderMap).forEach((festivalId, index) => {
        const folderName = festivalFolderMap[festivalId];
        const festivalElement = document.getElementById(festivalId);
        
        if (festivalElement && folderName) {
            // Stagger the overlay fade-out for a more polished effect
            const delay = overlayDelay + (index * 200); // 200ms stagger between cards
            setFestivalBackground(festivalElement, folderName, mode, 2000, delay);
        }
    });
}

// Initialize all festival backgrounds when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeFestivalBackgrounds('random'); // Change to 'cycle' for slideshow effect
});
