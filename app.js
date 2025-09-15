let currentPage = 'page1';
        let currentMusic = null;
        let birthdayName = 'Sumit'; // Name is now hardcoded
        let isMusicStarted = false;

        function switchPage(pageId) {
            const oldPage = document.getElementById(currentPage);
            const newPage = document.getElementById(pageId);

            if (oldPage) oldPage.classList.add('exiting');
            
            setTimeout(() => {
                if(oldPage) {
                    oldPage.classList.remove('active');
                    oldPage.classList.remove('exiting');
                }
                if (newPage) newPage.classList.add('active');
                currentPage = pageId;
            }, 400);
        }

        function startJourney() {
            // This is the first user interaction, so we can reliably start music here.
            if (!isMusicStarted) {
                changeMusic('music-track-1');
                isMusicStarted = true;
            }
            switchPage('page2');
        }

        function changeMusic(trackId) {
            if (currentMusic) {
                currentMusic.pause();
                currentMusic.currentTime = 0;
            }
            currentMusic = document.getElementById(trackId);
            if (currentMusic) {
                currentMusic.muted = false; // Ensure audio is not muted
                currentMusic.play().catch(error => console.error("Music play was prevented by browser:", error));
            }
        }

        function openLightbox(imageUrl) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = imageUrl;
            lightbox.classList.add('active');
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
        }
        
        // --- Canvas Hearts Animation ---
        let hearts = [];
        let heartsCanvas, heartsCtx;
        let heartsAnimationId;
        function startHeartParticles() {
            heartsCanvas = document.getElementById('hearts-canvas');
            heartsCtx = heartsCanvas.getContext('2d');
            heartsCanvas.width = window.innerWidth;
            heartsCanvas.height = window.innerHeight;
            hearts = [];
            for (let i = 0; i < 30; i++) {
                hearts.push(createHeart());
            }
            if(heartsAnimationId) cancelAnimationFrame(heartsAnimationId);
            animateHearts();
        }

        function createHeart() {
            return {
                x: Math.random() * heartsCanvas.width,
                y: heartsCanvas.height + Math.random() * 100,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.5
            };
        }

        function animateHearts() {
            heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
            hearts.forEach(heart => {
                heart.y -= heart.speed;
                if (heart.y < -heart.size) {
                    Object.assign(heart, createHeart(), {y: heartsCanvas.height + 20});
                }
                drawHeart(heart);
            });
            heartsAnimationId = requestAnimationFrame(animateHearts);
        }
        
        function drawHeart(heart) {
            heartsCtx.fillStyle = `rgba(244, 114, 182, ${heart.opacity})`; // Pink-400
            heartsCtx.beginPath();
            const d = Math.min(heart.size, heart.size);
            const k = heart.x;
            const l = heart.y;
            heartsCtx.moveTo(k, l + d / 4);
            heartsCtx.quadraticCurveTo(k, l, k + d / 4, l);
            heartsCtx.quadraticCurveTo(k + d / 2, l, k + d / 2, l + d / 4);
            heartsCtx.quadraticCurveTo(k + d / 2, l, k + d * 3/4, l);
            heartsCtx.quadraticCurveTo(k + d, l, k + d, l + d / 4);
            heartsCtx.quadraticCurveTo(k + d, l + d / 2, k + d * 3/4, l + d * 3/4);
            heartsCtx.lineTo(k + d / 2, l + d);
            heartsCtx.lineTo(k + d / 4, l + d * 3/4);
            heartsCtx.quadraticCurveTo(k, l + d / 2, k, l + d / 4);
            heartsCtx.fill();
        }
        // --- End Canvas Hearts ---

        async function downloadAsPDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pages = document.querySelectorAll('.page');
            const originalActivePage = currentPage;
            alert("Generating your Memory Book PDF... Please wait.");

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                // Temporarily make page visible for capture
                page.classList.add('active');
                
                await html2canvas(page, { scale: 2 }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    if (i > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                });

                page.classList.remove('active');
            }
            
            // Restore original page view
            document.getElementById(originalActivePage).classList.add('active');
            pdf.save(`${birthdayName}_Birthday_Memory_Book.pdf`);
        }
        
        // --- NEW FALLING HEARTS BACKGROUND SCRIPT ---
        const welcomeCanvas = document.getElementById('confetti-canvas');
        const welcomeCtx = welcomeCanvas.getContext('2d');
        let fallingParticles = [];
        const heartColors = ['#f9a8d4', '#a78bfa', '#f472b6', '#ec4899', '#fb7185'];

        function setupWelcomeCanvas() {
            welcomeCanvas.width = window.innerWidth;
            welcomeCanvas.height = window.innerHeight;
            fallingParticles = [];
            for (let i = 0; i < 50; i++) {
                fallingParticles.push(createFallingParticle());
            }
        }

        function createFallingParticle() {
            return {
                x: Math.random() * welcomeCanvas.width,
                y: Math.random() * welcomeCanvas.height - welcomeCanvas.height,
                size: Math.random() * 15 + 10,
                speed: Math.random() * 2 + 1,
                color: heartColors[Math.floor(Math.random() * heartColors.length)],
                opacity: Math.random() * 0.7 + 0.3
            };
        }
        
        function animateFallingParticles() {
            welcomeCtx.clearRect(0, 0, welcomeCanvas.width, welcomeCanvas.height);
            fallingParticles.forEach((particle, index) => {
                particle.y += particle.speed;
                
                // Draw heart shape
                welcomeCtx.fillStyle = particle.color;
                welcomeCtx.globalAlpha = particle.opacity;
                const d = particle.size;
                const k = particle.x;
                const l = particle.y;
                welcomeCtx.beginPath();
                welcomeCtx.moveTo(k, l + d / 4);
                welcomeCtx.quadraticCurveTo(k, l, k + d / 4, l);
                welcomeCtx.quadraticCurveTo(k + d / 2, l, k + d / 2, l + d / 4);
                welcomeCtx.quadraticCurveTo(k + d / 2, l, k + d * 3/4, l);
                welcomeCtx.quadraticCurveTo(k + d, l, k + d, l + d / 4);
                welcomeCtx.quadraticCurveTo(k + d, l + d / 2, k + d * 3/4, l + d * 3/4);
                welcomeCtx.lineTo(k + d / 2, l + d);
                welcomeCtx.lineTo(k + d / 4, l + d * 3/4);
                welcomeCtx.quadraticCurveTo(k, l + d / 2, k, l + d / 4);
                welcomeCtx.fill();
                welcomeCtx.globalAlpha = 1.0;

                if (particle.y > welcomeCanvas.height) {
                    fallingParticles[index] = createFallingParticle();
                    fallingParticles[index].y = 0 - fallingParticles[index].size;
                }
            });
            requestAnimationFrame(animateFallingParticles);
        }

        window.onload = () => {
            // Set the name on all pages as soon as the app loads
            document.querySelectorAll('.birthday-name').forEach(el => el.textContent = birthdayName);
            document.title = `Happy Birthday, ${birthdayName}!`;
            
            // Start effects for the first page
            setupWelcomeCanvas();
            animateFallingParticles();
        };

        window.onresize = () => {
            if (currentPage === 'page1') {
                setupWelcomeCanvas();
            }
            if(currentPage === 'page5' && heartsCanvas) {
                startHeartParticles(); // Redraw hearts canvas on resize
            }
        }