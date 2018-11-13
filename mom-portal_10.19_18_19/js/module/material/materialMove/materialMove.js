require(['/js/zlib/app.js'], function (App) {
    //引入用户登录校验
    require(['checkUser']);
    /**作者：贾旭光
     *日期：2018.10.17
     *描述：
     */
    var PageModule = {
        materialMoveInit: function () {
            var temPlate = [];
            $.get("../../json/factoryModel/materialMove/tankManage.json", function (result) {
                temPlate = result.rows[1];
                var primaryTable = result.rows[1].primaryTable;
                var seedTable = result.rows[1].seedTable;
                PageModule.materialMgetData(primaryTable, seedTable)

            });

        },
        //请求拿数据
        materialMgetData: function (primaryTable, seedTable) {
            /*拿data数据*/
            Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/data.json', {}, function (result) {
                if (result.success) {
                    PageModule.renderPotTable(primaryTable, seedTable, result)
                } else {
                    Mom.layAlert(result.message);
                }
            });
        },
        /*
         *罐规则数据potArr,
         *移动规则数据moveArr,
         *父表罐的请求数据 result,
         */
        renderPotTable: function (potArr, moveArr, result) {
            require(['jqGrid_my'], function (jqGridAll) {
                var optionsPot = {
                    colNames: potArr[0].colNames,
                    colModel: potArr[0].colModel,
                    data: result.rows,
                    multiselect: true
                };
                var optionsMMove = {
                    colNames: moveArr[0].colNames,
                    colModel: moveArr[0].colModel,
                    multiselect: true
                };
                var config = {
                    url: 'http://localhost:8000/json/factoryModel/materialMove/subdata.json'
                };
                var MMovesubTable = [];
                var subTableId;
                jqGridAll.jG_jqGridTableLevel('#materialMTable', optionsPot, optionsMMove, config, MMovesubTable, function (res) {
                    subTableId = res;
                    //编辑
                    var subtr = '.ui-subgrid .subgrid-data table tr.ui-widget-content';
                    $(subtr).each(function () {
                        $(this).on('dblclick', function () {
                            var moveType = $(this).find('td').eq(2).attr('title');
                            console.log(moveType);
                            if (moveType != 'TANK_TO_TANK') {
                                Mom.layAlert('请选择罐付罐类型物料移动数据，其他物料移动数据无法进行编辑')
                            } else {
                                var potDate = '2018-10-18';
                                /*$('#tankDate').val();*/
                                var classes = '早班(00:00:00-08:00:00)';
                                /*$('#clsses option:selected').val();*/
                                Bus.openEditDialog('新建物料移动信息', 'material/materialMove/addMove.html?potDate=' + potDate + '&classes=' + escape(classes), '681px', '495px')
                            }
                        })
                    })


                });
                var arr = jqGridAll.jG_getCheckAllIds('#materialMTable');
                //添加按钮
                $('#btn-add').unbind('click').on('click', function () {
                    var arrSubOne = [];
                    $(subTableId).each(function (i, item) {
                        var subArr = jqGridAll.jG_getCheckAllIds('#' + item);
                        $(subArr).each(function (a, aitem) {
                            //拿到被选中的子表id
                            arrSubOne.push(aitem);
                        })
                    });
                    if (arr.length > 1) {
                        Mom.layAlert('只能选择一个罐区进行新建物料移动')
                    } else if (arr.length == 0 || arrSubOne.length != 0) {
                        Mom.layAlert('请选择一个罐区进行新建物料移动')
                    } else {
                        var potDate = '2018-10-18';
                        /*$('#tankDate').val();*/
                        var classes = '早班(00:00:00-08:00:00)';
                        /*$('#clsses option:selected').val();*/
                        Bus.openEditDialog('新建物料移动信息', 'material/materialMove/addMove.html?potId=' + arr[0] + '&potDate=' + potDate + '&classes=' + escape(classes), '681px', '495px')
                    }
                });
                //关闭按钮
                $('#btn-close').unbind('click').on('click', function () {
                    var arrSubOne = [];
                    //拿到所有展开的主表id
                    if (subTableId == undefined || arr.length > 0) {
                        Mom.layAlert('请选择一项物料移动数据进行关闭')
                    } else {
                        $(subTableId).each(function (i, item) {
                            var subArr = jqGridAll.jG_getCheckAllIds('#' + item);
                            $(subArr).each(function (a, aitem) {
                                //拿到被选中的子表id
                                arrSubOne.push(aitem);
                            })
                        });
                        if (arrSubOne.length > 1 || arrSubOne.length < 1) {
                            Mom.layAlert('请选择一项物料移动数据进行关闭')
                        } else {
                            moveType = $('#' + arrSubOne[0]).find('td').eq(2).attr('title');
                            var potDate = '2018-10-18';
                            /*$('#tankDate').val();*/
                            var classes = '早班(00:00:00-08:00:00)';
                            /*$('#clsses option:selected').val();*/
                            Bus.openEditDialog('关闭物料移动', 'material/materialMove/addMove.html?moveId=' + arrSubOne[0] + '&potDate=' + potDate + '&classes=' + escape(classes) + '&moveType=' + moveType, '681px', '495px')
                        }
                    }
                });

            })
        },
        //移动弹出页
        addMoveInit: function () {
            var potId = Mom.getUrlParam('potId');
            var moveId = Mom.getUrlParam('moveId');
            var moveDate = Mom.getUrlParam('potDate');
            var classes = Mom.getUrlParam('classes');
            var moveType = Mom.getUrlParam('moveType');
            require(['datetimepicker', 'Page'], function () {
                //新增
                if (moveId == null && potId != null) {
                    /*初始化渲染数据*/
                    Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/formInit.json', {}, function (result) {
                        if (result.success) {
                            Bus.appendOptionsValue($('#operationType'), result.moveTypeList);
                            Validator.renderData(result.nodeMtrlMove, '#inputForm')
                        } else {
                            Mom.layAlert(result.message);
                        }

                    });
                    Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/class2.json', {}, function (result) {
                        if (result.success) {
                            $('#oppositeNode').empty();
                            Bus.appendOptionsValue($('#oppositeNode'), result.NodeList, 'id', 'nodename');
                            nodeToMtrl('#oppositeNode', result.NodeList, '#oppositeMaterial', '#oppositealias', true);
                        } else {
                            Mom.layAlert(result.message);
                        }
                    });


                    /*初始化对方节点*/
                    Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/class2.json', {}, function (result) {
                        if (result.success) {
                            $('#oppositeNode').empty();
                            Bus.appendOptionsValue($('#oppositeNode'), result.NodeList, 'id', 'nodename');
                            nodeToMtrl('#oppositeNode', result.NodeList, '#oppositeMaterial', '#oppositealias', true);
                        } else {
                            Mom.layAlert(result.message);
                        }
                    });
                    tankMove('table tr td', '#operationType,#oppositeNode,#oppositeMaterial,#startTime', '#startTime');
                    $('#operationType').on('change', function () {
                        var moveTypeS = $('#operationType option:selected').val();
                        //罐付罐
                        if (moveTypeS == 'TANK_TO_TANK') {
                            tankMove('table tr td', '#operationType,#oppositeNode,#startTime', '#startTime');

                            /*初始化对方节点*/
                            Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/class2.json', {}, function (result) {
                                if (result.success) {
                                    $('#oppositeNode').empty();
                                    Bus.appendOptionsValue($('#oppositeNode'), result.NodeList, 'id', 'nodename');
                                    nodeToMtrl('#oppositeNode', result.NodeList, '#oppositeMaterial', '#oppositealias', true);
                                } else {
                                    Mom.layAlert(result.message);
                                }
                            });
                            /**作者：贾旭光 ***描述：差两个本方量、对方量点击弹窗检尺*/
                        }
                        //罐收付进出厂点
                        else if (moveTypeS == 'TANK_RETO_IOF' || moveTypeS == 'TANK_TO_IOF') {
                            tankMove('table tr td', '#operationType,#oppositeNode,#oppositeMaterial,#startTime', '#startTime');
                            /*初始化对方节点*/
                            Api.ajaxJson('http://localhost:8000/json/factoryModel/materialMove/class2.json', {}, function (result) {
                                if (result.success) {
                                    $('#oppositeNode').empty();
                                    Bus.appendOptionsValue($('#oppositeNode'), result.NodeList, 'id', 'nodename');
                                    nodeToMtrl('#oppositeNode', result.NodeList, '#oppositeMaterial', '#oppositealias', true);
                                } else {
                                    Mom.layAlert(result.message);
                                }
                            });
                        }
                        //罐收付料线
                        else if (moveTypeS == 'TANK_RETO_LINE' || moveTypeS == 'TANK_TO_LINE') {
                            tankMove('table tr td', '#operationType,#oppositeNode,#startTime', '#startTime');
                            /**作者：贾旭光 ***描述：差一个本方量点击弹窗检尺*/
                        }

                        //特殊操作项
                        else if (moveTypeS == 'TANK_MOD' || moveTypeS == 'TANK_TO_STOREHOUSE' || moveType == 'TANK_RETO_STOREHOUSE' || moveType == 'TANK_RE_CHK') {
                            $('table tr td:nth-of-type(4)').each(function (i, item) {
                                $(this).find('input').attr('readonly', 'readonly', 'disabled', 'disabled');
                                $(this).find('input:checkbox,select').attr('disabled', 'disabled');
                            });
                            //槽罐改名和退库编辑项相同
                            if (moveTypeS == 'TANK_MOD' || moveTypeS == 'TANK_RETO_STOREHOUSE') {
                                tankMove('table tr td:nth-of-type(2)', '#operationType,#ownMaterial,#startTime', '#startTime')
                            }
                            //交库||复尺
                            if (moveTypeS == 'TANK_TO_STOREHOUSE' || moveTypeS == 'TANK_RE_CHK') {
                                tankMove('table tr td:nth-of-type(2)');
                                if (moveTypeS == 'TANK_RE_CHK') {
                                    $('#operationType,#startTime').removeAttr('disabled').removeAttr('readonly');
                                    /**作者：贾旭光 ***描述：差一个本方量点击弹窗检尺*/
                                } else {
                                    $('#operationType,#ownMaterial,#startTime').removeAttr('disabled').removeAttr('readonly');
                                }
                            }

                        }


                    });

                    // 判断input、select是否可用
                    // selector所有遍历元素
                    // removeAS删除属性的元素 字符串 如多个加逗号
                    // timeS如果有可编辑的时间 加times参数 选择器 传字符串
                    function tankMove(selector, removeAS, timeS) {
                        $(selector).each(function () {
                            $(this).find('input').attr('disabled', 'disabled');
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
                                todayBtn: true
                            });
                        }

                    }


                    // parSel父级节点选择器 parRows父级数据列表
                    // midSel中级节点选择器 midRows中级数据列表
                    // select子级节点选择器 ischange 意思是是如果二级不动的话 一级动 二三级一起变 传布尔值
                    //前提 数据格式不能变 参数不能变 其次 三级必须得是 1、select 2、select 3、input
                    function nodeToMtrl(parSel, parRows, midSel, selector, ischange) {
                        $(parSel).on('change', function () {
                            var id = $(parSel + ' option:selected').val();
                            var idsub;
                            $(parRows).each(function (e, eitem) {
                                if (id == eitem.id) {
                                    $(midSel).empty();
                                    Bus.appendOptionsValue($(midSel), parRows[e].mtrlList, 'id', 'mtrlName');
                                    $(parRows[e].mtrlList).each(function (q, qitem) {
                                        idsub = $(midSel + ' option:selected').val();
                                        if (idsub == qitem.id) {
                                            $(selector).val(parRows[e].mtrlList[q].mtrlAlias)
                                        }
                                    });
                                    if (ischange) {
                                        $(midSel).on('change', function () {
                                            $(parRows[e].mtrlList).each(function (d, ditem) {
                                                var idchange = $(midSel + ' option:selected').val();
                                                if (idchange == ditem.id) {
                                                    $(selector).val(parRows[e].mtrlList[d].mtrlAlias)
                                                }
                                            })
                                        })
                                    }

                                }
                            })
                        })
                    }
                }
                //关闭
                else if (potId == null && moveId != null) {
                    /*只有罐付罐可以编辑 并且只有对方量可以编辑 点击确定拿到对方量*/
                    $('input').attr('readonly', 'readonly', 'disabled', 'disabled');
                    $('input:checkbox').attr('disabled', 'disabled');
                    $('select').attr('readonly', 'readonly', 'disabled', 'disabled');
                    $('#endTime').removeAttr('disabled').removeAttr('readonly');
                    if (moveType == 'TANK_TO_TANK') {
                        $('#oppositeQuantity').removeAttr('disabled').removeAttr('readonly');
                    }
                    //判断日期大小
                    $("#endTime").on('change', function () {
                        if ($('#endTime').val() < $('#startTime').val() && $('#endTime').val() != '') {
                            Mom.layMsg('结束时间应大于开始时间，请重新选择');
                            $('#endTime').val('')
                        }
                    });
                    //时间选择插件
                    $("#endTime").val("").datetimepicker({
                        bootcssVer: 3, //显示箭头，部分如不显示箭头要加这个
                        format: "yyyy-mm-dd hh:ii:ss",  //保留到日
                        showMeridian: true,     //显示上、下午
                        language: "zh-CN",   //中文显示
                        minView: "0",    //月视图
                        autoclose: true,  //选择时间后自动隐藏
                        clearBtn: true,
                        todayBtn: true

                    });
                }
                //编辑
                else if (moveId == null && potId == null) {
                    /*只有罐付罐可以编辑 并且只有对方量可以编辑 点击确定拿到对方量*/
                    $('input').attr('readonly', 'readonly', 'disabled', 'disabled');
                    $('input:checkbox').attr('disabled', 'disabled');
                    $('select').attr('readonly', 'readonly', 'disabled', 'disabled');
                    $('#oppositeQuantity').removeAttr('disabled').removeAttr('readonly')
                }
            });


        }
    };
    $(function () {
        //参数配置列表
        if ($('#materialMove').length > 0) {
            PageModule.materialMoveInit();
        } else if ($('#addMove').length > 0) {
            PageModule.addMoveInit();
        }

    })

});