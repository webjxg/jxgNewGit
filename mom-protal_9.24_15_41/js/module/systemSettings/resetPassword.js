require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                window.pageLoad = function (){
                    var data = {
                        userName: $('#userName').val(),
                        userTel: $('#phoneNumber').val(),
                        status: $("#reset").val()
                    };
                    //修改默认每页显示条数
                    Page.init(Api.admin+"/api/sys/ResetPassword/resetPasswordList",data,true,function(tableData){
                        renderTableData(tableData);
                        $(".btn-reset").click(function(){
                            var data = {
                                userIds:$(this).attr('id')
                            };
                        });
                        //点击重置按钮
                        $('#reset-btn').click(function(){
                            $('#userName,#phoneNumber').val('');
                            $("#reset option:first").prop("selected", 'selected');
                            Page.reset(["userName","userTel","status"]);
                        });
                        //点击列表重置按钮提示
                        $(".btn-reset").click(function () {
                            var   id = $(this).attr('id');
                            var data={ids:id};
                            Mom.layConfirm("确定要重置吗 ？",function(index){
                                Api.ajaxForm(Api.admin+'/api/sys/ResetPassword/resetPassword',data,function(result){
                                    if(result.success == true){
                                        Mom.layMsg('重置成功！');
                                        pageLoad();
                                    }
                                });
                                layer.close(index);
                            });
                        });
                    });
                };
                $("#search-btn").click(function(){
                    pageLoad();
                });
                pageLoad();
            });

            function renderTableData(tableData){
                $('#treeTable').dataTable({
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy":true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0, 2, 6]}
                    ],
                    "oLanguage": dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": "userName",'sClass':"alignCenter","width":"12%"},
                        {"data": "loginName",'sClass':"alignCenter","width":"12%"},
                        {"data": "userTel",'sClass':"alignCenter","width":"15%"},
                        {"data": "startTime",'sClass':"alignCenter","width":'15%'},
                        {"data": "applyTime",'sClass':"alignCenter","width":'25%',
                            "render": function (data, type, row, meta) {

                                return row.startTime+ ' 至  '+row.endTime
                            }},
                        {"data": "status",'sClass':"alignCenter", "orderable": false, "defaultContent": "","width":'8%',
                            "render": function (data, type, row, meta) {
                                if(row.status == "0"){
                                    var  html = "<span class='newspapers'>待重置</span>"
                                }else if(row.status == "1"){
                                    var  html = "<span class='newspapers'>已重置</span>"
                                }
                                return html
                            }
                        },
                        {"data": "resetTime",'sClass':"alignCenter","width":'15%'},
                        {"data": "", "orderable": false, "defaultContent": "",'sClass':" alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                if(row.status == "0"){
                                    var  html = "<a class='btn btn-info btn-xs btn-reset' id=" + row.id + "><i class='fa fa-refresh'></i>重置</a >"
                                }else if(row.status == "1"){
                                    var html = ""
                                }
                                return html
                            }
                        }
                    ]
                });
                renderIChecks();
            }
        },

    };

    $(function(){
        //重置密码列表
        if($('#resetPassword').length > 0){
            PageModule.listInit();
        }
    });

});