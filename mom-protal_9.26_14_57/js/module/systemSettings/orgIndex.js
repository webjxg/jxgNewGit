require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser','treeTable']);

    var PageModule = {
        listInit: function(){
            //引入zTree样式
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
                '../js/plugins/ztree/css/metroStyle/metroStyle.css',
                '../js/plugins/easyui/themes/default/easyui.css',
                '../js/plugins/treetable/css/jquery.treetable.css',
                '../js/plugins/treetable/css/jquery.treetable.theme.default.css',
                '../js/plugins/datatables/css/jquery.dataTables.min.css'
            ]);
            require(['ztree_all'],function(){
                Api.ajaxJson(Api.admin+'/api/sys/SysOrg/leftTree','json',zTree);
            });
            function zTree(da) {
                var data=da.rows;
                var zTreeObj;
                // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,   //设置是否使用简单数据模式(Array)
                            idKey: "id",    //设置节点唯一标识属性名称
                            pIdKey: "pId"      //设置父节点唯一标识属性名称
                        },
                        key: {
                            name: "name",//zTree 节点数据保存节点名称的属性名称
                            title: "name"//zTree 节点数据保存节点提示信息的属性名称
                        }
                    },
                    callback: {
                        onClick: function (e, treeId, node){
                            if(node.id){
                                updatason(node.id)
                            }
                        }
                    }

                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                var zNodes = data;
                //执行ztree
                var treeObj =$.fn.zTree.init($("#tree"), setting, zNodes);
            }
            function updatason(node){
                load(node);
            }
            var pageLoad = function () {
                load(0);
            };
            pageLoad();

            function btncilck(){
                // 查看
                $('.btn-check').click(function () {
                    var id = $(this).attr('id');
                    Bus.openDialog('查看组织机构信息', './systemSettings/orgCheckView.html?id=' + id, '800px', '600px')
                });
                //修改
                $('.btn-change').click(function () {
                    var id = $(this).attr('id');
                    openEditDialogDic('修改组织机构信息', './systemSettings/orgCheckView.html?id=' + id, '800px', '600px')
                });
                //删除
                $('.btn-delete').click(function () {
                    var id = $(this).attr('id');
                    deleteItem('确定要删除该机构吗', Api.admin+'/api/sys/SysOrg/del/',id)
                });
                // 添加下级菜单
                $('.btn-add').click(function(){
                    var id = $(this).attr('id');
                    openEditDialogLevel('添加下级菜单','./systemSettings/orgCheckView.html?pid='+id,'800px','600px')
                });
                // 分配用户
                $('.btn-allot').click(function(){
                    var id = $(this).attr('id');
                    var type = $(this).attr('data-type');
                    Bus.openDialog('分配用户','./systemSettings/orgAssign.html?id='+id+'&type='+type,'800px','600px');
                });
                // 分配应用
                $('.btn-allotApp').click(function(){
                    var id = $(this).attr('id');
                    Bus.openDialog('分配应用','./systemSettings/orgAllotApp.html?id='+id,'800px','600px');
                });
            }
            // 加载右侧数据
            function load(node) {
                Api.ajaxJson(Api.admin+"/api/sys/SysOrg/treeJson/"+node,{},function(tableData){
                    if(tableData.success){
                        require(['easyui_my'],function(){
                            $('#tt').treegrid({
                                idField:'id',
                                treeField:'name',
                                collapsible: true,
                                fitColumns: true,
                                singleSelect : true,
                                columns:[[
                                    {field:'name',title:'机构名称',width:150,align:'left'},
                                    {field:'typeLabel',title:'机构类型',width:80,align:'center'},
                                    {field:'gradeLabel',title:'机构等级',width:80,align:'center'},
                                    {field:"text",title:"操作",align:'center',width:400,formatter: function(value,row,index){
                                        if(row.type=="1"|| row.type=="0"){
                                            return "<a class='btn  btn-info btn-check' id='"+ row.id+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                                " <a class='btn btn-success btn-mr btn-change' id='"+ row.id+"'><i class='fa icon-change'></i>修改</a>" +
                                                "<a class='btn   btn-xs btn-allotApp' id='"+ row.id+"'><i class='fa fa-pie-chart'></i> 分配应用</a>" +
                                                " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"'><i class='fa fa-trash'></i> 删除</a>"  +
                                                " <a class='btn  btn-add btn-target' id='"+ row.id+"'><i class='fa fa-plus'></i>添加下级指标</a>";
                                        }else{
                                            return "<a class='btn  btn-info btn-check' id='"+ row.id+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                                " <a class='btn btn-success btn-mr btn-change' id='"+ row.id+"'><i class='fa icon-change'></i>修改</a>" +
                                                "<a class='btn  btn-warning btn-xs btn-allot' id='"+ row.id+"' data-type='"+ row.type+"'><i class='fa fa-user'></i> 分配用户</a> " +
                                                "<a class='btn   btn-xs btn-allotApp' id='"+ row.id+"'><i class='fa fa-pie-chart'></i> 分配应用</a>" +
                                                " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"'><i class='fa fa-trash'></i> 删除</a>"  +
                                                " <a class='btn  btn-add btn-target' id='"+ row.id+"'><i class='fa fa-plus'></i>添加下级指标</a>";
                                        }
                                    }},
                                ]],
                                data:tableData,
                            });

                            btncilck();

                        });

                    }else{
                        Mom.layMsg(tableData.message)
                    }
                })
            }

            //修改
            function openEditDialogDic(title,url,width,height,innerCallbackFn){
                var clickFlag = true;
                if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
                    width='auto';
                    height='auto';
                }else{//如果是PC端，根据用户设置的width和height显示。
                }
                var ind =  top.layer.open({
                    type: 2,
                    area: [width, height],
                    title: title,
                    maxmin: false, //开启最大化最小化按钮
                    content: url ,
                    btn: ['确定', '关闭'],
                    yes: function(index, layero){
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if(clickFlag){
                            if(!innerCallbackFn){
                                iframeWin.contentWindow.doSubmit1(iframeWin.contentWindow,body,index);
                                var objDic = iframeWin.contentWindow.formdata;
                                // 通过id获取要修改数据
                                var editNode = '';
                                setTimeout(function(){
                                    Api.ajaxJson(Api.admin+"/api/sys/SysOrg/treeJson/" +0,{},function(tableData){
                                        var ArrayData =tableData.rows;
                                        getNodeId(ArrayData);
                                        function getNodeId (data) {
                                            data.forEach(function(item){
                                                if(item.name == objDic.name && item.code == objDic.code && item.grade == objDic.grade){
                                                    editNode = item;
                                                }
                                                if(item.children.length > 0 ){
                                                    getNodeId(item.children);
                                                }
                                            })
                                        }
                                        var data = {
                                            name: editNode.name ,
                                            typeLabel: editNode.typeLabel,
                                            gradeLabel: editNode.gradeLabel
                                        }
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_editTreegridNode('#tt',objDic.id, data);
                                            btncilck();
                                        });

                                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                                        var node = treeObj.getNodeByParam("id", objDic.id, null);
                                        node.name = objDic.name;
                                        treeObj.updateNode(node);

                                    })
                                },500);


                            }else{
                                //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                                innerCallbackFn(iframeWin, body, index);

                            }
                            clickFlag = false;
                            setTimeout(function(){
                                clickFlag = true;
                            },3000);
                        }
                    },
                    cancel: function(index){
                    }
                });

            }

            //添加下级指标
            function openEditDialogLevel(title,url,width,height,innerCallbackFn){
                var clickFlag = true;
                if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
                    width='auto';
                    height='auto';
                }else{//如果是PC端，根据用户设置的width和height显示。
                }
                var ind =  top.layer.open({
                    type: 2,
                    area: [width, height],
                    title: title,
                    maxmin: false, //开启最大化最小化按钮
                    content: url ,
                    btn: ['确定', '关闭'],
                    yes: function(index, layero){
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if(clickFlag){
                            if(!innerCallbackFn){
                                iframeWin.contentWindow.doSubmit1(iframeWin.contentWindow,body,index);
                                var objDic = iframeWin.contentWindow.formdata;
                                // 添加到父节点需要获取添加子节点
                                var editNode = '';
                                setTimeout(function(){
                                    Api.ajaxJson(Api.admin+"/api/sys/SysOrg/treeJson/"+0,{},function(tableData){
                                        var ArrayData =tableData.rows;
                                        getNodeId(ArrayData);
                                        function getNodeId (data) {
                                            data.forEach(function(item){
                                                if(item.name == objDic.name && item.code == objDic.code && item.grade == objDic.grade){
                                                    editNode = item;
                                                }
                                                if(item.children.length > 0 ){
                                                    getNodeId(item.children);
                                                }
                                            })
                                        }
                                        // 添加到父节点下面
                                        var data = [{
                                            id: editNode.id,
                                            name: editNode.name ,
                                            typeLabel: editNode.typeLabel,
                                            gradeLabel: editNode.gradeLabel
                                        }];
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_appendTreegridNode('#tt',objDic.parent.id, data);
                                            btncilck();
                                        });
                                        // 重新加载左侧树，由于存在异步操作，用到定时器
                                        setTimeout(function(){
                                            var newNodes  = '';
                                            Api.ajaxJson(Api.admin+'/api/sys/SysOrg/leftTree',{},function (data) {
                                                var ArrayDic =data.rows;
                                                ArrayDic.forEach(function(item,index){
                                                    if(item.name == objDic.name & item.type == objDic.type){
                                                        newNodes  = item;
                                                    }
                                                })
                                                var treeObj = $.fn.zTree.getZTreeObj("tree");
                                                var node = treeObj.getNodeByParam("id",newNodes.pId, null);
                                                newNode = treeObj.addNodes(node, newNodes);
                                            });
                                        },1000);
                                    });
                                },1000)

                            }else{
                                //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                                innerCallbackFn(iframeWin, body, index);

                            }
                            clickFlag = false;
                            setTimeout(function(){
                                clickFlag = true;
                            },3000);
                        }
                    },
                    cancel: function(index){
                    }
                });

            }

            //删除单条数据
            function deleteItem(mess,url,id){
                //var ids= eleP.find('input.i-checks').attr('id')
                var data = {id:id} || {};
                top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index){
                    Api.ajaxForm(url,data,function(result){
                        if(result.success == true){
                            require(['easyui_my'],function(easyuiObj){
                                easyuiObj.tg_removeTreegridNode('#tt',id);
                                btncilck();
                            });
                            // 重新加载左侧树，由于存在异步操作，用到定时器
                            setTimeout(function(){
                                var treeObj = $.fn.zTree.getZTreeObj("tree");
                                var node = treeObj.getNodeByParam("id",id, null);
                                treeObj.removeNode(node);
                            },1000);

                        }
                    });
                    top.layer.close(index);
                });
                return false;
            }

        },

        //查看(修改)组织机构信息 && 添加下级菜单
        formInit: function(){
            Mom.include('myCss', '', [
                '../css/comInnerTable.css',
            ]);
            // 获取机构类型
            Bus.createSelect(Api.admin+"/api/sys/SysDict/type/orgType","#type",'value','label');
            // 获取机构等级
            Bus.createSelect(Api.admin+"/api/sys/SysDict/type/orgGrade","#grade",'value','label');
            var id = Mom.getUrlParam('id');
            var pid = Mom.getUrlParam('pid');
            $("#id").val(id);
            if (id!==null) {
                /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                var url = Api.admin+"/api/sys/SysOrg/view/" + id;
                Api.ajaxForm(url, {}, function (result) {
                    if (result.success) {
                        var SysOrg = result.SysOrg;
                        Validator.renderData(SysOrg, $('#inputForm'));
                        /*运行把ajax数据渲染到弹出窗口中*/
                        $('#pname').val(SysOrg.primaryPerson?SysOrg.primaryPerson.name:"");
                        $('#dname').val(SysOrg.deputyPerson?SysOrg.deputyPerson.name:"");
                        $('#parentName').val(result.parentName);
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            }else if(pid!==null){
                var url = Api.admin+"/api/sys/SysOrg/view/" + pid;
                Api.ajaxForm(url, {}, function (result) {
                    if (result.success) {
                        var SysOrg = result.SysOrg;
                        $('#parentName').val(SysOrg.name);
                        $('#parentId').val(SysOrg.id);
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            }
            layerInZtreeAll('#parentalert', ['300px', '424px'], './systemSettings/orgParents.html', '#parentName', '#parentId');
            layerInPersons('#ppalert', ['800px', '600px'], './systemSettings/orgPersons.html', '#pname', '#pnameId');
            layerInPersons('#dpalert', ['800px', '600px'], './systemSettings/orgPersons.html', '#dname', '#dnameId');

            function layerInZtreeAll(btn,size,url,name,id) {
                $(btn).on('dblclick',function () {
                    top.layer.open({
                        btn: ['确定', '取消'],
                        shade: [0.4, '#000'], //0.1透明度的白色背景
                        type: 2,
                        title: '添加',
                        shadeClose: true,
                        maxmin: false, //开启最大化最小化按钮
                        area: size,
                        content: url,
                        yes:function (index,layero) {
                            var iframeWin = layero.find('iframe')[0];
                            var selobj=iframeWin.contentWindow.getSelectVal();//在layer中运行当前弹出页内的getSelectVal方法
                            if(selobj){
                                $(name).val(selobj.name);
                                $(id).val(selobj.id);
                            }
                            top.layer.close(index);
                        }
                    })
                })
            }

            function layerInPersons(btn,size,url,name,id) {
                $(btn).on('dblclick',function () {
                    top.layer.open({
                        btn: ['确定', '取消'],
                        shade: [0.4, '#000'], //0.1透明度的白色背景
                        type: 2,
                        title: '添加',
                        shadeClose: true,
                        maxmin: true, //开启最大化最小化按钮
                        area: size,
                        content: url,
                        yes: function (index, layero) {
                            var iframeWin = layero.find('iframe')[0];
                            var selobj = iframeWin.contentWindow.getElement();
                            if (selobj) {
                                $(name).val(selobj.name);
                                $(id).val(selobj.id);
                            }
                            top.layer.close(index);
                        }
                    })
                })
            }

            window.doSubmit1 = function(iframeWin, iframeBody, layerIdx){
                if(!Validator.valid(document.forms[0],1.3)){
                    return;
                }
                var formObj = $('#inputForm');
                var url = formObj.attr('action');
                var formdata = formObj.serializeJSON();
                window.formdata = formdata;
                Api.ajaxJson(url,JSON.stringify(formdata),function(result){
                    if(result.success == true){
                        Mom.layMsg('已成功提交',{time: 1000});
                        setTimeout(function(){
                            //关闭弹出层
                            top.layer.close(layerIdx);

                        },1000);
                    }else{
                        Mom.layAlert(result.message);
                    }
                });
            };

        },


        //选择上级机构
        orgParent: function(){
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
            ]);
            require(['ztree_all'],function(){
                Api.ajaxJson(Api.admin+'/api/sys/SysOrg/selectOrg','json',ztreeorgZtree2);
            });
            //user-ztree2页面使用 ajax并返回处理节点方法
            var zTreeObj;
            function ztreeorgZtree2(data) {
                var da=data.rows
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,   //设置是否使用简单数据模式(Array)
                            idKey: "id",    //设置节点唯一标识属性名称
                            pIdKey: "pId"      //设置父节点唯一标识属性名称
                        },
                        key: {
                            name: "name",//zTree 节点数据保存节点名称的属性名称
                            title: "name" //zTree 节点数据保存节点提示信息的属性名称
                        }
                    }
                };
                var zNodes = da;
                zTreeObj= $.fn.zTree.init($('#tree'), setting, zNodes);
                if(zTreeObj)
                {return getSelectVal}
            }
            window.getSelectVal = function(){
                if(zTreeObj){
                    var nodes = zTreeObj.getSelectedNodes();
                    if(nodes.length != 1){
                        layer.alert('只能选择一项', {
                            icon: 2,
                            offset: 't',
                        })
                    }
                    var id = nodes[0].id;
                    var name = nodes[0].name;
                    var pId = nodes[0].pId;
                    var type = nodes[0].type;
                    var selObj = {'id':id, 'name':name, 'pId':pId, 'type':type};
                    return selObj;
                }
            }
        },

        //选择负责人
        orgPerson: function(){
            require(['Page'],function(){
                var page = new Page();
                window.pageLoad = function () {
                    var data = {
                        companyId: $("#companyId").val(),
                        loginNameParam: $('#loginName').val(),
                        deptId: $('#officeId').val(),
                        nameParam: $('#name').val(),
                        treeId: $('#treeId').val()
                    };
                    page.init(Api.admin+"/api/sys/SysUser/page", data, true, function (tableData, result) {
                        dataout(tableData);
                    });
                };
                //点击重置按钮
                $("#reset-btn").click(function () {
                    $("#companyName").val("");
                    $("#companyId").val("");
                    $('#loginName').val("");
                    $('#officeName').val("");
                    $('#name').val("");
                    page.reset(["nameParam","deptId","loginNameParam","companyId"]);
                });
                pageLoad();
            });
            //选择公司
            $('.first-input-group').click(function () {
                Bus.openOrgSelect('type=1','#companyName', '#companyId', '请选择归属公司');
            });
            //选择部门
            $('.second-input-group').click(function () {
                var companyId=$('#companyId').val();
                Bus.openOrgSelect('type=2&id='+companyId,'#officeName', '#officeId', '请选择部门');
            });
            var treeId = Mom.getUrlParam("treeId");
            $('#treeId').val(treeId);

            //ajax请求渲染datatable数据
            function dataout(dataTable) {
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
                    "data":dataTable,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {"data": null,"sWidth":"10px;","defaultContent":"",'sClass':"alignCenter",
                            "render":function(data, type, row, meta) {
                                return data = "<input name='i-check' type='radio' id=" + row.id + " class='i-checks'>"
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
            //弹窗方法
            window.getElement = function(){
                var obj = {};
                $("#datainner tr td .i-checks").each(function (index,item) {
                    if($(item).is(":checked")) {
                        var id = $(this).attr("id");
                        var name = $(this).parents("td").next().next().text();
                        obj.id = id;
                        obj.name = name;
                    }
                });
                return obj;
            }
        },

    };

    $(function(){
        //机构管理首页
        if($('#orgIndex').length > 0){
            PageModule.listInit();
        }
        //查看(修改)组织机构信息 && 添加下级菜单
        else if($('#orgCheckView').length > 0){
            PageModule.formInit();
        }
        //选择上级机构
        else if($('#orgParents').length > 0){
            PageModule.orgParent();
        }
        //选择负责人
        else if($('#orgPersons').length > 0){
            PageModule.orgPerson();
        }
    });
});