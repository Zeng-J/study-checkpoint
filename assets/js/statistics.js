let userInfo = JSON.parse(window.localStorage.getItem("USER_OBJ") || "null");
document.addEventListener('DOMContentLoaded',function(){
    if (!userInfo) {
        location.href = "./login.html";
        return false;
    }
});
$(document).ready(function(){
    getCalendarData();
});

function getCalendarData() {
    const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    getData('sc_calendar_list', {
        where: {
            $and: [
                { 
                    createdAt: { $gte: { __type: Date, iso: moment().startOf('isoWeek').format(TIME_FORMAT) } } 
                }, { 
                    createdAt: { $lte: { __type: Date, iso: moment().endOf('isoWeek').format(TIME_FORMAT) } } 
                }
            ]
        }
    })
    .then(data => {
        dealWithData(data);
    })
    .catch(error => console.error(error))
}

function dealWithData({ results=[] }) {
    const WEEK_DAY = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    let demoObj = {
        week: Array.from({length: 7}),
        finishNumber: 0,
        points: 0,
        avtart: './assets/img/login-background.jpg',
        listRender: '',
    }
    let objMap = {
        '曾大哥': Object.assign(JSON.parse(JSON.stringify(demoObj)), { avtart: './assets/img/zj.jpg' }),
        '彭肉肉': Object.assign(JSON.parse(JSON.stringify(demoObj)), { avtart: './assets/img/prr.jpg', }),
    };
    for (let item of results) {
        // 因为周日是0，把它放到最后
        let index = moment(item.createdAt).day();
        index = index === 0 ? 6 : (index-1);

        objMap[item.userName].week[index] = {
            content: item.content,
            date: item.createdAt,
        }
        ++objMap[item.userName].finishNumber;
    }
    objMap['曾大哥'].points = objMap['曾大哥'].finishNumber;
    objMap['彭肉肉'].points = objMap['彭肉肉'].finishNumber*2;

    Object.keys(objMap).forEach(key => {
        let tempItem = objMap[key];
        tempItem.listRender = `<div class="col-xs-6">
                                <div class="clearfix">
                                    <img src="${tempItem.avtart}" alt="头像" class="u-avatar img-circle pull-right">
                                    <h3>${key}</h3>
                                </div>
                                <ul class="list-group">`;
        tempItem.week.forEach((item, index) => {
            tempItem.listRender += `<li class="list-group-item">
                                        ${WEEK_DAY[index]}
                                        ${item ? '<span class="badge">完成</span>' : ''}
                                    </li>`;
        });
        tempItem.listRender += `</ul>
                                <ul class="list-group">
                                    <li class="list-group-item list-group-item-success">
                                        完成次数：${tempItem.finishNumber}
                                    </li>
                                    <li class="list-group-item list-group-item-info">
                                        获取积分：${tempItem.points}
                                    </li>
                                </ul>
                            </div>`;

        let rowRender = `<div class="row">${objMap['曾大哥'].listRender}${objMap['彭肉肉'].listRender}</div>`;
        
        if (objMap['曾大哥'].points === objMap['彭肉肉'].points) {
            rowRender += `<div class="alert alert-warning" role="alert">看来两个人势均力敌呀</div>`;
        } else if (objMap['曾大哥'].points > objMap['彭肉肉'].points) {
            rowRender += `<div class="alert alert-warning" role="alert">彭肉肉真的弱爆了！</div>`;
        } else if (objMap['曾大哥'].points < objMap['彭肉肉'].points) {
            rowRender += `<div class="alert alert-warning" role="alert">曾大哥要加吧劲了！</div>`;
        }

        $('#m-main').html(rowRender);
    })
}