require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            var userId = Mom.getCookie("loginUserid");
            //获取班次数据
            loadShift();
            //获取班组数据
            Bus.createSelect(Api.aps+'/api/aps/Groups/list',$('#team'),'id','name');
            //获取工序数据
            Bus.createSelect(Api.admin+'/api/sys/SysAuthProperty/getAttributeValue/'+userId+'/GXJQ/syswp',$('#process'),'value','name');
            //Page插件
            require(['Page'],function(){
                window.pageLoad = function () {
                    var data = {
                        process:$("#process").val()==""?"":$("#process option:selected").text(),//工序
                        groupName:$("#team").val()==""?"":$("#team option:selected").text(), //班组
                        shift:{                                        //班次
                            id:$("#time").val()==""?"":$("#time option:selected").val()
                        },
                        startOverDate:$("#startDateParam").val(),   //开始时间
                        endOverDate:$("#endDateParam").val(),//结束时间
                        bigKind:"CZ"
                    };
                    new Page().init(Api.aps+"/api/ctrl/ShiftMain/page",data,true,function (tableDta, result) {
                        createTable(tableDta, result);
                    })
                };
                pageLoad();
            });
            require(['datetimepicker'], function () {
                //时间选择插件(获取年月日日期)
                $("#startDateParam").datetimepicker({
                    bootcssVer: 3,
                    format: "yyyy-mm-dd",   //保留到日
                    language:'zh-CN',          //中文显示
                    minView: "month",      //月视图
                    todayBtn: true,       //切换到今天
                    clearBtn: true,       //清除全部
                    autoclose:true  //选择时间后自动隐藏
                });
                $("#endDateParam").datetimepicker({
                    bootcssVer: 3,
                    format: "yyyy-mm-dd",   //保留到日
                    language:'zh-CN',          //中文显示
                    minView: "month",      //月视图
                    todayBtn: true,       //切换到今天
                    clearBtn: true,       //清除全部
                    autoclose:true  //选择时间后自动隐藏
                });
            });

            //获取班次数据
            function loadShift(){
                var url_ = Api.aps+'/api/ctrl/Shift/list';
                Api.ajaxJson(url_, {}, function(result){
                    if(result.success){
                        var rows = result.rows;
                        var options = new Array();
                        $(rows).each(function(i,o){
                            var label = o['name']+'('+o['startTime']+'-'+o['endTime']+')';
                            options.push({'value':o['id'], 'label':label});
                        });
                        Bus.appendOptions($('#time'), options);
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }

            //创建table
            function createTable(data) {
                //  datatables使用ajax
                $('#treeTable').dataTable({
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "ordering": false,
                    "oLanguage": dataTableLang,
                    "data": data,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": "process", 'sClass': " alignCenter authName","width":"20%"},
                        {"data": "shift.name", 'sClass': "alignCenter ","width":"15%"},
                        {"data": "groupName", 'sClass': "alignCenter","width":"15%"},
                        {"data": "overUserName", 'sClass': "alignCenter","width":"10%"},
                        {"data": "reciveUserName", 'sClass': "alignCenter","width":"10%"},
                        {"data": "overDate", 'sClass': "alignCenter","width":"15%"},
                        {"data": "reciveDate", 'sClass': "alignCenter","width":"15%"}
                    ]
                });
            }
            $('i').click(function(){
                return false
            })
        },


    };

    $(function(){
        //应用管理列表
        if($('#operationRecord').length > 0){
            PageModule.listInit();
        }

    });
});