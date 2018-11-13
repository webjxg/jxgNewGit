require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        proPreserveValue: function(){
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
                '../js/plugins/ztree/css/metroStyle/metroStyle.css'
            ]);
            var id = Mom.getUrlParam('id');//拿到url中其他页面传过来的id
            $('#officeContent').attr('src','./proPreserveValueTable.html?id='+id);
            require(['ztree_all'],function(){
                Api.ajaxJson(Api.admin+'/api/sys/SysAuthPropertyValue/list/'+id,'json',zTree);
            });
            //点击树刷新右侧列表过渡方法
            function zTree(da) {
                var data=da.zTree;
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
                                rendersun(node.id)
                            }
                        }
                    }

                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                var zNodes = data;
                //执行ztree
                var treeObj =$.fn.zTree.init($("#tree"), setting, zNodes);
            }
            //ztree点击后执行子页面方法
            function rendersun(data) {
                var id = Mom.getUrlParam('id');
                $('#officeContent')[0].contentWindow.updatason(data);
            }
        },

        proPreserveValueTable: function(){
            //承接父页面操作子iframe方法
            window.updatason = function (node){
                var id = Mom.getUrlParam('id');
                if(node==''){
                    var obj={"id":'',"sysAuthProperty":{"id":id}}
                }else{
                    var obj={"id":node,"sysAuthProperty":{"id":id}}
                }
                var data= JSON.stringify(obj);
                Api.ajaxJson(Api.admin+"/api/sys/SysAuthPropertyValue/ajaxTreeJson",data,function(tableData){
                    renderTableData(tableData.rows);
                    clickButton();
                });
            };
            var pageLoad = function () {
                var id = Mom.getUrlParam('id');
                var obj={"id":'',"sysAuthProperty":{"id":id}};
                var data= JSON.stringify(obj);
                Api.ajaxJson(Api.admin+"/api/sys/SysAuthPropertyValue/ajaxTreeJson",data,function(tableData){
                    require(['treeTable'],function() {
                        renderTableData(tableData.rows);
                        $('tbody tr').css('text-align', 'center');
                        clickButton();
                        $('#btnadd').click(function () {
                            var Sid = Mom.getUrlParam('id');
                            Bus.openEditDialog('添加属性', './systemSettings/proValueForSubmit.html?Sid=' + Sid + '&View=no', '800px', '326px')
                        });
                    });
                });
            };
            pageLoad();
            function clickButton() {
                $('.btn-check').click(function () {
                    var id = $(this).parents("tr").find('.i-Checks').attr('id');
                    Bus.openDialog('查看属性信息', './systemSettings/proValueCheckView.html?id=' + id+'&View=yes', '800px', '326px');

                });
                $('.btn-change').click(function () {
                    var id = $(this).parents("tr").find('.i-Checks').attr('id');
                    Bus.openEditDialog('修改属性信息', './systemSettings/proValueCheckView.html?id=' + id+'&View=no', '800px', '326px', doSubmitHandle)
                });
                $('.btn-delete').click(function () {
                    var id = $(this).parents("tr").find('.i-Checks').attr('id');
                    Bus.deleteItem('确定要删除该属性吗', Api.admin+'/api/sys/SysAuthPropertyValue/ajaxDel/'+id,{},function (result,layerIndex) {
                        top.layer.close(layerIndex);
                        if(result.success == true){
                            $('.fa-refresh',window.parent.document).trigger('click');
                        }else{
                            Mom.layAlert(result.message);
                        }
                    })
                });
                $('.btn-add').click(function(){
                    var id = $(this).parents("tr").find('.i-Checks').attr('id');
                    var Sid=Mom.getUrlParam('id');
                    Bus.openEditDialog('添加下级属性','./systemSettings/proValueForSubmit.html?pid='+id+"&Sid="+Sid+'&View=no','800px','326px',doSubmitHandle);
                });
            }
            // 渲染表格
            function renderTableData(data) {
                var tableStr = "";
                for (var i = 0; i < data.length; i++) {
                    var count = 'data-tt-id=' + data[i].id;
                    if (data[i]._parentId && data[i]._parentId != '') {
                        count += '  data-tt-parent-id=' + data[i]._parentId;
                    }
                    tableStr += "<tr  " + count + " >"
                        + "<td class='i-Checks' id='" + data[i].id + "'>" + data[i].name + "</td>"
                        + "<td>" + data[i].value + "</td>"
                        + "<td>" +data[i].sort+ "</td>"
                        + "<td class='autoWidth' ><a class='btn btn-info btn-xs btn-check'><i class='fa fa-search-plus'></i>查看</a>" + " <a class='btn btn-success btn-xs btn-change'><i class='fa icon-change'></i>修改</a>" + " <a class='btn btn-danger btn-xs btn-delete'><i class='fa fa-trash'></i> 删除</a>" + "  <a class='btn btn-primary btn-xs btn-add'><i class='fa fa-plus'></i> 添加下级节点</a>"
                        + "</tr>";
                }
                if (tableStr.length == 0) {
                    var len = $("#treeTable thead tr").children("th").length;
                    tableStr = "<tr style='text-align: center'><td colspan='" + len + "'><font color='#cd0a0a'>暂无记录</font></td></tr>";
                }
                $('#treeTableBody').html(tableStr);
                    $("#treeTable").treetable({expandable: true, column: 0}, true); //第二个参数表示为true时强制重新初始化树。
                Mom.setFrameHeight();
            }

            window.doSubmitHandle = function(index,layero){
                var iframeWin = layero.find('iframe')[0].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var innerFormObj = iframeWin.getFormData();
                if(innerFormObj){
                    Api.ajaxJson(innerFormObj.url, innerFormObj.formdata,function(result){
                        if(result.success == true){
                            Mom.layMsg('已成功提交',{time: 1000});
                            top.layer.close(index);
                            $('.ztree-refresh',parent.window.document).trigger('click');
                        }else{
                            Mom.layAlert(result.message)
                        }
                    });
                }
            }

        },
        //修改页面
        proValueCheckView: function(){
            var id = Mom.getUrlParam('id');
            $('#id').val(id);
            if (id) {
                /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                var url = Api.admin+"/api/sys/SysAuthPropertyValue/view/" + id;
                Api.ajaxJson(url, {}, function (result) {
                    if (result.success) {
                        Validator.renderData(result.sysPropVal, $('#inputForm'));
                        Validator.renderData(result, $('#inputForm'));
                        $('#sysAuthPropertyName').val(result.sysPropVal.sysAuthProperty.name);
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            }
            PageModule.getFormDataInnerWindow();
        },
        //添加下级节点页面
        proValueForSubmit: function(){
            //加载数据
            var id = Mom.getUrlParam('pid');
            var Sid= Mom.getUrlParam('Sid');
            $('#sysAuthPropertyId').val(Sid);
            $('#parentId').val(id);
            var obj={"parent":{"id":id},"sysAuthProperty":{"id":Sid}};
            var data=JSON.stringify(obj);
            $('#id').val(id);
            var url = Api.admin+"/api/sys/SysAuthPropertyValue/form";
            Api.ajaxJson(url, data, function (result){
                if (result.success) {
                    $('#parentName').text(result.parentName);
                    $('#sysAuthPropertyName').val(result.SysAuthPropertyValue.sysAuthProperty.name);
                } else {
                    alert('错误');
                    Mom.layMsg(result.message);
                }

            });
            PageModule.getFormDataInnerWindow();
        },

        getFormDataInnerWindow: function(){
            //定义获取form参数函数，在父窗口中调用子窗口方法获取
            window.getFormData = function(){
                //表单验证
                if(!Validator.valid(document.forms[0],1.3)){
                    return null;
                }
                var formObj =$("#inputForm");
                var url = formObj.attr('action');
                var formdata = JSON.stringify(formObj.serializeJSON());
                return {url: url, formdata: formdata};
            }
        }

    };

    $(function(){
        //维护属性值
        if($('#proPreserveValue').length > 0){
            PageModule.proPreserveValue();
        }
        else if($('#proPreserveValueTable').length > 0){
            PageModule.proPreserveValueTable();
        }
        else if($('#proValueCheckView').length > 0){
            PageModule.proValueCheckView();
        }
        else if($('#proValueForSubmit').length > 0){
            PageModule.proValueForSubmit();
        }

    });

});