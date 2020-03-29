let userInfo = JSON.parse(window.localStorage.getItem("USER_OBJ") || "null");

document.addEventListener('DOMContentLoaded',function(){
    console.log(userInfo);
    if (!userInfo) {
        location.href = "./login.html";
        return false;
    }
});
$(document).ready(function(){
    $('#u-user').html(`<img src="./assets/img${userInfo.avatar}.jpg" alt="头像" class="u-avatar img-circle">
                        <span>${userInfo.name}</span>`);
    getCalendarData();
});

function handleClick(e) {
    let dom = document.getElementById("submit-btn");
    dom.disabled = !e.target.checked;
}
function handleSubmit(e) {
    let dom = document.getElementById("content");
    let content = dom.value.trim() || '';
    e.preventDefault();
    e.target.disabled = true;

    postData('sc_calendar_list', {
        content,
        userName: userInfo.name,
        userId: userInfo.objectId,
    }).then(data => {
        console.log(data);
        $('#m-form').html('<div class="alert alert-success" role="alert">打卡成功</div>');
        getCalendarData();
    }).catch(error => {
        console.log(error)
        e.target.disabled = false;
    })
}

function getCalendarData() {
    const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    getData('sc_calendar_list', {
        where: {
            $and: [
                { 
                    createdAt: { $gte: { __type: Date, iso: moment().startOf('month').format(TIME_FORMAT) } } 
                }, { 
                    createdAt: { $lte: { __type: Date, iso: moment().endOf('month').format(TIME_FORMAT) } } 
                }
            ],
            userId: userInfo.objectId,
        }
    })
    .then(data => {
        $("#calendar").calendar({
            mode: "month",
            data: (data.results || []).map(item => ({ date: item.createdAt.split(' ')[0] })),
            cellClick: function (events) {
                console.log(events)
                //viewCell的事件列表
            },
        });

        // 今日已打卡
        let findObj = (data.results || []).find(item => moment().isSame(item.createdAt.split(' ')[0], 'day'));
        if (findObj) {
            $('#m-form').html('<div class="alert alert-success" role="alert">今日已打卡，棒棒哒！</div>');
        }
    })
    .catch(error => console.error(error))
}