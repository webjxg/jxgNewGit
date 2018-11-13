require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);
    Mom.include('myCss', '', [
        '../../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
        '../js/plugins/ztree/css/metroStyle/metroStyle.css',
        '../../js/plugins/select2/dist/css/select2.css'
    ]);
    var PageModule = {

        //  角色管理
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                var page = new Page();
                window.pageLoad = function (){
                    var data = {
                        nameParam: $("#name").val()
                    };
                    //修改默认每页显示条数
                    page.init(Api.admin+"/api/sys/SysRole/page",data,true,function(tableData, result){
                        renderTableData(tableData);
                        $('.btn-check').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('查看角色','systemSettings/roleInner.html?id='+id+'&api=view','800px','345px');
                        });
                        $('.btn-change').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改角色','systemSettings/roleInner.html?id='+id,'800px','345px');
                        });
                        $('.btn-delete').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该角色吗',Api.admin+'/api/sys/SysRole/delete/',id);
                        });
                        $('.btn-add').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id'),
                                authName =  $(this).parents("tr").find('.authName').text();
                            Bus.openDialog(authName+'-分配许可','systemSettings/roleTypeOfAllotPro.html?id='+id,'800px','500px');
                        });
                        $('.btn-allot').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('分配用户','systemSettings/roleAssign.html?id='+id,'800px','500px');
                        });
                    });
                };
                //点击重置按钮
                $('#reset-btn').click(function(){
                    $("#name").val("");
                    page.reset(["nameParam"]);
                });
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
                        {"bSortable": false, "aTargets": [0, 4]}
                    ],
                    "oLanguage": window.dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"10px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "name",'sClass':" alignCenter authName"},
                        {"data": "enname",'sClass':"alignCenter ","width":"15%"},
                        {"data": "roleTypeLabel",'sClass':"alignCenter"},
                        {
                            "data": "id", "orderable": false, "defaultContent": "",'sClass':" alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >" +
                                    "<a class='btn btn-success btn-xs btn-change' ><i class='fa icon-change'></i>修改</a >" +
                                    "<a class='btn btn-danger btn-xs btn-delete' ><i class='fa fa-trash' ></i>删除</a >" +
                                    "<a class='btn btn-primary btn-xs btn-add'><i class='fa fa-briefcase'></i>分配许可</a >" +
                                    "<a class='btn btn-warning btn-xs btn-allot'><i class='fa fa-user'></i>分配用户</a >";
                            }
                        }]
                });
                renderIChecks();
            }
        },

        //  查看，修改
        formInit: function(){
            var id =Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            var url = Api.admin+"/api/sys/SysRole/"+api+"/"+id;
            Api.ajaxJson(url,{},function(result){
                if (result.success) {
                    var roleList = result.roleTypeList;
                    Bus.appendOptionsValue('#roleType',roleList);
                    Validator.renderData(result.SysRole,$('#inputForm'));
                } else {
                    Mom.layMsg(result.message);
                }
            });
        },

        //  分配许可
        listAllotPro: function(){
            //分配、撤销功能
            function allotCancelItem(tableId,opflag,ifAllot,dataPrama,url){
                var str="",flag = true;
                $(tableId +" tbody tr td input.i-checks:checkbox").each(function(){
                    if(true == $(this).is(':checked')) {
                        var ifAllotText = "";
                        ifAllotText = $(this).parents("tr").find('.ifAllot').text();
                        str += "," + $(this).attr("id");
                        if (ifAllotText == ifAllot) {
                            var tit = "";
                            if(ifAllot == "是"){
                                tit = "您所选的已有分配！";
                            }else{
                                tit ="您所选的已有撤销的！";
                            }
                            Mom.layAlert(tit, 0);
                            flag = false;
                            return;
                        }
                    }
                });
                if(str == ""){
                    Mom.layAlert('请至少选择一条数据!', {icon: 0, title:'警告'});
                }
                if(flag){
                    var data = {
                        opflag: opflag
                    };
                    data[dataPrama[0]] = id;
                    data[dataPrama[1]] = str.substr(1);
                    Api.ajaxForm(url,data,function (result) {
                        if (result.success == true) {
                            document.location.reload();
                        }
                    });
                }
            };
            var id =Mom.getUrlParam('id');
            require(['Page'], function () {
                var page = new Page();
                window.pageLoad = function () {
                    var data = {
                        roleId: id,
                        nameParam: $("#authProName").val(),
                        codeParam: $("#authPro").val()
                    };
                    page.init(Api.admin+"/api/sys/SysRole/rolePermPage", data, true, function (tableData, result) {
                        renderTableData(tableData);
                    });
                };
                //分配
                $('#allot-btn').click(function () {
                    allotCancelItem("#treeTable", "dist", "是", ["roleId", "permIds"], Api.admin+"/api/sys/SysRole/ajaxSaveDist");
                });
                //撤销
                $('#cancel-btn').click(function () {
                    allotCancelItem("#treeTable", "cancel", "否", ["roleId", "permIds"],Api.admin+"/api/sys/SysRole/ajaxSaveDist");
                });
                //点击重置按钮
                $('#reset-btn').click(function () {
                    $("#authProName").val("");
                    $("#authPro").val("");
                    page.reset(["nameParam", "codeParam"]);
                });
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
                    "oLanguage": window.dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"60px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "name",'sClass':" alignCenter"},
                        {"data": "code",'sClass':"alignCenter "},
                        {"data": "des",'sClass':"alignCenter"},
                        {"data": "null",'sClass':"alignCenter autoWidth ifAllot", "defaultContent": "","render":function (data, type, row, meta){
                            return distStatus = row.distStatus==1?"是":"否";
                        }
                        }
                    ]
                });
                renderIChecks();
            }
        },

        //待选用户、已选用户
       preUserIds: [], selectedUserIds: [],

        // 分配用户
        roleAssign: function(){
            var id =Mom.getUrlParam('id')|| '';
            $(function(){
                $("#roleId").val(id);
                var url = Api.admin+"/api/sys/SysRole/view/"+id;
                Api.ajaxJson(url,{},function(result){
                    if (result.success) {
                        var data = result.list,
                            html = "",
                            SysRole = result.SysRole;
                        html += " <div class=\"row-fluid span12\">" +
                            "<span class=\"span4 roleType\">角色名称: <strong>" + SysRole.name + "</strong></span>" +
                            "<span class=\"span4\">英文名称: " + SysRole.enname + "</span>" +
                            " </div>" +
                            " <div class=\"row-fluid span8\">" +
                            "<span class=\"span4\">角色类型: " + SysRole.roleType + "</span>" +
                            " </div>";
                        $(".container-fluid").append(html);
                        renderTableData(data);

                    } else {
                        Mom.layMsg(result.message);
                    }
                });
                $("#refresh-btn").click(function(){
                    refreshLoad();
                });
                refreshLoad();

                $('#delete-btn').click(function(){
                    removeUserBatch();
                });

                $("#datainner").on("click",'.btn-delete',function(){
                    var userIds = $(this).attr('id'),
                        roleName = $(this).parents('tr').find('.roleName').text();
                    var data = {
                        userIds:userIds,
                        roleId:id
                    };
                    deleteACallback('确认要将用户 <strong>['+ roleName +']</strong>从 <strong>['+$(".roleType strong").text()+']</strong>角色中移除吗？', function(layIdx){
                        var url = Api.admin+'/api/sys/SysRole/removeUser';
                        Api.ajaxForm(url,data,function(result){
                            if(result.success == true){
                                top.layer.close(layIdx);
                                refreshLoad();
                            }

                        });
                    });
                });
            });

            function refreshLoad(){
                var roleId = $("#roleId").val();
                if(roleId != ''){
                    //用户功能显示（已分配）用户信息列表
                    var url = Api.admin+"/api/sys/SysRole/assign/" + roleId;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            var data = result.list;
                            renderTableData(data);
                        } else {
                            Mom.layMsg(result.message);
                        }
                    });
                }
            }

            function removeUserBatch(){
                var userIds = "";
                $("#treeTable tbody tr td input.i-checks:checkbox").each(function(){
                    if(true == $(this).is(':checked')){
                        userIds+=","+$(this).attr("id");
                    }
                });
                if(userIds.length > 0){
                    var data = {
                        userIds:userIds.substr(1),
                        roleId:id
                    };
                    deleteACallback('确认要将已选择的用户从角色<strong>['+$(".roleType strong").text()+']</strong>中移除吗？', function(layIdx){
                        var url =Api.admin+'/api/sys/SysRole/removeUser';
                        Api.ajaxForm(url,data,function(result){
                            if(result.success == true){
                                top.layer.close(layIdx);
                                refreshLoad();
                                //去掉标题中的选中状态
                                $(".icheckbox_square-green").find("[type='checkbox']").iCheck('uncheck');

                            }

                        });
                    });
                }else{
                    Mom.layAlert('请至少选择一条数据!', {icon: 0, title:'警告'});
                }
            }

            function deleteACallback(mess,callfn){
                Mom.layConfirm(mess,function(index) {
                    if (callfn) {
                        callfn(index);
                    }else{
                        top.layer.close(index);
                    }
                });
            }

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
                    "oLanguage": window.dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"60px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + data.id + " class='i-checks'>"
                            }
                        },
                        {"data": "loginName",'sClass':" alignCenter"},
                        {
                            "data": "name", "orderable": false, "defaultContent": "",'sClass':" alignCenter  ",
                            "render": function (data, type, row, meta) {
                                return "<a class='roleName' style='color:#000'>"+row.name+"</a >" ;
                            }
                        },
                        {"data": "phone",'sClass':"alignCenter"},
                        {"data": "mobile",'sClass':"alignCenter"},
                        {
                            "data": null, "orderable": false, "defaultContent": "",'sClass':" alignCenter ",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn btn-delete '  style='cursor:pointer' id='"+row.id+"'>删除</a >" ;
                            }
                        }]
                });
                renderIChecks();

            };

            //  添加人员
            $("#assignButton").click(function(){
                top.layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    title:"选择用户",
                    maxmin: true, //开启最大化最小化按钮
                    content: "systemSettings/usertorole.html?id="+id ,
                    btn: ['确定', '关闭'],
                    yes: function(index,layero){
                        var pre_ids = layero.find("iframe")[0].contentWindow.getPreUserIds();
                        var ids = layero.find("iframe")[0].contentWindow.getSelectedUserIds();
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if(ids[0]==''){
                            ids.shift();
                            pre_ids.shift();
                        }
                        if(pre_ids.sort().toString() == ids.sort().toString()){
                            Mom.layMsg("未给角色【管理员】分配新成员！");
                            return false;
                        };
                        // 执行保存
                        //loading('正在提交，请稍等...');
                        var idsArr = "";
                        for (var i = 0; i<ids.length; i++) {
                            idsArr = (idsArr + ids[i]) + (((i + 1)== ids.length) ? '':',');
                        }
                        $('#idsArr').val(idsArr);
                        var formdata = {
                            roleId:id,
                            userIds:idsArr
                        };
                        var url = $("#assignRoleForm").attr('action');
                        Api.ajaxForm(url,formdata,function(result) {
                            if (result.success == true) {
                                Mom.layMsg('已成功提交',0,1000);
                                setTimeout(function () {
//
                                    top.layer.close(index);
                                    //刷新
                                    refreshLoad();

                                }, 1000);
                            } else {
                                Mom.layAlert(result.message)
                            }
                        });
                    },
                    cancel: function(index){
                    }
                });
            });


        },


        // 添加用户
        usertorole: function(){
            window.getPreUserIds = function(){
                return PageModule.preUserIds;
            };
            window.getSelectedUserIds=function(){
                return PageModule.selectedUserIds;
            };

            var officeTree, userTree, selectedTree;//分别为 所有部门、zTree已选择对象、待选用户对象
            var id = Mom.getUrlParam('id');
            var allDepUrl = Api.admin+"/api/sys/SysOrg/leftTree", //全部部门
                unallotUrl = Api.admin+"/api/sys/SysOrg/selectUser", //待选
                allotUrl = Api.admin+"/api/sys/SysRole/assign/"+id;  //已选

            var setting1 = {view: {selectedMulti:false,nameIsHTML:true,showTitle:false,dblClickExpand:false},
                data: {simpleData: {enable: true}},
                callback: {onClick: treeOnClick}};

            var setting2 = {view: {selectedMulti:false,nameIsHTML:true,showTitle:false,dblClickExpand:false},
                data: {simpleData: {enable: true}},
                callback: {onDblClick: treeOnClick}};

            //部门tree
            Api.ajaxJson(allDepUrl, {}, function (result) {
                if (result.success) {
                    require(['ztree_all'],function(){
                        officeTree = $.fn.zTree.init($("#officeTree"), setting1, result.rows);
                    })
                } else {
                    Mom.layMsg(result.message);
                }
            });

            // 全选
            $('.selectedAll').click(function(){
                checkAll();
            });
            // 还原
            $('.reduction').click(function(){
                revert();
            })

            //已选人员
            function selectUserInit(){
                Api.ajaxJson(allotUrl, {}, function (result) {
                    if (result.success) {
                        var hasList = [];
                        PageModule.preUserIds=[], PageModule.selectedUserIds=[];
                        $.each(result.list,function(ind,item){
                            PageModule.selectedUserIds.push(item.id);//将已选加入数组
                            PageModule.preUserIds.push(item.id);
                            hasList.push({
                                id:item.id,
                                name:"<font color='red'>"+item.name+"</font>"
                            });
                        });
                        //绑定筛选框事件
                        require(['ztree_my'],function(treeSelect){
                            selectedTree = $.fn.zTree.init($("#selectedTree"), setting2, hasList);
                            $('#waitQuery2').unbind('keyup').keyup(function(event){
                                var treeObj_ = $.fn.zTree.getZTreeObj("selectedTree");
                                treeSelect.searchNode(treeObj_, 'name', $(this).val());
                            });
                        });
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            }

            selectUserInit();


            //点击选择项回调
            function treeOnClick(event, treeId, treeNode, clickFlag){
                    $.fn.zTree.getZTreeObj(treeId).expandNode(treeNode);
                    if("officeTree"==treeId){
                        var companyId = treeNode.type == "1"?treeNode.id:"",
                            deptId = treeNode.type == "1"?"":treeNode.id;
                        var data = {
                            roleId:id,
                            deptId:deptId,
                            companyId:companyId
                        };
                        Api.ajaxForm(Api.admin+'/api/sys/SysRole/selectUserNotInRole',data, function (result) {
                            if (result.success) {
                                require(['ztree_my'],function(treeSelect){
                                    userTree = $.fn.zTree.init($("#userTree"), setting2, result.rows);
                                    //绑定筛选框事
                                    $('#waitQuery').unbind('keyup').keyup(function(event){
                                        var treeObj_ = $.fn.zTree.getZTreeObj("userTree");
                                        treeSelect.searchNode(treeObj_, 'name', $(this).val());
                                    });
                                });
                            } else {
                                Mom.layMsg(result.message);
                            }
                        });
                    }
                    //待选人员，双击后加入到已选列表
                    if("userTree"==treeId){
                        if($.inArray(String(treeNode.id), PageModule.selectedUserIds)<0){
                            selectedTree.addNodes(null, treeNode);
                            PageModule.selectedUserIds.push(String(treeNode.id));
                        }
                    };
                    //已选择人员，双击后移除
                    if("selectedTree"==treeId){
                        selectedTree.removeNode(treeNode);
                        PageModule.selectedUserIds.splice($.inArray(String(treeNode.id), PageModule.selectedUserIds), 1);
                    }

            };
            //全选
            function checkAll(){
                if(userTree){
                    var nodes = userTree.getNodesByParam("isHidden", false);
                    if(nodes.length > 0){
                        for(var i=0; i<nodes.length; i++){
                            var treeNode = nodes[i];
                            if($.inArray(String(treeNode.id), PageModule.selectedUserIds)<0){
                                selectedTree.addNodes(null, treeNode);
                                PageModule.selectedUserIds.push(String(treeNode.id));
                            }
                        }
                    }
                }
            }

            //还原
            function revert(){
                var p_ = top;
                p_.layer.confirm('确认还原吗?', {icon:3, title:'系统提示'}, function(index, layero){
                    selectUserInit();
                    p_.layer.close(index);
                });
            }

        }
    };

    $(function(){
        //角色列表
        if($('#role').length > 0){
            PageModule.listInit();
        }else if($('#roleInner').length > 0){
            PageModule.formInit();
        }else if($('#roleTypeOfAllotPro').length > 0){
            PageModule.listAllotPro();
        }else if($('#roleAssign').length > 0){
            PageModule.roleAssign();
        }else if($('#usertorole').length > 0){
            PageModule.usertorole();
        }
    });

});