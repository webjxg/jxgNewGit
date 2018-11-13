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
        measuringNodeInit: function () {
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
                    page.init("http://localhost:8011/../json/factoryModels/tableListJLD.json", data, true, function (tableData,result) {
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
                    {"data": "nodeNo",      'sClass': "alignCenter autoWidth"},
                    {"data": "nodeCode",    'sClass': "alignCenter autoWidth"},
                    {"data": "nodename",    'sClass': "alignCenter autoWidth"},
                    {"data": "nodeAlias",   'sClass': "alignCenter autoWidth"},
                    {"data": "areaAlias",   'sClass': "alignCenter autoWidth"},
                    {"data": "pres",        'sClass': "alignCenter autoWidth"},
                    {"data": "useFlag", 'sClass': "alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                        return "<i class='fa gray-check-"+row.useFlag+"'></i>"

                        }
                    },
                    {"data": "displayOrder",'sClass': "alignCenter autoWidth"},
                    {"data": "remake",      'sClass': "alignCenter autoWidth"},
                    {
                        "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            return "<a class='btn-computed' title='计算'><i class='fa fa-calculator'></i></a>" +
                                "<a class='btn-edit' title='编辑'><i class='fa fa-edit '></i></a >" +
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
                Bus.openEditDialog('新增侧线', 'material/factoryModels/measuringNodeForm.html', '755px', '380px');
            });
            //头部修改
            $('#btn-edit').click(function () {
                Bus.editCheckedTable('新增侧线', 'material/factoryModels/measuringNodeForm.html', '755px', '380px','#treeTable');
            });
            //计算
            $('.btn-computed').on('click', function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.openDialog('计算公式配置', 'material/factoryModels/measuringNodeCom.html?id=' + id, '643px', '480px')
            });
            //编辑
            $('.btn-edit').click(function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.openEditDialog('修改侧线', 'material/factoryModels/measuringNodeForm.html?id=' + id, '755px', '380px');
            });
            //删除
            $('.btn-delete').click(function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.deleteItem('确定要删除该侧线吗', Api.admin + '/api/fm/NodeMeasure/del', id);
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
        /**计算公式配置————lateralLComputed页*/
        //计算公式弹出页
        measuringNodeCInit: function () {
            require(['/js/module/material/factoryModels/computedCommons.js'], function (computed) {
                //只渲染一个select 之后会换成select
                computed.com_selectRead('../../../../json/factoryModels/fnselect.json');
                //8个切换按钮重新渲染数据// 参数1：头部切换选择了的active的大标签// 参数2：头部切换普通大标签// 参数3：头部切换小标签li
                computed.com_renderChange('.contentBox.active','.contentBox','.contentChange>li',PageModule.btnComputed);
            })
        },
        //计算公式按钮区
        btnComputed:function () {
            //公式匹配
            var thisbox='.contentBox.active';
            $(thisbox).find('.btn-matching').unbind('click').on('click',function () {
                var materialValue=$(thisbox).find('ul.searchUl>li.active').text();
                var selectval=$(thisbox).find('.selFn option:selected').val();
                $('#material').val(materialValue);
                $('#Fninput').val(selectval);
                $(thisbox).find('.context>br').each(function (i, item) {
                    $(item).remove();
                });
                $('.contentBox.active').find('.contentInner div.context.active').append('<span>'+selectval+'('+materialValue+')</span>')
            });
            //四则运算等符号

            for(var i=0;i<$(thisbox).find('fieldset button').length-2;i++){
                $(thisbox).find('fieldset button').eq(i).unbind('click').on('click',function () {
                    $(thisbox).find('.context>br').each(function (i, item) {
                        $(item).remove();
                    });
                    $(thisbox).find('.contentInner div.context.active').append('<span>'+$(this).text()+'</span>')
                })
            }
            //清除
            $(thisbox).find('fieldset .empty').unbind('click').on('click',function () {
                $(thisbox).find('.contentInner div.context.active').empty();

            });
            //退格
            $(thisbox).find('fieldset .backOne').unbind('click').on('click',function () {
                $(thisbox).find('.contentInner div.context.active').find('span:last-of-type').remove();

            });

            //匹配
            require(['/js/module/material/factoryModels/computedCommons.js'], function (computed) {
                $(thisbox).find('.btn-verify').unbind('click').on('click', function () {
                    var str = '';
                    $(thisbox).find('.context.active>span').each(function (i, item) {
                        str += $(this).text()
                    });
                    computed.com_regularFn(str)
                })
            });
            //保存
            $(thisbox).find('.btn-save').unbind('click').on('click', function () {
                var str = '';
                $(thisbox).find('.context.active>span').each(function (i, item) {
                    str += $(this).text()
                });
                // $(thisbox).find('.btn-verify')
                var data={
                    "savetext":str,
                    "type":$('#boxindex').val(),
                    "materialtype":$('#tabindex').val()
                };
                console.log(data);
            })

        },
        /**弹出新增、修改页*/
        measuringNodeFormInit: function () {
            var id = Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            Api.ajaxJson('http://localhost:8011/../json/factoryModels/goback.json', {}, function (result) {
                if (result.success) {
                    Bus.appendOptionsValue('#unitType',result.rows);
                    Bus.appendOptionsValue('#unitName',result.rows);
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
        if ($('#measuringNodeList').length > 0) {
            PageModule.measuringNodeInit()
        }
        else if ($('#measuringNodeCom').length > 0) {
            PageModule.measuringNodeCInit()
        }
        else if ($('#measuringNodeForm').length > 0) {
            PageModule.measuringNodeFormInit()
        }

    });

});