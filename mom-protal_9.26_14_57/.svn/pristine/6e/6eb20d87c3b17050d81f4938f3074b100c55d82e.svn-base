/**
 * 分页组件，支持后端分页
 * Created by mac on 18/2/1.
 * update by Qiyh | 2018-09-23 | 解决一个页面存在多个分页对象数据污染的bug
 */
var Page = function(){
    this.url_ = "";
    this.paramData = null;
    this.renderTableFn = null;
    this.pageSizeArr = [5,10,20,25,30,40,50];
    this.defaultPageSizeIndex = 2;
    this.rowCount = 0;

    /**
     * 调用：new Page().init()进行分页渲染,
     * 如果要调整每页显示大小:Page.defaultPageSizeIndex=?
     * @param url: 分页接口
     * @param data：分页参数
     * @param vari：是否初始化
     * @param renderTableFn：回调函数进行数据渲染
     */
    this.init = function(url,data,vari,renderTableFn){
        this.url_ = url;
        this.paramData = data;
        if(renderTableFn){
            var selPs = parseInt($("#pag-sel option:selected").val());
            this.paramData.page = {
                pageSize: (isNaN(selPs) || selPs<0)?this.pageSizeArr[this.defaultPageSizeIndex]:selPs,
                pageNo: 1
            };
            this.renderTableFn = renderTableFn;

        }
        this.pageCom(data,vari);
    };
    this.reload = function(){
        if(this.paramData){
            this.pageCom(this.paramData,false);
        }
    };
    this.bindEvent = function(){
        $("#pag-sel").unbind('change').change(function(){
            var _ps = parseInt($(this).val());
            this.paramData.page.pageSize = (_ps==-1?this.rowCount:_ps);
            this.pageCom(this.paramData,true);
        });
    };
    this.reset = function(arrParam){
        var len = arrParam.length;
        if(len){
            for(var i = 0;i<len;i++ ){
                if(typeof(this.paramData[arrParam[i]]) == "object"){
                   var obj = this.paramData[arrParam[i]];
                    for(var key in obj){
                        var arr =[]; arr.push(arrParam[i][key]);
                        obj[key] = "";
                    }
                }else{
                    this.paramData[arrParam[i]] = "";
                }
            }
        }

        this.paramData.page.pageSize = $("#pag-sel").val();
        this.pageCom(this.paramData,true);
    };
    this.pageCom = function(data,vari){
        var that = this;
        Api.ajaxJson(this.url_, JSON.stringify(data), function(result){
            if(result.success){
                var page = result.page;
                that.rowCount = page.count;
                var showInfo = "显示第"+(page.startRowNum+1)+"到第"+(page.endRowNum+1)+"条记录，总共 "+(page.count)+"条记录";
                showInfo += "   <span>每页显示</span><select name='' id='pag-sel' class='form-control' style='height:28px;padding:0 4px;display:inline;font-size:12px;'>";
                var pageSizeArr_ = that.pageSizeArr;

                var allSelected=' selected';
                pageSizeArr_.forEach(function(o,i){
                    var selected = o==page.pageSize?' selected':'';
                    showInfo += "<option value='"+o+"' "+selected+">"+o+"</option>";
                    if(selected != ''){
                        allSelected = '';
                    }
                });
                // showInfo += "<option value='"+page.count+"' "+allSelected+">所有</option>";
                showInfo += "<option value='-1' "+allSelected+">所有</option>";
                showInfo += "</select>条记录";
                $(".page-info").empty().html(showInfo);
				//$(".page-info").parents('table').find('input.i-checks').iCheck('uncheck');
                that.bindEvent();
                $('.pagination-detail').show();
                if( that.renderTableFn){
                    that.renderTableFn(page.rows, result);
                }
                // debugger;
                if(vari){
                    that.callBackPagination(page.pageSize,page.pageCount,page.count);
                }
                $('html,body').animate({scrollTop: '0px'}, 300);
            }else{
                Mom.layMsg(result.message);
            }

        })
    };
    this.callBackPagination = function(limit,showCount,totalCount) {
        var that = this;
        $('#pagination').extendPagination({
            totalCount: totalCount,
            showCount: showCount,
            limit: limit,
            callback: function (curr,limit, totalCount) {
                that.paramData.page = {
                    pageSize:limit,
                    pageNo:curr
                };
                that.init(that.url_,that.paramData,false);
            }
        });
    }
};
