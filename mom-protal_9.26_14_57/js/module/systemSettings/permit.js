require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser','ztree_all']);
    Mom.include('myCss', '', [
        '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
    ]);

    var PageModule = {
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                var page = new Page();
                window.pageLoad = function (){
                    var data = {
                        nameParam: $("#permitName").val(),
                        codeParam: $("#permitCode").val(),
                        enable:$("#permitEnable").val()
                    };
                    //修改默认每页显示条数
                    page.init(Api.admin+"/api/sys/SysPermission/page",data,true,function(tableData, result){
                        renderTableData(tableData);
                        $('.btn-check').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('查看许可','systemSettings/permitInner.html?id='+id+'&api=view','654px','282px')
                        });
                        $('.btn-change').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改许可','systemSettings/permitInner.html?id='+id+'&api=form','654px','282px');
                        });
                        $('.btn-delete').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该许可吗',Api.admin+'/api/sys/SysPermission/delete',id)
                        });
                        $('.btn-empower').click(function(){
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('授权数据','systemSettings/permitAuthData.html?id='+id,'900px','500px')
                        });
                    });
                };
                //点击重置按钮
                $('#reset-btn').click(function(){
                    $("#permitEnable option:first").prop("selected", 'selected');
                    $("#permitName").val("");
                    $("#permitCode").val("");
                    page.reset(["nameParam","codeParam","enable"]);
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
                        {"bSortable": false, "aTargets": [0, 2, 6]}
                    ],
                    "oLanguage": dataTableLang,
                    "data":tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"60px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "name",'sClass':" alignCenter"},
                        {"data": "code",'sClass':"alignCenter ","width":"15%"},
                        {"data": "des",'sClass':"alignCenter","width":"15%"},
                        {"data": "sort",'sClass':"alignCenter","width":"8%"},
                        {"data": "enable",'sClass':"alignCenter","width":"8%", "defaultContent": "","render":function (data, type, row, meta){
                                var chahgeType;
                                return chahgeType = row.enable==0?"否":"是";
                            }},
                        {
                            "data": "id", "orderable": false, "defaultContent": "",'sClass':" alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >" +
                                    "<a class='btn btn-success btn-xs btn-change' ><i class='fa icon-change'></i>修改</a >" +
                                    "<a class='btn btn-danger btn-xs btn-delete' ><i class='fa fa-trash-o' ></i>删除</a >" +
                                    "<a class='btn  btn-xs btn-empower'><i class='fa icon-accredit'></i>授权数据</a >";
                            }
                        }]
                });
                renderIChecks();
            }
        },

        formInit: function(){
            var id =Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            var url = Api.admin+"/api/sys/SysPermission/"+api+"/"+id;
            Api.ajaxJson(url,{},function(result){
                if(result.success){
                    var data = result.SysPermission;
                    var operId ="",
                        operName = "",
                        authClassId = "",
                        authClassName = "";
                    if(api == 'view'){
                        operId = data.sysOperation.id;
                        operName = data.sysOperation.name;
                        authClassId = data.sysAuthClass.id;
                        authClassName =data.sysAuthClass.name;
                        var html = "<option value='"+operId+"'>"+(operName||'无')+"</option>";
                        $("#operationId").empty().append(html).val(operId);
                        var html1 = "<option value='"+authClassId+"'>"+(authClassName||"无")+"</option>";
                        $("#authClass").empty().append(html1).val(authClassId);
                    }
                    else if(api == 'form'){
                        if(id) {
                            operId = data.sysOperation.id;
                            authClassId = data.sysAuthObject.sysAuthClass.id ;
                        }
                        var operIdArr =  result.OperationList,
                            authClassIdArr = result.AuthClassList;
                        Bus.appendOptionsValue('#operationId', operIdArr, 'id', 'name');
                        $("#operationId").val(operId||'');
                        Bus.appendOptionsValue('#authClass', authClassIdArr, 'id', 'name');
                        $("#authClass").val(authClassId||'');
                    }
                    Validator.renderData(data,$('#inputForm'));
                }else{
                    Mom.layMsg(result.message);
                }
            });
        },

        formInitData: function(){
            var id =Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form',
                html = html1 = "";
            var url = Api.admin+"/api/sys/SysPermission/"+api+"/"+id;
            Api.ajaxJson(url,{},function(result){
                if(result.success){
                    if(api == 'view'){
                        var data = result.SysPermission;
                        var operId =data.id,
                            operName = data.name,
                            authClassId = data.id,
                            authClassName =data.name;
                        html += "<option value='"+operId+"'>"+operName+"</option>";
                        html1 += "<option value='"+authClassId+"'>"+(authClassName == null?"无":authClassName)+"</option>";
                        $("#operationId").empty().append(html).val(operId);
                        $("#authClass").empty().append(html1).val(authClassId);
                    }else if(api == 'form'){
                        if(id){
                            var  data = result.SysPermission;
                            var  operIdArr =  result.OperationList,
                                authClassIdArr = result.AuthClassList,
                                operId =data.sysOperation.id,
                                authClassId = data.sysAuthObject.sysAuthClass.id;
                            authClassName = data.sysAuthObject.sysAuthClass.name;
                            authClassId = authClassName == null ?"":authClassId;
                            renderSelect(operId,authClassId);
                        }else{
                            var operIdArr = result.OperationList,
                                authClassIdArr =result.AuthClassList;
                            renderSelect("请选择","");
                        }
                        function renderSelect(operId,authClassId){
                            for(var i=0;i<operIdArr.length;i++) {
                                operIdFor = operIdArr[i].id;
                                operNameFor = operIdArr[i].name;
                                html += "<option value='" + operIdFor + "'>" + operNameFor + "</option>";
                            }
                            for(var i=0;i<authClassIdArr.length;i++) {
                                authClassIdFor = authClassIdArr[i].id;
                                authClassNameFor = authClassIdArr[i].name;
                                html1 += "<option value='" + authClassIdFor + "'>" + authClassNameFor + "</option>";
                            }
                            $("#operationId").empty().append(html).val(operId);
                            $("#authClass").empty().append(html1).val(authClassId);
                        }
                    }
                    Validator.renderData(data,$('#inputForm'));
                }else{
                    Mom.layMsg(result.message);
                }
            });
            function refreshLoad(){
                $("#permitAuthZtree").trigger("change");
            }
            var id =Mom.getUrlParam('id');
            $("#permissionId").val(id);
            var selHtml = html1 = "";
            var zTreeObj,objectId,permissionId,propId;
            var setting = {
                check:{
                    // chkboxType: { "Y": "ps", "N": "ps" },
                    chkStyle: "checkbox",//复选框类型
                    enable: true //每个节点上是否显示 CheckBox
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                    }
                },
                view: {
                    //禁止树节点多选
                    selectedMulti: false
                },
                callback: {
                    onDblClick: onDblClick,
                    onCheck:zTreeOnCheck
                }
            };
            Api.ajaxJson(Api.admin+'/api/sys/SysPermission/authData/'+id,{},function(result){
                if(result.success){
                    var data = result.SysPermission,
                        sysOperation = data.sysOperation;
                    var  selList = data.sysAuthClass.sysAuthProperties;
                    var html = "<span>许可:["+data.name+"]</span><span>鉴权类:["+data.sysAuthClass.name+"]</span><span>操作:["+(sysOperation?sysOperation.name:'无')+"]</span>";
                    $('.permitAuthTit').empty().html(html);
                    $('#objectId').val(data.sysAuthObject.id);
                    for(var i=0;i<selList.length;i++){
                        selHtml += "<option value='"+selList[i].id+"'>" +selList[i].name+"</option>";
                    }
                    $("#permitAuthZtree").empty().append(selHtml);
                    refreshLoad();
                }
            });
            $('#objectId').val();
            $('#permitAuthZtree').change(function(){
                var val = $(this).val();
                objectId = $('#objectId').val(),
                    url = Api.admin+"/api/sys/SysPermission/listPropVal/"+objectId+"/"+val;
                Api.ajaxJson(url,{},function(result){
                    if(result.success==true) {
                        var treeNodes = JSON.stringify(result.zTree);
                        var checkNodes = result.checkIds;
                        $("#propvals").val(checkNodes);
                        initZtree(treeNodes);
                        if(checkNodes){
                            for (var i = 0; i < checkNodes.length; i++) {
                                var treeObj = $.fn.zTree.getZTreeObj("tree");
                                var node = treeObj.getNodeByParam("id", checkNodes[i]);
                                node.checked = true;
                                treeObj.updateNode(node);
                            }
                        }
                    }
                });
            });
            function onDblClick(event, treeId, treeNode){
                var id = treeNode.id;
                var url = Api.admin+"/api/sys/SysAuthPropertyValue/perimissionview/"+id;
                Api.ajaxJson(url,{},function(result){
                    if(result.success){
                        var data = result.SysAuthPropertyValue;
                        Validator.renderData(data,$('#permitAuthTab'));
                        $("#permitPro").empty().text(data.sysAuthProperty.code);
                        $("#enable").text((data.enable==1?"是":"否"));
                    }
                });
            }
            //初始化ZTree树
            function initZtree(data) {
                var zNodes = eval("(" + data + ")");//动态js语句
                zTreeObj = $.fn.zTree.init($('#tree'), setting, zNodes);	//Tree 树的id，支持多个树
                zTreeObj.expandAll(true);		//展开所有树节点
            }

            function zTreeOnCheck(event,treeId,treeNode){
                var treeObj=$.fn.zTree.getZTreeObj("tree"),
                    nodes=treeObj.getCheckedNodes(true),
                    propvals ="";
                for(var i=0;i<nodes.length;i++){
                    propvals+=","+nodes[i].id ;
                }
                if(propvals.length>0){
                    propvals = propvals.substring(1,propvals.length);
                    $("#propvals").val(propvals);
                }
            }

        },

    };

    $(function(){
        //许可维护列表
        if($('#permit').length > 0){
            PageModule.listInit();
        }
        else if($('#permitInner').length > 0){
            PageModule.formInit();
        }
        //授权数据
        else if($('#permitAuthData').length > 0){
            PageModule.formInitData();
        }

    });

});