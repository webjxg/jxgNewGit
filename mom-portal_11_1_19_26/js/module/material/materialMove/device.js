/**作者：贾旭光
 *日期：2018.10.29
 *描述：
 */
require(['/js/zlib/app.js'], function (App) {
    require(['jqGrid_my'], function (jqGridAll) {
        var PageModule = {
            //全局装置日期
            recordDate: '',
            /***描述：搜索orgApiCfg接口用的是罐区的*/
            //————————初始化————————//
            init: function () {
                PageModule.loadClass(true, '#tabDate');
                //————————时间插件绑定————————//
                require(['datetimepicker'], function () {
                    //时间选择插件(获取年月日日期)
                    $("#tankDate").datetimepicker({
                        format: "yyyy-mm-dd",   //保留到日
                        language: 'zh-CN',          //中文显示
                        minView: "month",      //月视图
                        todayBtn: true,       //切换到今天
                        clearBtn: true,       //清除全部
                        autoclose: true, //选择时间后自动隐藏
                        endDate: getNowFormatDate()
                    });
                    $("#tankDate").val(getNowFormatDate());
                    //获取当前时间，格式YYYY-MM-DD
                    function getNowFormatDate() {
                        var date = new Date();
                        var seperator1 = "-";
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = "0" + strDate;
                        }
                        var currentdate = year + seperator1 + month + seperator1 + strDate;
                        return currentdate;
                    }
                });
                //————————左侧装置树方法 预留点击后取到节点参数————————//
                require(['ztree_my'], function (ZTree) {
                    var orgTree, curClickTreeNode;
                    var orgZtreeSetting = $.extend(true, {}, {
                        callback: {onClick: orgOnClick}
                    }, {});

                    var orgApiCfg = $.extend(true, {}, {
                        url: Api.mtrl + "/api/mv/Tank/getTankTree",
                        data: {},
                        contentType: 'json'
                    }, {});
                    var orgConType = orgApiCfg.contentType || 'json';
                    loadOrgData();
                    function loadOrgData() {
                        if (orgConType == 'json') {
                            //json的方式调用接口
                            Api.ajaxJson(orgApiCfg.url, JSON.stringify(orgApiCfg.data || {}), function (result) {
                                if (result.success) {
                                    loadOrgTree(result.rows);
                                } else {
                                    Mom.layMsg(result.message);
                                }
                            });
                        }
                    }

                    function loadOrgTree(rows) {
                        var ztree1 = new ZTree();
                        orgTree = ztree1.loadData($("#zTree"), rows, false, orgZtreeSetting);
                        ztree1.registerSearch(orgTree, $('#wait_searchText'), 'name');
                        var nodes = orgTree.getNodes();
                        if (nodes.length > 0) {
                            orgTree.selectNode(nodes[0]);
                            $("#shiftHidden").attr("data-nodeId", nodes[0].id);
                        }
                    }

                    function orgOnClick(event, treeId, treeNode, clickFlag) {
                        if (orgTree) {
                            curClickTreeNode = treeNode;
                            orgTree.expandNode(treeNode);
                            $("#shiftHidden").attr("data-nodeId", treeNode.id);
                        }
                    }
                });
                PageModule.tabBtnclick('.tabBtn li', '.msgbox', '.operationBtn');
                pageLoad = function () {
                    var data = {
                        date: $("#tankDate").val(),             //日期
                        shift: $("#shift").val(),                        //班次
                        deviceId: $("#shiftHidden").attr("data-nodeid")          //装置id
                    };
                    Api.ajaxJson("http://localhost:8000/json/factoryModel/list.json", {}, function (result) {
                        PageModule.renderDevice(result.rows);
                        Bus.appendOptionsValue($('#schemeName'), result.rows, 'id', 'name');
                        PageModule.btnCollection();
                        //删除
                        $('a.btn-delete').unbind('click').on('click', function () {
                            var id = $(this).parents("tr").find('.btn-delete').attr('id');
                            /**改地址*/
                            Bus.deleteItem('确定要删除该方案么', Api.mtrl + '/api/fm/NodeSideline/delete', {ids: id});
                        });

                        //切换方案
                        $('#tab-btn').unbind('click').on('click', function () {
                            var data = {
                                schemeName: $('#schemeName').val(),
                                tabDate: $('#tabDate').val()
                            };
                            Api.ajaxJson(Api.aps + '', JSON.stringify(data), function (result) {
                                if (result.success) {
                                    console.log(result);
                                    pageLoad();
                                } else {
                                    Mom.layAlert(result.message);
                                }

                            });
                        });
                    });
                };
                pageLoad();
            },

            //————————方案按钮集合————————//
            btnCollection: function () {
                //数据提交
                $('#submit').unbind('click').on('click', function () {
                    var id = $('#shiftHidden').attr('data-nodeId');
                    var data = {
                        id: id
                    };
                    Api.ajaxJson(Api.aps + ''/*____待填写_____*/, JSON.stringify(data), function (result) {
                        if (result.success) {
                            console.log(result);
                        } else {
                            Mom.layAlert(result.message);
                        }

                    });
                });

                //解除提交
                $('#unSubmit').unbind('click').on('click', function () {
                    var id = $('#shiftHidden').attr('data-nodeId');
                    var data = {
                        id: id,
                        date: $('#tankDate').val(),
                        shift: $('#shift').val()
                    };
                    Api.ajaxJson(Api.aps + ''/*____待填写_____*/, JSON.stringify(data), function (result) {
                        if (result.success) {
                            console.log(result);
                        } else {
                            Mom.layAlert(result.message);
                        }

                    });
                });

                //删除班次记录
                $('#delClass').unbind('click').on('click', function () {
                    var id = $('#shiftHidden').attr('data-nodeId');
                    var data = {
                        id: id,
                        date: $('#tankDate').val(),
                        shift: $('#shift').val()
                    };
                    Api.ajaxJson(Api.aps + ''/*____待填写_____*/, JSON.stringify(data), function (result) {
                        if (result.success) {
                            console.log(result);
                        } else {
                            Mom.layAlert(result.message);
                        }

                    });
                });
            },

            /***描述：搜索url_接口用的是罐区的*/
            //————————渲染班次下拉框 参数是如果isTime是true则拿到班次时间————————//
            loadClass: function (isTime, sel) {
                var url_ = Api.aps + '/api/ctrl/Shift/list';
                Api.ajaxJson(url_, {}, function (result) {
                    if (result.success) {
                        var rows = result.rows;
                        var options = new Array();
                        $(rows).each(function (i, o) {
                            var label = o['name'] + '(' + o['startTime'] + '-' + o['endTime'] + ')';
                            var value = o['startTime'] + '-' + o['endTime'];
                            options.push({'value': value, 'label': label});
                        });
                        Bus.appendOptions($('#shift'), options);
                        if (isTime == true) {
                            $(sel).val($('#shift').val().split('-')[1])
                        }
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            },

            //————————Tab切换方法————————//
            /*参数lis是li   selector是被隐藏容器集合*/
            tabBtnclick: function (lis, selector, btnSel) {
                //tab切换
                $(lis).each(function (index, item) {
                    $(item).unbind("click").on("click", function () {
                        $(this).addClass("active").siblings("li").removeClass("active");
                        $(selector).eq(index).removeClass('hide').siblings(selector).addClass('hide');
                        if (index == 0 || index == 3) {
                            //方案管理
                            PageModule.pageChange('datatable');
                        }
                        if (index == 1 || index == 2 || index == 3) {
                            $(btnSel).eq(index - 1).removeClass('hide').siblings(btnSel).addClass('hide');
                            if (index == 1) {
                                //班计量
                                PageModule.pageChange('jqgrid', '.table-content', 'classMTable', PageModule.getColModelName)

                            } else if (index == 2) {
                                //投入产出
                                PageModule.pageChange('jqgrid', '#inputOTable')
                            } else {
                                //物料移动
                                PageModule.pageChange('datatable',PageModule.renderMaterialM);
                            }
                        } else {
                            $(btnSel).addClass('hide');
                        }


                    });
                });


            },

            //页面刷新重新请求数据 参数tableType渲染表的类型，tableSel表选择器，回调函数
            pageChange: function (tableType, tableSel, tableId, callBack) {
                if (tableType == 'datatable') {
                    if(tableSel==undefined){
                        pageLoad()
                    }else{
                        tableSel()
                    }


                } else if (tableType == 'jqgrid') {
                    $(tableSel).empty();
                    var tablehtml = '<table id="' + tableId + '"></table>';
                    $(tableSel).append(tablehtml);
                    if (callBack) {
                        callBack()
                    }
                }

            },

            //————————渲染方案列表页方法————————//
            renderDevice: function (tableData) {
                $('#schemeMTable').dataTable({
                    "bSort": true,
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0]}
                    ],
                    "data": tableData,
                    "aoColumns": [
                        {"data": "name", 'sClass': "center", "width": "34%"},
                        {"data": "startDate", 'sClass': "center", "width": "34%"},
                        {
                            "data": "id",
                            "orderable": false,
                            "defaultContent": "",
                            'sClass': " center ",
                            "width": "24%",
                            "render": function (data, type, row, meta) {
                                if (row.type != undefined && row.type == true) {
                                    return "";
                                } else {
                                    return "<a class='btn-delete' id='" + row.id + "' title='删除'><i class='fa fa-trash-o'></i></a >";
                                }

                            }
                        }

                    ]
                });

            },

            //————————jqgrid请求colModels  参数为判断下一步是否采集 重新渲染jqgrid————————//
            getColModelName: function (isgather) {
                $.get('../../../json/factoryModel/materialMove/deviceColModel.json', function (json) {
                    PageModule.renderJqgrid(json, isgather);

                })
            },

            //————————班计量渲染jqgrid方法————————//
            renderJqgrid: function (json, isgather) {
                require(['jqGrid_my'], function (jqGridAll) {
                    window.pageLoad = function () { //Api.mtrl +"/api/mv/FormulaDef/form"
                        if (isgather == true) {
                            var url = "http://localhost:8000/json/factoryModel/materialMove/tableTestDP.json";
                            //————————此处联调接口时更改为采集的接口地址————————//
                        } else {
                            var url = "http://localhost:8000/json/factoryModel/materialMove/tableTestDP.json";
                        }

                        var dataList = {
                            createDate: $("#tankDate").val(),             //日期
                            shift: $("#shiftHidden").val(),
                            deviceId: $("#shiftHidden").attr("data-deviceId")
                        };
                        Api.ajaxJson(url, dataList, function (res) {
                            //渲染成功多少条
                            $('#classMeasure .treeTable-num').text(res.rows.length);
                            //配置主子表参数
                            var lastsel;
                            var optionsPot = {
                                colNames: json.parents.colNames,
                                colModel: [
                                    {
                                        "name": "id",
                                        "label": "id",
                                        "align": "center",
                                        "hidden": true
                                    },
                                    {
                                        "name": "liaoxianname",
                                        "label": "liaoxianname",
                                        "align": "center"
                                    },
                                    {
                                        "name": "wuliao",
                                        "label": "wuliao",
                                        "align": "center"
                                    },
                                    {
                                        "name": "jinchu",
                                        "label": "jinchu",
                                        "align": "center"
                                    },
                                    {
                                        "name": "zhiliang",
                                        "label": "zhiliang",
                                        "align": "center"
                                    },
                                    {
                                        "name": "liaoxianend",
                                        "label": "liaoxianend",
                                        "align": "center",
                                        formatter: function (cellvalue, options, rowObject) {
                                            return '<a class="leftBtn"><i class="fa fa-table col-1ab394"></i></a> '
                                        }
                                    },
                                    {
                                        "name": "qianliang",
                                        "label": "qianliang",
                                        "align": "center"
                                    },
                                    {
                                        "name": "houliang",
                                        "label": "houliang",
                                        "align": "center",
                                        formatter: function (cellvalue, options, rowObject) {
                                            return '<a class="rightBtn"><i class="fa fa-tachometer col-1ab394"></i></a> '
                                        }
                                    },
                                    {
                                        "name": "chacunliang",
                                        "label": "chacunliang",
                                        "align": "center",
                                        "editable": true
                                    },
                                    {
                                        "name": "chaquery",
                                        "label": "chaquery",
                                        "align": "center"
                                    },
                                    {
                                        "name": "jiequliang",
                                        "label": "jiequliang",
                                        "align": "center",
                                        "editable": true
                                    },
                                    {
                                        "name": "jieququery",
                                        "label": "jieququery",
                                        "align": "center",
                                        "editable": true
                                    },
                                    {
                                        "name": "pingguling",
                                        "label": "pingguling",
                                        "align": "center"
                                    },
                                    {
                                        "name": "shift",
                                        "label": "shift",
                                        "align": "center"
                                    },
                                    {
                                        "name": "save",
                                        "label": "save",
                                        "align": "center"
                                    }],
                                data: res.rows,
                                rownumbers: true,
                                cellEdit: false,
                                cellsubmit: 'clientArray',
                                editurl: 'clientArray',
                                onSelectRow: function (id, status) {
                                    if (id && id !== lastsel) {
                                        $('#classMTable').saveRow(lastsel, false, 'clientArray');
                                        $('#classMTable').restoreRow(lastsel);
                                        $('#classMTable').editRow(id, false);
                                        lastsel = id;
                                    }

                                }
                            };
                            var optionsMMove = {
                                colNames: json.childs.colNames,
                                colModel: [
                                    {name: "id", label: "id", align: "center", hidden: true},
                                    {name: "F", label: "F", align: "center", title: false, width: "10"},
                                    {name: "materialName", label: "materialName", align: "center", width: "100"},
                                    {name: "material", label: "material", align: "center", width: "100"},
                                    {
                                        name: "qualityGrade",
                                        label: "qualityGrade",
                                        align: "center",
                                        width: '100',
                                        formatter: function (cellvalue, options, rowObject) {
                                            return '<select class="form-control editSelect"></select>'
                                        }
                                    }
                                ]
                            };
                            var config = {
                                url: "http://localhost:8000/json/factoryModel/materialMove/tableTestDC.json",
                                dataParams: {
                                    date: $("#shiftHidden").attr("data-time"), /**/
                                    shift: $("#shiftHidden").val()/**/
                                },
                                otherId: 'tankId'

                            };
                            var MMovesubTable = [];
                            //拿到子表id
                            jqGridAll.jG_jqGridTableLevel('#classMTable', optionsPot, optionsMMove, config, MMovesubTable, function (subtabIds, datajson, resdata) {
                                $(subtabIds).each(function (i, o) {
                                    jqGridAll.jG_Resize('#' + o, '.subTableBox');
                                });
                                Bus.appendOptionsValue('.editSelect', resdata.labels, 'id', 'label');
                                //编辑下拉框的时候保存数据
                                $('.editSelect').on('change', function () {
                                    var id = $(this).parent('td').parent('tr').find('td').eq(0).text();
                                    var data = {
                                        id: id,
                                        qualityGrade: $(this).val()
                                    };
                                    Api.ajaxJson('', JSON.stringify(data), function (result) {
                                        if (result.success) {
                                            console.log(result);
                                        } else {
                                            Mom.layAlert(result.message);
                                        }

                                    });
                                })
                            });
                            //重新设置宽度 跟主子表里的ibox-content冲突
                            jqGridAll.jG_Resize('#classMTable', '.table-content');
                            $('.leftBtn').each(function (i, o) {
                                $('#classMTable').off('click', 'a.leftBtn').on('click', 'a.leftBtn', function (event) {
                                    $(this).parents('td').prev().text('zzzz')
                                })
                            });
                            $('.rightBtn').each(function (i, o) {
                                $('#classMTable').off('click', 'a.rightBtn').on('click', 'a.rightBtn', function (event) {
                                    if ($(this).parents('td').next().text() == '') {
                                        $(this).parents('td').next().find('input').val('xxxx');
                                    } else {

                                    }

                                })
                            });
                            //自动采集按钮
                            $('#gather').unbind('click').on('click', function () {
                                PageModule.pageChange('jqgrid', '.table-content', 'classMTable', PageModule.getColModelName(true))
                            });
                            //保存
                            $('#class-btn-save').unbind('click').on('click', function () {
                                $('input[type=text].editable').each(function (i, item) {
                                    $(this).parents('td').text($(this).val());
                                    $(this).remove()
                                });
                                var allData = $('#classMTable').jqGrid('getRowData');
                                Api.ajaxJson('', JSON.stringify(allData), function (result) {
                                    if (result.success) {
                                        console.log(result);
                                    } else {
                                        Mom.layAlert(result.message);
                                    }

                                });
                            })

                        });


                    };
                    pageLoad();

                });
            },

            //————————物料移动列表页渲染————————//
            renderMaterialM: function () {
                var data = {
                    date: $("#tankDate").val(),             //日期
                    shift: $("#shift").val(),                        //班次
                    deviceId: $("#shiftHidden").attr("data-nodeid")          //装置id
                };
                Api.ajaxJson("http://localhost:8000/json/factoryModel/listMaterialMove.json", JSON.stringify(data), function (result) {
                    if(result.success){
                        //渲染成功多少条
                        $('#materialMove .treeTable-num').text(result.rows.length);
                        $('#materialMTable').dataTable({
                            "bSort": true,
                            "data": result.rows,
                            "aoColumns": [
                                {"data": "id", 'sClass': "autoWidth center"},
                                {
                                    "data": null, "defaultContent": "", 'sClass': "center", "width": "1%",
                                    "render": function (data, type, row, meta) {
                                        return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                                    }
                                },
                                {"data": "getGiveType", 'sClass': "autoWidth center"},
                                {"data": "giveName", 'sClass': "autoWidth center"},
                                {"data": "getName", 'sClass': "autoWidth center"},
                                {"data": "startDate", 'sClass': "autoWidth center"},
                                {"data": "endDate", 'sClass': "autoWidth center"},
                                {"data": "createBy", 'sClass': "autoWidth center"},
                                {"data": "createDate", 'sClass': "autoWidth center"},
                                {"data": "cloBy", 'sClass': "autoWidth center"},
                                {"data": "cloDate", 'sClass': "autoWidth center"}
                            ],
                            "fnDrawCallback" : function(){
                                this.api().column(0).nodes().each(function(cell, i) {
                                    cell.innerHTML =  i + 1;
                                });
                            }
                        });
                        renderIChecks();
                        Bus.appendOptionsValue($('#schemeName'), result.rows, 'id', 'name');
                        PageModule.btnCollection();

                        //删除
                        $('button.btn-delete').unbind('click').on('click', function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            //多个删除
                                var bol = false;
                                var str = '';  //用于拼接str
                                $("tbody tr td input.i-checks:checkbox").each(function (index, item) {
                                    if ($(this).is(":checked")) {
                                        var id = $(this).attr('id');
                                        if (id != undefined) {
                                            str += "," + $(this).attr("id");
                                        }
                                        bol = true;
                                    }
                                });
                                if (bol) {
                                    top.layer.confirm('请您确认是否要删除勾选数据', {icon: 3, title: '系统提示'}, function (index) {
                                        if (str.length > 0) { //新增的元素+已存在的数据 或全是已存在的数据
                                            var data = {
                                                ids: str.substr(1)
                                            };
                                            var url = Api.aps + '';
                                            Api.ajaxForm(url,data, function (result) {
                                                if (result.success) {
                                                    Mom.layMsg('删除成功！');
                                                    $("tbody tr td input.i-checks:checkbox").each(function (index, item) {
                                                        if ($(this).is(':checked')) {
                                                            $(this).parents('tr').remove();
                                                        }
                                                    });
                                                } else {
                                                    Mom.layMsg(result.message);
                                                }
                                            })
                                        }
                                        top.layer.close(index);
                                    });

                                } else {
                                    Mom.layMsg("请选择至少一条数据！");
                                }
                        });
                        //新建
                        $('#btn-add').unbind('click').on('click', function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            var string=[];
                            $("tbody tr td input.i-checks:checkbox").each(function (index, item) {
                                if ($(this).is(":checked")) {
                                    var id = $(this).attr('id');
                                    if (id != undefined) {
                                        string.push(id);
                                    }
                                }

                            });
                            if (string.length>1) {
                                Mom.layAlert('只能选择一条数据');
                            }else if(string.length<1){
                                Mom.layAlert('请选择一条数据');
                            }else{
                                var winOptons = {
                                    btnArr: [
                                        {
                                            btn: '确定', fn: function (layerIdx, layero) {
                                            var iframeWin = layero.find('iframe')[0].contentWindow;
                                            var formData = iframeWin.getFormData();
                                            console.log(formData);
                                            Api.ajaxJson(Api.aps+formData.url,JSON.stringify(formData.data),function(result){
                                                if(result.success == true){
                                                    Mom.layMsg('操作成功', 1000);
                                                    setTimeout(function(){
                                                        PageModule.renderMaterialM();
                                                        //↑↑↑刷新页面 不确定是否可用 待试用↑↑↑↑
                                                        top.layer.close(layerIdx);
                                                    },500);
                                                }else{
                                                    Mom.layAlert(result.message);
                                                }
                                            });
                                            return false;
                                            }
                                        }
                                    ]
                                };

                                Bus.openDialogCfg("物料移动信息录入", "../material/materialMove/deviceMMAddForm.html?id=" + id+"&Type=add&classDate="+data.date+'&classTime='+data.shift , "698px", '409px', winOptons)
                            }

                        });
                        //关闭
                        $('#btn-close').unbind('click').on('click', function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            var string=[];
                            $("tbody tr td input.i-checks:checkbox").each(function (index, item) {
                                if ($(this).is(":checked")) {
                                    var id = $(this).attr('id');
                                    if (id != undefined) {
                                        string.push(id);
                                    }
                                }

                            });
                            if (string.length>1) {
                                Mom.layAlert('只能选择一条数据');
                            }else if(string.length<1){
                                Mom.layAlert('请选择一条数据');
                            }else{
                                var winOptons = {
                                    btnArr: [
                                        {
                                            btn: '确定', fn: function (layerIdx, layero) {
                                            var iframeWin = layero.find('iframe')[0].contentWindow;
                                            var formData = iframeWin.getFormData();
                                            console.log(formData);
                                            Api.ajaxJson(Api.aps+formData.url,JSON.stringify(formData.data),function(result){
                                                if(result.success == true){
                                                    Mom.layMsg('操作成功', 1000);
                                                    setTimeout(function(){
                                                        PageModule.renderMaterialM();
                                                        //↑↑↑刷新页面 不确定是否可用 待试用↑↑↑↑
                                                        top.layer.close(layerIdx);
                                                    },500);
                                                }else{
                                                    Mom.layAlert(result.message);
                                                }
                                            });
                                            return false;
                                            }
                                        }
                                    ]
                                };

                                Bus.openDialogCfg("物料移动信息录入", "../material/materialMove/deviceMMAddForm.html?id=" + id+"&Type=close&classDate="+data.date+'&classTime='+data.shift , "698px", '409px', winOptons)
                            }

                        });
                    }else{
                        Mom.layMsg(result.message)
                    }


                });
            },
            
            //————————装置物料移动弹窗页面方法————————//
            decMMAForm:function () {
                require(['datetimepicker', 'Page'], function () {;
                var type=Mom.getUrlParam('Type'), deviceId=Mom.getUrlParam('id'),classDate=Mom.getUrlParam('classDate'),classTime=Mom.getUrlParam('classTime');
                if(type=='add'){
                    attrInit('table tr td','#operationType,input.i-checks,#dlvNodeId,#oppositeNode,#startTime','#startTime')
                }else if(type=='close'){
                    attrInit('table tr td','#endTime','#endTime')
                }
                window.getFormData=function () {
                    if(!Validator.valid(document.forms[0],1.3)){
                        return;
                    }
                    var formObj = $('#inputForm');
                    return {
                        url: formObj.attr('action'),
                        data: formObj.serializeJSON()
                    }
                };








                // 判断input、select是否可用
                function attrInit(selector, removeAS, timeS) {
                    $(selector).each(function () {
                        $(this).find('input:text').attr('readonly', 'readonly');
                        $(this).find('select').attr('disabled', 'disabled').addClass('dis');
                    });
                    if (removeAS) {
                        $(removeAS).removeAttr('disabled').removeAttr('readonly').removeClass('dis');
                    }
                    //时间选择插件
                    if (timeS) {
                        $(timeS).val("").datetimepicker({
                            bootcssVer: 3, //显示箭头，部分如不显示箭头要加这个
                            format: "yyyy-mm-dd hh:ii:ss",  //保留到日
                            showMeridian: true,     //显示上、下午
                            language: "zh-CN",   //中文显示
                            minView: "0",    //月视图
                            autoclose: true,  //选择时间后自动隐藏
                            clearBtn: true,
                            startDate:classDate+' '+classTime.split('-')[0],
                            endDate:classDate+' '+classTime.split('-')[1]
                        });
                    }
                }
                })
            }
        };
        $(function () {
            //————————主页列表页————————//
            if ($("#deviceIndex").length > 0) {
                PageModule.init();
            }else if($('#deviceMMAddFrom').length>0){
                PageModule.decMMAForm();
            }
        })
    });
});