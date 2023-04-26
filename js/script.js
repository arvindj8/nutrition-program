'use strict'

window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent'),
        tabParent = document.querySelector('.tabheader__items')

    function hideTabContent() {
        tabContent.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show')
        })

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabContent[i].classList.add('show', 'fade')
        tabContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }


    hideTabContent()
    showTabContent()

    tabParent.addEventListener('click', (event) => {
        const target = event.target

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })

    // Timer //

    const deadline = '2023-04-21'

    function getClock(endtime) {
        if (Date.parse(endtime) >= new Date()) {
            const t = Date.parse(endtime) - new Date(),
                days = Math.floor((t / (1000 * 60 * 60 * 24))),
                seconds = Math.floor((t / 1000) % 60),
                minutes = Math.floor((t / 1000 / 60) % 60),
                hours = Math.floor((t / (1000 * 60 * 60) % 24))

            return {t, days, seconds, minutes, hours}

        } else {
            const titleTimer = document.querySelector('.promotion__timer > .title')
            titleTimer.textContent = 'Акция закончилась!'

            return {t: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
        }
    }

    function addZeroNum(num) {
        let result
        num >= 0 && num < 10 ? result = `0${num}` : result = num

        return result
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000)

        updateClock()


        function updateClock() {
            const t = getClock(endtime)

            days.textContent = addZeroNum(t.days)
            hours.innerHTML = addZeroNum(t.hours)
            minutes.innerHTML = addZeroNum(t.minutes)
            seconds.innerHTML = addZeroNum(t.seconds)

            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        }

    }

    setClock('.timer', deadline)

    // Modal //

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')

    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal)
    })

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.toggle('show')
        document.body.style.overflow = ''
    }


    modal.addEventListener('click', (event) => {
        if (event.target === modal ||
            event.target.getAttribute('data-close') === '') {
            closeModal()
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal, 50000)


    function openModalScroll() {
        if (window.scrollY + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight - 1) {
            openModal()
            window.removeEventListener('scroll', openModalScroll)
        }
    }

    window.addEventListener('scroll', openModalScroll)


    // Cards //

    class Card {
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src
            this.alt = alt
            this.title = title
            this.descriprion = description
            this.price = price
            this.classes = classes
            this.parent = document.querySelector(parentSelector)
            this.transfer = 70
            this.changeToRub()
        }

        changeToRub() {
            this.price *= this.transfer
        }

        render() {
            const element = document.createElement('div')

            if (this.classes.length === 0) {
                element.classList.add('menu__item')
            } else {
                this.classes.forEach(className => element.classList.add(className))
            }


            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descriprion}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `
            this.parent.append(element)
        }
    }

    const getDataCard = async (url) => {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Данные не получены, ошибка ${res.status}`)
        }
        return await res.json()
    }

    getDataCard('http://localhost:3000/menu')
        .then(data => data.forEach(
            ({img, altimg, title, descr, price}) => {
            new Card(img, altimg, title, descr, price, '.menu .container')
                .render()
        }))


    // Form //

    const forms = document.querySelectorAll('form')

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Мы скоро свяжемся с вами.',
        failure: 'Что-то пошло не так'
    }

    forms.forEach(form => {
        bindPostData(form)
    })

    const postData = async (url, obj) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: obj
        })
        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const statusMessage = document.createElement('img')
            statusMessage.src = message.loading
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `
            form.insertAdjacentElement("afterend", statusMessage)

            const formData = new FormData(form)

            // преобразуем formData в объект
            const obj = Object.entries(Object.fromEntries(formData))

            postData('http://localhost:3000/requests', JSON.stringify(obj))
            .then(data => {
                console.log(data)
                showThanksModal(message.success)
                statusMessage.remove()
            }).catch(() => {
                showThanksModal(message.failure)
            }).finally(() => {
                form.reset()
            })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide')
        openModal()

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `
        document.querySelector('.modal').append(thanksModal)

        setTimeout(() => {
            thanksModal.remove()
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal()
        }, 4000)
    }

    // Slider //

    const prevSlide = document.querySelector('.offer__slider-prev'),
        nextSlide = document.querySelector('.offer__slider-next'),
        slider = document.querySelector('.offer__slider'),
        currentSlide = document.querySelector('#current'),
        totalSlides = document.querySelector('#total'),
        slides = document.querySelectorAll('.offer__slide'),
        sliderWrapper = document.querySelector('.offer__slider-wrapper'),
        slideInner = document.querySelector('.offer__slider-inner'),
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
        dot.setAttribute('data-slide-to', i + 1)
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
})




