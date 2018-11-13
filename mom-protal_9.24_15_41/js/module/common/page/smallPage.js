//分页插件
var SmallPage = (function(){
	var dataList,pageNo,pageSize,pageCount,pageRender,container;

	//初始化
	var init = function(pageCfg, pageRender_){
		SmallPage.pageNo = pageCfg.pageNo || 1;
		SmallPage.pageSize = pageCfg.pageSize || 10;
		SmallPage.dataList = pageCfg.dataList || [];
        SmallPage.pageCount = parseInt(SmallPage.dataList.length/SmallPage.pageSize);
        if(SmallPage.dataList.length % SmallPage.pageSize!=0){
            SmallPage.pageCount++;
        }
        SmallPage.container = pageCfg.container;
		if(SmallPage.container){
			var exist = $(SmallPage.container).find('.small-page').length;
			if(exist==0){
				var html = "<a class='firstP' href='javascript:SmallPage.first();'>首页</a>";
				html += "<a  class='preP' href='javascript:SmallPage.pre();'>上页</a>";
				html += "<a class='nextP' href='javascript:SmallPage.next();'>下页</a>";
				html += "<a class='lastP' href='javascript:SmallPage.last();'>末页</a>";
				$(SmallPage.container).append("<div class='small-page'>"+html+"</div>");
			}
		}
		if(pageRender_){
			SmallPage.pageRender = pageRender_;
			SmallPage.first();
		}
	}
	
	//首页
	var first = function(){
		if($(SmallPage.container).find('.firstP').hasClass('disabled')){
			return;
		}
		if(SmallPage.dataList || SmallPage.dataList.length>0){
			if(SmallPage.pageRender){
				SmallPage.pageNo = 1;
                SmallPage.pageRender(getPageRows());
			}
		}
        setPageDisabled();
	}
	//末页
	var last = function(){
        if($(SmallPage.container).find('.lastP').hasClass('disabled')){
            return;
        }
		if(SmallPage.dataList || SmallPage.dataList.length>0){
			if(SmallPage.pageRender){
				SmallPage.pageNo = SmallPage.pageCount;
                SmallPage.pageRender(getPageRows());
			}
		}
        setPageDisabled();
	}
	//上一页
	var pre = function(){
        if( $(SmallPage.container).find('.preP').hasClass('disabled')){
            return;
        }
		if(SmallPage.dataList || SmallPage.dataList.length>0){
			if(SmallPage.pageRender){
				SmallPage.pageNo --;
                SmallPage.pageRender(getPageRows());
			}
		}
        setPageDisabled();
	};
	//下一页
	var next = function(){
        if( $(SmallPage.container).find('.nextP').hasClass('disabled')){
            return;
        }
		if(SmallPage.dataList || SmallPage.dataList.length>0){
			if(SmallPage.pageRender){
				if(SmallPage.pageNo < SmallPage.pageCount){
                    SmallPage.pageNo ++;
                    SmallPage.pageRender(getPageRows());
				}else{
                    SmallPage.pageNo = SmallPage.pageCount;
				}
			}
		}
        setPageDisabled();
	};

	var getPageRows = function(){
        if(SmallPage.pageNo<1){
            SmallPage.pageNo = 1;
        }
        //获取开始索引
        var startIdx = (SmallPage.pageNo-1)*SmallPage.pageSize;
        if(startIdx < 0){
            startIdx = 0;
        }
        if(startIdx >= SmallPage.dataList.length){
            startIdx = SmallPage.dataList.length-1;
        }
		//获取结束索引
        var endIdx = startIdx+SmallPage.pageSize-1;
        if(endIdx >= SmallPage.dataList.length){
            endIdx = SmallPage.dataList.length-1;
        }
		var pageRows_ = [];
        for(var j=startIdx; j<=endIdx; j++){
            pageRows_.push(SmallPage.dataList[j]);
        }
        return pageRows_;
	}

    var setPageDisabled = function(){
        if(SmallPage.pageNo <= 1){
            $(SmallPage.container).find('.firstP,.preP').addClass("disabled");
        }else{
            $(SmallPage.container).find('.firstP,.preP').removeClass("disabled");
        }
        if(SmallPage.pageNo >= SmallPage.pageCount){
            $(SmallPage.container).find('.nextP,.lastP').addClass("disabled");
        }else{
            $(SmallPage.container).find('.nextP,.lastP').removeClass("disabled");
        }
        $(SmallPage.container).find('.firstP').attr('title','首页 当前:'+SmallPage.pageNo);
        $(SmallPage.container).find('.preP').attr('title','上页 当前:'+SmallPage.pageNo);
        $(SmallPage.container).find('.nextP').attr('title','下页 当前:'+SmallPage.pageNo);
        $(SmallPage.container).find('.lastP').attr('title','末页 当前:'+SmallPage.pageNo);
    }

	return {
		init: init,
		first: first,
		last: last,
		pre: pre,
		next: next
	};
})();