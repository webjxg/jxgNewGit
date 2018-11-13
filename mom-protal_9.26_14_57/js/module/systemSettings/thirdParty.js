require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);
    var PageModule = {
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                window.pageLoad = function (){
                    var data = {
                        name:$("#name").val()
                    };
                    //修改默认每页显示条数
                    var page = new Page();
                    page.init(Api.admin+"/api/sys/SysUserRel/page",data,true,function(tableData, result){
                        renderTableData(tableData);
                        //查看
                        $(".btn-check").click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('查看用户','systemSettings/thirdPartyInner.html?id='+id+'&api=view'+"&type="+"check",'800px','500px')
                        });
                        //编辑
                        $(".btn-change").click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('编辑用户','systemSettings/thirdPartyInner.html?id='+id+'&api=view'+"&type="+"change",'800px','500px')
                        });
                        //删除
                        $('.btn-delete').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该用户吗',Api.admin+'/api/sys/SysUserRel/delete/',id)
                        });
                        //重置按钮
                        $('#reset-btn').click(function(){
                            $("#name").val(""),
                                page.reset(["name"]);
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
                    "ordering": false,
                    "oLanguage": dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"10px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "name",'sClass':" alignCenter authName"},
                        {"data": "loginName",'sClass':"alignCenter ","width":"15%"},
                        {"data": "deptCode",'sClass':"alignCenter"},
                        {"data": "deptLabel",'sClass':"alignCenter"},
                        {"data": "jobLabel",'sClass':"alignCenter"},
                        {"data": "jobCode",'sClass':"alignCenter"},
                        {"data": "mobile",'sClass':"alignCenter"},
                        {"data": "tel",'sClass':"alignCenter"},
                        {"data": "email",'sClass':"alignCenter"},
                        {"data": "professional",'sClass':"alignCenter"},
                        {"data":null ,'sClass':"alignCenter",
                            "render":function (data, type, row, meta) {
                                var html = "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >"+
                                    "<a class='btn btn-info btn-xs btn-change' ><i class='fa icon-change'></i>编辑</a >"+
                                    "<a class='btn btn-info btn-xs btn-delete' ><i class='fa fa-trash-o'></i>删除</a >"
                                return html;
                            }
                        }
                    ]
                });
                renderIChecks();
            }
        },

        formInit: function(){
            if(Mom.getUrlParam('type') == "check"){
                $(".input-group-btn").remove();
            };
            var id = Mom.getUrlParam('id');
            var api = Mom.getUrlParam('api') || 'form';
            $("#value").focus();
            setSys();   //下拉
            if(id){
                var url = Api.admin+"/api/sys/SysUserRel/"+api+"/"+id;
                Api.ajaxJson(url,{},function(result){
                    if(result.success){
                        Validator.renderData(result.SysUserRel,$('#inputForm'));
                        $("#sysLoginName").val(result.SysUserRel.user.loginName);
                        $("#sysUserName").val(result.SysUserRel.user.name);
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            };
            function setSys(){
                Bus.createSelect(Api.admin+'/api/sys/SysDict/type/app', '#sys');
            }
            //mom第三反用户列表页面
            $('#companyButton').unbind("click").on('click', function () {
                var p_ = top;
                // 正常打开
                p_.layer.open({
                    type: 2,
                    area: ['800px', '500px'],
                    title: "mom用户列表",
                    content: "systemSettings/correspondingUser.html",
                    btn: ['确定', '关闭'],
                    yes: function (index, layero) { //或者使用btn1
                        var iframeWin = layero.find('iframe')[0].contentWindow;
                        var msg = iframeWin.getdataMsg();
                        top.layer.close(index);
                        $("#sysLoginName").val(msg.loginName);
                        $("#sysUserName").val(msg.name);
                        $("#momId").val(msg.id)
                    },
                    cancel: function (index) { //或者使用btn2
                    }
                });
            });
        },
        userInit:function () {
            require(['Page'],function() {
                window.pageLoad = function () {
                    var data = {
                        loginNameParam: $("#loginName").val(),
                        nameParam: $("#userName").val()
                    };
                    new Page().init(Api.admin+"/api/sys/SysUser/page", data, true, function (rows, result) {
                        PageModule.createTable(rows);
                    });
                   };
                window.pageLoad();
             window.getdataMsg = function getdataMsg () {
                    var obj = {};
                    $("#datainner tr td .i-checks").each(function (index,item) {
                        if($(item).is(":checked")) {
                            var id = $(this).attr("id");
                            var loginName = $(this).parents("td").next().text();
                            var name = $(this).parents("td").next().next().text();
                            obj.id = id;
                            obj.loginName = loginName;
                            obj.name = name;
                        }
                    });
                    return obj;
                }
            });
        },
        createTable:function (dataTable) {
        $('#treeTable').dataTable({
            "bPaginate": false,
            "bAutoWidth": false,
            "bDestroy":true,
            "paging": false,
            "bProcessing": true,
            "searching": false, //禁用aa原生搜索
            "info": false,  //底部文字
            "order": [],
            "ordering": false,
            "oLanguage": window.dataTableLang,
            "data":dataTable,
            //定义列 宽度 以及在json中的列名
            "aoColumns": [
                {"data": null,"sWidth":"10px;","defaultContent":"",'sClass':"alignCenter",
                    "render":function(data, type, row, meta) {
                        return data = "<input name='i-check' type='checkbox' id=" + row.id + " class='i-checks'>"
                    }
                },
                {"data": "loginName", "width": "auto",'sClass':"alignCenter loginName"},
                {"data": "name", "width": "auto",'sClass':"alignCenter name"},
                {"data": "phone", "width": "auto",'sClass':"alignCenter"},
                {"data": "mobile", "width": "auto",'sClass':"alignCenter"}
            ]
        });
            renderIChecks();
        }
    };
    $(function(){
        //第三方用户管理列表
        if($('#thirdParty').length > 0){
            PageModule.listInit();
        } else if($('#thirdPartyInner').length > 0){//查看、编辑、新增
            PageModule.formInit();
        }else if($("#corresponding").length>0){//选择登录名页面
            PageModule.userInit()
        }
    });
});