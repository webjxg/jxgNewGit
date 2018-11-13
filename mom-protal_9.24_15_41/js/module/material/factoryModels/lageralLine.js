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
        lateralInit: function () {
            window.pageLoad = function () {
                // var data = {
                //     startDate: $('#startTime').val(),
                //     endDate: $('#endTime').val(),
                //     cteateBy: $('#creator').val(),
                //     status: $('#status option:selected').val()
                // };
                // require(['Page'], function () {
                //     Page.init('../../../../json/factoryModels/tableList.json',{}, true, function (tableDate) {
                //         PageModule.createTable(tableDate.page.rows); //渲染表格数据
                //         PageModule.btngather();//按钮集合
                //     })
                // });
                $.ajax({
                    type: "get",
                    url: "../../../../json/factoryModels/tableList.json",
                    dataType: 'json',
                    success: function (result) {
                        PageModule.createTable(result.page.rows);
                        PageModule.btngather();
                    },
                    error: function () {
                        Mom.layMsg(result.message);
                    }
                });
            };
            pageLoad();


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
                    {"data": "nodeNo", 'sClass': "alignCenter autoWidth"},
                    {"data": "nodeCode", 'sClass': "alignCenter autoWidth"},
                    {"data": "nodeName", 'sClass': "alignCenter autoWidth"},
                    {"data": "nodeAlias", 'sClass': "alignCenter autoWidth"},
                    {"data": "unitGroupId", 'sClass': "alignCenter autoWidth"},
                    {"data": "unitId", 'sClass': "alignCenter autoWidth"},
                    {"data": "slineMtrlType", 'sClass': "alignCenter autoWidth"},
                    {"data": "slineInoutType", 'sClass': "alignCenter autoWidth"},
                    {"data": "refSidelineId", 'sClass': "alignCenter autoWidth"},
                    {"data": "isRvs", 'sClass': "alignCenter autoWidth"},
                    {"data": "areaForm", 'sClass': "alignCenter autoWidth"},
                    {"data": "slineForm", 'sClass': "alignCenter autoWidth"},
                    {"data": "remake", 'sClass': "alignCenter autoWidth"},
                    {
                        "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            return "<i class='btn btn-computed fa fa-calculator'></i>" +
                                "<i class='btn btn-compile fa fa-edit' ></i>" +
                                "<i class='btn btn-delete fa fa-trash'></i>";
                        }
                    }

                ]
                // "fnDrawCallback": function () {
                //     this.api().column(0).nodes().each(function (cell, i) {
                //         cell.innerHTML = i + 1;
                //     });
                // }
            });
        },
        //按钮集合
        btngather: function () {
            //删除
            $('.btn-computed').on('click', function () {
                var id = $(this).parents("tr").find('.i-checks').attr('id');
                Bus.openDialog('计算公式配置', 'material/factoryModels/lateralLComputed.html?id=' + id, '643px', '537px')
            });
            // //编辑
            // $('.btn-edit').on('click', function () {
            //     var id = $(this).parents("tr").find('.invId').attr('id');
            //     var invDate = $(this).parents("tr").find('.invDate').text();
            //     var date = invDate.split(' ')[0];
            //     location.href = 'invDataComputation.html?id=' + id + '&type=1&invDate=' + date;
            // });
        },
        /**计算公式配置————lateralLComputed页*/
        lateralLCInit: function () {
            require(['/js/module/material/factoryModels/computedCommons.js'], function (computed) {
                //只渲染一个select 之后会换成select
                computed.com_selectRead('../../../../json/factoryModels/fnselect.json');
                //8个切换按钮重新渲染数据// 参数1：头部切换选择了的active的大标签// 参数2：头部切换普通大标签// 参数3：头部切换小标签li
                computed.com_renderChange('.contentBox.active','.contentBox','.contentChange>li',PageModule.btnComputed);
            })
        },
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
                $('.contentBox.active').find('.contentInner div.context').append('<span>'+selectval+'('+materialValue+')</span>')
            });
            //四则运算等符号

            for(var i=0;i<$(thisbox).find('fieldset button').length-2;i++){
                $(thisbox).find('fieldset button').eq(i).unbind('click').on('click',function () {
                    $(thisbox).find('.context>br').each(function (i, item) {
                        $(item).remove();
                    });
                    $(thisbox).find('.contentInner div.context').append('<span>'+$(this).text()+'</span>')
                })
            }
            //清除
            $(thisbox).find('fieldset .empty').unbind('click').on('click',function () {
                $(thisbox).find('.contentInner div.context').empty();

            });
            //退格
            $(thisbox).find('fieldset .backOne').unbind('click').on('click',function () {
                $(thisbox).find('.contentInner div.context').find('span:last-of-type').remove();

            });

            //匹配
            require(['/js/module/material/factoryModels/computedCommons.js'], function (computed) {
                $(thisbox).find('.btn-verify').unbind('click').on('click', function () {
                    var str = '';
                    $(thisbox).find('.context>span').each(function (i, item) {
                        str += $(this).text()
                    });
                    computed.com_regularFn(str)
                })
            });
            //保存
            $(thisbox).find('.btn-save').unbind('click').on('click', function () {
                var str = '';
                $(thisbox).find('.context>span').each(function (i, item) {
                    str += $(this).text()
                });
                $(thisbox).find('.btn-verify')
                var data={
                    "savetext":str,
                    "type":$('#boxindex').val(),
                    "materialtype":$('#tabindex').val()
                };
                console.log(data);
            })

        }



    };
    $(function () {
        //参数配置列表
        if ($('#lateralLineListPage').length > 0) {
            PageModule.lateralInit()
        }
        else if ($('#lateralLComputed').length > 0) {
            PageModule.lateralLCInit()
        }
        // else if ($('#invManaChart').length > 0) {
        //     PageModule.invMChartInit()
        // }
    });

});