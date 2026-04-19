document.addEventListener('DOMContentLoaded', () => {

    function showNotification(message, isError = false) {
        const notif = document.createElement('div');
        notif.className = `notification ${isError ? 'error' : 'success'}`;
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);

        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3000);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.textContent = 'Authenticating...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                showNotification('Login Successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'hostel.html';
                }, 1000);
            }, 800);
        });
    }

    const chips = document.querySelectorAll('.rating-chip');
    const selectedRatingInput = document.getElementById('selectedRating');

    if (chips.length > 0) {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedRatingInput.value = chip.dataset.value;
            });
        });
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!selectedRatingInput.value) {
                showNotification('Please select a rating.', true);
                return;
            }

            const btn = feedbackForm.querySelector('button[type="submit"]');
            btn.textContent = 'Submitting...';
            
            setTimeout(() => {
                showNotification('Feedback submitted successfully!');
                setTimeout(() => {
                    window.location.href = 'hostel.html';
                }, 1200);
            }, 800);
        });
    }

    const searchInput = document.getElementById('roomSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.room-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach((card, index) => {
        card.style.animationDelay = `${0.5 + (index * 0.1)}s`;
    });
});
