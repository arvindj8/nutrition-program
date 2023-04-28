import {getDataCard} from '../services/services'

function cards() {
    class Cards {
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

    getDataCard('http://localhost:3000/menu')
        .then(data => data.forEach(
            ({img, altimg, title, descr, price}) => {
                new Cards(img, altimg, title, descr, price, '.menu .container')
                    .render()
            })
        )
}

export default cards