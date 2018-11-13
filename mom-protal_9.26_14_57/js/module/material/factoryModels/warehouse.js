require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['checkUser']);
    /**作者：贾旭光
     *日期：2018.9.20
     *描述：
     */
    var PageModule = {
        /**列表页————lateralLineListPage页*/
        //列表页
        warehouseListInit: function () {
            Mom.include('computed_css', '/js/module/material/factoryModels/', ['computedCommons.css']);
            Bus.createSelect("http://localhost:8011/../json/factoryModels/fnselect.json", "#batteryLimit");
            var data = {
                code: $('#code').val(),
                name: $('#name').val(),
                inOut: $('#batteryLimit option:selected').val(),
                device: $('#device option:selected').val()
            };
            require(['Page'], function () {
                var page = new Page();
                window.pageLoad = function () {
                    page.init("http://localhost:8011/../json/factoryModels/tableListCk.json", data, true, function (tableData,result) {
                        PageModule.createTable(result.page.rows);
                        PageModule.btngather(page);
                    })



                };
                pageLoad();

            })


        },
        //创建表格
        createTable: function (tableDate) {
            $('#treeTable').dataTable({
                "bPaginate": false,
                "bAutoWidth": false,
                "bDestroy": true,
                "paging": false,
                "bProcessing": true,
                "searching": false, //禁用aa原生搜索
                "info": false,  //底部文字
                "order": [],
                "aoColumnDefs": [
                    {"bSortable": false, "aTargets": [0]}
                ],
                "oLanguage": dataTableLang,
                "data": tableDate,
                //定义列 宽度 以及在json中的列名
                "aoColumns": [
                    {
                        "data": null, "defaultContent": "", 'sClass': "autoWidth alignCenter",
                        "render": function (data, type, row, meta) {
                            return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                        }
                    },
                    {"data": "areaNo",      'sClass': "alignCenter autoWidth"},
                    {"data": "areaCode",    'sClass': "alignCenter autoWidth"},
                    {"data": "areaName",    'sClass': "alignCenter autoWidth"},
                    {"data": "areaAlias",   'sClass': "alignCenter autoWidth"},
                    {"data": "wspId",       'sClass': "alignCenter autoWidth"},
                    {"data": "stockType",        'sClass': "alignCenter autoWidth"},
                    {"data": "useFlag",     'sClass': "alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            return "<i class='fa gray-check-"+row.useFlag+"'></i>"

                        }
                    },
                    {"data": "displayOrder",'sClass': "alignCenter autoWidth"},
                    {"data": "remake",      'sClass': "alignCenter autoWidth"},
                    {
                        "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            return"<a class='btn-edit' title='编辑'><i class='fa fa-edit '></i></a >" +
                                "<a class='btn-delete' title='删除'><i class='fa fa-trash-o '></i></a >";
                        }
                    }

                ]
            });
            renderIChecks();
        },
        //按钮集合
        btngather: function (page) {
            //新增
            $('#btn-add').click(function () {
                Bus.openEditDialog('新增侧线', 'material/factoryModels/warehouseForm.html', '755px', '380px');
            });
            //头部修改
            $('#btn-edit').click(function () {
                Bus.editCheckedTable('修改侧线', 'material/factoryModels/warehouseForm.html', '755px', '380px','#treeTable');
            });
            //编辑
            $('.btn-edit').click(function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.openEditDialog('修改侧线', 'material/factoryModels/warehouseForm.html?id=' + id, '755px', '380px');
            });
            //删除
            $('.btn-delete').click(function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.deleteItem('确定要删除该侧线吗', Api.admin + '/api/fm/AreaStock/delete', id);
            });
            //点击重置按钮
            $('#reset-btn').click(function () {
                $("#type option:first").prop("selected", 'selected');
                $("#description").val("");
                page.reset(["type", "descriptionParam"]);
            });
            $("#search-btn").click(function () {
                pageLoad();
            });
        },
        /**弹出新增、修改页*/
        warehouseForm: function () {
            var id = Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            Api.ajaxJson('http://localhost:8011/../json/factoryModels/goback.json', {}, function (result) {
                if (result.success) {
                    Bus.appendOptionsValue('#wspId',result.rows);
                    Bus.appendOptionsValue('#stockType',result.rows);
                    if (id) {
                        Validator.renderData(result.item, $('#inputForm'));
                    }
                } else {
                    Mom.layMsg(result.message);
                }
            });
            $('#nodeNo').attr('readonly', 'readonly');




        }


    };
    $(function () {
        //参数配置列表
        if ($('#warehouseList').length > 0) {
            PageModule.warehouseListInit()
        }
        else if ($('#warehouseForm').length > 0) {
            PageModule.warehouseForm()
        }

    });

});
