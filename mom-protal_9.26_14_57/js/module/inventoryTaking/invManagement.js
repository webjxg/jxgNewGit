require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['checkUser']);
    /**作者：贾旭光
     *日期：2018.9.7
     *描述：**图表接口还要调 看一下贾昊返回来的地址 文档
     */
    var PageModule = {
        /**列表页————invManagement页*/
        //列表页
        invMListInit: function () {
            require(['datetimepicker','Page'], function () {
                //时间选择插件
                $("#startTime,#endTime").val("").datetimepicker({
                    bootcssVer: 3,
                    format: "yyyy-mm-dd",  //保留到日
                    showMeridian: false,     //显示上、下午
                    language: "zh-CN",   //中文显示
                    minView: "3",    //月视图
                    autoclose: true,  //选择时间后自动隐藏
                    clearBtn: true,
                    todayBtn: true

                });
                //判断日期大小
                $("#endTime,#startTime").on('change', function () {
                    if ($('#endTime').val() < $('#startTime').val() && $('#endTime').val() != '') {
                        Mom.layMsg('结束时间应大于起始时间，请重新选择');
                        $('#endTime').val('')
                    }
                });
                window.pageLoad = function () {
                    var data = {
                        startDate: $('#startTime').val(),
                        endDate: $('#endTime').val(),
                        cteateBy: $('#creator').val(),
                        status: $('#status option:selected').val()
                    };
                    new Page().init(Api.aps + "/api/aps/manage/page", data, true, function (tableDate) {
                        PageModule.createTable(tableDate); //渲染表格数据
                        PageModule.btngather();//按钮集合
                    });
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
                "oLanguage": dataTableLang,
                "data": tableDate,
                //定义列 宽度 以及在json中的列名
                "aoColumns": [
                    {
                        "data": null,
                        "orderable": false,
                        "defaultContent": "",
                        'sClass': "yearName alignCenter autoWidth",
                        "render": ''
                    },
                    {"data": "stocktakeDate", 'sClass': "invDate alignCenter autoWidth"},
                    {
                        "data": 'status',
                        "orderable": false,
                        "defaultContent": "",
                        'sClass': "status alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            var classSet = "", setText;
                            if (row.status == "0") {
                                setText = "未封存";
                                classSet = "col-1ab394";
                            } else if (row.status == "1") {
                                setText = "已封存";
                                classSet = "col-62b5e9";
                            } else if (row.status == "2") {
                                setText = "已解封";
                                classSet = "col-ffa82d";
                            }
                            return "<span class='" + classSet + "' data-status='" + row.status + "'>" + setText + "</span >";
                        }
                    },
                    {"data": "createBy", 'sClass': "alignCenter autoWidth"},
                    {"data": "createDate", 'sClass': "alignCenter autoWidth"},
                    {
                        "data": null, "orderable": false, "defaultContent": "", 'sClass': "alignCenter autoWidth",
                        "render": function (data, type, row, meta) {
                            var html = "";
                            if (row.status == "0") {
                                html = "<a class='btn btn-edit btn-compile'><i class='fa fa-edit'></i>编辑</a >" + "<a class='btn btn-delete'><i class='fa fa-trash'></i>删除</a >" + "<a class='btn  btn-safesave   btn-compile' ><i class='fa fa-file-text-o'></i>封存</a >";
                            } else if (row.status == "1") {
                                html = "<a class='btn  btn-unsave   btn-compile' ><i class='fa fa-file-text-o'></i>解封</a >";
                            } else {
                                html = "<a class='btn btn-edit btn-compile'><i class='fa fa-edit'></i>编辑</a >" + "<a class='btn btn-delete'><i class='fa fa-trash'></i>删除</a >" + "<a class='btn  btn-safesave   btn-compile' ><i class='fa fa-file-text-o'></i>封存</a >";
                            }
                            return "<input type='hidden'  id=" + row.id + "  data-id='" + row.id + "'   class='invId'>" + "<a class='btn  btn-info btn-check' ><i class='fa fa-search-plus'></i>查看</a >" + html;
                        }
                    }
                ],
                "fnDrawCallback": function () {
                    this.api().column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }
            });
        },
        //按钮集合
        btngather: function () {
            //盘存核对计算
            $('#calculate-btn').on('click', function () {
                location.href = 'invDataComputation.html?type=0';
            });
            //删除
            $('.btn-delete').on('click', function () {
                var id = $(this).parents("tr").find('.invId').attr('id');
                Bus.deleteItem('请确认是否删除？', Api.aps + '/api/aps/manage/delete', id)
            });
            //封存
            $('.btn-safesave').on('click', function () {
                var id = $(this).parents("tr").find('.invId').attr('id');
                var data = {
                    id: id
                };
                Api.ajaxForm(Api.aps + '/api/aps/manage/equestrationManage', data, function (result) {
                    if (result.success) {
                        Mom.layMsg('封存成功');
                        pageLoad();
                    } else {
                        Mom.layAlert(result.message)
                    }
                })
            });
            //解封
            $('.btn-unsave').on('click', function () {
                var id = $(this).parents("tr").find('.invId').attr('id');
                var data = {
                    id: id
                };
                Api.ajaxForm(Api.aps + '/api/aps/manage/equestrationManage', data, function (result) {
                    if (result.success) {
                        Mom.layMsg('解封成功');
                        pageLoad();
                    } else {
                        Mom.layMsg(result.message)
                    }
                })
            });
            //编辑
            $('.btn-edit').on('click', function () {
                var id = $(this).parents("tr").find('.invId').attr('id');
                var invDate = $(this).parents("tr").find('.invDate').text();
                var date = invDate.split(' ')[0];
                location.href = 'invDataComputation.html?id=' + id + '&type=1&invDate=' + date;
            });
            //查看
            $('.btn-check').on('click', function () {
                var id = $(this).parents("tr").find('.invId').attr('id');
                var invDate = $(this).parents("tr").find('.invDate').text();
                var date = invDate.split(' ')[0];
                location.href = 'invDataComputation.html?id=' + id + '&type=2&invDate=' + date;
            });
            /**还未调试接口*/
        },
        /**盘存数据核算（新增）、编辑————invDataComputation页*/
        //盘存数据核算页面
        invDataComInit: function () {
            //渲染盘存时间
            var url = Api.admin + "/api/sys/SysDict/type/STOCKTAKE_DATE";
            Api.ajaxForm(url, {}, function (result) {
                var date = [15, 30];
                var dateArr = [];
                var myDate = new Date();
                var year = myDate.getFullYear();//获取当前月
                var month = myDate.getMonth() + 1;//获取当前日
                var rows = result.rows;
                for (var i = 0; i < rows.length; i++) {
                    for (var c = 0; c < date.length; c++) {
                        var now = year + '-' + month + "-" + date[c] + " " + rows[i].value;
                        dateArr.push(now)
                    }
                }
                $(dateArr).each(function (i, o) {
                    $('#invDate').append("<option value='" + dateArr[i] + "'>" + dateArr[i] + "</option>");
                });
            });
            //拿到父页面参数
            var pageid = Mom.getUrlParam('id');
            var pageType = Mom.getUrlParam('type');

            //类型判断
            $.get('../../../json/invData/Configjson.json', function (json_) {
                //查看
                if (pageid != null && pageType == 2) {
                    var json = json_.checkConfigArr;
                    var invDate = Mom.getUrlParam('invDate');
                    $('#invDateinput').val(invDate).attr({'type': 'text', 'readonly': 'readonly'});
                    $('#invDate').remove();
                    $('#save-btn,#computed-btn,#safekeeping-btn').hide();
                    PageModule.tabChange(json, invDate,pageType);
                    $('.tabChange').find('li').eq(0).trigger('click');
                }
                //编辑
                else if (pageid != null && pageType == 1) {
                    var json = json_.editConfigArr;
                    var invDate = Mom.getUrlParam('invDate');
                    $('#invDateinput').val(invDate).attr({'type': 'text', 'readonly': 'readonly'});
                    $('#invDate').remove();
                    PageModule.tabChange(json, invDate,pageType);
                    $('.tabChange').find('li').eq(0).trigger('click');
                }
                //新增
                else {
                    var json = json_.editConfigArr;
                    PageModule.tabChange(json, invDate, pageType);
                    $('.tabChange').find('li').eq(0).trigger('click');
                }
            });
            PageModule.btnCollection();

        },
        //按钮集合
        btnCollection: function () {
            //返回按钮
            $('#back-btn').click(function () {
                Mom.winBack();
            });
        },
        //查看操作跳转tab
        tabChange: function (json, invDate, pageType) {
            var flagtab;
            var tabindex;//拿到上一次点击的索引值
            $('.tabChange').find('li').each(function (i) {
                $('div.active>.ui-jqgrid').find('.floatColShow').empty();
                //tab页列表跳转
                $(this).unbind('click').on('click', function () {
                    $('.tabChange').find('li').each(function () {
                        if ($(this).index(".active") == 0) {
                            tabindex=$(this).index()
                        }
                    });
                    var statu = $(this).attr('statu');
                    if (flagtab == false) {
                        if (pageType!= 2) {
                            if($('#invDate')){
                                if (invDate == undefined) {
                                    invDate = $('#invDate option:selected').val()
                                }
                                $('#invDateinput').val(invDate).attr({'type': 'text', 'readonly': 'readonly'});
                                $('#invDate').remove();
                                $('input[type=text].editable').each(function (i, item) {
                                    $(this).parents('td').text($(this).val());
                                    $(this).remove()
                                });
                            }

                            var urlArr2 = ['manageProcessMtrl', 'manageMineral', 'manageReport', 'manageMtrl', 'manageYield', 'manageQuota', 'manageConsume', 'manageAO'];
                            var urlArr = ['ManageProcessMtrl', 'ManageMineral', 'ManageReport', 'ManageMtrl', 'ManageYield', 'ManageQuota', 'ManageConsume', 'ManageAO'];

                            var ids = [];
                            for (var z = 0; z < $('div.tableBox.active>div.ui-jqgrid').length; z++) {
                                ids.push($('div.tableBox.active>div.ui-jqgrid').eq(z).attr('id').split('_')[1]);
                            }

                            var savebtn = PageModule.saveTable(ids);
                            var data = {'stocktakeDate': invDate};
                            data[urlArr2[tabindex]] = JSON.stringify(savebtn);
                            Api.ajaxForm(Api.aps + '/api/aps/' + urlArr[tabindex] + '/save', data, function (result) {
                                if (result.success) {
                                } else {
                                    Mom.layAlert(result.message)
                                }
                            });

                        }
                    }
                    flagtab = false;
                    $(this).addClass('active').siblings('li').removeClass('active');
                    $('.aps-create-list>div').eq(i).addClass('active').siblings('div').removeClass('active');
                    PageModule.getData(i, json, invDate, pageType);
                });


            });


        },
        //getjson i参数传0的时候是初始化 传i的时候点击后的 带有数组去重
        getData: function (index, json_, invDate, pageType) {
            var urlArr = ['ManageProcessMtrl', 'ManageMineral', 'ManageReport', 'ManageMtrl', 'ManageYield', 'ManageQuota', 'ManageConsume', 'ManageAO'];
            if (invDate == undefined) {
                invDate = $('#invDate option:selected').val()
            }
            var url = '/api/aps/' + urlArr[index] + '/view/' + invDate;
            Api.ajaxJson(Api.aps + url, {}, function (result) {
                if (result.success) {
                    PageModule.ajaxInnerEvent(result, json_, index, invDate);
                } else {
                    Mom.layAlert(result.message)
                }
            });


        },
        /*
         *statuName:json表名字
         *rows:后台返回的列内容
         *json表的列内容：jsonItem
         */
        //表渲染
        ajaxInnerEvent: function (result, json_, index, invDate) {
            var rows = [];
            if (index == 1 || index == 5 || index == 7) {
                var tablehtml = '<table id="' + result.rows[0].code.split('_')[1] + '" class="tableItemBox"></table>';
                $('.tableBox').eq(index).append(tablehtml);
                rows = result.rows[0];
            } else if (index == 2 || index == 4 || index == 6) {
                var tablehtml = '<table id="' + result.code.split('_')[1] + '" class="tableItemBox"></table>';
                $('.tableBox').eq(index).append(tablehtml);
                rows = result.groupList;
                $(rows).each(function (i, item) {
                    if (item.parentId == "0") {
                        delete item['parentId']
                    }
                });
            } else if (index == 0 || index == 3) {
                for (var i = 0; i < result.rows.length; i++) {
                    var tablehtml = '<table id="' + result.rows[i].code.split('_')[1] + '" class="tableItemBox"></table>';
                    $('.tableBox').eq(index).append(tablehtml);
                }
                rows = result.rows;
                $(rows).each(function (i, item) {
                    $(rows[i].groupList).each(function (e, eitem) {
                        if (this.parentId == "0") {
                            delete this['parentId']
                        }
                    })
                });
            }
            ;
            var jsonItem = json_[index];
            var statuName = jsonItem.itemName;
            PageModule.tabledatagrid(statuName, rows, jsonItem, json_, index, invDate);

        },
        //渲染表格
        tabledatagrid: function (statuName, result, jsonItem, json_, index, invDates) {
            //保存用的参数
            var ids = [], colNameArr = [];
            //表格插入按钮所需数据
            var configjson = [
                {
                    'tableName': 'WBCCHS',
                    'colModel': [
                        {
                            name: 'wbckhsChart', align: 'center',
                            formatter: function () {
                                var btnhtml = '<a class="btn btnChart"> <i class="fa fa-bar-chart"></i></a>';
                                return btnhtml
                            }
                        }
                    ]
                },
                {
                    'tableName': 'JCWLHS',
                    'colModel': [
                        {
                            name: 'jcwlhsChart', align: 'center',
                            formatter: function () {
                                var btnhtml = '<a class="btn btnChart"> <i class="fa fa-bar-chart"></i></a>';
                                return btnhtml
                            }
                        }
                    ]


                },
                {
                    'tableName': 'CLHS',
                    'colModel': [
                        {
                            name: 'clhsChart', align: 'center',
                            formatter: function () {
                                var btnhtml = '<a class="btn btnChart"> <i class="fa fa-bar-chart"></i></a>';
                                return btnhtml
                            }
                        }
                    ]
                },
                {
                    'tableName': 'ZBHS',
                    'colModel': [
                        {
                            name: 'zbjhChart', align: 'center',
                            formatter: function () {
                                var btnhtml = '<a class="btn btnChart"> <i class="fa fa-bar-chart"></i></a>';
                                return btnhtml
                            }
                        }
                    ]
                }
            ];
            //引入jqgrid
            //引入jqgrid语言包
            require(['jqGrid_my'], function (jqGridAll) {
                if (statuName == 'GCWLHS') {
                    //jqgrid自定义公共方法
                    for (var i = 0; i < result.length; i++) {
                        var tableId = result[i].code.split('_')[1];
                        var colNames = jsonItem.colNames;
                        var colModel = jsonItem.colModel;
                        var configData = jqGridAll.jG_configData(result[i].groupList);
                        var gridConfig = jqGridAll.jG_config(result[i].name, colNames, colModel);
                        var gridsum = jqGridAll.jG_conSum('#' + tableId, ['densitySolid', 'weightSolid']);
                        var ishide = {hiddengrid: true};//是否折叠
                        var lastsel;
                        var gridEdit = jqGridAll.jG_editRowFn('#' + tableId, lastsel);

                        //默认第一个补折叠
                        if (i == 0) {
                            $('#' + tableId).jqGrid($.extend(configData, gridConfig, gridEdit, gridsum));
                        } else {
                            $('#' + tableId).jqGrid($.extend(configData, gridConfig, gridEdit, gridsum, ishide));
                        }
                        ids.push(tableId);

                    }
                    PageModule.isHideFn(ids, colNames);

                }
                else if (statuName == 'KSSHHS') {
                    var colNames = jsonItem.colNames;
                    var colModel = jsonItem.colModel;
                    var configData = jqGridAll.jG_configData(result.nodes);
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(gridEdit, configData, gridConfig));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    ids = [];
                    ids.push(statuName);
                    PageModule.isHideFn(ids, colNames, statuName);
                }
                else if (statuName == 'WBCCHS') {
                    var colNames = jsonItem.colNames, colModel = jsonItem.colModel;
                    //修改折叠表要求的数据格式
                    var jsonData = {
                        rows: result
                    };
                    var configUrl = jqGridAll.jG_configUrl(JSON.stringify(jsonData));
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    var treeGrid = jqGridAll.jG_istreeGrid('name');
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(configUrl, treeGrid, gridConfig, gridEdit));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    $('#' + statuName)[0].addJSONData(jsonData);
                    ids = [];
                    ids.push(statuName);
                    //输入的tree的数据格式
                    PageModule.isHideFn(ids, colNames, statuName);
                }
                else if (statuName == 'JCWLHS') {
                    var jcwlData = '';
                    var colNames = jsonItem.colNames;
                    var colModel = jsonItem.colModel;
                    if (colModel.length != colNames.length) {
                        $(configjson).each(function () {
                            //把按钮push到数据里
                            if (statuName == this.tableName) {
                                jcwlData = this.colModel[0];
                            }
                        });
                        colModel.push(jcwlData);
                    }

                    for (var i = 0; i < result.length; i++) {
                        var tableId = result[i].code.split('_')[1];
                        var jsonData = {
                            rows: result[i].groupList
                        };
                        var configUrl = jqGridAll.jG_configUrl();
                        var gridConfig = jqGridAll.jG_config(result[i].name, colNames, colModel);
                        var gridsum = jqGridAll.jG_conSum('#' + tableId, ['monthTotal', 'monthLastTotal']);
                        var lastsel;
                        var treeGrid = jqGridAll.jG_istreeGrid('name');
                        var gridEdit = jqGridAll.jG_editRowFn('#' + tableId, lastsel);
                        var ishide = {hiddengrid: true};//是否折叠
                        //默认第一个补折叠
                        if (i == 0) {
                            $('#' + tableId).jqGrid($.extend(configUrl, gridConfig, gridEdit, gridsum, treeGrid));
                        }else{
                            $('#' + tableId).jqGrid($.extend(configUrl, gridConfig, gridEdit, gridsum, treeGrid,ishide));
                        }
                        $('#' + tableId)[0].addJSONData(jsonData);
                        ids.push(tableId);
                    }
                    PageModule.isHideFn(ids, colNames);
                }
                else if (statuName == 'CLHS') {
                    var jcwlData = '';
                    var colNames = jsonItem.colNames;
                    var colModel = jsonItem.colModel;
                    if (colModel.length != colNames.length) {
                        $(configjson).each(function () {
                            //把按钮push到数据里
                            if (statuName == this.tableName) {
                                jcwlData = this.colModel[0];
                            }
                        });
                        colModel.push(jcwlData);
                    }
                    //修改折叠表要求的数据格式
                    var jsonData = {
                        rows: result
                    };
                    var configUrl = jqGridAll.jG_configUrl(JSON.stringify(jsonData));
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    var treeGrid = jqGridAll.jG_istreeGrid('name');
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(configUrl, treeGrid, gridConfig, gridEdit));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    $('#' + statuName)[0].addJSONData(jsonData);
                    ids = [];
                    ids.push(statuName);
                    //输入的tree的数据格式
                    PageModule.isHideFn(ids, colNames, statuName);

                }
                else if (statuName == 'ZBHS') {
                    var jcwlData = '';
                    var colNames = jsonItem.colNames;
                    var colModel = jsonItem.colModel;
                    if (colModel.length != colNames.length) {
                        $(configjson).each(function () {
                            //把按钮push到数据里
                            if (statuName == this.tableName) {
                                jcwlData = this.colModel[0];
                            }
                        });
                        colModel.push(jcwlData);
                    }
                    var configData = jqGridAll.jG_configData(result.nodes);
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(gridEdit, configData, gridConfig));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    ids = [];
                    ids.push(statuName);
                    PageModule.isHideFn(ids, colNames, statuName);
                }
                else if (statuName == 'ZYXHHS') {
                    var colNames = jsonItem.colNames, colModel = jsonItem.colModel;
                    //修改折叠表要求的数据格式
                    var jsonData = {
                        rows: result
                    };
                    var configUrl = jqGridAll.jG_configUrl(JSON.stringify(jsonData));
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    var treeGrid = jqGridAll.jG_istreeGrid('name');
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(configUrl, treeGrid, gridConfig, gridEdit));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    $('#' + statuName)[0].addJSONData(jsonData);
                    ids = [];
                    ids.push(statuName);
                    PageModule.isHideFn(ids, colNames, statuName);

                }
                else if (statuName == 'AODCHS') {
                    var colNames = jsonItem.colNames;
                    var colModel = jsonItem.colModel;
                    var configData = jqGridAll.jG_configData(result.nodes);
                    var gridConfig = jqGridAll.jG_config(jsonItem.name, colNames, colModel);
                    var lastsel;
                    var gridEdit = jqGridAll.jG_editRowFn('#' + statuName, lastsel);
                    //默认第一个补折叠
                    $('#' + statuName).jqGrid($.extend(gridEdit, configData, gridConfig));
                    $('#' + statuName).setGridWidth($('#' + statuName).parents('div.active').width());
                    ids = [];
                    ids.push(statuName);
                    PageModule.isHideFn(ids, colNames, statuName);
                }

                jqGridAll.jG_Resize('#' + statuName);
                //保存按钮
                $('body').off('click', '#save-btn').on('click', '#save-btn', function () {
                    $('input[type=text].editable').each(function (i, item) {
                        $(this).parents('td').text($(this).val());
                        $(this).remove()
                    });

                    //时间
                    if (invDates == undefined) {
                        invDates = $('#invDate option:selected').val();
                        $('#invDateinput').val(invDates).attr({'type': 'text', 'readonly': 'readonly'});
                        $('#invDate').remove();
                    }
                    var urlArr2 = ['manageProcessMtrl', 'manageMineral', 'manageReport', 'manageMtrl', 'manageYield', 'manageQuota', 'manageConsume', 'manageAO'];
                    var savebtn = PageModule.saveTable(ids);
                    var data = {'stocktakeDate': invDates};
                    data[urlArr2[index]] = JSON.stringify(savebtn);
                    var urlArr = ['ManageProcessMtrl', 'ManageMineral', 'ManageReport', 'ManageMtrl', 'ManageYield', 'ManageQuota', 'ManageConsume', 'ManageAO'];
                    Api.ajaxForm(Api.aps + '/api/aps/' + urlArr[index] + '/save', data, function (result) {
                        if (result.success) {
                            PageModule.getData(index, json_, invDates);
                            Mom.layMsg('保存成功')
                        } else {
                            Mom.layAlert(result.message)
                        }


                    });
                });
                //計算
                $('body').off('click', '#computed-btn').on('click', '#computed-btn', function () {
                    $('input[type=text].editable').each(function (i, item) {
                        $(this).parents('td').text($(this).val());
                        $(this).remove()
                    });
                    var urlArr2 = ['manageProcessMtrl', 'manageMineral', 'manageReport', 'manageMtrl', 'manageYield', 'manageQuota', 'manageConsume', 'manageAO'];
                    var savebtn = PageModule.saveTable(ids);
                    var data = {'stocktakeDate': '2018-09-09'};
                    data[urlArr2[index]] = JSON.stringify(savebtn);
                    var urlArr = ['ManageProcessMtrl', 'ManageMineral', 'ManageReport', 'ManageMtrl', 'ManageYield', 'ManageQuota', 'ManageConsume', 'ManageAO'];
                    //重新加載數據

                    Api.ajaxForm(Api.aps + '/api/aps/' + urlArr[index] + '/analysis', data, function (result) {
                        if (result.success) {
                            Mom.layMsg('计算成功，请查看最新数据');
                            $('div.tableBox.active').empty();
                            PageModule.ajaxInnerEvent(result, json_, index, invDates);
                        } else {
                            Mom.layAlert(result.message)
                        }
                    });
                });
                //图表按钮
                $(ids).each(function (i, item) {
                    $('#' + item).off('click', 'a.btnChart').on('click', 'a.btnChart', function (event) {
                        var id = $(this).parents('tr').attr('id');
                        /**以下方法可以取到表任意一个表格内的内容*/
                        var celldata = $('#' + item).jqGrid('getCell', id, 2);
                        Bus.openDialog('图表:' + celldata, 'inventoryTaking/invManaChart.html?id=' + id, '800px', '500px');

                    });
                });
            });


        },
        //显示隐藏
        isHideFn: function (ids, colNames, statuName) {
            var arr = [];
            //标题行
            var $divtitle = $('div.active .ui-jqgrid-hdiv>.ui-jqgrid-hbox');
            $divtitle.find('.floatColShow').remove();
            //本页表数遍历 创建
            $(ids).each(function (ind, item) {
                var ulhtml = '<ul class="floatColShow" ></ul>';
                $('div.active>.ui-jqgrid').eq(ind).append(ulhtml);
                for (var i = 2; i < colNames.length; i++) {
                    var lihtml = '<li ><span class="checkName">' + colNames[i] + '</span>&nbsp<input class="showH" type="checkbox" checked="checked"></li>';
                    $('div.active>.ui-jqgrid').eq(ind).find('.floatColShow').append(lihtml);
                }
            });
            //按照表格高度调整ul absolute位置
            if (ids.length > 1) {
                $('.floatColShow').css({'top': '110px'})
            } else {
                $('.floatColShow').css({'top': '60px'})
            }
            //滑动隐藏
            $divtitle.on('mouseover', function () {
                arr = [];
                $(this).parents('.ui-jqgrid').find('.floatColShow').show();
                // 悬浮框显示/隐藏列
                var th = $(this).parents('.ui-jqgrid').find('.ui-th-ltr');
                for (var i = 2; i < th.length; i++) {
                    var val = $(th).eq(i).attr('id').split('_')[1];
                    arr.push(val);
                }
                $(this).parents('.ui-jqgrid').find('.floatColShow').find('.showH').each(function (a, aitem) {
                    var this_ = this;
                    $(ids).each(function (b, bitem) {
                          $(this_).on('click', function () {
                              var tableId=$(this).parents('.ui-jqgrid').attr('id').split('_')[1]
                            if (statuName == undefined) {
                                if (this.checked == true) {
                                    $("#" + tableId).jqGrid('showCol', arr[a]).setGridWidth($('#' + ids[b]).parents('div.active').width());
                                    //初始化修改所有表格宽度
                                } else {
                                    $("#" + tableId).jqGrid('hideCol', arr[a]).setGridWidth($('#' + ids[b]).parents('div.active').width());

                                }
                            } else {
                                if (this.checked == true) {
                                    $("#" + statuName).jqGrid('showCol', arr[a]).setGridWidth($("#" + statuName).parents('div.active').width());
                                } else {
                                    $("#" + statuName).jqGrid('hideCol', arr[a]).setGridWidth($("#" + statuName).parents('div.active').width());
                                }
                            }
                        })
                    });
                });

            });
            $('.floatColShow').on('mouseleave', function () {
                $(this).parents('.ui-jqgrid').find('.floatColShow').hide();
                arr = [];
            });
            $('div.active>.ui-jqgrid').on('mouseleave', function () {
                $('.floatColShow').parents('.ui-jqgrid').find('.floatColShow').hide();
            });

        },
        //保存
        saveTable: function (id) {
            temp = [];
            var arrAll = '', arrfjc = '';
            var contentArr = [], allObj = {};
            /**_____测试假数据保存*/
            if (id.length === 1) {
                arrAll = $('#' + id).jqGrid('getRowData');
            } else if (id.length > 1) {
                for (var i = 0; i < id.length; i++) {
                    arrfjc = $('#' + id[i]).jqGrid('getRowData');
                    for (var j = 0; j < arrfjc.length; j++) {
                        contentArr.push(arrfjc[j])
                    }

                }
                arrAll = contentArr;
            }
            return arrAll
        },
        /**图表页面方法*/
        invMChartInit: function () {
            require(['/js/plugins/echarts/js/echarts.js'], function (echarts) {
                var dom = document.getElementById('container');
                var myChart = echarts.init(dom);
                var optionLine = null;
                optionLine = {
                    title: {
                        text: '折线图堆叠'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        right: 40,
                        top: 150,
                        orient: 'vertical',//横竖显示图头标示
                        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']

                    },
                    grid: {
                        width: '80%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value',
                        max: 1500,
                        min: 0,
                        interval: 300
                    },
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '视频广告',
                            type: 'line',
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                if (optionLine && typeof optionLine === "object") {
                    myChart.setOption(optionLine, true);
                }

            });
        }
    };
    $(function () {
        //参数配置列表
        if ($('#invManagement').length > 0) {
            PageModule.invMListInit()
        }
        else if ($('#invDataComputation').length > 0) {
            PageModule.invDataComInit()
        }
        else if ($('#invManaChart').length > 0) {
            PageModule.invMChartInit()
        }
    });

});
