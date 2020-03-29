

var Calendar = function (element, options) {

    this.el = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.init();
}
Calendar.prototype = {

    options: {
        mode: "month",
        weekMode: ["一", "二", "三", "四", "五", "六", "日"],
        newDate: new Date(),
        width: null,
        height: null,
        shwoLunar: false,
        showEvent: true,
    },

    init: function () {
        var me = this,
            el = me.el,
            opts = me.options;

        el.addClass("calendar");
        opts.width = el.width();
        opts.height = el.height();

        typeof (opts.newDate) == "string" ? opts.newDate = me._getDateByString(opts.newDate) : "";

        me._createView();

        //绑定事件
        //calendar-cell日期点击事件
        el.on("click", ".calendar-cell", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").removeClass("open");

            var cellDate = $(this).attr("title");

            var viewData = me.viewData;
            var month = parseInt(cellDate.split("年")[1].split("月")[0]) - 1;
            var date = parseInt(cellDate.split("年")[1].split("月")[1].split("日")[0]);


            if (opts.mode == "month" && month == opts.newDate.getMonth()) {
                if (opts.cellClick) opts.cellClick.call(me, viewData[date]);
            }
        })

        //年份下拉
        el.on("click", ".calendar-year-select", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").toggleClass("open");
            //创建下拉数据
            var yearText = opts.newDate.getFullYear();
            var s = '';
            for (var i = 0; i < 21; i++) {
                if (i == 10) {
                    s += '<li class="year-item active">'
                }
                else {
                    s += '<li class="year-item">'
                }
                s += '<span class="year-check">' + (yearText - 10 + i) + '</span>'
                s += '<span >年</span>'
                s += '</li>'
            }
            me.el.find(".dropdown-year").html(s);
        })
        //年份改变
        el.on("click", ".year-item", function (e) {
            e.stopPropagation();
            $(".dropdown-year").removeClass("open");
            var yearText = $(this).text();
            var yearNum = yearText.split("年")[0];
            if (yearNum == opts.newDate.getFullYear()) return;
            opts.newDate.setFullYear(yearNum);
            opts.mode == "month" ? me._refreshCalendar(opts.newDate) : me._refreshYearCalendar(opts.newDate);
            $(".calendar-year-text").text(yearText);


        })
        //触发选择月份
        el.on("click", ".calendar-month-select", function (e) {
            e.stopPropagation();
            $(".dropdown-year").removeClass("open");
            $(".dropdown-month").toggleClass("open");
        })
        //月份check事件
        el.on("click", ".month-item", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            var monthText = $(this).text();
            var monthNum = monthText.split("月")[0];
            if (monthNum == (opts.newDate.getMonth() + 1)) return;

            var beforeDate = opts.newDate.getDate();
            opts.newDate.setMonth(monthNum - 1);
            var afterDate = opts.newDate.getDate();

            //处理日期30号，切换到2月不存在30号
            if (beforeDate != afterDate) {
                opts.newDate.setDate(opts.newDate.getDate() - 1);
            }
            me._refreshCalendar(opts.newDate);
            $(".calendar-month-text").text(monthText);

        })
        $(document.body).on("click", function (e) {
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").removeClass("open");
        })
    },
    //公开方法


    getViewDate: function (viewDate) {
        var me = this,
            opts = me.options,
            mode = opts.mode,
            data = opts.data;
        if (!data || data.length == 0) return [];
        var viewData = {};


        //筛选视图数据并转化未对象
        for (let item of data) {

            var start = me._getDateByString(item.date);

            var year = start.getFullYear();
            var month = start.getMonth() + 1;
            var date = start.getDate();
            var timeKey = `${year}-${month}-${date}`;
            viewData[timeKey] = true;

        }
        console.log(mode, viewData)

        return viewData;

    },
    _getDateByString: function (stringDate) {
        var year = stringDate.split("-")[0];
        var month = parseInt(stringDate.split("-")[1]) - 1;
        var date = stringDate.split("-")[2];

        return new Date(year, month, date);
    },
    //私有方法
    _createView: function () {
        var me = this,
            el = me.el,
            opts = me.options,
            mode = opts.mode,
            newDate = opts.newDate,
            html = '';
        html += me._createToolbar();
        html += '<div class="calendar-body">';
        html += '<table class="calendar-table" cellspacing="0">'
        if (mode == "month") {
            html += me._createHeader();
        }
        html += me._createBody();
        html += '</table>'
        html += '</div>'
        el.html(html);


        if (mode == "month") {
            me._refreshCalendar(newDate);
        }
        // else {
        //     me._refreshYearCalendar(newDate);
        // }

    },
    _createToolbar: function () {
        var me = this,
            newDare = me.options.newDate,
            mode = me.options.mode,
            s = '';

        var year = newDare.getFullYear();
        var month = newDare.getMonth() + 1;

        s += '<div class="calendar-header">'
        s += '<div class="calendar-select calendar-year-select" >'
        s += '<span class="calendar-year-text"> ' + year + '年</span >'
        s += '<span class="calendar-icon"><i class="fa fa-angle-down"></i></span>'
        s += '<ul id="dropdown-year" class="dropdown-year">'
        s += '</ul>'
        s += '</div > '

        if (mode == "month") {

            s += '<div class="calendar-select  calendar-month-select">'
            s += '<span class="calendar-month-text"> ' + month + '月</span >'
            s += '<span class="calendar-icon"><i class="fa fa-angle-down"></i></span>'

            //创建月份下拉(写死)
            s += '<ul class="dropdown-month">'
            for (var i = 1; i <= 12; i++) {
                s += '<li class="month-item">'
                s += '<span class="month-check">' + i + '</span>'
                s += '<span >月</span>'
                s += '</li>'
            }
            s += '</ul>'
            s += '</div > '
        }

        s += '</div >'
        return s;
    },
    _createHeader: function () {
        var me = this,
            opts = me.options,
            weekMode = opts.weekMode;
        var s = '<thead><tr>'
        weekMode.forEach(function (item) {
            s += ' <th class="calendar-column-header" title="周' + item + '"><span class="calendar-column-header-inner">' + item + '</span></th>'
        })
        s += '</thead></tr>'
        return s;
    },
    _createBody: function () {
        var me = this;
        var s = ' <tbody class="calendar-tbody">'
        s += '</tbody>'
        return s;
    },
    _refreshCalendar: function (newDate) {
        var me = this,
            showEvent = me.options.showEvent,
            s = '';

        me.viewData = viewData = me.getViewDate(newDate);

        var _newDate = me._cloneDate(newDate);
        //当前date
        var nowNum = _newDate.getDate();

        //第一天周几
        _newDate.setDate(1);
        var weekDay = _newDate.getDay() == 0 ? 7 : _newDate.getDay();


        //视图第一天
        var viewDate = me._cloneDate(_newDate);
        viewDate.setDate(1 - weekDay + 1); // 当前月份1号的前几天

        renderDate = me._cloneDate(viewDate);


        //固定六行
        for (var i = 0; i < 6; i++) {
            s += '<tr>'
            for (var l = 0; l < 7; l++) {

                var year = renderDate.getFullYear();
                var month = renderDate.getMonth() + 1;
                var date = renderDate.getDate();
                var timeKey = `${year}-${month}-${date}`;

                if (renderDate.getMonth() < newDate.getMonth()) {
                    s += '<td title="' + year + '年' + month + '月' + date + '日" class="calendar-cell calendar-last-month-cell">';
                }
                else if (renderDate.getMonth() > newDate.getMonth()) {
                    s += '<td title="' + year + '年' + month + '月' + date + '日" class="calendar-cell calendar-next-month-cell">';
                }
                else if (date == nowNum) {
                    s += '<td title="' + year + '年' + month + '月' + date + '日" class="calendar-cell calendar-today">';
                }
                else {
                    s += '<td title="' + year + '年' + month + '月' + date + '日" class="calendar-cell">';
                }
                s += '<div class="calendar-date">';
                s += '<div class="calendar-value">' + date + '</div>';
                s += '<div class="calendar-content"><ul class="events">';
                if (showEvent && viewData[timeKey]) {
                    s += '<li><span>✔</span></li>';
                }
                s += '</ul ></div > ';
                s += '</div></td>';

                renderDate.setDate(renderDate.getDate() + 1);

            }
            s += '</tr>'
        }
        me.el.find(".calendar-tbody").html(s);
    },
    _cloneDate: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

}
$.fn.calendar = function (options) {

    var isSTR = typeof options == "string",
        args, ret;

    if (isSTR) {
        args = $.makeArray(arguments)
        args.splice(0, 1);
    }

    var name = "calendar",
        type = Calendar;

    var jq = this.each(function () {
        var ui = $.data(this, name);

        if (!ui) {
            ui = new type(this, options);
            $.data(this, name, ui);
        }
        if (isSTR) {
            ret = ui[options].apply(ui, args);
        }
    });

    return isSTR ? ret : jq;
};