require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

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

            function btncilck(){
                // 点击修改按钮
                $('#edit-btn').unbind().click(function(){
                    var nodes = $('#tt').treegrid('getChecked');
                    if(nodes.length == 0 ){
                        top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
                        return;
                    }

                    if(nodes.length > 1 ){
                        top.layer.alert('只能选择一条数据!', {icon: 0, title:'警告'});
                        return;
                    }
                    var id =  nodes[0].id;
                    openEditDialogDic('修改菜单','systemSettings/menuInner.html?id='+id,'600px','462px');
                });
                // 删除checkbox选中的
                $('#delete-btn').unbind().click(function(){
                    var nodes = $('#tt').treegrid('getChecked');
                    var str="";
                    if(nodes.length > 0){
                        nodes.forEach(function(item){
                            str += "," + item.id;
                        })
                    }
                    if(str.length>0){
                        var data = {
                            ids:str.substr(1)
                        };
                        top.layer.confirm('要删除该菜单及所有子菜单项吗？', {icon: 3, title:'系统提示'}, function(index){
                            Api.ajaxForm(Api.admin + '/api/sys/SysMenu/ajaxDel',data,function (result) {
                                if(result.success == true){

                                    nodes.forEach(function(item){
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_removeTreegridNode('#tt',item.id);
                                            btncilck();
                                        });
                                    })
                                }else{
                                    layer.msg(result.message);
                                }
                            });
                            top.layer.close(index);
                        });
                    }else{
                        top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
                    }
                })
                // 排序按钮
                $('#updateSort-btn').unbind().click(function(){
                    var ids="",sorts="";
                    $("input[name='sort']").each(function(ind,item){
                        var id = $(item).attr('data-id');
                        var itemDVal= $(item).attr("data-val");
                        var itemVal = $(item).val();
                        if(itemDVal !== itemVal){
                            ids+= ","+id;
                            sorts+= ","+itemVal;
                        }
                    });
                    if(ids.length>0){
                        ids = ids.substring(1);
                        sorts = sorts.substring(1);
                        var data = {
                            ids: ids,
                            sorts: sorts
                        };
                        Api.ajaxForm(Api.admin + "/api/sys/SysMenu/ajaxSort",data,function(result){
                            if(result.success){
                                pageLoad();
                            }else{
                                Mom.layAlert(result.message);
                            }
                        })
                    }else{
                        Mom.layMsg("没有修改任何排序！")
                    }
                })
                // 查看
                $('.btn-check').unbind().click(function () {
                    var id = $(this).attr('id');
                    Bus.openDialog('查看菜单','systemSettings/menuInner.html?id='+id,'800px','500px')
                });
                //修改
                $('.btn-change').unbind().click(function () {
                    var id = $(this).attr('id');
                    openEditDialogDic('修改菜单','systemSettings/menuInner.html?id='+id,'800px','500px')
                });
                //删除
                $('.btn-delete').unbind().click(function () {
                    var id = $(this).attr('id');
                    deleteItem('要删除该菜单及所有子菜单项吗', Api.admin + '/api/sys/SysMenu/ajaxDel',id)
                });
                // 添加下级菜单
                $('.btn-add').unbind().click(function(){
                    var id = $(this).attr('id');
                    openEditDialogLevel('添加下级菜单','systemSettings/menuInner.html?pid='+id,'800px','500px')
                });

            }
            function pageLoad(node) {
                Api.ajaxJson(Api.admin+"/api/sys/SysMenu/getTreeGraidJson",{},function(tableData){
                    if(tableData.success){
                        //function editstate (data) {
                        //    data.forEach(function(item){
                        //        //if(item.state == 'closed'){
                        //        //    item.state = 'open';
                        //        //}
                        //        if(item.state == ' closed'){
                        //            item.state = 'open';
                        //        }
                        //        if(item.children.length > 0){
                        //            item.state = 'closed';
                        //            editstate(item.children);
                        //        }
                        //        if(item.children.length = 0){
                        //            item.state = 'open';
                        //            editstate(item.children);
                        //        }
                        //    })
                        //}
                        //editstate(tableData.rows);
                        require(['easyui_my'],function(){
                            $('#tt').treegrid({
                                idField:'id',
                                treeField:'name',
                                collapsible: true,
                                fitColumns: true,
                                striped: true,
                                //rownumbers: true,
                                // 下面参数可以获取全选或多选
                                singleSelect : false,
                                checkOnSelect : false,
                                selectOnCheck : true,
                                columns:[[
                                //    {field:'ck',title:'ck',width:50,align:'center',checkbox:true,formatter: function(value,row,index){
                                //       return "<input type='checkbox' id=" + row.id + " class='i-checks' name='id'>"
                                //}},
                                    {field:'ck',title:'ck',width:60,align:'center',checkbox:true},
                                    {field:'name',title:'名称',width:150,align:'left'},
                                    {field:'href',title:'链接',width:220,align:'center'},
                                    {field:'sort',title:'排序',width:100,align:'center',formatter: function(value,row,index){
                                        return "<input type='number' name='sort' data-id='"+ row.id+"' value= '"+row.sort+"' data-val='"+ row.sort+"'>" ;
                                    }},
                                    {field:'is_show',title:'可见',width:50,align:'center',formatter: function(value,row,index){
                                        if(row.is_show == 1){
                                            return '是'
                                        }else{
                                            return '否'
                                        }
                                    }},
                                    {field:'module',title:'所属模块',width:80,align:'center'},
                                    {field:"text",title:"操作",align:'center',width:300,formatter: function(value,row,index){
                                        return "<a class='btn  btn-info btn-check' id='"+ row.id+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                            " <a class='btn btn-success  btn-change' id='"+ row.id+"');'><i class='fa icon-change'></i>修改</a>" +
                                            " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"'><i class='fa fa-trash'></i> 删除</a>"  +
                                            " <a class='btn  btn-add btn-target' id='"+ row.id+"'><i class='fa fa-plus'></i>添加下级菜单</a>";
                                    }},
                                ]],
                                data:tableData
                            });
                            btncilck();
                            renderIChecks();//

                        });

                    }else{
                        Mom.layMsg (tableData.message)
                    }
                })
            }

            pageLoad();

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
                                    Api.ajaxJson(Api.admin+"/api/sys/SysMenu/getTreeGraidJson",{},function(tableData){
                                        var ArrayData =tableData.rows;
                                        getNodeId(ArrayData);
                                        function getNodeId (data) {
                                            data.forEach(function(item){
                                                if(item.name == objDic.name && item.sort == objDic.sort){
                                                    editNode = item;
                                                }
                                                if(item.children.length > 0 ){
                                                    getNodeId(item.children);
                                                }
                                            })
                                        }
                                        var data = {
                                            name: editNode.name ,
                                            href: editNode.href,
                                            sort: editNode.sort,
                                            is_show: editNode.is_show,
                                            module: editNode.module
                                        }
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_editTreegridNode('#tt',objDic.id, data);
                                            btncilck();
                                        });

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
                                    Api.ajaxJson(Api.admin+"/api/sys/SysMenu/getTreeGraidJson",{},function(tableData){
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
                                            href: editNode.href,
                                            sort: editNode.sort,
                                            is_show: editNode.is_show,
                                            module: editNode.module
                                        }];
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_appendTreegridNode('#tt',objDic.parent.id, data);
                                            btncilck();
                                        });

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
                var data = {ids:id} || {};
                top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index){
                    Api.ajaxForm(url,data,function(result){
                        if(result.success == true){
                            require(['easyui_my'],function(easyuiObj){
                                easyuiObj.tg_removeTreegridNode('#tt',id);
                                btncilck();
                            });
                        }
                    });
                    top.layer.close(index);
                });
                return false;
            }

                //同步属性
                $("#sync-btn").click(function(){
                    Api.ajaxForm(Api.admin+"/api/sys/SysMenu/ajaxSys",{},function(result){
                        Mom.layAlert(result.message);
                    })
                });

        },
        menuInner: function(){
            Mom.include('myCss', '', [
                '../css/comInnerTable.css',
            ]);
            var id =Mom.getUrlParam('id')||'',
                pid = Mom.getUrlParam('pid') || '',
                data = {
                    "id":id,
                    "parent":{
                        "id":pid
                    }
                };
            data = JSON.stringify(data);
            $("#value").focus();
            if( id != "" || pid != "" ){
                var url = Api.admin+"/api/sys/SysMenu/form";
                Api.ajaxJson(url,data,function(result){
                    if(result.success){
                        var SysMenu = result.SysMenu;
                        Validator.renderData(SysMenu,$('#inputForm'));
                        $("#menuId").val(SysMenu.parentId);
                        $("#menuName").val(result.parentName);
                        $("#iconIconLabel").text(SysMenu.icon?SysMenu.icon:"无");
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }
            $("#menuButton").click(function(){
                // 多选的情况下multiple = true,否则为false;
                var url = "systemSettings/selectTree.html?multiple=false&defaultVal="+$("#menuId").val();
                url += "&dataUrl="+Api.admin+"/api/sys/SysMenu/openTree";
                Bus.openDialog("选择上级菜单",url,"300px","400px",function(index, layero){
                    var iframeWin = layero.find('iframe')[0];
                    var selArr=iframeWin.contentWindow.getCheckVal();
                    if(selArr){
                        var name = "",id ="";
                        for(var i = 0;i<selArr.length;i++){
                            name += ","+selArr[i].name;
                            id += ","+selArr[i].id;
                        }
                        if(id.length>0){
                            $("#menuName").val(name.substr(1));
                            $("#menuId").val(id.substr(1));
                        }

                    }
                });
                // renderIChecks();
            });
            // 选择图标icon
            $("#iconButton").click(function(){
                var selVal = $('#icon').val();
                top.layer.open({
                    type: 2,
                    maxmin: false,
                    title:"选择图标",
                    area: ['700px',  $(top.document).height()-180+"px"],
                    content: '../systemSettings/iconselect.html?selVal='+selVal,
                    btn: ['确定', '关闭'],
                    yes: function(index, layero){ //或者使用btn1
                        var icon = layero.find("iframe")[0].contentWindow.$("#icon").val();
                        $("#iconIcon").attr("class", "fa "+icon);
                        $("#iconIconLabel").text(icon);
                        $("#icon").val(icon);
                        top.layer.close(index);
                    },cancel: function(index){ //或者使用btn2

                    }
                });
            });

            $("#iconclear").click(function(){
                $("#iconIcon").attr("class", "icon- hide");
                $("#iconIconLabel").text("无");
                $("#icon").val("");
            });

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
        }
    };

    $(function(){
        //菜单管理列表
        if($('#menu-content').length > 0){
            PageModule.listInit();
        }
        //菜单子页(新增，修改，查看)
        else if($('#menuInner').length > 0){
            PageModule.menuInner();
        }


    });

});