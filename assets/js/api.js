const headers = {
    'X-Bmob-Application-Id': '089df87a586aac761a2feb9dbfbb0d7d',
    'X-Bmob-REST-API-Key': '5fcfb2bff65fa11220ba356839008e21',
    'Content-Type': 'application/json;charset=UTF-8',
};

function getData(url, params={}) {
    // Default options are marked with *
    if (Object.keys(params).length) {
        let paramsArr = Object.keys(params).map(key => {
            if (typeof params[key] === 'object') {
                return `${key}=${JSON.stringify(params[key])}`;
            }
            return `${key}=${params[key]}`;
        });

        url += '?' + paramsArr.join('&');
    }

    return fetch("https://api2.bmob.cn/1/classes/" + url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers,
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(response => response.json()) // parses response to JSON
}

function postData(url, body = {}) {
    // Default options are marked with *
    return fetch("https://api2.bmob.cn/1/classes/" + url, {
        body: JSON.stringify(body),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers,
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
        .then(response => response.json()) // parses response to JSON
}