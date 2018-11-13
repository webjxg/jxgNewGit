require(['/js/zlib/app.js'], function(App) {
    require(['checkUser']);

    var PageModule = {
        orgAssign: function(){
            var id = Mom.getUrlParam('id') || "";
            var type = Mom.getUrlParam('type') || "";
            if(id!=='') {
                $("#roleId").val(id);
                var url = Api.admin+'/api/sys/SysOrg/assign/';
                Api.ajaxJson(url, JSON.stringify({id: id}), function (result) {
                    if (result.success) {
                        $('#companyList').val(result.company.id);
                        html = "";
                        SysRole = result.dept;
                        html += " <div class=\"row-fluid span12\">" +
                            "<span class=\"span4 roleType\">机构名称: <strong>" + SysRole.name + "</strong></span>" +
                            "<span class=\"span4\">英文名称: " + SysRole.sname + "</span>" +
                            " </div>" +
                            " <div class=\"row-fluid span8\">" +
                            "<span class=\"span4\">机构类型: " + SysRole.typeLabel + "</span>" +
                            " </div>";
                        $(".container-fluid").append(html);
                    } else {
                        Mom.layMsg(result.message)
                    }

                })
            }else{
                Mom.layMsg('用户信息接收失败！');
                return false
            }
            //查看角色信息接口
            if(type!=1){
                dataval={deptId:id}
            }else{
                dataval={companyId:id}
            }
            // Page.defaultPageSizeIndex=0;
            require(['Page'],function(){
                new Page().init(Api.admin+"/api/sys/SysOrg/assignPage1/",dataval,true,function (rows, result) {
                    if (result.success) {
                        renderTableData(rows);
                    }else {
                        Mom.layMsg(result.message);
                    }
                });
            });
            /*删除按钮操作*/
            $("#datainner").on("click", '.btn-delete', function () {
                var userIds = $(this).attr('id'),
                    roleName = $(this).parents('tr').find('.roleName').text();
                var company=$('#companyList').val();
                var data = {
                    userIds: userIds,
                    deptId: id,
                    companyId:company
                };
                deleteACallback('确认要将用户 <strong>[' + roleName + ']</strong>从角色中移除吗？', function (layIdx) {
                    var url = Api.admin+'/api/sys/SysOrg/delUser';
                    Api.ajaxForm(url, data, function (result) {
                        if (result.success == true) {
                            top.layer.close(layIdx);
                            window.location.reload()
                        }
                    });
                });
            });

            /*刷新页面按钮*/
            $("#refresh-btn").click(function () {
                refreshLoad();
            });
            //    渲染请求信息到datatables表格
            /*每次重新渲染页面时执行*/
            function refreshLoad() {
                var roleId = $("#roleId").val();
                if (roleId != '') {
                    //用户功能显示（已分配）用户信息
                    var url = Api.admin+"/api/sys/SysOrg/assign/";
                    Api.ajaxJson(url, JSON.stringify({id:roleId}), function (result) {
                        if (result.success) {
                            html = "",
                                SysRole = result.dept,
                                SysCompany= result.company;
                            html += " <div class=\"row-fluid span12\">" +
                                "<span class=\"span4 roleType\">公司名称: <b>" + SysRole.name + "</b></span>" +
                                "<span class=\"span4\">简称: " + SysRole.sname + "</span>" +
                                " </div>" +
                                " <div class=\"row-fluid span8\">" +
                                "<span class=\"span4\">公司: " + SysCompany.name + "</span>" +
                                " </div>";
                            $(".container-fluid").append(html);
                            renderTableData(result);

                        } else {
                            Mom.layMsg(result.message);
                        }
                    });
                }
            }
            $('#delete-btn').click(function () {
                var userIds = "";
                $("#treeTable tbody tr td input.i-checks:checkbox").each(function () {
                    if (true == $(this).is(':checked')) {
                        userIds += "," + $(this).attr("id");
                    }
                });
                var company=$('#companyList').val();
                if (userIds.length > 0) {
                    var data = {
                        userIds: userIds.substr(1),
                        deptId: id,
                        companyId:company
                    };
                    deleteACallback('确认要将已选择的用户从角色中移除吗？', function (layIdx) {
                        var url = Api.admin+'/api/sys/SysOrg/delUser';
                        Api.ajaxForm(url, data, function (result) {
                            if (result.success == true) {
                                top.layer.close(layIdx);
                                window.location.reload();
                                //去掉标题中的选中状态
                                $(".icheckbox_square-green").find("[type='checkbox']").iCheck('uncheck');

                            }

                        });
                    });
                } else {
                    top.layer.alert('请至少选择一条数据!', {icon: 0, title: '警告'});
                }
            });
            //用拿到的数据渲染表格
            function renderTableData(tableData) {
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
                    "data": tableData,
                    "aoColumns": [
                        {
                            "data": null, "sWidth": "60px;", "defaultContent": "", 'sClass': "alignCenter",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "loginName", 'sClass': " alignCenter"},
                        {
                            "data": "name", "orderable": false, "defaultContent": "", 'sClass': " alignCenter  ",
                            "render": function (data, type, row, meta) {
                                return data= "<a class=' roleName' >" + row.name + "</a >";
                            }
                        },
                        {"data": "phone", 'sClass': "alignCenter"},
                        {"data": "mobile", 'sClass': "alignCenter"},
                        {
                            "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter ",
                            "render": function (data, type, row, meta) {
                                return data= "<a class='btn btn-delete ' id='" + row.id + "'>删除</a >";
                            }
                        }]
                });
                renderIChecks();
            };

            //添加人员
            $("#assignButton").click(function () {
                top.layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    title: "选择用户",
                    maxmin: true, //开启最大化最小化按钮
                    content: "systemSettings/orgAssignUsers.html?id=" + id+'&type='+type,
                    btn: ['确定', '关闭'],
                    yes: function (index, layero) {
                        var pre_ids = layero.find("iframe")[0].contentWindow.getPreUserIds();
                        var ids = layero.find("iframe")[0].contentWindow.getSelectedUserIds();
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if (ids[0] == '') {
                            ids.shift();
                            pre_ids.shift();
                        }
                        if (pre_ids.sort().toString() == ids.sort().toString()) {
                            Mom.layMsg("未给角色【管理员】分配新成员！");
                            return false;
                        };
                        var idsArr = "";
                        for (var i = 0; i < ids.length; i++) {
                            idsArr = (idsArr + ids[i]) + (((i + 1) == ids.length) ? '' : ',');
                        }
                        $('#idsArr').val(idsArr);
                        var company=$('#companyList').val();
                        var formdata = {
                            companyId:company,
                            deptId: id,
                            userIds: idsArr
                        };

                        var url = $("#assignRoleForm").attr('action');
                        Api.ajaxForm(url, formdata, function (result) {
                            if (result.success == true) {
                                Mom.layMsg('已成功提交','',1000);
                                window.location.reload();
                            } else {
                                Mom.layAlert(result.message)
                            }
                            top.layer.close(index);
                        });
                    },
                    cancel: function (index) {
                    }
                });
            });
            function deleteACallback(mess,callfn){
                top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index) {
                    if (callfn) {
                        callfn(index);
                    }else{
                        top.layer.close(index);
                    }
                });
            }
        },
        //待选用户、已选用户
        preUserIds: [], selectedUserIds: [],
        //添加人员
        orgAssignUsers: function(){
            //引入zTree样式
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
                '../js/plugins/ztree/css/metroStyle/metroStyle.css'
            ]);
            //分别为 所有部门、zTree已选择对象、zTree未选择对象
            var officeTree,selectedTree,pre_selectedNodes;
            var id = Mom.getUrlParam('id');
            var type = Mom.getUrlParam('type');

            window.getPreUserIds = function(){
                return PageModule.preUserIds;
            };
            window.getSelectedUserIds=function(){
                return PageModule.selectedUserIds;
            };

            var allDepUrl = Api.admin+"/api/sys/SysOrg/leftTree", //全部部门
                unallotUrl = Api.admin+"/api/sys/SysUser/selectUser", //待选
                allotUrl = Api.admin+"/api/sys/SysOrg/assign/";  //已选
            /*部门tree*/
            Api.ajaxJson(allDepUrl, {}, function (result) {
                if (result.success) {
                    require(['ztree_all'],function(){
                        officeTree = $.fn.zTree.init($("#officeTree"), setting1, result.rows);
                    })
                } else {
                    Mom.layMsg(result.message);
                }
            });

            //已选人员
            function selectUserInit(){
                if(type!=1){
                    dataval={deptId:id}
                }else{
                    dataval={companyId:id}
                }
                Api.ajaxJson(Api.admin+"/api/sys/SysOrg/assign1/", JSON.stringify(dataval), function (result) {
                    if (result.success) {
                        var hasList = [];
                        PageModule.selectedUserIds=[], PageModule.preUserIds=[];
                        $.each(result.page,function(ind,item){
                            PageModule.selectedUserIds.push(item.id)
                            PageModule.preUserIds.push(item.id);//将已选加入数组
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
            var setting1 = {view: {selectedMulti:false,nameIsHTML:true,showTitle:false,dblClickExpand:false},
                data: {simpleData: {enable: true}},
                callback: {onClick: treeOnClick}};

            var setting2 = {view: {selectedMulti:false,nameIsHTML:true,showTitle:false,dblClickExpand:false},
                data: {simpleData: {enable: true}},
                callback: {onDblClick: treeOnClick}};
            //点击选择项回调
            function treeOnClick(event, treeId, treeNode, clickFlag){
                $.fn.zTree.getZTreeObj(treeId).expandNode(treeNode);
                if("officeTree"==treeId){
                    if(treeNode.type=="1"){
                        if(type=="1"){
                            datas={
                                companyId1:id,
                                companyId2:treeNode.id
                            }
                        }else{
                            datas={
                                deptId1:id,
                                companyId2:treeNode.id
                            }
                        }
                    }else{
                        if(type=="1"){
                            datas={
                                companyId1:id,
                                deptId2:treeNode.id
                            }
                        }else{
                            datas={
                                deptId1:id,
                                deptId2:treeNode.id
                            }
                        }
                    }
                    Api.ajaxForm(Api.admin+'/api/sys/SysOrg/selectUser1',datas, function (result) {
                        if (result.success) {
                            //绑定筛选框事件
                            require(['ztree_my'],function(treeSelect){
                                userTree =$.fn.zTree.init($("#userTree"), setting2, result.userList);
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
            $('.checkAll').click(function(){
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
            });
            //还原
            $('.revert').click(function(){
                var p_ = top;
                p_.layer.confirm('确认还原吗?', {icon:3, title:'系统提示'}, function(index, layero){
                    selectUserInit();
                    p_.layer.close(index);
                });
            });
        },

        orgAllotApp: function(){
            var id = Mom.getUrlParam('id') || "";
            $("#roleId").val(id);
            //查看应用信息接口
            Api.ajaxJson(Api.admin+"/api/sys/SysOrg/assignApp/" + id, {}, function (result) {
                if (result.success) {
                    var data = result.sysOrg,
                        html = "";
                    html += " <div class=\"row-fluid span12\">" +
                        "<span class=\"span4 roleType\">机构名称: <strong>" + data.name + "</strong></span>" +"&nbsp;&nbsp;"+
                        "<span class=\"span4\">机构简称: " + data.sname + "</span>" +
                        " </div>";
                    $(".container-fluid").append(html);
                    var company= result.sysOrg.parentId;
                    $("#companyList").val(company);
                    renderTableData(result.apps);

                } else {
                    Mom.layMsg(result.message);
                }
            });

            /*删除按钮操作*/
            $("#datainner").on("click", '.btn-delete', function () {
                var userIds = $(this).attr('id'),
                    roleName = $(this).parents('tr').find('.roleName').text();
                var data = {
                    appIds: userIds,
                    orgId: id
                };
                deleteACallback('确认要将应用从<strong>[' + $(".roleType strong").text() + ']</strong>中移除吗？', function (layIdx) {
                    var url = Api.admin+'/api/sys/SysOrg/delApp';

                    Api.ajaxForm(url, data, function (result) {
                        if (result.success == true) {
                            top.layer.close(layIdx);
                            refreshLoad();
                        }

                    });
                });
            });
            function deleteACallback(mess,callfn){
                top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index) {
                    if (callfn) {
                        callfn(index);
                    }else{
                        top.layer.close(index);
                    }
                });
            }

            /*刷新页面按钮*/
            $("#refresh-btn").click(function () {
                refreshLoad();
            });

            // 渲染请求信息到datatables表格
            /*每次重新渲染页面时执行*/
            function refreshLoad() {
                var roleId = $("#roleId").val();
                if (roleId != '') {
                    //用户功能显示（已分配）用户信息
                    var url = Api.admin+"/api/sys/SysOrg/assignApp/"+id;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            var data = result.apps;
                            renderTableData(data);
                        } else {
                            Mom.layMsg(result.message);
                        }
                    });
                }
            }
            //删除机构中所在的用户
            $("#delete-btn").click(function () {
                var userIds = "";
                $("#treeTable tbody tr td input.i-checks:checkbox").each(function () {
                    if (true == $(this).is(':checked')) {
                        userIds += "," + $(this).attr("id");
                    }
                });
                if (userIds.length > 0) {
                    var data = {
                        appIds: userIds.substr(1),
                        orgId: id,
                    };
                    deleteACallback('确认要将已选择的应用从<strong>[' + $(".roleType strong").text() + ']</strong>中移除吗？', function (layIdx) {
                        var url = Api.admin+'/api/sys/SysOrg/delApp';
                        Api.ajaxForm(url, data, function (result) {
                            if (result.success == true) {
                                top.layer.close(layIdx);
                                refreshLoad();
                                //去掉标题中的选中状态
                                $(".icheckbox_square-green").find("[type='checkbox']").iCheck('uncheck');

                            }

                        });
                    });
                } else {
                    top.layer.alert('请至少选择一条数据!', {icon: 0, title: '警告'});
                }
            });

            //用拿到的数据渲染表格
            function renderTableData(tableData) {
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
                    "data": tableData,
                    "aoColumns": [
                        {
                            "data": null, "sWidth": "60px;", "defaultContent": "", 'sClass': "alignCenter",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "appName",'sClass': "alignCenter",},
                        {"data": "appCode",'sClass': "alignCenter",},
                        {"data": "appRoot",'sClass': "alignCenter",},
                        {"data": "applicability",'sClass': "alignCenter",},
                        {
                            "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter ",
                            "render": function (data, type, row, meta) {
                                return data= "<a class='btn-delete ' id='" + row.id + "'>删除</a >";
                            }
                        }]
                });
                renderIChecks();

            };

            //添加应用
            $("#assignButton").click(function () {
                top.layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    title: "分配应用",
                    content: "systemSettings/orgApp.html?id="+id,
                    btn: ['确定', '关闭'],
                    yes: function (index, layero) {
                        var iframeWin = layero.find('iframe')[0];
                        var selObj = iframeWin.contentWindow.getElement();//在layer中运行当前弹出页内的getSelectVal方法
                        var orgId=$('#roleId').val(),
                            data= {
                                orgId:orgId,
                                appIds:selObj
                            };
                        Api.ajaxForm(Api.admin+"/api/sys/SysOrg/addApp",data,function(result) {
                            if (result.success) {
                                top.layer.close(index);
                                refreshLoad()
                            } else {
                                Mom.layMsg(result.message);
                            }
                        });

                    },
                    cancel: function (index) {
                    }
                })

            });
        },

        orgApp: function(){
            require(['Page'],function(){
                window.pageLoad= function () {
                    var id = Mom.getUrlParam('id') || "";
                    var data = {
                        orgId:id
                    };
                    new Page().init(Api.admin+"/api/sys/SysOrg/selectApp",data, true, function (tableData) {
                        dataout(tableData);
                    });
                };
                pageLoad();
            });
            //表格渲染
            function dataout(data) {
                $('#treeTable').dataTable({
                    "bAutoWidth":false,
                    "bPaginate": false,
                    "bDestroy": true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "ordering": false,
                    "oLanguage": dataTableLang,
                    "data": data,
                    //定义列 宽度 以及在json中的列名
                    "columns": [
                        {
                            "data": null,"width":'5%',
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"

                            }
                        },
                        {"data": "sort",'sClass': " alignCenter",},
                        {"data": "appName",'sClass': " alignCenter",},
                        {"data": "appCode",'sClass': " alignCenter",},
                        {"data": "appRoot",'sClass': " alignCenter",},
                        {"data": "applicability",'sClass': " alignCenter",}

                    ],

                });
                renderIChecks();
            }

            //弹窗方法
            window.getElement = function(){
                if($('div.checked')){
                    var nodes=$('div.checked').parents('tr').children('td:nth-of-type(2)');
                    var name = nodes.html();
                    var ids=[];
                    $('div.checked').each(function (i) {
                        var id=$(this).children('input').attr('id');
                        ids.push(id);
                    });
                    var ids=ids.join();
                    var selObj = {'name':name,'appIds':ids};
                    return selObj.appIds;
                }
            }
        }
    };

    $(function(){
        //分配用户子页面
        if($('#orgAssign').length > 0){
            PageModule.orgAssign();
        }
        //添加人员
        else if($('#orgAssignUsers').length > 0){
            PageModule.orgAssignUsers();
        }
        else if($('#orgAllotApp').length > 0){
            PageModule.orgAllotApp();
        }
        else if($('#orgApp').length > 0){
            PageModule.orgApp();
        }

    });

});