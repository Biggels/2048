const tile = document.querySelector('.tile');
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            tile.classList.remove('move-r-1');
            break;
        case 'ArrowRight':
            tile.classList.add('move-r-1');
            break;
        default:
            break;
    }
})