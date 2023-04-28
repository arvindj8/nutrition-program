function addZeroNum(num) {
    let result
    num >= 0 && num < 10 ? result = `0${num}` : result = num

    return result
}


function timer(timerSelector ,deadline) {
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

    setClock(timerSelector, deadline)
}

export default timer
export {addZeroNum}

