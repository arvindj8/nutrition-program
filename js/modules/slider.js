import {addZeroNum} from './timer'

function slider({prevArrow, nextArrow, sliderSelector, currSlide, countSlides,oneSlideSelector, sliderWrap, slideField}) {
    const prevSlide = document.querySelector(prevArrow),
        nextSlide = document.querySelector(nextArrow),
        slider = document.querySelector(sliderSelector),
        currentSlide = document.querySelector(currSlide),
        totalSlides = document.querySelector(countSlides),
        slides = document.querySelectorAll(oneSlideSelector),
        sliderWrapper = document.querySelector(sliderWrap),
        slideInner = document.querySelector(slideField),
        slideWidth = window.getComputedStyle(sliderWrapper).width,
        allDots = []

    let currentSlideIndex = 1

    let offset = 0

    slider.style.position = 'relative'

    // add dots to slider
    const dotWrapper = document.createElement('ol')
    dotWrapper.classList.add('carousel-indicators')
    slider.append(dotWrapper)

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li')
        dot.setAttribute('data-slide-to', `${i + 1}`)
        dot.classList.add('dot')
        dotWrapper.append(dot)
        allDots.push(dot)

        if (i === 0) {
            dot.classList.add('dot__active')
        }
    }

    // changes actives dots
    function changeDotsSlide() {
        allDots.forEach(dot => {
            dot.classList.add('dot')
            if (dot.classList.contains('dot__active')) {
                dot.classList.toggle('dot__active')
                allDots[currentSlideIndex - 1].classList.toggle('dot__active')
            }
        })
    }


    // add zero's for num < 10
    function checkCountSlides() {
        if (slides.length < 10) {
            totalSlides.textContent = addZeroNum(slides.length)
            currentSlide.textContent = addZeroNum(currentSlideIndex)
        }
    }

    checkCountSlides()

    // set starting properties for slider
    function setPropertiesSlider() {
        slides.forEach(slide => slide.style.width = slideWidth)

        slideInner.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: 0.5s all;
    `
        sliderWrapper.style.overflow = 'hidden'
    }

    setPropertiesSlider()

    // checking offset slide
    function checkOffset(isNext=true) {
        if (isNext === true) {
            if (offset === +slideWidth.replace(/\D/g, '') * (slides.length - 1)) {
                offset = 0;
            } else {
                offset += +slideWidth.slice(0, slideWidth.length - 2);
            }
        } else {
            if (offset === 0) {
                offset = +slideWidth.replace(/\D/g, '') * (slides.length - 1)
            } else {
                offset -= +slideWidth.replace(/\D/g, '')
            }
        }
    }

    // switching slides to next
    function switchNextSlide() {
        checkOffset()
        slideInner.style.transform = `translateX(-${offset}px)`

        if (currentSlideIndex === slides.length) {
            currentSlideIndex = 1
        } else {
            currentSlideIndex++
        }

        checkCountSlides()
        changeDotsSlide()
    }

    setInterval(switchNextSlide, 4000)

    // switching slides to prev
    function switchPrevSlide() {
        checkOffset(false)
        slideInner.style.transform = `translateX(-${offset}px)`

        if (currentSlideIndex === 1) {
            currentSlideIndex = slides.length
        } else {
            currentSlideIndex--
        }

        checkCountSlides()
        changeDotsSlide()
    }

    // next slide
    nextSlide.addEventListener('click', () => {
        switchNextSlide()
    })

    // prev slide
    prevSlide.addEventListener('click', () => {
        switchPrevSlide()
    })

    // switching slides by dots
    function switchDotSlide() {
        allDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const dotSLideTo = +e.target.getAttribute('data-slide-to')
                currentSlideIndex = dotSLideTo

                offset = +slideWidth.replace(/\D/g, '') * (dotSLideTo - 1)
                slideInner.style.transform = `translateX(-${offset}px)`

                checkCountSlides()
                changeDotsSlide()
            })
        })
    }

    switchDotSlide()
}

export default slider