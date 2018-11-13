require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        proPreserveValue: function(){
            var propId = Mom.getUrlParam('id');
            require(['ztree_my','easyui_my'],function(ZTree,easyuiObj){
                var ztree = new ZTree(), treeObj;
                Api.ajaxJson(Api.admin+'/api/sys/SysAuthPropertyValue/list/'+propId,{},function(result){
                    if(result.success){
                        var ztreeSetting = {
                            callback:{
                                onClick: function (e, treeId, node){
                                    if(node.id){
                                        if(node.id==''){
                                            var obj={"id":'',"sysAuthProperty":{"id":propId}};
                                        }else{
                                            var obj={"id":node.id,"sysAuthProperty":{"id":propId}};
                                        }
                                        loadTreeTable(JSON.stringify(obj));
                                    }
                                }
                            }
                        };
                        treeObj = ztree.loadData($("#tree"),result.zTree,false,ztreeSetting);
                    }else{
                        Mom.layAlert(result.message);
                    }
                });

                function loadTreeTable(data){
                    var url = Api.admin+"/api/sys/SysAuthPropertyValue/ajaxTreeJson";
                    Api.ajaxJson(url,data,function(result){
                        if(result.success){
                            renderTableData(result.rows);
                        }else{
                            Mom.layAlert(result.message);
                        }
                    });
                }

                // 渲染表格
                function renderTableData(tableData) {
                    $('#tt').treegrid({
                        idField:'id',
                        treeField:'name',
                        collapsible: true,
                        fitColumns: true,
                        singleSelect : true,
                        data: tableData,
                        columns:[[
                            {field:'name',title:'名称',width:150,align:'left'},
                            {field:'value',title:'值',width:80,align:'center'},
                            {field:'sort',title:'排序',width:80,align:'center'},
                            {field:'null',title:"操作",align:'center',width:300,formatter: function(value,row,index){
                                return "<a class='btn  btn-info btn-check' id='"+ row.id+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                        " <a class='btn btn-success btn-mr btn-change' id='"+ row.id+"'><i class='fa icon-change'></i>修改</a>" +
                                        " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"'><i class='fa fa-trash'></i> 删除</a>"  +
                                        " <a class='btn  btn-add btn-target' id='"+ row.id+"'><i class='fa fa-plus'></i>添加下级节点</a>";
                                }
                            }
                        ]]
                    });
                    clickButton();
                }
                function clickButton() {
                    $('.btn-check').click(function () {
                        var id = $(this).attr('id');
                        Bus.openDialog('查看属性信息', './systemSettings/proValueCheckView.html?id=' + id+'&oper=view', '805px', '340px');

                    });
                    $('.btn-change').click(function () {
                        var id = $(this).attr('id');
                        Bus.openEditDialog('修改属性信息', './systemSettings/proValueCheckView.html?id=' + id+'&oper=edit', '805px', '340px', doSubmitHandle)
                    });
                    $('.btn-delete').click(function () {
                        var id = $(this).attr('id');
                        Bus.deleteItem('确定要删除该属性吗', Api.admin+'/api/sys/SysAuthPropertyValue/ajaxDel/'+id,{},function (result,layerIndex) {
                            if(result.success == true){
                                // $('.ztree-refresh').trigger('click');
                                easyuiObj.removeTreegridNode('#tt', id);
                                var node = treeObj.getNodeByParam("id", id, null);
                                treeObj.removeNode(node);
                                return true;
                            }else{
                                Mom.layAlert(result.message);
                            }
                            return false;
                        });
                    });
                    $('.btn-target').click(function(){
                        var id = $(this).attr('id');
                        Bus.openEditDialog('添加下级属性','./systemSettings/proValueForSubmit.html?pid='+id+"&Sid="+propId+'&oper=addSon','800px','340px',doSubmitHandle);
                    });
                }

                function doSubmitHandle(layerIdx,layero){
                    var iframeWin = layero.find('iframe')[0].contentWindow;
                    var formData = iframeWin.getFormData();
                    if(formData){

                    }
                }

                var initData={"id":'',"sysAuthProperty":{"id":propId}};
                loadTreeTable(JSON.stringify(initData));
            });
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
                        $('#parentName').val(result.parentName);
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
                    $('#parentName').val(result.parentName);
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
        else if($('#proValueCheckView').length > 0){
            PageModule.proValueCheckView();
        }
        else if($('#proValueForSubmit').length > 0){
            PageModule.proValueForSubmit();
        }

    });

});