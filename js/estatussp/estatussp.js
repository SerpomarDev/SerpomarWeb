let currentIndex = 0;

document.getElementById('markGreenBtn').addEventListener('click', function() {
    const events = document.querySelectorAll('.event');
    if (currentIndex < events.length) {
        events[currentIndex].classList.add('completed');
        currentIndex++;
    }
});

document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
        const text = event.querySelector('.details h2').textContent.toLowerCase();
        if (text.includes(filter)) {
            event.style.display = '';
        } else {
            event.style.display = 'none';
        }
    });
});
