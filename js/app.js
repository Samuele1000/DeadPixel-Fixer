document.addEventListener('DOMContentLoaded', () => {
    // --- PIXEL TESTER LOGIC ---
    const startTestBtn = document.getElementById('startTest');
    const colorOverlay = document.getElementById('colorOverlay');

    if (startTestBtn && colorOverlay) {
        const testColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        let currentColorIndex = 0;

        startTestBtn.addEventListener('click', () => {
            colorOverlay.style.display = 'block';
            colorOverlay.style.backgroundColor = testColors[0];
            enterFullScreen(colorOverlay);
            currentColorIndex = 0;
        });

        colorOverlay.addEventListener('click', () => {
            currentColorIndex++;
            if (currentColorIndex >= testColors.length) {
                exitFullScreen();
                colorOverlay.style.display = 'none';
            } else {
                colorOverlay.style.backgroundColor = testColors[currentColorIndex];
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && colorOverlay.style.display === 'block') {
                exitFullScreen();
                colorOverlay.style.display = 'none';
            }
        });
    }

    // --- PIXEL REPAIR LOGIC ---
    const resizableFix = document.getElementById('resizableFix');
    const pixelFlashing = document.getElementById('pixelFlashing');
    const toggleFullScreenFix = document.getElementById('toggleFullScreenFix');
    const fullScreenFix = document.getElementById('fullScreenFix');

    function startFlashing(element) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000', '#ffff00', '#00ffff', '#ff00ff'];

        function flash() {
            if (element.style.display === 'none' && element.id === 'fullScreenFix') return;

            // 70% chance of random color, 30% chance of "noise" effect
            if (Math.random() > 0.3) {
                element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                element.style.backgroundImage = 'none';
            } else {
                element.style.backgroundImage = `repeating-linear-gradient(${Math.random() * 360}deg, #000, #fff 1px, #000 2px)`;
            }
            requestAnimationFrame(flash);
        }
        flash();
    }

    // --- DRAGGABLE LOGIC ---
    if (resizableFix) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        resizableFix.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === resizableFix || e.target === pixelFlashing) {
                isDragging = true;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, resizableFix);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    if (pixelFlashing) {
        startFlashing(pixelFlashing);
    }

    if (toggleFullScreenFix && fullScreenFix) {
        toggleFullScreenFix.addEventListener('click', () => {
            fullScreenFix.style.display = 'block';
            enterFullScreen(fullScreenFix);
            startFlashing(fullScreenFix);
        });

        fullScreenFix.addEventListener('click', () => {
            exitFullScreen();
            fullScreenFix.style.display = 'none';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullScreenFix.style.display === 'block') {
                exitFullScreen();
                fullScreenFix.style.display = 'none';
            }
        });
    }

    // --- REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- MOUSE GLOW EFFECT ---
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    });

    // --- HELPER FUNCTIONS ---
    function enterFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
});
