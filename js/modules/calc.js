function calc() {
    const result = document.querySelector('.calculating__result span')
    let gender, height, weight, age, ratio

    // set params in default in calc
    function setOptionsDefault() {
        if (localStorage.getItem('gender') && localStorage.getItem('ratio')) {
            gender = localStorage.getItem('gender')
            ratio = localStorage.getItem('ratio')
        } else {
            gender = 'female'
            localStorage.setItem('gender', gender)

            ratio = 1.375
            localStorage.setItem('ratio', ratio)
        }
    }

    setOptionsDefault()

    // set settings from Local Storage
    function setLocalSettings(parent, activeClass) {
        const elements = document.querySelectorAll(parent)
        elements.forEach(elem => {
            elem.classList.remove(activeClass)

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass)
            }
            if (elem.getAttribute('id') === localStorage.getItem('gender')) {
                elem.classList.add(activeClass)
            }
        })
    }

    setLocalSettings('#gender div', 'calculating__choose-item_active')
    setLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active')


    // main calculator
    function calculateTotalActivity() {
        if (!gender || !height || !weight || !age || !ratio) {
            result.textContent = '________  '
            return
        }

        if (gender === 'male') {
            result.textContent = `${Math.round(88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) * ratio)}`
        } else {
            result.textContent = `${Math.round(447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age) * ratio)}`
        }
    }

    calculateTotalActivity()

    // Record data to LocalStorage
    function getStaticInformation(parent, activeClass) {
        const elements = document.querySelectorAll(parent)

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio')
                    localStorage.setItem('ratio', ratio)
                } else {
                    gender = e.target.getAttribute('id')
                    localStorage.setItem('gender', gender)
                }

                elements.forEach(item => {
                    item.classList.remove(activeClass)

                })

                e.target.classList.add(activeClass)
                calculateTotalActivity()
            })

        })
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active')
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')

    // check input values
    function getInputInformation(selector) {
        const input = document.querySelector(selector)
        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value
                    break

                case 'weight':
                    weight = +input.value
                    break

                case 'age':
                    age = +input.value
                    break
            }
            calculateTotalActivity()
        })
    }

    getInputInformation('#height')
    getInputInformation('#weight')
    getInputInformation('#age')
}

export default calc