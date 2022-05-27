function initSwiper() {
    const swiperStates = ['first', 'second'];
    for (const swiper of document.querySelectorAll('.swiper')) {
        const track = swiper.querySelector('.swiper-track');
        const prevArrow = swiper.querySelector('.swiper-arrow.prev');
        const nextArrow = swiper.querySelector('.swiper-arrow.next');
        const callback = swiper.getAttribute('data-swiper-on-change');
        const onChnage = callback && callback.trim() !== '' && callback in window ? window[callback] : (_) => { };

        const setIndex = (index) => track.setAttribute('data-swiper-index', index);
        const getIndex = () => Number(track.getAttribute('data-swiper-index') || '0');

        const updateArrows = () => {
            const currentIndex = getIndex();
            prevArrow?.classList.remove('disabled');
            nextArrow?.classList.remove('disabled');

            if (currentIndex < 1)
                prevArrow?.classList.add('disabled');

            if (currentIndex > track.childElementCount - 2)
                nextArrow?.classList.add('disabled');
        }
        const updateAlignment = () => {
            const index = getIndex() + 1;
            const totalItems = track.childElementCount;
            if (totalItems <= 5) {
                track.setAttribute('data-swiper-alignment', 'center');
                return;
            }
            if (index <= 2)
                track.setAttribute('data-swiper-alignment', 'end');
            else if (totalItems - index <= 2)
                track.setAttribute('data-swiper-alignment', 'start');
            else
                track.setAttribute('data-swiper-alignment', 'center');
        }

        const moveCarousel = () => {
            const currentIndex = getIndex();
            updateArrows();

            for (let i = currentIndex - 1, stateCounter = 0; i >= 0 && stateCounter < 2; i--, stateCounter++)
                track.children[i].setAttribute('data-swiper-state', swiperStates[stateCounter]);

            for (let i = currentIndex + 1, stateCounter = 0; i < track.children.length && stateCounter < 2; i++, stateCounter++)
                track.children[i].setAttribute('data-swiper-state', swiperStates[stateCounter]);

            track.children[currentIndex].setAttribute('data-swiper-state', 'main');

            if (currentIndex - 3 >= 0)
                track.children[currentIndex - 3].setAttribute('data-swiper-state', '');

            if (currentIndex + 3 <= track.childElementCount - 1)
                track.children[currentIndex + 3].setAttribute('data-swiper-state', '');
            updateAlignment();
            onChnage(currentIndex);
        }
        const moveLeft = (times = 1) => {
            for (i = 0; i < times; i++) {
                if (getIndex() < 1)
                    return;
                setIndex(getIndex() - 1)
                moveCarousel();
            }
        }
        const moveRight = (times = 1) => {
            for (i = 0; i < times; i++) {
                if (getIndex() > track.childElementCount - 2)
                    return;
                setIndex(getIndex() + 1)
                moveCarousel();
            }
        }
        const distanceFromCenter = (wrapper, direction = 'forwards', distance = 1) => {
            const sibling = direction === 'forwards' ? wrapper.nextElementSibling : wrapper.previousElementSibling;
            if (distance >= 3 || sibling === null)
                return -1;
            if (sibling.getAttribute('data-swiper-state') === 'main')
                return distance;
            return distanceFromCenter(sibling, direction, distance + 1);
        }

        // Move on elements click
        for (const wrapper of track.querySelectorAll('.swiper-item-wrapper')) {
            wrapper.addEventListener('click', () => {
                const state = wrapper.getAttribute('data-swiper-state');
                if (state === 'main')
                    return;

                if (distanceFromCenter(wrapper) > 0)
                    moveLeft(distanceFromCenter(wrapper));
                else
                    moveRight(distanceFromCenter(wrapper, 'backwards'));
            });
        }
        moveRight(2);
        prevArrow?.addEventListener('click', () => moveLeft());
        nextArrow?.addEventListener('click', () => moveRight());
        track.classList.add('initialized');
    }
}
window.addEventListener('load', initSwiper);