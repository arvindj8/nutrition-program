const postData = async (url, data) => {
    let res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

const getDataCard = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Данные не получены, ошибка ${res.status}`)
    }
    return await res.json()
}

export {postData, getDataCard}