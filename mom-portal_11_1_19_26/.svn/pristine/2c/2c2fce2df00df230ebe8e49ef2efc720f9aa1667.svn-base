require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        /**模板列表页*/
        planTempInit: function () {
            var treeId = Mom.getUrlParam("treeId");
            $('#treeId').val(treeId);
            $('#add-btn').click(function () {
                Bus.openEditDialog('新增模板', './inventoryTaking/planTempCheckView.html', '455px', '290px');
            });
            $('#edit-btn').click(function () {
                Bus.editCheckedTable('修改模板', './inventoryTaking/planTempCheckView.html', '455px', '290px', '#listTable');
            });
            $('#del-btn').click(function () {
                Bus.delCheckTable('您确定要删除吗', Api.aps+'/api/stocktake/StocktakeTemplate/delete','#listTable');
            });
            require(['Page'], function () {
                var page = new Page();
                var pageLoad = function () {
                    page.init(Api.aps + "/api/stocktake/StocktakeTemplate/page", {}, true, function(data) {
                        planTempdataout(data);
                        $('.btn-preserve').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('项目信息维护', './inventoryTaking/planTempPreserve.html?id=' + id, '500px', '600px')
                        });
                    });
                };
                pageLoad();

                //   ajax请求渲染datatable数据
                function planTempdataout(data) {
                    $('#listTable').dataTable({
                        "data": data,
                        "columns": [
                            {
                                "data": null, "defaultContent": "", 'sClass': "autoWidth alignCenter",
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
                                        return data = '未启用'
                                    } else {
                                        return data = '启用'
                                    }
                                }
                            },
                            {
                                "data": "id", "orderable": false, "defaultContent": "", 'sClass':'autoWidth',
                                "render": function (data, type, row, meta) {
                                    return data =
                                        "<a class='btn-maintain btn btn-preserve'><i class='fa icon-project' ></i>项目信息维护</a >"
                                }
                            }]
                    });
                    renderIChecks();
                }

            });
        },

        //新增、修改
        planTempCheckViewInit: function(){
            $('#inputForm').attr('action', Api.aps+"/api/stocktake/StocktakeTemplate/saveTemplate");
            var id = Mom.getUrlParam('id');
            $('#id').val(id);
            if (id) {
                Api.ajaxJson(Api.aps+"/api/stocktake/StocktakeTemplate/form/"+id, {}, function(result) {
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
                        Bus.appendOptionsValue($('#opeCode'),result.rows,'value','label');
                        if(res){
                            $('#opeCode').val(res.template.types);
                        }
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }
        },

        //项目信息维护
        planTempPreserveInit: function(){
            var tmpId = Mom.getUrlParam('id'), selResult;
            require(['ztree_my'],function(ZTree){
                var ztree = new ZTree(), treeObj;
                function ztreeLoad(){
                    var apiUrl = Api.aps+'/api/stocktake/StocktakeTemplate/formTemplateDetail/'+tmpId;
                    Api.ajaxJson(apiUrl, {}, function(result){
                        treeObj = ztree.loadData($("#tree"), result.treeArr, false);
                    });
                }
                ztreeLoad();

                $('#btn-add').click(function () {
                    Bus.openEditDialog('添加根指标', './inventoryTaking/planTempPreserveCV.html?id=0&tempId='+tmpId, '620px', '500px', addRootCallback);
                });

                $('#btn-addSon').click(function () {
                    selResult = ztree.getCheckValues(false, false);
                    if(selResult.success){
                        var childrenCodeArr = [];//已添加的子节点
                        var selNode = selResult.nodes[0];
                        $.each(selNode.children,function(i,o){
                            childrenCodeArr.push(o.code);
                        });
                        var options = {
                            width: '450px',
                            height: '550px',
                            defaultVals: {value:childrenCodeArr.join(','), prop:'code'},
                            multiple: true,
                            setting: {
                                check: {
                                    chkboxType: { "Y": "", "N": "" }
                                }
                            }
                        };
                        var apiCfg = {
                            url: Api.aps+'/api/aps/Device/tableTree',
                            data: {}
                        };
                        Bus.openTreeSelect('添加下级指标', apiCfg, options, addSonCallback);
                    }else {
                        Mom.layMsg('请单选父级指标后再试');
                    }
                });
                $('#btn-update').click(function () {
                    if (str === '') {
                        Mom.layMsg('请单选指标后再试');
                    } else {
                        EditDialogTemp(parentName, './inventoryTaking/planTempPreserveCVEdit.html?id=' + str, '600px', '440px')
                    }
                });

                $('#btn-del').click(function () {
                    if (str === '') {
                        Mom.layMsg('请单选指标后再试');
                    } else {
                        deleteItOne('确定要删除该指标吗', Api.aps + '/api/stocktake/StocktakeTemplate/delTempDetail/' + str)
                    }
                });

                function addRootCallback(layIdx, layero){
                    var iframeWin = layero.find('iframe')[0].contentWindow;
                    var formData = iframeWin.getFormData();
                    if(formData){
                        var data = formData.data;
                        Api.ajaxForm(formData.url, JSON.stringify(data), function (result) {
                            if (result.success == true) {
                                Mom.layMsg('保存成功');
                                top.layer.close(layIdx);
                                ztreeLoad();
                            }else {
                                Mom.layMsg(result.message);
                            }
                        });
                    }
                    return false;
                }

                function addSonCallback(chkResult, layIdx, layero){
                    if(chkResult.success){
                        var codeArr = [];
                        $.each(chkResult.nodes,function(i,o){
                            codeArr.push(o.code);
                        });
                        var data = {
                            "templateId": tmpId,
                            "parentId": selResult.id,
                            "codes": codeArr.join(',')
                        };
                        Api.ajaxForm(Api.aps+"/api/stocktake/StocktakeTemplate/addTempDetail", data, function (result) {
                            if (result.success == true) {
                                Mom.layMsg('保存成功');
                                top.layer.close(layIdx);
                                ztreeLoad();
                            } else {
                                Mom.layAlert(result.message);
                            }
                        });
                        return false;
                    }
                }
            });
        },

        planTempPreserveCVInit: function(){
            var parentId = Mom.getUrlParam('id');
            var tempId = Mom.getUrlParam('tempId');

            window.getFormData = function(){
                var codes = "";
                $("tbody tr td input.i-checks:checkbox").each(function (i) {
                    if (true == $(this).is(':checked')) {
                        codes += "," + $(this).parent().siblings('.code').val();
                    }
                });
                if(codes == '') {
                    Mom.layMsg('请至少勾选一条指令');
                    return;
                }
                var data = {
                    "templateId": tempId,
                    "parentId": parentId,
                    "codes": codes.substr(1)
                };
                return {
                    url: Api.aps+"/api/stocktake/StocktakeTemplate/addTempDetail",
                    data: data
                }
            }
        }

    };

    $(function () {
        //模板列表页
        if ($('#planTemple').length > 0) {
            PageModule.planTempInit();
        }
        //新增、修改
        else if($('#planTempCheckView').length){
            PageModule.planTempCheckViewInit();
        }
        //项目信息维护
        else if ($('#planTempPreserve').length > 0) {
            PageModule.planTempPreserveInit()
        }
        else if ($('#planTempPreserveCV').length > 0) {
            PageModule.planTempPreserveCVInit()
        }

    });
})
;