require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['checkUser','ztree_all','icheck']);
    Mom.include('myCss', '', [
        '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
    ]);
    var PageModule = {
            /**模板列表页*/

            //模板页初始化
            planTempInit: function () {
                var pageLoad = function () {
                    require(['Page'], function () {
                        new Page().init(Api.aps + "/api/stocktake/StocktakeTemplate/page", {}, true, function(data) {
                            PageModule.planTempdataout(data);
                            $('.btn-preserve').click(function () {
                                var id = $(this).parents("tr").find('.i-checks').attr('id');
                                Bus.openDialog('项目信息维护', './inventoryTaking/planTempPreserve.html?id=' + id, '500px', '600px')
                            });
                            $('#add-btn').click(function () {
                                Bus.openEditDialog('新增模板', './inventoryTaking/planTempCheckView.html', '800px', '300px')
                            });
                            $('#edit-btn').click(function () {
                                Bus.editCheckedTable('修改模板信息', './inventoryTaking/planTempCheckView.html', '800px', '300px', '#treeTable')
                            });
                            $('#del-btn').click(function () {
                                Bus.delCheckTable('内置模板不允许删除，您确定要删除吗', Api.aps+'/api/stocktake/StocktakeTemplate/delete','#treeTable')
                            });
                        });
                    })

                };

                var treeId = Mom.getUrlParam("treeId");
                $('#treeId').val(treeId);
                pageLoad();

            },
            //   ajax请求渲染datatable数据
            planTempdataout: function (data) {
                $('#treeTable').dataTable({
                    "bSort": false,
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "pagingType": "full_numbers",
                    "oLanguage": dataTableLang,
                    "data": data,
                    //定义列 宽度 以及在json中的列名
                    "columns": [
                        {
                            "data": null, "width": "60px", "defaultContent": "",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "name", 'sClass': "alignLeft"},//修改内容居左
                        {"data": "types", 'sClass': "alignLeft"},//修改内容居左
                        {"data": "createDate", 'sClass': "alignCenter"},
                        {
                            "data": null, 'sClass': "alignCenter",
                            "render": function (data) {
                                if (data.enable == 0) {
                                    return data = '否'
                                } else {
                                    return data = '是'
                                }
                            }
                        },
                        {
                            "data": "id", "orderable": false, "defaultContent": "",
                            "render": function (data, type, row, meta) {
                                return data =
                                    "<a class='btn-maintain btn btn-preserve'><i class='fa icon-project' ></i>项目信息维护</a >"
                            }
                        }]


                });
                $('tbody tr').attr('class', 'alignCenter');
                renderIChecks();
            },

            /**模板添加，修改*/
            planTempupdata:function () {
                $('#inputForm').attr('action', Api.aps+"/api/stocktake/StocktakeTemplate/saveTemplate");
                var id = Mom.getUrlParam('id');
                $('#id').val(id);
                if (id) {
                    /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                    var url = Api.aps+"/api/stocktake/StocktakeTemplate/form/" + id;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            Validator.renderData(result.template, $('#inputForm'));
                            dsRender(result);
                        } else {
                            Mom.layMsg(result.message);
                        }

                    });

                }else{
                    dsRender();
                }
                function dsRender(res) {
                    Api.ajaxJson(Api.admin+'/api/sys/SysDict/type/PC_TEMPLETE',{},function (result) {
                        if(result.success) {
                            Bus.appendOptionsValue($('#opeCode'),result.rows,'value','value');
                            if(res!==undefined){
                                $('#opeCode').select2().val(res.template.types).trigger('change');
                            }else{
                                $('#opeCode').select2().val().trigger('change');

                            }

                        }else{
                            Mom.layMsg(result.message);
                        }
                    });
                }
                /*清除头像*/
                function getSubmitFormId(){
                    return "#inputForm";
                }
            },

            /**项目信息维护*/
            planTempPInit: function () {
                page = 'orgInner.html';
                var id = Mom.getUrlParam('id');
                $('#officeContent').attr('src', './orgInner.html');
                Api.ajaxJson(Api.aps + '/api/stocktake/StocktakeTemplate/formTemplateDetail/' + id, 'json', PageModule.zTree);
            },
            zTree: function (da) {
                var data = da.treeArr;
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
                        onClick: function (e, treeId, node) {
                            ids = '';
                            currentCode = '';
                            if (node.id) {
                                rendersun(node.id, node.name)
                            }

                            // 判断点击的是否为父节点
                            var treeObj = $.fn.zTree.getZTreeObj("tree");
                            var sNodes = treeObj.getSelectedNodes();
                            if (sNodes.length > 0) {
                                var flag = sNodes[0].isParent;
                                if(flag){ //当前点击节点是父节点
                                    getSonIds(node);


                                    function getSonIds(node){
                                        node.children.forEach(function(item){
                                            //ids += ',' + item.code;
                                            if(item.children){
                                                getSonIds(item);
                                            }else{
                                                ids += ',' + item.code;
                                            }
                                        })
                                    }
                                    ids = ids.substr(1);
                                }else{
                                    currentCode = node.code;
                                }
                            }
                        }
                    }

                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                var zNodes = data;
                //执行ztree
                require(['/js/plugins/ztree/js/jquery.ztree.core.js'], function () {
                    var treeObj = $.fn.zTree.init($("#tree"), setting, zNodes);
                });
                str = "";
                parentName = "";
                ids = '';//获取点击的所有子节点的codes
                currentCode = ''; //获取点击当前不是父节点的code
                function rendersun(data, nodename) {
                    str = data;
                    parentName = nodename;
                }

                var tempId = Mom.getUrlParam('id');
                //strΪztree��id
                $('#btn-add').click(function () {
                    EditDialogTemp('添加根指标', './inventoryTaking/planTempPreserveCV.html?id=0&tempId=' + tempId, '800px', '700px');
                });

                $('#btn-addSon').click(function () {
                    if (str === '') {
                        Mom.layMsg('请单选父级指标后再试');
                    } else {
                        EditDialogTempSon('添加下级指标', './inventoryTaking/planTempPreserveSon.html?id=' + str + '&tempId=' + tempId + '&ids=' + escape(ids)+ '&currentCode=' + escape(currentCode), '350px', '550px');
                    }
                });

                $('#btn-update').click(function () {
                    if (str === '') {
                        Mom.layMsg('请单选指标后再试');
                    } else {
                        EditDialogTemp(parentName, './inventoryTaking/planTempPreserveCVEdit.html?id=' + str, '800px', '500px')
                    }

                });

                $('#btn-del').click(function () {
                    if (str === '') {
                        Mom.layMsg('请单选指标后再试');
                    } else {
                        deleteItOne('确定要删除该指标吗', Api.aps + '/api/stocktake/StocktakeTemplate/delTempDetail/' + str)
                    }
                });


                //        删除
                function deleteItOne(mess, url) {
                    top.layer.confirm(mess, {icon: 3, title: '系统提示'}, function (index) {
                        Api.ajaxForm(url, {}, function (result) {
                            if (result.success == true) {
                                window.location.reload();
                            }
                        });
                        top.layer.close(index);
                    });
                    return false;
                }

                // 添加根指标弹窗
                function EditDialogTemp(title, url, width, height, innerCallbackFn) {
                    var clickFlag = true;
                    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {//如果是移动端，就使用自适应大小弹窗
                        width = 'auto';
                        height = 'auto';
                    } else {//如果是PC端，根据用户设置的width和height显示。
                    }
                    var ind = top.layer.open({
                        type: 2,
                        area: [width, height],
                        title: title,
                        maxmin: true, //开启最大化最小化按钮
                        content: url,
                        btn: ['保存', '取消'],
                        yes: function (index, layero) {
                            var body = top.layer.getChildFrame('body', index);  //获取子iframe
                            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                            if (clickFlag) {
                                if (!innerCallbackFn) {
                                    iframeWin.contentWindow.clicksubmit(iframeWin.contentWindow, body, index);
                                    window.location.reload();
                                } else {
                                    innerCallbackFn.call(iframeWin.contentWindow, iframeWin.contentWindow, body, index);
                                }
                                clickFlag = false;
                                setTimeout(function () {
                                    clickFlag = true;
                                }, 1500);
                            }

                        },
                        cancel: function (index) {
                        }
                    });

                }

                // 添加下级指标弹窗
                function EditDialogTempSon(title, url, width, height, innerCallbackFn) {
                    var clickFlag = true;
                    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {//如果是移动端，就使用自适应大小弹窗
                        width = 'auto';
                        height = 'auto';
                    } else {//如果是PC端，根据用户设置的width和height显示。
                    }
                    var ind = top.layer.open({
                        type: 2,
                        area: [width, height],
                        title: title,
                        maxmin: true, //开启最大化最小化按钮
                        content: url,
                        btn: ['保存', '取消'],
                        yes: function (index, layero) {
                            var body = top.layer.getChildFrame('body', index);  //获取子iframe
                            var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                            if (clickFlag) {
                                if (!innerCallbackFn) {
                                    iframeWin.contentWindow.clicksubmit(iframeWin.contentWindow, body, index);
                                    window.location.reload();
                                } else {
                                    innerCallbackFn.call(iframeWin.contentWindow, iframeWin.contentWindow, body, index);
                                }
                                clickFlag = false;
                                setTimeout(function () {
                                    clickFlag = true;
                                }, 1500);
                            }

                        },
                        cancel: function (index) {
                        }
                    });

                }

            },

            /**维护信息内页 添加指标*/
            planTempPCVInit: function () {
                $('#inputForm').attr('action', Api.aps + '/api/stocktake/StocktakeTemplate/addTempDetail');
                var id = Mom.getUrlParam('id');
                var tempId = Mom.getUrlParam('tempId');
                $('#id').val(id);
                if (id) {
                    /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                    var url = Api.aps + "/api/stocktake/StocktakeTemplate/queryDevice";
                    var data = {
                        id: id,
                        template: {
                            id: tempId
                        }
                    };
                    Api.ajaxJson(url, JSON.stringify(data), function (result) {
                        if (result.success) {
                            require(['icheck'],function(Icheck){
                                dataout(result.rows);
                                $('.i-checks').iCheck({
                                    checkboxClass: 'icheckbox_square-green',
                                    radioClass: 'iradio_square-green'
                                });
                            })
                            //dataout(result.rows);

                        } else {
                            layer.msg(result.message);
                        }

                    });

                }
                function dataout(data) {
                    var tempId = Mom.getUrlParam('tempId');
                    var parentId = Mom.getUrlParam('id');
                    $('#treeTable').dataTable({
                        "bSort": false,
                        "bPaginate": false,
                        "bDestroy": true,
                        "paging": false,
                        "bProcessing": true,
                        "searching": false, //禁用aa原生搜索
                        "info": false,  //底部文字
                        "order": [],
                        "pagingType": "full_numbers",
                        "oLanguage": dataTableLang,
                        "data": data,
                        //定义列 宽度 以及在json中的列名
                        "columns": [
                            {
                                "data": null, "width": "10%", "defaultContent": "",
                                "render": function (data, type, row, meta) {
                                    return data = "<input type='checkbox' id=" + row.id + " class='i-checks' name='id'>" +
                                        "<input type='text' hidden='hidden' class='parentId'  name='parentId' value='" + parentId + "'>" +
                                        "<input type='text' hidden='hidden' class='code'  name='code' value='" + data.code + "'>" +
                                        "<input type='text' hidden='hidden' class='templateId'  name='templateId' value='" + tempId + "'>"
                                }
                            },
                            {"data": "name", "width": "auto"},
                            {
                                "data": "id", "orderable": false, "defaultContent": "",
                                "render": function (data, type, row, meta) {
                                    return data =
                                        "<a class='btn btn-success btn-xs btn-preserve btn-up'><i class='fa fa-edit' ></i>上移</a >" +
                                        "<a class='btn btn-success btn-xs btn-preserve btn-down' ><i class='fa fa-edit' ></i>下移</a >"
                                }
                            }]
                    });
                    //renderIChecks();
                    $('tbody tr').attr('class', 'alignCenter');
                    //上移下移
                    $("a.btn-up").each(function () {
                        $(this).click(function () {
                            var $tr = $(this).parents("tr");
                            if ($tr.index() != 0) {
                                $tr.prev().before($tr);
                            }
                        });
                    });
                    var trLength = $("a.btn-down").length;
                    $("a.btn-down").each(function () {
                        $(this).click(function () {
                            var $tr = $(this).parents("tr");
                            if ($tr.index() != trLength - 1) {
                                $tr.next().after($tr);
                            }
                        });
                    });
                }

                //    点击递交
                window.clicksubmit = function (iframeWin, body, index) {
                    var templateId = "", parentId = "", codes = "";
                    var url = Api.aps + "/api/stocktake/StocktakeTemplate/addTempDetail";
                    $("tbody tr td input.i-checks:checkbox").each(function (i) {
                        if (true == $(this).is(':checked')) {
                            parentId = $(this).parent().siblings('.parentId').val();
                            codes += "," + $(this).parent().siblings('.code').val();
                            templateId = $(this).parent().siblings('.templateId').val();
                        }
                    });
                     var data = {
                        "templateId": templateId,
                        "parentId": parentId,
                        "codes": codes.substr(1)
                    };
                    if (codes == '') {
                        layer.alert('请勾选指令后再进行保存')
                    } else {
                        Api.ajaxForm(url, data, function (result) {
                            if (result.success == true) {
                                top.layer.msg('保存成功');
                                top.layer.close(index);
                            } else {
                                top.layer.msg(result.message);
                                top.layer.close(index);
                            }
                        });
                    }

                }
            },
        //  添加下级指标
        planTempPreserveSon: function() {
            var ids = Mom.getUrlParam('ids');
            var currentCode = Mom.getUrlParam('currentCode');
            var templateId = Mom.getUrlParam('tempId');
             var parentId = Mom.getUrlParam('id')
            var zTreeObj;
            var setting = {
                check:{
                    chkboxType: { "Y": "", "N": "" },
                    chkStyle: "checkbox",//复选框类型
                    enable: true, //每个节点上是否显示 CheckBox
                },
                key: {
                    name: "name",//zTree 节点数据保存节点名称的属性名称
                    title: "name"//zTree 节点数据保存节点提示信息的属性名称
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
                    beforeCheck: zTreeBeforeCheck
                    //onCheck:zTreeOnCheck
                }
            };
            //还原
            function revert(){
                var p_ = top;
                p_.layer.confirm('确认清除吗?', {icon:3, title:'系统提示'}, function(index, layero){
                    $('.search').val('');
                    load();
                    p_.layer.close(index);
                });
            }
            // 还原
            $('.revert').click(function(){
                revert();
            });
            require(['ztree_my'],function(treeSelect){
                //绑定筛选框事
                $('.search').unbind('keyup').keyup(function(event){
                    var zTreeObj = $.fn.zTree.getZTreeObj("tree");
                    treeSelect.searchNode(zTreeObj, 'name', $(this).val());
                });
            });
            // 父节点不能选取
            function zTreeBeforeCheck(treeId, treeNode) {
                //return !treeNode.isParent;//当是父节点 返回false 不让选取
            }

            function load(){
                Api.ajaxJson(Api.aps+'/api/aps/Device/tableTree', {}, function (result) {
                     treeNodes = JSON.stringify(result.rows);
                    require(['ztree_all'],function(){
                        initZtree(treeNodes);

                    });
                    //initZtree(treeNodes);
                });
            }
            load();

            //初始化ZTree树
            function initZtree(data) {
                var zNodes = eval("(" + data + ")");//动态js语句
                zTreeObj = $.fn.zTree.init($('#tree'), setting, zNodes);	//Tree 树的id，支持多个树
                zTreeObj.expandAll(false);		//展开所有树节点
                //var datas = ids.split(',');
                if(currentCode){
                    zTreeObj.setChkDisabled(zTreeObj.getNodesByParam("code",currentCode,null)[0],true);
                }
                if(ids){
                    var datas = ids.split(',');
                    for(var i = 0;i<datas.length;i++){
                        zTreeObj.checkNode(zTreeObj.getNodesByParam("code", datas[i],null)[0],true, true);
                    }
                }

            }


            //require(['ztree_all'],function(){
            //    //绑定筛选框事件
            //    require(['ztree_my'],function(treeSelect){
            //        Api.ajaxJson(Api.aps+'/api/aps/Device/tableTree', {}, function (result) {
            //            treeNodes = JSON.stringify(result.rows);
            //            zTreeObj =  treeSelect.loadJsonData('tree',treeNodes,true,ids);
            //
            //            $('.revert').click(function(){
            //                revert();
            //            })
            //            //还原
            //            function revert(){
            //                var p_ = top;
            //                p_.layer.confirm('确认清除吗?', {icon:3, title:'系统提示'}, function(index, layero){
            //                    $('.search').val('');
            //                    treeSelect.showAllNode();
            //                    //load();
            //                    p_.layer.close(index);
            //                });
            //            }
            //
            //            $('.search').unbind('keyup').keyup(function(event){
            //                //var treeObj_ = $.fn.zTree.getZTreeObj("tree");
            //                treeSelect.searchNode(zTreeObj, 'name', $(this).val());
            //            });
            //
            //        });
            //
            //    });
            //})
            window.clicksubmit = function (iframeWin, body, index) {
                var templateId = Mom.getUrlParam('tempId'), parentId = Mom.getUrlParam('id'), codes = "";
                var url = Api.aps + "/api/stocktake/StocktakeTemplate/addTempDetail";
                var nodes = zTreeObj.getCheckedNodes();
                nodes.forEach(function(item){
                    codes += "," + item.code;
                })
                var data = {
                    "templateId": templateId,
                    "parentId": parentId,
                    "codes": codes.substr(1)
                };
                if (codes == '') {
                    layer.alert('请勾选指令后再进行保存')
                } else {
                    Api.ajaxForm(url, data, function (result) {
                        if (result.success == true) {
                            top.layer.msg('保存成功');
                            top.layer.close(index);
                        } else {
                            top.layer.msg(result.message);
                            top.layer.close(index);
                        }
                    });
                }

            }
        },

            /**维护信息编辑内页*/
            planTempPCVEInit: function () {
                $('#inputForm').attr('action', Api.aps + '/api/stocktake/StocktakeTemplate/addTempDetail');
                var id = Mom.getUrlParam('id');
                $('#id').val(id);

                if (id) {
                    /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                    var url = Api.aps + "/api/stocktake/StocktakeTemplate/edit/" + id;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            debugger;
                            require(['dataTables'],function(Icheck){
                                dataout(result.list);
                            });
                            //dataout(result.list);
                        } else {
                            layer.msg(result.message);
                        }

                    });

                }
                function dataout(data) {
                    var tempId = Mom.getUrlParam('tempId');
                    $('#treeTable').dataTable({
                        "bSort": false,
                        "bPaginate": false,
                        "bDestroy": true,
                        "paging": false,
                        "bProcessing": true,
                        "searching": false, //禁用aa原生搜索
                        "info": false,  //底部文字
                        "order": [],
                        "pagingType": "full_numbers",
                        "oLanguage": dataTableLang,
                        "data": data,
                        //定义列 宽度 以及在json中的列名
                        "columns": [
                            {"data": "name", "width": "auto"},
                            {
                                "data": "id", "orderable": false, "defaultContent": "",
                                "render": function (data, type, row, meta) {
                                    return data =
                                        "<input type='checkbox' id='" + row.id + "' name='id' hidden='hidden' class='hidd'>" +
                                        "<a class='btn btn-success btn-xs btn-preserve btn-up'><i class='fa fa-edit' ></i>上移</a >" +
                                        "<a class='btn btn-success btn-xs btn-preserve btn-down' ><i class='fa fa-edit' ></i>下移</a >"
                                }
                            }]
                    });
                    //上移下移
                    $("a.btn-up").each(function () {
                        $(this).click(function () {
                            var $tr = $(this).parents("tr");
                            if ($tr.index() != 0) {
                                $tr.prev().before($tr);
                            }
                        });
                    });
                    var trLength = $("a.btn-down").length;
                    $("a.btn-down").each(function () {
                        $(this).click(function () {
                            var $tr = $(this).parents("tr");
                            if ($tr.index() != trLength - 1) {
                                $tr.next().after($tr);
                            }
                        });
                    });
                    $('tbody tr').attr('class', 'alignCenter')
                }
                //    点击递交
                window.clicksubmit = function (iframeWin, body, index) {
                    var id = "";
                    var url = Api.aps +"/api/stocktake/StocktakeTemplate/saveTempDetail";

                    $("tbody tr td input.hidd").each(function () {
                        id += "," + $(this).attr('id');
                    });
                    var data = {
                        "id": id.substr(1)
                    };

                    Api.ajaxForm(url, data, function (result) {
                        if (result.success == true) {
                            Mom.layMsg('保存成功');
                            top.layer.close(index);
                        } else {
                            Mom.layMsg(result.message);
                        }
                    });


                }
            }


        }
        ;

    $(function () {
        if ($('#planTemple').length > 0) {
            PageModule.planTempInit() //模板列表页
        } else if ($('#planTempPreserve').length > 0) {
            PageModule.planTempPInit() // 项目信息维护
        } else if ($('#planTempPreserveCV').length > 0) {
            PageModule.planTempPCVInit() // 添加指标
        } else if ($('#planTempPreserveCVEdit').length > 0) {
            PageModule.planTempPCVEInit() // 编辑指标
        } else if ($('#planTempCheckView').length>0){
            PageModule.planTempupdata()  // 模板添加和修改
        }else if ($('#planTempPreserveSon').length>0){
            PageModule.planTempPreserveSon()  // 模板添加和修改
        }
    });
})
;