require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    // require(['checkUser']);

    var PageModule = {
        listInit: function () {
            //动态添加Select的option
            Bus.createSelect(Api.admin + "/api/sys/SysDict/allType", "#type", 'type', 'type');

            $('#companyButton').click(function(){
                var apiCfg = {url:Api.admin+'/api/sys/SysOrg/selectOrg', data:{}};
                var treeOption = {};
                Bus.openTreeSelect('请选择公司',apiCfg,treeOption,function(result){
                    console.log(result);
                    return true;
                },function(){
                    console.log(clear);
                });
            });

            //引入Page插件
            require(['Page'], function () {
                var page = new Page();
                window.pageLoad = function () {
                    var data = {
                        type: $("#type option:selected").val(),
                        descriptionParam: $('#description').val()
                    };
                    //修改默认每页显示条数
                    page.init(Api.admin + "/api/sys/SysDict/page", data, true, function (tableData) {
                        renderTableData(tableData);
                        $('.btn-edit').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改字典', '../0_0/form.html?id=' + id, '665px', '386px');
                        });
                        $('.btn-delete').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该字典吗', Api.admin + '/api/sys/SysDict/delete', id);
                        });
                    });

                };
                //点击重置按钮
                $('#reset-btn').click(function () {
                    $("#type option:first").prop("selected", 'selected');
                    $("#description").val("");
                    page.reset(["type", "descriptionParam"]);
                });
                $("#search-btn").click(function () {
                    pageLoad();
                });
                pageLoad();
            });

            function renderTableData(tableData) {
                $('#treeTable').dataTable({
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "paging": false,
                    "bProcessing": false,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0, 2, 6]}
                    ],
                    "oLanguage": window.dataTableLang,
                    "data": tableData,
                    //定义列 宽度 以及在json中的列名
                    "aoColumns": [
                        {
                            "data": null, "sWidth": "60px;", "defaultContent": "", 'sClass': "alignCenter",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "value", 'sClass': " alignCenter", "width": "12%"},
                        {"data": "label", 'sClass': "alignCenter ", "width": "12%"},
                        {"data": "type", 'sClass': "alignCenter", "width": "12%"},
                        {"data": "enable", 'sClass': "alignCenter", "width": "12%",
                            "render": function (data, type, row, meta) {
                                return "<i class='fa gray-check-"+row.enable+"'></i>";
                            }
                        },
                        {"data": "description", 'sClass': "alignCenter"},
                        {"data": "sort", 'sClass': "alignCenter", "width": '8%'},
                        {
                            "data": "id","width": '10%', "defaultContent": "", 'sClass': " alignCenter ",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn-edit' title='编辑'><i class='fa fa-edit '></i></a >" +
                                    "<a class='btn-delete' title='删除'><i class='fa fa-trash-o '></i></a >";
                            }
                        }]
                });
                renderIChecks();
            }
        },

        formInit: function () {
            var id = Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            if (id) {
                var url = Api.admin + "/api/sys/SysDict/" + api + "/" + id;
                Api.ajaxJson(url, {}, function (result) {
                    if (result.success) {
                        Validator.renderData(result.SysDict, $('#inputForm'));
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
                $('#value').attr('readonly','readonly');
            }

        },

    };
    $(function () {
        //列表
        if ($('#list').length > 0) {  //XX列表页
            PageModule.listInit();
        }
        //查看、编辑
        else if ($('#form').length > 0) {  //XX弹窗页（新增）
            PageModule.formInit();
        }


    });

});