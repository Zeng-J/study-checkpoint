function postData(url) {
    // Default options are marked with *
    return fetch("https://api2.bmob.cn/1/classes/"+url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'X-Bmob-Application-Id': '089df87a586aac761a2feb9dbfbb0d7d',
            'X-Bmob-REST-API-Key': '5fcfb2bff65fa11220ba356839008e21',
            'Content-Type': 'application/json;charset=UTF-8',
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
    .then(response => response.json()) // parses response to JSON
}

window.addEventListener("load", () => {
    postData('sc_user_list')
    .then(data => console.log(data)) // JSON from `response.json()` call
    .catch(error => console.error(error))
})