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

    // Timer

    const deadline = '2023-04-01'

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

    function addZeroDateTime(datetime) {
        let result
        datetime >= 0 && datetime < 10 ? result = `0${datetime}` : result = datetime

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

            days.textContent = addZeroDateTime(t.days)
            hours.innerHTML = addZeroDateTime(t.hours)
            minutes.innerHTML = addZeroDateTime(t.minutes)
            seconds.innerHTML = addZeroDateTime(t.seconds)

            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        }

    }

    setClock('.timer', deadline)

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseAction = modal.querySelector('.modal__close')

    function openModal() {
        modal.classList.toggle('show')
        document.body.style.overflow = 'hidden'
        clearTimeout(modalTimerId)
    }

    function closeModal() {
        modal.classList.toggle('show')
        document.body.style.overflow = ''
    }


    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal)
    })

    modalCloseAction.addEventListener('click', closeModal)

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal()
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal, 3000)


    function openModalScroll() {
        if (window.scrollY + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight - 1) {
            openModal()
            window.removeEventListener('scroll', openModalScroll)
        }
    }

    window.addEventListener('scroll', openModalScroll)


    // Cards

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

    new Card(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню “Фитнес”',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        6,
        '.menu .container'
    ).render()

    new Card(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        7,
        '.menu .container'
    ).render()

    new Card(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        8,
        '.menu .container'
    ).render()

    // Form

    const forms = document.querySelectorAll('form')

    const message = {
        loading: 'Загрузка',
        success: 'Мы скоро свяжемся с вами.',
        failure: 'Что-то пошло не так'
    }

    forms.forEach(form => {
        postData(form)
    })

    function postData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const statusMessage = document.createElement('div')
            statusMessage.classList.add('status')
            statusMessage.textContent = message.loading
            form.append(statusMessage)

            const request = new XMLHttpRequest()

            request.open('POST', 'server.php')
            request.setRequestHeader('Content-type', 'application/json')
            const formData = new FormData(form)

            const obj = {}
            formData.forEach( (key, value) => {
                obj[key] = value
            })

            request.send(JSON.stringify(obj))

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    statusMessage.textContent = message.success
                    form.reset()
                    setTimeout(() => {
                        statusMessage.remove()
                    }, 2000)
                } else {
                    statusMessage.textContent = message.failure
                }
            })
        })
    }
})



