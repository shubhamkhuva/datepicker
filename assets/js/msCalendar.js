// Big Calendar
// atuhor: Marghoob Suleman
// Date: 30th March, 2011
// Version: 1.3;
var msCalendar = function() {
	this.holder = '';
	this.oCurrentDate = new Date();
	this.onDateChangeCallback = ''
	this.onChangeCallback = '';
	this.onInitCallback = '';
	this.onDateCellCallback = ''
	this.onIconCallback = ''
	var tdSelected = '';
	var previousTDSelected = '';
	var idCounter = 20;
	var textBox = '';
	var isCreated = false;
	var createTodayBar = false;
	var calendarType = 'travel';
	var enableUptoDate = '';
	var isMaxDateSetted = false;
	var divLeftHolder = '';
	var divRightHolder = '';
	var marginTop = '31';
	this.args = '';	
	this.prop = new Object();
	var isFirstTime = true;
	
	var restrictDate = null;
	var selectedDate = null;
	
	this.oldCSS = '';
	this.activeTD = null;
	this.activeDate = null;
	this.serverDate = new Date();
	this.enableSort = false; //sort icon
	this.enabledNextPrevious = true;
	this.nextMonthIndication = true;
	this.createMonthTitle = false;
	this.styleCSS = {weekNameTD:'tdWeekName', titleTD:'tdTitle', normalTD:'tdOff', hoverTD:'tdOn', selectedTD:'tdSelected', weekendTD:'tdWeekend', enabledTD:'activeTD', disabledTD:'inActiveTD', fixedTD:'datetd', leftArrowTD:'hand', rightArrowTD:'hand', datetext:'datetext', iconSort:'iconSort'};
	this.showMonthlabel = true;
        var maxRestrictDate = null;
	$this = this;
	this.init = function(h, d, nd, sd, rd , mrd) {
		var oDate = (typeof(d)=="undefined") ? new Date() : d;
		
		var dateToBeSelected = (sd == null || sd == "" || sd == undefined) ? null : sd;
		
		restrictDate = (typeof rd != "undefined" && rd != null && rd != "") ? rd : null;
                if(restrictDate) {
                    restrictDate.setHours(0,0,0,0);
                }
		maxRestrictDate = mrd;
		selectedDate = new Date(d);
			
		var objHolder = h;
		this.createMonth(objHolder, oDate, nd, dateToBeSelected);
		if($this.onInitCallback!='') {
			eval($this.onInitCallback)($this);
		};
	};
	this.getCSS = function(key) {
		return $this.styleCSS[key];
	};
	this.setCalendarType = function(c) {
		calendarType = c;
	}
	this.getCalendarType = function() {
		return calendarType;
	}
	this.createMonth = function(objHolder, d, nd, dateToBeSelected) {
		/***********************************************/
		// Create Month
		/************************************************/
		
		var divHolder = (objHolder==undefined || objHolder==null) ? this.holder : document.getElementById(objHolder);
		this.holder = divHolder;
		this.holder.innerHTML = "";
		
		var divTitle = new Element("DIV");
		var titleTable = createTable();
		titleTable.table.setAttribute("border", "0");
		titleTable.table.className = 'day-container-table';
		titleTable.table.setAttribute("width", "100%");
//		titleTable.table.setAttribute("width", "172");
		var oDate = (typeof(d)=="undefined") ? new Date() : d;
		var currentMonth = oDate.getMonth();
		var currentYear = oDate.getFullYear();
		var currentDate = (nd===undefined) ? 1 : oDate.getDate();//1;
		var column = 1;
		var totalColumn = Calendar.Config.weekdays.length;
		var totalDays = getTotalDays(oDate, nd) //+ Calendar.Config.startDays[oDate.getDay(1)];
		var isFirstRow = true;
		var tempDate = new Date();
		tempDate.setFullYear(oDate.getFullYear(), oDate.getMonth(), currentDate);
		this.oCurrentDate = tempDate;
		var day = tempDate.getDay();
		
		//for return;
		this.prop = new Object();
		this.prop.date = oDate;
		this.prop.tempDate = tempDate;
		this.prop.holder = this.holder;
		
		//Create Month Title
		var cssOff = $this.getCSS("normalTD");
		if(this.createMonthTitle) {
			var row = new Element("TR");
			var monthDiv = createTitleTable(oDate);			
			var td = new Element("td", {colSpan:'7', 'class':cssOff});
			td.appendChild(monthDiv);
			row.appendChild(td);
			titleTable.tBody.appendChild(row);
		};
				
		//Days Bar
		
                /*var row = new Element("TR");
		var daysDiv = createDaysTable();
		var cssTitle = $this.getCSS("titleTD");
		var td = new Element("TD", {colSpan:'7', 'class':cssOff+' '+cssTitle});
		td.appendChild(daysDiv);
		row.appendChild(td);
		titleTable.tBody.appendChild(row);	
*/
		//craete days
		var counter = 0;
                var emptyFirstRowTD = 0;
		while(counter<totalDays) {
			var cnt = idCounter++;			
			if(column==1) {
				var row = new Element("TR");
			}

			var dateSet  = new Date();
			
			dateSet.setFullYear(currentYear, currentMonth, currentDate);
			dateSet.setHours(0,0,0,0);
			var id_str = (dateSet.getFullYear()+"_"+(dateSet.getMonth()+1)+"_"+dateSet.getDate());
			var tdID = 'td_'+id_str;
			var aID = 'a_'+id_str;
			var iconID = 'span_'+id_str;
			var mnth = "";
			if($this.nextMonthIndication) {
				if(currentMonth < dateSet.getMonth() || this.showMonthlabel == true) {
					var monthLabel = getMonthLabel("short");					
					mnth = " " +	monthLabel[dateSet.getMonth()];
					//$this.nextMonthIndication = false; //no need to show again
				};				
			};
			//Creating blank td
			if(day>0 && isFirstRow) {
				isFirstRow = false;
				column = day+1;
				for(var iCount=0;iCount<day;iCount++) {
					var clsName = getClassName(iCount+1, true, dateSet);
					
					var classStr = (typeof clsName.classname['class'] != "undefined" && clsName.classname['class'] != null && clsName.classname['class'] != "") ? clsName.classname['class'] : "";
					classStr += ' clsDateCell';
					clsName.classname['class'] = classStr;
					
					td = new Element("TD", clsName.classname);
					$(td).update("&nbsp;");
					td.date = 0;
					td.isWeekend = clsName.isWeekend;					
					//td.setAttribute('id', tdID);
//					$(td).css({opacity:0.3}).addClass("blank");
					$(td).addClass("disabled");
                                        emptyFirstRowTD++;
					row.appendChild(td);
				}
//                        console.log(isFirstRow , iCount  ,day , row,column , td , emptyNum);
			}
                        if(emptyFirstRowTD < 2){
                            $(this.holder).addClass('adjust-month');
                        }
			//create row
			var clsName = getClassName(column, false, dateSet);
			
			var classStr = (typeof clsName.classname['class'] != "undefined" && clsName.classname['class'] != null && clsName.classname['class'] != "") ? clsName.classname['class'] : "";
			classStr += ' clsDateCell';
			clsName.classname['class'] = classStr;

			//$(clsName.classname).prop('class',$(clsName.classname).prop('class') + ' clsDateCell');
			var monthLabel = getMonthLabel("long");
			clsName.classname.title = getDayLabel(dateSet.getDay()) + ", "+dateSet.getDate()+" "+monthLabel[dateSet.getMonth()]+" "+dateSet.getFullYear();
			td = new Element("TD", clsName.classname);
			
			var a = new Element("A", {'class':$this.getCSS("datetext"), id:aID, href:"javascript:void(0);"});
			$(a).update('<span class="day-num">'+dateSet.getDate()+'</span>');
			td.appendChild(a);
			
			$(td).attr('dateCell', "true");
			
			if(this.enableSort) {
				var iconContentDiv = new Element("div", {'class':'datecontent', id:"holder"+iconID});
				$(iconContentDiv).update("&nbsp;");
				td.appendChild(iconContentDiv);
				
				var iconSpan = new Element("SPAN", {'class':$this.getCSS("iconSort"), id:iconID});
				$(iconSpan).update("<img src='"+Calendar.Config.sortIcon+"' />");
				iconSpan.td = td;
				iconContentDiv.appendChild(iconSpan);
				
				$(iconSpan).bind("click", iconClick);
			}
						
			td.isWeekend = clsName.isWeekend;
			td.date = dateSet;
			td.fn = $this;
			a.date = dateSet;
			a.td = td;
			td.setAttribute('id', tdID);
			
//			$(td).bind('mouseenter', highlight);
//			$(td).bind('mouseleave', restore);
//			$(td).bind('mouseup', restore);			
			setAction(td);
			setAction(a);
			
			row.appendChild(td);
			titleTable.tBody.appendChild(row);
			currentDate++;
			counter++;
			column++;
			if(column>7) {
				column =1;
			}
			var td_id = $(td).attr('id');				
			if(Calendar.Config.holidays[td_id])  {
                            $(a).append('<i class="holiday-ico"></i>');
                            $(a).append('<p class="holiday-desc">'+Calendar.Config.holidays[td_id]+'</p>');
			};
		}

		divTitle.appendChild(titleTable.table);
		divHolder.appendChild(divTitle);
		//this.holder.appendChild(divTitle);
		
		//var tempDate = new Date();
		var tempDate = dateToBeSelected || new Date(serverDate);
		
		setDateSelected(tempDate);	
		
		if(isFirstTime==false) {
			callOnChangeCallback();
		}
		isFirstTime = false;
	};
	var createTable = function(sID, insertInto, sClass) {
		var oTable = new Element("TABLE");
		var oTBody = new Element("TBODY");
		oTable.appendChild(oTBody);
		if(sClass) oTable.className = sClass;
		if(insertInto) insertInto.appendChild(oTable);
		return {table:oTable, tBody:oTBody};
	};	
	var createTitleTable = function(date) {
		var oDate = date; //new Date();
		var monthType = getMonthType();
		var monthLabel = getMonthLabel(monthType);
		var divTitle = new Element("DIV");
		var titleTable = createTable();		
		titleTable.table.setAttribute("width", "100%");
		var tr = new Element("TR");
		var leftID = 'td_img_'+idCounter++;
		var tdLeft = new Element("TD", {width:'2%', align:'left', id:leftID, 'class':'leftArrow monthTitle'});	
		//tdLeft.date = oDate;
		
		//tdLeft.setAttribute('id', leftID);
		var tdMiddle = new Element("TD", {width:'96%', align:'center', id:"month_title", 'class':'monthTitle'})
		$(tdMiddle).update(monthLabel[oDate.getMonth()] + ", " +oDate.getFullYear());
		var rightID = 'td_img_'+idCounter++;
		var tdRight = new Element("TD", {width:'2%', align:'right', id:rightID, 'class':'rightArrow monthTitle'})
		//tdRight.date = oDate;
		//tdRight.setAttribute('id', rightID);
		if($this.enabledNextPrevious === true) {
			$(tdRight).update("<img src='"+Calendar.Config.rightArrow+"' />");	
			$(tdLeft).update("<img src='"+Calendar.Config.leftArrow+"' />");
			tdRight.className = "hand";
			tdLeft.className = "hand";
			$(tdLeft).bind('click', previousMonth);
			$(tdRight).bind('click', nextMonth);
		} else {
			$(tdRight).update("&nbsp;");	
			$(tdLeft).update("&nbsp;");	
		}
		
		tr.appendChild(tdLeft);
		tr.appendChild(tdMiddle);
		tr.appendChild(tdRight);
		titleTable.tBody.appendChild(tr);
		divTitle.appendChild(titleTable.table);
		return divTitle;
		//this.holder.appendChild(divTitle);		
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
		for(var iCount=0;iCount<7;iCount++) {
			var td = new Element("TD", {'class':css});
			$(td).update(charDays[iCount]);
			tr.appendChild(td);
		}
		titleTable.tBody.appendChild(tr);
		divTitle.appendChild(titleTable.table);
		return divTitle;
		//this.holder.appendChild(divTitle);
	};	
	var getMonthType = function() {
		return Calendar.Config.getMonthType();
	};
	var getMonthLabel = function(month) {
		return Calendar.Config.getMonthLabel(month);
	};
	var getDaysLabel = function(days) {
		return Calendar.Config.getDaysLabel(days);
	};	
	var getDaysType = function() {
		return Calendar.Config.getDaysType();
	};	
	var isDateSmaller = function(srcDate, trgtDate) {
		var srouceDate = srcDate;
		var targetDate = trgtDate;		
		var isSmall = (srouceDate<targetDate);
		return isSmall;
	};	
	var setAction = function(td) {	
		$(td).bind('mouseup', sendDate);
	};
	//icon click
	var iconClick = function() {
		var target = this;
		var td = target.td;
		if(td.fn.onIconCallback!='') {
			eval(td.fn.onIconCallback)(td.date, td.fn, td.id);
		};		
	}
//	var highlight = function() {
//		
//		var td = this;
//		
//		if(td.date < restrictDate)
//		{
//			$('#' + td.id + " a").addClass('disabledAnc');
//			return;
//		}
//		
//		$this.oldCSS = td.className;
//		td.className = 'tdOn clsDateCell';
//		$this.activeTD = td;
//		$this.activeDate = td.date;
//		if($this.enableSort) {
//			var cssIcon = $this.getCSS("iconSort");
//			$("#"+td.id + " ."+cssIcon).show();
//		}		
//	};	
	
//	var restore = function() {
//		var td = this;
//		
//		if(td.date < restrictDate)
//		{
//			//$('#' + td.id + " a").removeClass('disabledAnc');
//			return;
//		}
//		
//		var isWeekend = td.isWeekend;
//		td.className = $this.oldCSS;
//		
//		/*if(isWeekend) {
//			td.className = 'tdWeekend clsDateCell';
//		} else {
//			td.className = 'tdOff clsDateCell';
//		}
//		if(tdSelected) {
//			tdSelected.className = $this.getCSS("selectedTD") + ' clsDateCell';
//		}*/
//		
//		$this.activeTD = null;
//		$this.activeDate = null;
//		if($this.enableSort) {
//			var cssIcon = $this.getCSS("iconSort");
//			$("#"+td.id +" ."+cssIcon).hide();
//		}
//										
//	};
	var sendDate = function() {
		
		var target = this;
		var td;
		var callback = '';
		if(String(target.nodeName).toLowerCase() == "a") {
			td = this.td;
			callback = $this.onDateChangeCallback;
		} else {
			td = this;
			callback = $this.onDateCellCallback;
		}
		
		if((restrictDate > td.date) || (maxRestrictDate < td.date))
		{
			return;
		}
		
		var date = td.date;
		var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
//		alert("dateString " + dateString + " $(Calendar.textBox) " + $(Calendar.textBox))
		$(textBox).value = dateString;	
		
		if(tdSelected!='') {			
			var isWeekend = tdSelected.isWeekend;
			if(isWeekend) {				
				tdSelected.className = "tdWeekend"; //$this.getCSS("weekendTD");
			} 
		}
		//tdSelected.className = $this.getCSS("selectedTD"); 		
		tdSelected = td;
		td.className = $this.getCSS("selectedTD") + " " + $this.getCSS("hoverTD");
		
//		$(Calendar.textBox).focus();	
		//alert("previousTDSelected "+previousTDSelected)
		
		if(previousTDSelected) {
			var isWeekend = previousTDSelected.isWeekend;
			if(isWeekend) {				
				previousTDSelected.className = "tdWeekend"; //$this.getCSS("weekendTD");
			}  else {
				previousTDSelected.className = $this.getCSS("normalTD");
			}
		}
		previousTDSelected = tdSelected;
		//alert("Calendar.onDateChangeCallback " + Calendar.onDateChangeCallback);
		
		if(callback!='') {
			eval(callback)(td.date, td.id);
		};				
	};	
	var setDateSelected = function(argDate) {
		//tdSelected
		//$('#'+holder.id+' TD:contains("'+currentDay+'")').addClass('tdSelected');
		var srcDate = new Date(serverDate);
		var targetDate = (typeof(argDate)=="undefined") ? new Date(serverDate) : argDate;
		//targetDate.setDate(15);
		var allTD = $('#'+$this.holder.id+' TD');
		var totalTD = allTD.length;
		var iCount = 0;		
		while(iCount<=totalTD-1) {
			var currentTD = allTD[iCount];
			if(typeof(currentTD.date)!="undefined") {
				
				if(currentTD.date!=0) {
					var year = currentTD.date.getFullYear();
					var month = currentTD.date.getMonth();
					var date = currentTD.date.getDate();
					
					srcDate.setFullYear(year, month, date);
					
					var isTrue = compareDate(srcDate, targetDate);
					if(isTrue && srcDate >= restrictDate) {
						tdSelected = currentTD;
						previousTDSelected = currentTD;
						currentTD.className = $this.getCSS("selectedTD") + " " + $this.getCSS("hoverTD") + " clsDateCell";
					}
					//console.debug("isTrue " + isTrue);
				}
			}			
			iCount++;
		}
	};	
	var compareDate = function(srcDate, trgtDate) {
		var srouceDate = srcDate;
		var targetDate = trgtDate;
		
		if(restrictDate != undefined && restrictDate != null && restrictDate != "")
		{
			if((srouceDate.getDate() == restrictDate.getDate()) && (srouceDate.getMonth() == restrictDate.getMonth()) && (srouceDate.getFullYear() == restrictDate.getFullYear()))
			{
				return false;
			}			
		}

		if((srouceDate.getDate() == targetDate.getDate()) && (srouceDate.getMonth() == targetDate.getMonth()) && (srouceDate.getFullYear() == targetDate.getFullYear())) {
			return true;
		}
		
		return false;
	};	
	var getTotalDays = function(d, nd) {
		var month = d.getMonth();
		var year = d.getFullYear();
		var totalDays;
		if(nd===undefined) {
			var currentMonth = month;
			totalDays = Calendar.Config.monthsTotalDays[currentMonth];
			if(currentMonth==1) { //feb
				var oDate = new Date();
				oDate.setFullYear(year);
				if(isLeapYear(oDate)) {
					totalDays = 29;
				};
			};
		} else {
			var ONE_DAY = 1000 * 60 * 60 * 24;
		    // Convert both dates to milliseconds
		    var date1_ms = d.getTime()
		    var date2_ms = nd.getTime()	    	
    		var difference_ms = Math.abs(date1_ms - date2_ms);
    		totalDays = Math.round(difference_ms/ONE_DAY);			
		}
		return totalDays;
	};
	var isLeapYear = function(date) {
		var year = date.getFullYear();
		if(year%4==0) {
			return true
		}
		return false;
	};
	var getFebruaryDays = function() {
		var sysDate = new Date(); //Should be Server|System Date
		if(isLeapYear(sysDate)) {
			return 29;
		};
		return 28;
	};
	var getClassName = function(day, isBlank, currentDate) {
		
		var tdOptions = new Object();
		var activeTD = (isBlank==true) ? "" : " "+$this.getCSS("enabledTD");
		if($this.getCalendarType()=='travel') {
			//de-activate old drag and drop
			var oDate = $this.getServerDate();
			var isSmaller = isDateSmaller(currentDate, oDate);
			if(isSmaller) {
				activeTD = "";
			}
		}
		
				
		if(day==1 || day==7) {
			
			var applyClass = "";
			if((restrictDate != null && restrictDate != undefined && restrictDate != "" && currentDate < restrictDate) || (maxRestrictDate && currentDate > maxRestrictDate))
			{
				applyClass = $this.getCSS("disabledTD");
				tdOptions.isDisabled =  true;
			}
			else if(selectedDate != null && selectedDate != undefined && selectedDate != "" && currentDate == selectedDate)
			{
				applyClass = $this.getCSS("enabledTD");
				tdOptions.isDisabled =  false;
			}
			else
			{
				applyClass = $this.getCSS("weekendTD")+activeTD;
				tdOptions.isDisabled =  false;
			}
			
			tdOptions.classname = {'class': applyClass};
			tdOptions.isWeekend = true;
		} else {
			var applyClass = "";
			if((restrictDate != null && restrictDate != undefined && restrictDate != "" && currentDate < restrictDate) || (maxRestrictDate && currentDate > maxRestrictDate))
			{
				applyClass = $this.getCSS("disabledTD");
				tdOptions.isDisabled =  true;
			}
			else if(selectedDate != null && selectedDate != undefined && selectedDate != "" && currentDate == selectedDate)
			{
				applyClass = $this.getCSS("enabledTD");
				tdOptions.isDisabled =  false;
			}
			else
			{
				applyClass = $this.getCSS("normalTD")+activeTD;
				tdOptions.isDisabled =  false;
			}
			
			tdOptions.classname = {'class': applyClass};
			tdOptions.isWeekend = false;
		}
		
		return tdOptions;
	};	
	var getCurrentTD = function(d) {
		var targetDate = d;
		var id_str = targetDate.getFullYear()+"_"+(targetDate.getMonth()+1)+"_"+targetDate.getDate();
		return document.getElementById("td_"+id_str) || false;		
	};
	var previousMonth = function() {
		$this.showPreviousMonth();
	};
	var getDayLabel = function(day, type) {
		if(type=="short") {
			Calendar.Config.charWeekdaysShort[day];
		}
		return Calendar.Config.charWeekdaysLong[day];		  
	}
	this.showPreviousMonth = function() {
		var currentDate = new Date();
		currentDate.setFullYear($this.oCurrentDate.getFullYear(), $this.oCurrentDate.getMonth()-1, $this.oCurrentDate.getDate());
		$this.createMonth($this.holder.id, currentDate);
	};
	var nextMonth = function() {
		$this.showNextMonth();
	};	
	
	this.showNextMonth = function() {
		var currentDate = new Date();
		currentDate.setFullYear($this.oCurrentDate.getFullYear(), $this.oCurrentDate.getMonth()+1, $this.oCurrentDate.getDate());
		$this.createMonth($this.holder.id, currentDate);
	};	
	var callOnChangeCallback = function() {
		if($this.onChangeCallback!='') {
			$this.onChangeMonthYear($this.onChangeCallback);
			eval($this.onChangeCallback)($this);
		}		
	};
	this.onChangeMonthYear = function(fn) {
		$this.onChangeCallback = fn;
		//alert("onChangeMonthYear");
	};
	this.onChangeDate = function(fn) {
		$this.onDateChangeCallback = fn;
	};
	this.onDateCellClick = function(fn) {
		$this.onDateCellCallback = fn;
	};
	this.onIconClick = function(fn) {
		$this.onIconCallback = fn;
	};
	this.onInit = function(fn) {
		$this.onInitCallback = fn;
	};
	this.getCurrentDate = function() {
		return this.oCurrentDate;
	};
	this.getProperties = function() {
		return this.prop;
	};
	this.goToMonth = function(d) {
		this.createMonth(null, d);
	};
	this.getActiveTD = function() {
		return $this.activeTD;
	};
	this.getActiveDate = function() {
		return $this.activeDate;
	};
	this.getTDbyDate  = function(d) {
		var oDate = d;
		var currentTD = getCurrentTD(oDate);
		return currentTD;
	};
	this.setServerDate = function(d) {
		this.serverDate = d;
	};
	this.getServerDate = function() {
		return this.serverDate;
	};
	this.getLastDate = function() {
		return $('#'+$this.holder.id+' TD[datecell="true"]:last')[0];
	};
	this.getFirstDate = function() {
		return $('#'+$this.holder.id+' TD[datecell="true"]:first')[0];
	};
	/********************/
	// customization for evetns
	/************************/
	this.addCustomEvent = function(d, e) {
		//working here - working on content td;
		var oDate = d;
		var currentTD = getCurrentTD(oDate);
		var events = e;
		if(currentTD!=false) {
			var tdID = currentTD.id;
			var contentID = tdID+"_content";
			if($("#"+contentID).length==0) {
				var content = new Element("div", {'class':'datecontent', id:contentID});
				currentTD.appendChild(content);	
				$('#'+contentID).addClass('datecontent'); //??
			}
			document.getElementById(contentID).appendChild(events);
			//currentTD.appendChild(events);
		} else {
			if(typeof(console)!="undefined") {
				//console.log("date not found in calendar "+oDate);
			}
		}
	};
	this.addUI = function(d, e) {
		this.addCustomEvent(d, e);
	};
	//added by rahul
	this.bindEventOnCalDatesTd = function(evtType, oDate, method)
	{	
		var currentTD = getCurrentTD(oDate);
		$('#'+currentTD.id).bind(evtType, function(e) {
			method.apply(this, arguments);
		});
	};
	this.setData = function(oDate, data) {
		var currentTD = getCurrentTD(oDate);
		$('#'+currentTD.id).data("customData", data);
	};
	this.getData = function(oDate) {
		var currentTD = getCurrentTD(oDate);
		return $('#'+currentTD.id).data("customData");
	}
	
	this.setConfig = function(obj) {
		for(var i in obj) {
			$this[i] = obj[i];
		}
	}
	
}

//Check if Protype Library is undefined 
// new Element and update method are available in Prototype Library
if(typeof(Prototype)== "undefined") {
		/*
		HTMLElement.prototype.update = function(html){
		  //alert('Hello World from ' + html + " " +this);
		  this.innerHTML = html;
		};	
		*/
		$.fn.update = function(html) {
			return this.each(function() {
									  var element = $(this);
									  $(this).html(html);
									  });
		}	
		var Element = function(ele, attr) {
			var element = document.createElement(ele);
			//add method to element
			if(typeof(attr)!="undefined") {
				for(var i in attr) {
					element.setAttribute(i, attr[i]);
				};
				
				// hack for IE
				//$(element).addClass($(attr).prop('class')); // This line has become unstable for IE in new jquery versions. Worked fine till 1.6
				$(element).addClass(attr['class']);
			};	
			return element;
		};
}
//Element.prototype.update = HTMLElement.prototype.update;
var holidays_cal_json = {"td_2016_1_1":"New Year's Day","td_2016_1_14":"Makar Sankranti","td_2016_1_15":"Pongal","td_2016_1_16":"Guru Govind Singh Jayanti","td_2016_1_26":"Republic Day","td_2016_2_8":"Chinese New Year","td_2016_2_12":"Vasant Panchami","td_2016_2_14":"Valentine's Day","td_2016_2_19":"Shivaji Jayanti","td_2016_2_22":"Guru Ravidas Jayanti","td_2016_3_4":"Maharishi Dayanand Jayanti","td_2016_3_7":"Maha Shivaratri","td_2016_3_23":"Holi","td_2016_3_24":"Dolyatra","td_2016_3_25":"Good Friday","td_2016_3_27":"Easter Day","td_2016_4_8":"Chaitra Sukhladi","td_2016_4_13":"Vaisakhi","td_2016_4_14":"Mesadi/Vaisakhadi","td_2016_4_14":"Ambedkar Jayanti","td_2016_4_15":"Rama Navami","td_2016_4_20":"Mahavir Jayanti","td_2016_4_21":"Hazarat Ali's Birthday","td_2016_4_23":"First day of Passover","td_2016_5_1":"May Day","td_2016_5_8":"Mother's Day","td_2016_5_8":"Birthday of Ravindranath","td_2016_5_21":"Buddha Purnima/Vesak","td_2016_6_19":"Father's Day","td_2016_7_1":"Jamat Ul_Vida","td_2016_7_6":"Rath Yatra","td_2016_7_8":"Ramzan Id/Eid-ul-Fitar","td_2016_8_7":"Friendship Day","td_2016_8_15":"Independence Day","td_2016_8_15":"Thanksgiving Day","td_2016_8_17":"Parsi New Year","td_2016_8_18":"Raksha Bandhan","td_2016_8_25":"Janmashtami","td_2016_9_5":"Ganesh Chaturthi","td_2016_9_12":"Id-ul-Zuha(Bakrid)","td_2016_9_14":"Onam","td_2016_10_2":"Mahatma Gandhi Jayanti","td_2016_10_11":"Dussehra","td_2016_10_12":"Muharram","td_2016_10_16":"Maharishi Valmiki Jayanti","td_2016_10_19":"Karva Chauth","td_2016_10_29":"Naraka Chaturdasi","td_2016_10_30":"Diwali","td_2016_10_31":"Halloween","td_2016_10_31":"Govardhan Puja","td_2016_11_1":"Bhai Duj","td_2016_11_6":"Chhat Puja","td_2016_11_14":"Guru Nanak's Birthday","td_2016_11_24":"Guru Tegh Bahadur's Martyrdom Day","td_2016_12_13":"Milad un_Nabi/Id-e-Milad","td_2016_12_24":"Christmas Eve","td_2016_12_25":"First Day of Hanukkah","td_2016_12_25":"Christmas","td_2016_12_31":"New Year's Eve"};
var Calendar = {};
Calendar.Config = {
	holidays :holidays_cal_json,
	startDays:new Array(7, 6, 5, 4, 3, 2, 1),
	closeIcon: 'http://images.shopping.indiatimes.com/images/ovt/imagesv1/myTravel/icon_close.gif',
	leftArrow: 'images/iconPrev.gif',
	rightArrow:'images/iconNext.gif',
	sortIcon:'images/icon-sort.gif',
	useTravelRules:true,
	charMonthsShort:new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
	charMonthsLong:new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	charWeekdaysVeryShort: new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'),
	charWeekdaysShort: new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
	charWeekdaysLong: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	months:new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11),
	monthsTotalDays: new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
	weekdays:new Array(0, 1, 2, 3, 4, 5, 6),	
	monthType:'Long',
	weekdaysType:'short',
	getMonthLabel: function(month) {
		if(month.toLowerCase()=='long') {
			return this.charMonthsLong;
		} else {
			return this.charMonthsShort;
		}
	},
	getDaysLabel: function(days) {
//		alert(days);
		if(days.toLowerCase()=='long') {
			return this.charWeekdaysLong;
		} 
		if(days.toLowerCase()=='short') {
			return this.charWeekdaysShort;
		} 
		return this.charWeekdaysVeryShort;
	},
	setMonthType: function(monthType) {
		this.monthType = monthType;
	},
	getMonthType: function() {
		return this.monthType;
	},
	setDaysType: function(daysType) {
		this.weekdaysType = daysType;
	},
	getDaysType: function() {
		return this.weekdaysType;
	}

}