/* Description: Scrollable Calendar with one year visible, to and from in one field
 * Dependencies: jQuery & msCalendar      
 * Version: 1.0.3
 * Date: 07 Dec 2015
 * */
var msCalendarPG = function() {
    this.holder = "";
    this.oCurrentDate = new Date();
    this.onDateChangeCallback = "";
    this.onChangeCallback = "";
    this.onInitCallback = "";
    this.onDateCellCallback = "";
    this.onIconCallback = "";
    var tdSelected = "";
    var previousTDSelected = "";
    var idCounter = 20;
    var textBox = "";
    var isCreated = false;
    var createTodayBar = false;
    var calendarType = "travel";
    var enableUptoDate = "";
    var isMaxDateSetted = false;
    var divLeftHolder = "";
    var divRightHolder = "";
    var marginTop = "31";
    this.args = "";
    this.prop = new Object();
    var isFirstTime = true;
    var restrictDate = null;
    var selectedDate = null;
    this.oldCSS = "";
    this.activeTD = null;
    this.activeDate = null;
    this.serverDate = new Date();
    this.enableSort = false;
    this.enabledNextPrevious = true;
    this.nextMonthIndication = true;
    this.createMonthTitle = false;
    this.styleCSS = {
        weekNameTD: "tdWeekName",
        titleTD: "tdTitle",
        normalTD: "tdOff",
        hoverTD: "tdOn",
        selectedTD: "tdSelected",
        weekendTD: "tdWeekend",
        enabledTD: "activeTD",
        disabledTD: "inActiveTD",
        fixedTD: "datetd",
        leftArrowTD: "hand",
        rightArrowTD: "hand",
        datetext: "datetext",
        iconSort: "iconSort"
    };
    this.showMonthlabel = true;
    var maxRestrictDate = null;
    $this = this;
    this.init = function(h, d, nd, sd, rd, mrd) {
        var oDate = (typeof(d) == "undefined") ? new Date() : d;
        var dateToBeSelected = (sd == null || sd == "" || sd == undefined) ? null : sd;
        restrictDate = (typeof rd != "undefined" && rd != null && rd != "") ? rd : null;
        if (restrictDate) {
            restrictDate.setHours(0, 0, 0, 0)
        }
        maxRestrictDate = mrd;
        selectedDate = new Date(d);
        var objHolder = h;
        this.createMonth(objHolder, oDate, nd, dateToBeSelected);
        if ($this.onInitCallback != "") {
            eval($this.onInitCallback)($this)
        }
    };
    this.getCSS = function(key) {
        return $this.styleCSS[key]
    };
    this.setCalendarType = function(c) {
        calendarType = c
    };
    this.getCalendarType = function() {
        return calendarType
    };
    this.createMonth = function(objHolder, d, nd, dateToBeSelected) {
        var divHolder = (objHolder == undefined || objHolder == null) ? this.holder : document.getElementById(objHolder);
        this.holder = divHolder;
        this.holder.innerHTML = "";
        var divTitle = new Element("DIV");
        var titleTable = createTable();
        titleTable.table.setAttribute("border", "0");
        titleTable.table.className = "day-container-table";
        titleTable.table.setAttribute("width", "100%");
        var oDate = (typeof(d) == "undefined") ? new Date() : d;
        var currentMonth = oDate.getMonth();
        var currentYear = oDate.getFullYear();
        var currentDate = (nd === undefined) ? 1 : oDate.getDate();
        var column = 1;
        var totalColumn = Calendar.Config.weekdays.length;
        var totalDays = getTotalDays(oDate, nd);
        var isFirstRow = true;
        var tempDate = new Date();
        tempDate.setFullYear(oDate.getFullYear(), oDate.getMonth(), currentDate);
        this.oCurrentDate = tempDate;
        var day = tempDate.getDay();
        this.prop = new Object();
        this.prop.date = oDate;
        this.prop.tempDate = tempDate;
        this.prop.holder = this.holder;
        var cssOff = $this.getCSS("normalTD");
        if (this.createMonthTitle) {
            var row = new Element("TR");
            var monthDiv = createTitleTable(oDate);
            var td = new Element("td", {
                colSpan: "7",
                "class": cssOff
            });
            td.appendChild(monthDiv);
            row.appendChild(td);
            titleTable.tBody.appendChild(row)
        }
        var counter = 0;
        var emptyFirstRowTD = 0;
        while (counter < totalDays) {
            var cnt = idCounter++;
            if (column == 1) {
                var row = new Element("TR")
            }
            var dateSet = new Date();
            dateSet.setFullYear(currentYear, currentMonth, currentDate);
            dateSet.setHours(0, 0, 0, 0);
            var id_str = (dateSet.getFullYear() + "_" + (dateSet.getMonth() + 1) + "_" + dateSet.getDate());
            var tdID = "td_" + id_str;
            var aID = "a_" + id_str;
            var iconID = "span_" + id_str;
            var mnth = "";
            if ($this.nextMonthIndication) {
                if (currentMonth < dateSet.getMonth() || this.showMonthlabel == true) {
                    var monthLabel = getMonthLabel("short");
                    mnth = " " + monthLabel[dateSet.getMonth()]
                }
            }
            if (day > 0 && isFirstRow) {
                isFirstRow = false;
                column = day + 1;
                for (var iCount = 0; iCount < day; iCount++) {
                    var clsName = getClassName(iCount + 1, true, dateSet);
                    var classStr = (typeof clsName.classname["class"] != "undefined" && clsName.classname["class"] != null && clsName.classname["class"] != "") ? clsName.classname["class"] : "";
                    classStr += " clsDateCell";
                    clsName.classname["class"] = classStr;
                    td = new Element("TD", clsName.classname);
                    $(td).update("&nbsp;");
                    td.date = 0;
                    td.isWeekend = clsName.isWeekend;
                    $(td).addClass("disabled");
                    emptyFirstRowTD++;
                    row.appendChild(td)
                }
            }
            if (emptyFirstRowTD < 2) {
                $(this.holder).addClass("adjust-month")
            }
            var clsName = getClassName(column, false, dateSet);
            var classStr = (typeof clsName.classname["class"] != "undefined" && clsName.classname["class"] != null && clsName.classname["class"] != "") ? clsName.classname["class"] : "";
            classStr += " clsDateCell";
            clsName.classname["class"] = classStr;
            var monthLabel = getMonthLabel("long");
            clsName.classname.title = getDayLabel(dateSet.getDay()) + ", " + dateSet.getDate() + " " + monthLabel[dateSet.getMonth()] + " " + dateSet.getFullYear();
            td = new Element("TD", clsName.classname);
            var a = new Element("A", {
                "class": $this.getCSS("datetext"),
                id: aID,
                href: "javascript:void(0);"
            });
            $(a).update('<span class="day-num">' + dateSet.getDate() + "</span>");
            td.appendChild(a);
            $(td).attr("dateCell", "true");
            if (this.enableSort) {
                var iconContentDiv = new Element("div", {
                    "class": "datecontent",
                    id: "holder" + iconID
                });
                $(iconContentDiv).update("&nbsp;");
                td.appendChild(iconContentDiv);
                var iconSpan = new Element("SPAN", {
                    "class": $this.getCSS("iconSort"),
                    id: iconID
                });
                $(iconSpan).update("<img src='" + Calendar.Config.sortIcon + "' />");
                iconSpan.td = td;
                iconContentDiv.appendChild(iconSpan);
                $(iconSpan).bind("click", iconClick)
            }
            td.isWeekend = clsName.isWeekend;
            td.date = dateSet;
            td.fn = $this;
            a.date = dateSet;
            a.td = td;
            td.setAttribute("id", tdID);
            setAction(td);
            setAction(a);
            row.appendChild(td);
            titleTable.tBody.appendChild(row);
            currentDate++;
            counter++;
            column++;
            if (column > 7) {
                column = 1
            }
            var td_id = $(td).attr("id");
            if (Calendar.Config.holidays[td_id]) {
                $(a).append('<i class="holiday-ico"></i>');
                $(a).append('<p class="holiday-desc">' + Calendar.Config.holidays[td_id] + "</p>")
            }
        }
        if ($(row).children().length < totalColumn) {
            var colInRow = emptyFirstRowTD + totalDays;
            var colReq = totalColumn - colInRow;
            for (var iCount = 0; iCount < colReq; iCount++) {
                var clsName = getClassName(iCount + 1, true, dateSet);
                var classStr = (typeof clsName.classname["class"] != "undefined" && clsName.classname["class"] != null && clsName.classname["class"] != "") ? clsName.classname["class"] : "";
                classStr += " clsDateCell";
                clsName.classname["class"] = classStr;
                td = new Element("TD", clsName.classname);
                $(td).update("&nbsp;");
                td.date = 0;
                td.isWeekend = clsName.isWeekend;
                $(td).addClass("disabled");
                emptyFirstRowTD++;
                row.appendChild(td)
            }
        }
        divTitle.appendChild(titleTable.table);
        divHolder.appendChild(divTitle);
        var tempDate = dateToBeSelected || new Date(serverDate);
        setDateSelected(tempDate);
        if (isFirstTime == false) {
            callOnChangeCallback()
        }
        isFirstTime = false
    };
    var createTable = function(sID, insertInto, sClass) {
        var oTable = new Element("TABLE");
        var oTBody = new Element("TBODY");
        oTable.appendChild(oTBody);
        if (sClass) {
            oTable.className = sClass
        }
        if (insertInto) {
            insertInto.appendChild(oTable)
        }
        return {
            table: oTable,
            tBody: oTBody
        }
    };
    var createTitleTable = function(date) {
        var oDate = date;
        var monthType = getMonthType();
        var monthLabel = getMonthLabel(monthType);
        var divTitle = new Element("DIV");
        var titleTable = createTable();
        titleTable.table.setAttribute("width", "100%");
        var tr = new Element("TR");
        var leftID = "td_img_" + idCounter++;
        var tdLeft = new Element("TD", {
            width: "2%",
            align: "left",
            id: leftID,
            "class": "leftArrow monthTitle"
        });
        var tdMiddle = new Element("TD", {
            width: "96%",
            align: "center",
            id: "month_title",
            "class": "monthTitle"
        });
        $(tdMiddle).update(monthLabel[oDate.getMonth()] + ", " + oDate.getFullYear());
        var rightID = "td_img_" + idCounter++;
        var tdRight = new Element("TD", {
            width: "2%",
            align: "right",
            id: rightID,
            "class": "rightArrow monthTitle"
        });
        if ($this.enabledNextPrevious === true) {
            $(tdRight).update("<img src='" + Calendar.Config.rightArrow + "' />");
            $(tdLeft).update("<img src='" + Calendar.Config.leftArrow + "' />");
            tdRight.className = "hand";
            tdLeft.className = "hand";
            $(tdLeft).bind("click", previousMonth);
            $(tdRight).bind("click", nextMonth)
        } else {
            $(tdRight).update("&nbsp;");
            $(tdLeft).update("&nbsp;")
        }
        tr.appendChild(tdLeft);
        tr.appendChild(tdMiddle);
        tr.appendChild(tdRight);
        titleTable.tBody.appendChild(tr);
        divTitle.appendChild(titleTable.table);
        return divTitle
    };
    var createDaysTable = function() {
        var divTitle = new Element("DIV");
        var titleTable = createTable();
        titleTable.table.className = "tableTitle";
        titleTable.table.setAttribute("width", "100%");
        var daysType = getDaysType();
        var charDays = getDaysLabel(daysType);
        var tr = new Element("TR");
        var css = $this.getCSS("daysTD");
        for (var iCount = 0; iCount < 7; iCount++) {
            var td = new Element("TD", {
                "class": css
            });
            $(td).update(charDays[iCount]);
            tr.appendChild(td)
        }
        titleTable.tBody.appendChild(tr);
        divTitle.appendChild(titleTable.table);
        return divTitle
    };
    var getMonthType = function() {
        return Calendar.Config.getMonthType()
    };
    var getMonthLabel = function(month) {
        return Calendar.Config.getMonthLabel(month)
    };
    var getDaysLabel = function(days) {
        return Calendar.Config.getDaysLabel(days)
    };
    var getDaysType = function() {
        return Calendar.Config.getDaysType()
    };
    var isDateSmaller = function(srcDate, trgtDate) {
        var srouceDate = srcDate;
        var targetDate = trgtDate;
        var isSmall = (srouceDate < targetDate);
        return isSmall
    };
    var setAction = function(td) {
        $(td).bind("mouseup", sendDate)
    };
    var iconClick = function() {
        var target = this;
        var td = target.td;
        if (td.fn.onIconCallback != "") {
            eval(td.fn.onIconCallback)(td.date, td.fn, td.id)
        }
    };
    var sendDate = function() {
        var target = this;
        var td;
        var callback = "";
        if (String(target.nodeName).toLowerCase() == "a") {
            td = this.td;
            callback = $this.onDateChangeCallback
        } else {
            td = this;
            callback = $this.onDateCellCallback
        }
        if ((restrictDate > td.date) || (maxRestrictDate < td.date)) {
            return
        }
        var date = td.date;
        var dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        $(textBox).value = dateString;
        if (tdSelected != "") {
            var isWeekend = tdSelected.isWeekend;
            if (isWeekend) {
                tdSelected.className = "tdWeekend"
            }
        }
        tdSelected = td;
        td.className = $this.getCSS("selectedTD") + " " + $this.getCSS("hoverTD");
        if (previousTDSelected) {
            var isWeekend = previousTDSelected.isWeekend;
            if (isWeekend) {
                previousTDSelected.className = "tdWeekend"
            } else {
                previousTDSelected.className = $this.getCSS("normalTD")
            }
        }
        previousTDSelected = tdSelected;
        if (callback != "") {
            eval(callback)(td.date, td.id)
        }
    };
    var setDateSelected = function(argDate) {
        var srcDate = new Date(serverDate);
        var targetDate = (typeof(argDate) == "undefined") ? new Date(serverDate) : argDate;
        var allTD = $("#" + $this.holder.id + " TD");
        var totalTD = allTD.length;
        var iCount = 0;
        while (iCount <= totalTD - 1) {
            var currentTD = allTD[iCount];
            if (typeof(currentTD.date) != "undefined") {
                if (currentTD.date != 0) {
                    var year = currentTD.date.getFullYear();
                    var month = currentTD.date.getMonth();
                    var date = currentTD.date.getDate();
                    srcDate.setFullYear(year, month, date);
                    var isTrue = compareDate(srcDate, targetDate);
                    if (isTrue && srcDate >= restrictDate) {
                        tdSelected = currentTD;
                        previousTDSelected = currentTD;
                        currentTD.className = $this.getCSS("selectedTD") + " " + $this.getCSS("hoverTD") + " clsDateCell"
                    }
                }
            }
            iCount++
        }
    };
    var compareDate = function(srcDate, trgtDate) {
        var srouceDate = srcDate;
        var targetDate = trgtDate;
        if (restrictDate != undefined && restrictDate != null && restrictDate != "") {
            if ((srouceDate.getDate() == restrictDate.getDate()) && (srouceDate.getMonth() == restrictDate.getMonth()) && (srouceDate.getFullYear() == restrictDate.getFullYear())) {
                return false
            }
        }
        if ((srouceDate.getDate() == targetDate.getDate()) && (srouceDate.getMonth() == targetDate.getMonth()) && (srouceDate.getFullYear() == targetDate.getFullYear())) {
            return true
        }
        return false
    };
    var getTotalDays = function(d, nd) {
        var month = d.getMonth();
        var year = d.getFullYear();
        var totalDays;
        var currentMonth = month;
        var totalDays = Calendar.Config.monthsTotalDays[currentMonth];
        if (nd === undefined) {
            var currentMonth = month;
            if (currentMonth == 1) {
                var oDate = new Date();
                oDate.setFullYear(year);
                if (isLeapYear(oDate)) {
                    totalDays = 29
                }
            }
        } else {
            var ONE_DAY = 1000 * 60 * 60 * 24;
            var date1_ms = d.getTime();
            var date2_ms = nd.getTime();
            var difference_ms = Math.abs(date1_ms - date2_ms);
            totalDays -= Math.round(difference_ms / ONE_DAY)
        }
        return totalDays
    };
    var isLeapYear = function(date) {
        var year = date.getFullYear();
        if (year % 4 == 0) {
            return true
        }
        return false
    };
    var getFebruaryDays = function() {
        var sysDate = new Date();
        if (isLeapYear(sysDate)) {
            return 29
        }
        return 28
    };
    var getClassName = function(day, isBlank, currentDate) {
        var tdOptions = new Object();
        var activeTD = (isBlank == true) ? "" : " " + $this.getCSS("enabledTD");
        if ($this.getCalendarType() == "travel") {
            var oDate = $this.getServerDate();
            var isSmaller = isDateSmaller(currentDate, oDate);
            if (isSmaller) {
                activeTD = ""
            }
        }
        if (day == 1 || day == 7) {
            var applyClass = "";
            if ((restrictDate != null && restrictDate != undefined && restrictDate != "" && currentDate < restrictDate) || (maxRestrictDate && currentDate > maxRestrictDate)) {
                applyClass = $this.getCSS("disabledTD");
                tdOptions.isDisabled = true
            } else {
                if (selectedDate != null && selectedDate != undefined && selectedDate != "" && currentDate == selectedDate) {
                    applyClass = $this.getCSS("enabledTD");
                    tdOptions.isDisabled = false
                } else {
                    applyClass = $this.getCSS("weekendTD") + activeTD;
                    tdOptions.isDisabled = false
                }
            }
            tdOptions.classname = {
                "class": applyClass
            };
            tdOptions.isWeekend = true
        } else {
            var applyClass = "";
            if ((restrictDate != null && restrictDate != undefined && restrictDate != "" && currentDate < restrictDate) || (maxRestrictDate && currentDate > maxRestrictDate)) {
                applyClass = $this.getCSS("disabledTD");
                tdOptions.isDisabled = true
            } else {
                if (selectedDate != null && selectedDate != undefined && selectedDate != "" && currentDate == selectedDate) {
                    applyClass = $this.getCSS("enabledTD");
                    tdOptions.isDisabled = false
                } else {
                    applyClass = $this.getCSS("normalTD") + activeTD;
                    tdOptions.isDisabled = false
                }
            }
            tdOptions.classname = {
                "class": applyClass
            };
            tdOptions.isWeekend = false
        }
        return tdOptions
    };
    var getCurrentTD = function(d) {
        var targetDate = d;
        var id_str = targetDate.getFullYear() + "_" + (targetDate.getMonth() + 1) + "_" + targetDate.getDate();
        return document.getElementById("td_" + id_str) || false
    };
    var previousMonth = function() {
        $this.showPreviousMonth()
    };
    var getDayLabel = function(day, type) {
        if (type == "short") {
            Calendar.Config.charWeekdaysShort[day]
        }
        return Calendar.Config.charWeekdaysLong[day]
    };
    this.showPreviousMonth = function() {
        var currentDate = new Date();
        currentDate.setFullYear($this.oCurrentDate.getFullYear(), $this.oCurrentDate.getMonth() - 1, $this.oCurrentDate.getDate());
        $this.createMonth($this.holder.id, currentDate)
    };
    var nextMonth = function() {
        $this.showNextMonth()
    };
    this.showNextMonth = function() {
        var currentDate = new Date();
        currentDate.setFullYear($this.oCurrentDate.getFullYear(), $this.oCurrentDate.getMonth() + 1, $this.oCurrentDate.getDate());
        $this.createMonth($this.holder.id, currentDate)
    };
    var callOnChangeCallback = function() {
        if ($this.onChangeCallback != "") {
            $this.onChangeMonthYear($this.onChangeCallback);
            eval($this.onChangeCallback)($this)
        }
    };
    this.onChangeMonthYear = function(fn) {
        $this.onChangeCallback = fn
    };
    this.onChangeDate = function(fn) {
        $this.onDateChangeCallback = fn
    };
    this.onDateCellClick = function(fn) {
        $this.onDateCellCallback = fn
    };
    this.onIconClick = function(fn) {
        $this.onIconCallback = fn
    };
    this.onInit = function(fn) {
        $this.onInitCallback = fn
    };
    this.getCurrentDate = function() {
        return this.oCurrentDate
    };
    this.getProperties = function() {
        return this.prop
    };
    this.goToMonth = function(d) {
        this.createMonth(null, d)
    };
    this.getActiveTD = function() {
        return $this.activeTD
    };
    this.getActiveDate = function() {
        return $this.activeDate
    };
    this.getTDbyDate = function(d) {
        var oDate = d;
        var currentTD = getCurrentTD(oDate);
        return currentTD
    };
    this.setServerDate = function(d) {
        this.serverDate = d
    };
    this.getServerDate = function() {
        return this.serverDate
    };
    this.getLastDate = function() {
        return $("#" + $this.holder.id + ' TD[datecell="true"]:last')[0]
    };
    this.getFirstDate = function() {
        return $("#" + $this.holder.id + ' TD[datecell="true"]:first')[0]
    };
    this.addCustomEvent = function(d, e) {
        var oDate = d;
        var currentTD = getCurrentTD(oDate);
        var events = e;
        if (currentTD != false) {
            var tdID = currentTD.id;
            var contentID = tdID + "_content";
            if ($("#" + contentID).length == 0) {
                var content = new Element("div", {
                    "class": "datecontent",
                    id: contentID
                });
                currentTD.appendChild(content);
                $("#" + contentID).addClass("datecontent")
            }
            document.getElementById(contentID).appendChild(events)
        } else {
            if (typeof(console) != "undefined") {}
        }
    };
    this.addUI = function(d, e) {
        this.addCustomEvent(d, e)
    };
    this.bindEventOnCalDatesTd = function(evtType, oDate, method) {
        var currentTD = getCurrentTD(oDate);
        $("#" + currentTD.id).bind(evtType, function(e) {
            method.apply(this, arguments)
        })
    };
    this.setData = function(oDate, data) {
        var currentTD = getCurrentTD(oDate);
        $("#" + currentTD.id).data("customData", data)
    };
    this.getData = function(oDate) {
        var currentTD = getCurrentTD(oDate);
        return $("#" + currentTD.id).data("customData")
    };
    this.setConfig = function(obj) {
        for (var i in obj) {
            $this[i] = obj[i]
        }
    }
};
function PegasusCalendar(c) {
    var s = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var A = this;
    this.fromDate = null;
    this.toDate = null;
    this.fromEle = null;
    this.toEle = null;
    this.calType = "date";
    this.toMonth = null;
    this.fromMonth = null;
    this.isCheapest = false;
    this.scrollToprev = 0;
    var d = "PegasusCal-" + PegasusCalendar.prototype.count;
    var C = $.extend({
        minDate: new Date(),
        maxDate: null,
        daysNum: 0,
        departEle: null,
        alwaysOpen: false,
        elementPos: null,
        returnEle: null,
        outputFormat: "dd/mm/yyyy",
        sameDayReturn: {
            allow: true,
            cb: null
        },
        selectTxts: ["Select Departure Date", "Select Return Date"],
        holder: "#" + d,
        headHTML: null,
        stripText: null,
        onOpen: null,
        onPointerChange: null,
        calToggle: false,
    }, c);
    $("body").append($('<div id="' + d + '" >'));
    var b = $(C.departEle);
    var k = $(C.returnEle);
    var v = $(C.holder);
    var p = {
        monthBox: "month-box",
        monthTitle: "month-title",
        dayContainer: "day-container",
        monthContainer: "js-month-container",
        monthSlider: "active-mark",
        dayAnchor: "datetext",
        monthWrapper: "js-viewport",
        monthList: "month-list",
        headEle: "cal-head",
        monthHead: "month-head",
        calViewToggle: "lowest-fare-details",
        monthPicker: "month-picker",
        monthTxt: "month-label",
        activeMonth: "active-month",
        activeMonthHolder: "active-month-holder",
        infoStrip: "info-strip",
        day: {
            from: "depart-daybox",
            mid: "mid-daybox",
            to: "return-daybox"
        }
    };
    var z = "F";
    var m = C.minDate;
    var w = false;
    var t = {
        dateChange: [],
        modeChange: [],
        open: [],
        pointerChange: [],
        monthChange: []
    };
    var j = new msCalendarPG();
    var o = function() {
        r();
        h();
        e();
        E();
        i();
        f();
        D();
        a(C.minDate, true)
    };
    var r = function() {
        var G = C.daysNum;
        if (G) {
            var F = new Date(C.minDate);
            F.setDate(F.getDate() + G);
            C.maxDate = new Date(F)
        }
    };
    this.setDates = function(I) {
        var F = I.from;
        var G = I.to;
        if (F) {
            z = "F";
            $("a." + p.dayAnchor, v).filter("#" + H(F)).click();
            if (G) {
                z = "T";
                $("a." + p.dayAnchor, v).filter("#" + H(G)).click()
            }
        }

        function H(L) {
            if (typeof L == "object") {
                L = [L.getDate(), (L.getMonth() + 1), L.getFullYear()].join("/")
            }
            var J = L.split("/");
            for (var K = 0; K < J.length; K++) {
                J[K] = parseInt(J[K])
            }
            return "a_" + J.reverse().join("_")
        }
    };
    var a = function(F, H) {
        var K = F;
        var G = "";
        var I = "";
        if (H) {
            K = K.getMonth();
            I = String(F.getFullYear());
            I = I.substr(I.length - 2, I.length - 1)
        } else {
            var K = K.split("-")[3];
            K = parseInt(K) - 1;
            I = F.lastIndexOf("-");
            I = F.substring(G + 1);
            I = I.substr(I.length - 2, I.length - 1)
        }
        var J = s[K];
        G = "&nbsp<span>&rsquo;" + I + "</span>";
        if (G) {
            J += G
        }
        $("." + p.activeMonthHolder, v).html(J)
    };
    var g = function(H, K) {
        var P = typeof K != "undefined" ? K : false;
        var M = $('<div class="' + p.monthBox + '" />');
        var R = "";
        var O = String(H.getFullYear());
        O = O.substr(O.length - 2, O.length - 1);
        var G = "<span>&rsquo;" + O + "</span>";
        var L = s[H.getMonth()];
        R = L + " " + G;
        var Q = new Date(C.minDate);
        var N = Q.getMonth();
        var T = "";
        if (H.getMonth() == N && !P) {
            T = "activeMonth";
            var I = new Date(H).setDate(1);
            I = new Date(I)
        }
        var J = $('<div class="' + p.monthTitle + " " + T + '" />').html(R);
        var S = C.holder.slice(1) + "-month-" + (H.getMonth() + 1) + "-" + H.getFullYear();
        $("#" + S).parent().remove();
        var F = $('<div class="' + p.dayContainer + '" id="' + S + '" />').get(0);
        M.append(J, F);
        $("." + p.monthContainer, v).append(M);
        j.init(S, H, I, undefined, C.minDate, C.maxDate)
    };
    var i = function(J) {
        var G = new Date();
        var I = typeof J != "undefined" ? J : false;
        for (var H = 0; H < 12; H++) {
            var F = G.getMonth();
            g(G, I);
            G.setDate(1);
            G.setMonth(F + 1)
        }
    };
    this.setMinDate = function(G, H) {
        var I = typeof H != "undefined" ? H : false;
        if (G) {
            C.minDate = G;
            m = G;
            i(I)
        }
        if (G > A.fromDate) {
            A.resetDates()
        }
        if (A.fromEle) {
            var F = $(A.fromEle).attr("id");
            A.fromEle = $("a." + p.dayAnchor, v).filter("#" + F);
            $("a." + p.dayAnchor, v).filter("#" + F).parent().addClass("depart-daybox")
        }
    };
    this.setMaxDate = function(F) {
        if (F) {
            C.maxDate = F;
            maxDateCache = F;
            i()
        }
        if (F > A.fromDate) {
            A.resetDates()
        }
        if (F == null) {
            C.maxDate = null;
            maxDateCache = null;
            A.resetDates()
        }
    };
    this.resetDates = function() {
        A.fromDate = null;
        A.toDate = null;
        A.fromEle = null;
        A.toEle = null;
        l()
    };
    this.resetCal = function(F) {
        if (F == "month") {
            A.fromDate = null;
            A.toDate = null;
            q()
        } else {
            A.fromMonth = null;
            A.toMonth = null;
            x()
        }
        l(A.getCurrentState())
    };
    var E = function() {
        var G = new Date();
        G.setDate(1);
        for (var I = 0; I < 12; I++) {
            var F = G.getMonth();
            var K = F % 2 == 0 ? "even_li" : "";
            var J = String(G.getFullYear());
            J = J.substr(J.length - 2, J.length - 1);
            var H = "<span>&rsquo;" + J + "</span>";
            $("." + p.monthList, v).append('<li class="month-picker ' + K + '"><a class="month-label" data-date="' + G + '" data-year ="' + G.getFullYear() + '" data-month="' + (F) + '"  href="#' + C.holder.slice(1) + "-month-" + (F + 1) + "-" + G.getFullYear() + '">' + s[F] + "  " + H + "</a></li>");
            G.setMonth(F + 1)
        }
    };
    this.selectDate = function(J, F) {
        var G = J.date;
        if (z == "F") {
            I()
        } else {
            if (z == "T") {
                H()
            }
        }
        b.data({
            fromDate: A.fromDate,
            toDate: A.toDate
        });
        q();
        if (!F) {
            if (z == "T" && A.toDate == null) {} else {
                n()
            }
        }
        u("dateChange", A.getCurrentState());

        function I() {
            A.fromDate = G;
            A.fromEle = J;
            if (A.fromDate > A.toDate) {
                A.toDate = null;
                A.toEle = null
            }
        }

        function H() {
            A.toDate = G;
            A.toEle = J
        }
    };
    this.selectMonth = function(K, G) {
        var H = K.dataset.date;
        var F = K.dataset.cheapest;
        if (typeof H != "undefined" && typeof F == "undefined") {
            J()
        } else {
            I()
        }
        b.data({
            fromMonth: A.fromMonth,
            toMonth: A.toMonth
        });
        x(K);
        if (!G) {
            n()
        }
        u("monthChange", A.getCurrentState());

        function J() {
            A.fromMonth = H;
            A.fromEle = K;
            A.isCheapest = false
        }

        function I() {
            A.fromMonth = H;
            A.fromEle = K;
            A.isCheapest = true
        }
    };
    var B = function() {
        if (z == "F") {
            C.minDate = m
        } else {
            if (z == "T") {
                C.minDate = A.fromDate ? A.fromDate : m
            }
        }
        $("a." + p.dayAnchor, v).each(function() {
            var F = this.date.getTime();
            if (C.sameDayReturn.allow) {
                if (F < C.minDate || (C.maxDate != null && F > C.maxDate)) {
                    $(this).parent().addClass("inActiveTD")
                } else {
                    $(this).parent().removeClass("inActiveTD")
                }
            } else {
                if (z != "F" && F <= C.minDate || (C.maxDate != null && F >= C.maxDate)) {
                    $(this).parent().addClass("inActiveTD")
                } else {
                    $(this).parent().removeClass("inActiveTD")
                }
            }
        })
    };
    this.clearPrices = function() {
        $("a." + p.dayAnchor, v).each(function() {
            $(".price", this).remove()
        })
    };
    this.trigger = function(F) {
        u(F, A.getCurrentState())
    };
    this.dateToStr = function(G, F) {
        return y(G, F)
    };
    this.updatePrices = function(J) {
        var I = J.allFares;
        var G = J.lowestFare;
        $("a." + p.dayAnchor, v).each(function() {
            $(".price", this).remove();
            var M = this.date;
            var L = y(M);
            var K = G[M.getMonth()];
            if (typeof I[L] != "undefined") {
                $(this).append(H(I[L], K))
            }
        });

        function H(M, L) {
            var K = "lowestPrice";
            if (M != L) {
                K = ""
            }
            var N = '<span class="price ' + K + '">' + F(M) + "</span>";
            return N
        }

        function F(K) {
            var M = new RegExp(/(\d)(?=(\d\d\d)+(?!\d))/g);
            if (typeof K != "undefined") {
                var L = K.toString().replace(M, "$1,")
            }
            if (L.length > 6) {
                return L.substring(0, 1) + "," + L.substring(1, L.length)
            } else {
                return K.toString().replace(M, "$1,")
            }
        }
    };
    var y = function(I, H) {
        var F = I.getDate();
        var J = (I.getMonth() + 1);
        var K = I.getFullYear();
        F = F < 10 ? "0" + F : F;
        J = J < 10 ? "0" + J : J;
        if (!H) {
            H = "/"
        }
        var G = (F + H + J + H + K);
        return G
    };
    this.on = function(G, F) {
        if (t[G]) {
            t[G].push(F)
        }
    };
    this.getCurrentState = function() {
        return {
            F: A.fromDate,
            T: A.toDate,
            P: z,
            ele: b,
            holder: v,
            typ: A.calType,
            FM: A.fromMonth,
            TM: A.toMonth,
            CM: A.isCheapest
        }
    };
    var q = function() {
        $("a." + p.dayAnchor, v).parent().removeClass(p.day.from + " " + p.day.mid + " " + p.day.to);
        $(A.fromEle).parent().addClass(p.day.from);
        $(A.toEle).parent().addClass(p.day.to);
        if (A.toDate && A.fromDate) {
            $("a." + p.dayAnchor, v).each(function() {
                var G = this.date.getTime();
                var F = A.fromDate.getTime();
                var H = A.toDate.getTime();
                if (G > F && G < H) {
                    $(this).parent().addClass(p.day.mid)
                }
            })
        }
    };
    var x = function(F) {
        $("a." + p.monthTxt, v).parent().removeClass(p.activeMonth);
        if (F != undefined) {
            $(F, v).parent().addClass(p.activeMonth)
        }
    };
    var u = function(H, F) {
        for (var G = 0; G < t[H].length; G++) {
            t[H][G].call(A, F)
        }
    };
    var f = function() {
        $(v).on("click", "a." + p.monthTxt, function(L) {
            L.preventDefault();
            L.stopPropagation();
            if ($(this).hasClass("disabledMonth")) {} else {
                A.selectMonth(this)
            }
        });
        $("." + p.monthList + " a", v).live("click", function(N, L) {
            N.preventDefault();
            var O = $(this).attr("href");
            var M = $(O).parent().position().top;
            if ($(window).width() < 768) {
                M = L > 0 ? (M + L) : M
            }
            $("." + p.monthWrapper, v).animate({
                scrollTop: M
            }, 200)
        });
        $("." + p.monthWrapper, v).scroll(function() {
            var O = $(this).scrollTop();
            var M = $(this).height();
            var L = $("." + p.monthContainer, v).height();
            var N = O * 100 / (L - 35);
            $("." + p.monthSlider, v).css({
                top: N + "%"
            });
            $("." + p.monthContainer, v).children().children(".day-container").each(function() {
                if ($(this).offset().top <= $(v).offset().top + 100 && $(this).offset().top >= 160) {
                    var P = $(this).attr("id");
                    a(P)
                }
            });
            $("a." + p.dayAnchor, v).each(function() {
                if ($(this).children(".holiday-desc").hasClass("rotate-toast")) {
                    $(this).children(".holiday-desc").removeClass("rotate-toast")
                }
            })
        });
        $("a." + p.dayAnchor, v).live("mouseover", function(N) {
            N.preventDefault();
            var M = $(v).offset().top + 100;
            if ($(this).children(".holiday-desc").offset() && $(this).children(".holiday-desc").offset().top < M) {
                $(this).children(".holiday-desc").addClass("rotate-toast")
            }
            if (A.fromMonth == null) {
                if (A.fromDate != null && A.toDate == null) {
                    var L = A.fromDate.getTime();
                    var O = this.date.getTime();
                    $("a." + p.dayAnchor, v).each(function() {
                        var P = this.date.getTime();
                        if (z != "F" && ((P > L && P < O) || (P < L && P > O))) {
                            $(this).parent().addClass(p.day.mid)
                        } else {
                            $(this).parent().removeClass(p.day.mid)
                        }
                    })
                }
                if (G(this) && !$(this).parent().hasClass("inActiveTD")) {
                    l(J(this))
                } else {
                    l(A.getCurrentState())
                }
            }
        });
        $(".js-month-container", v).mouseleave(function() {
            if (A.fromMonth == null) {
                l(A.getCurrentState());
                q()
            }
        });

        function J(L) {
            var M = {
                F: A.fromDate,
                T: A.toDate
            };
            var N = L.date;
            if (z == "F") {
                M.F = L.date
            } else {
                if (z == "T") {
                    M.T = L.date
                }
            }
            return M
        }

        function G(L) {
            if (C.maxDate) {
                if ((C.minDate <= L.date) && (C.maxDate >= L.date)) {
                    return true
                }
            } else {
                if (C.minDate <= L.date) {
                    return true
                }
            }
            return false
        }
        $(v).on("click", "a." + p.dayAnchor, function(L) {
            L.preventDefault();
            if (G(this) && !$(this).parent().hasClass("inActiveTD")) {
                if (C.alwaysOpen == true) {
                    A.selectDate(this, true)
                } else {
                    A.selectDate(this)
                }
            }
        });
        b.focus(function() {
            I(this)
        });
        k.focus(function() {
            z = "T";
            A.updateHeadMsg(z);
            B();
            H(this);
            F();
            u("open", A.getCurrentState())
        });

        function I(L) {
            z = "F";
            A.updateHeadMsg(z);
            B();
            if (C.alwaysOpen === true && C.elementPos) {
                $(C.elementPos).css("height", $(v).height() + 30);
                K($(C.elementPos))
            } else {
                H(L)
            }
            F();
            u("open", A.getCurrentState())
        }
        if (C.alwaysOpen === true) {
            I()
        }

        function K(L) {
            $(v).css({
                left: ((($(L).width() - v.outerWidth()) / 2) + $(L).scrollLeft() + "px")
            })
        }

        function H(M) {
            var L = $(M).next().hasClass("preventDefault");
            var P = $(M).offset();
            var O = P.top + $(M).outerHeight();
            var N = P.left;
            var R = $(window).width() - v.outerWidth() - N;
            if (R < 0) {
                N = N + R - 5
            }
            var Q = {
                top: O,
                left: N
            };
            if (!w) {
                $(v).css(Q)
            }
            if (!L) {
                $(v).fadeIn(200)
            }
        }
        if (C.alwaysOpen === false) {
            $(document).mouseup(function(M) {
                var L = $(v);
                if (!L.is(M.target) && !b.is(M.target) && !k.is(M.target) && L.has(M.target).length == 0) {
                    n()
                }
            });
            $(document).keyup(function(L) {
                if (L.keyCode == 27) {
                    n()
                }
            })
        }
        $(".calViewMessage a.close-cal", v).live("click", function(L) {
            L.preventDefault();
            A.hideMessage(true)
        });

        function F() {
            var P = C.minDate;
            var Q = 0;
            $("." + p.monthWrapper, v).animate({
                scrollTop: 0
            }, 0);
            if (z == "F") {
                P = A.fromDate ? A.fromDate : P
            } else {
                P = (A.toDate ? A.toDate : this.fromDate ? A.fromDate : P)
            }
            var R = "td_" + P.getFullYear() + "_" + (P.getMonth() + 1) + "_" + P.getDate();
            var M = "a_" + P.getFullYear() + "_" + (P.getMonth() + 1) + "_" + P.getDate();
            var O = $("#" + R).parent().index();
            var S = O * ($("#" + R).height() == 0 ? 50 : $("#" + R).height());
            Q = $("#" + R, v).offset() != null ? $("#" + R, v).offset().top : 0;
            var T = $("#" + M, v).height();
            var N = $(v).offset().top + 60;
            var L = 0;
            if (Q < 0) {
                L = -(Q)
            } else {
                L = Q < N ? Q : Q - N - T
            }
            $("." + p.monthWrapper, v).animate({
                scrollTop: L
            }, 0)
        }
    };
    this.slideMe = function(F) {
        w = F;
        $(v).addClass("slide-helper");
        if (C.returnEle) {
            k.get(0).focus()
        }
    };
    var n = function() {
        if (!$(v).hasClass("slide-helper")) {
            $(v).fadeOut(200);
            b.blur();
            k.blur()
        }
        $(v).removeClass("slide-helper");
        w = false
    };
    this.closeMe = function() {
        n()
    };
    var e = function() {
        var K = $('<div class="cal-head"/>');
        var H = $('<div class="cal-body"/>');
        var N = $('<div class="body-left"/>');
        var I = $('<div class="body-right"/>');
        var O = $('<table class="days-head" />');
        var L = $('<div class="month-head"/>');
        var F = $('<div class="active-month-holder">');
        var M = ('<div class="info-strip" />');
        L.append(F, M);
        var J = $("<tr />");
        J.append("<td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td>");
        O.append(J);
        N.append('<div class="message-strip"><p style="font-weight:500">Get lowest fares across a whole month.</p></div><div class="month-selection-wrapper"><div class="cheapestMonth"><a data-date="Cheapest Month" data-cheapest="true" class="month-label">Cheapest Month</a></div><ul class="month-list"></ul></div>');
        I.append(L, O, '<div class="month-wrapper js-viewport"><div class="js-month-container"></div></div>');
        H.append(N, I);
        var G = $('<div class="calViewMessage"><div class="cal-msg-desc">Message to Show</div><a title="Hide Message" href="#" class="close-cal sprite" /></div>');
        if (typeof C.elementPos != "undefined" && C.elementPos != null) {
            $(C.elementPos).append(v)
        } else {
            $("body").append(v)
        }
        v.html("").append(K, G, H).addClass("pegasus-cal blur_class")
    };
    this.updateHeadMsg = function(G) {
        var H = 0;
        if (G == "T") {
            H = 1
        }
        var I = C.selectTxts[H];
        var F = "";
        if (C.headHTML) {
            F = C.headHTML.call(A, A.getCurrentState());
            if (typeof F != "undefined" && typeof F == "object") {
                $("." + p.headEle, v).html(F)
            } else {
                I += F;
                $("." + p.headEle, v).html(I)
            }
        }
        if (C.stripText) {
            var I = C.stripText;
            $("." + p.infoStrip, v).html(I)
        }
    };
    this.changeView = function(F) {
        if (F && (appProp.xploreEnable == "true" || (typeof(optimizely_exploreNow) != "undefined" && optimizely_exploreNow == 1))) {
            $("." + p.calViewToggle, v).show()
        } else {
            $("." + p.calViewToggle, v).hide()
        }
    };
    this.toogleCalenderType = function(F) {
        if (F == "month") {
            $(".body-left", v).show();
            $(".body-right", v).hide()
        } else {
            $(".body-right", v).show();
            $(".body-left", v).hide()
        }
        A.calType = F
    };
    this.hideMessage = function(F) {
        if (F) {
            $(".calViewMessage", v).slideUp()
        } else {
            $(".calViewMessage", v).hide()
        }
    };
    this.updateMessage = function(G, F) {
        $(".calViewMessage", v).children(".cal-msg-desc").html(G).slideDown();
        if (F) {
            A.hideMessage();
            $(".calViewMessage", v).slideDown()
        }
    };
    this.refresh = function() {
        q();
        l(A.getCurrentState())
    };
    var D = function() {
        A.on("dateChange", function(F) {
            l(F)
        });
        A.on("monthChange", function(F) {
            l(F)
        });
        A.on("toggle", function(F) {
            _resetCalender(F)
        });
        if (typeof C.onOpen == "function") {
            A.on("open", C.onOpen)
        }
        if (typeof C.onPointerChange == "function") {
            A.on("pointerChange", C.onPointerChange)
        }
    };
    var l = function(I) {
        var H = "",
            G = "";
        if (typeof I != "undefined" && typeof I.typ != "undefined" && I.typ != "date") {
            if (I && I.FM && !I.CM) {
                H = J(I.FM)
            }
            if (I && I.TM) {
                G = J(I.TM)
            }
            if (I && I.FM && I.CM) {
                H = K(I.FM)
            }
        } else {
            if (I && I.F) {
                H = F(I.F)
            }
            if (I && I.T) {
                G = F(I.T)
            }
        }
        b.val(H);
        k.val(G);

        function F(L) {
            if (C.outputFormat == "dd/mm/yyyy") {
                return A.dateToStr(L, "/")
            }
            return (L.getDate() + " " + s[L.getMonth()].slice(0, 3) + " " + L.getFullYear())
        }

        function J(L) {
            var M = new Date(L);
            var P = M.getMonth();
            var O = String(M.getFullYear());
            var N = O.substr(O.length - 2, O.length - 1);
            return s[P] + "'" + N
        }

        function K(L) {
            return L
        }
    };
    var h = function() {
        b.val("")
    };
    o();
    b.data("pegasusCal", this);
    PegasusCalendar.prototype.count++
}
PegasusCalendar.prototype.count = 0;