/**
 * Created by admin on 2018/10/16.
 */
require(['/js/zlib/app.js'], function(App) {
    require(['jqGrid_my'], function (jqGridAll) {
        var PageModule = {
            /*************检尺********************/
        init:function () {
            var temPlate = []; //获取到所有的模板数据，tab切换的时候不在请求json
            // $.get("../../json/factoryModel/materialMove/tankManage.json",function (result) {
            //         temPlate = result.rows;
            //         PageModule.tabBtnclick(temPlate);//tab切换选择不同的json配置
            //     });
                        temPlate = PageModule.getTemPlate();
                        PageModule.tabBtnclick(temPlate[0]);//tab切换选择不同的json配置
                //渲染班次下拉
            PageModule.loadClass();
            /*
            * 生成初始化记录
            * winOptons：配置生成初始化记录按钮的方法，callback
            * */
            var winOptons = {
                btnArr: [
                    {btn:'生成初始化记录', fn: function(layerIdx, layero){
                        var iframeWin = layero.find('iframe')[0].contentWindow;
                        console.log(iframeWin)
                        var formData = iframeWin.getFormData();
                        if(formData){
                            var data = formData.data;
                            //调用接口：生成初始化数据
                            Api.ajaxJson(formData.url,JSON.stringify(data),function(result) {
                                if (result.success == true) {
                                    var wuliao = result.AA.wuliao||data.wuliao;
                                    //更新选中行中的物料数据
                                }else{
                                    Mom.layAlert(result.message);
                                }
                            });
                        }
                    }}
                ],
            };
            $("#initialize").unbind("click").on("click",function () {
                var id = "123";
                Bus.openDialogCfg("槽/罐区-槽/罐初始化","../material/materialMove/initializeFrom.html?id="+id,"574px",'207px',winOptons)
            });
            /*
             * 检尺信息录入
             * tankOptions：配置数据采集，数据计算，确定方法，callback
             * */
            var tankOptions = {
                btnArr:[
                    {btn:'数据采集',fn:function (layerIdx,layero) {
                        var iframeWin = layero.find('iframe')[0].contentWindow;
                        var formData = iframeWin.getTankFormData();
                        if(formData){
                            var data = formData.data;
                            //调用接口：生成数据采集数据
                            Api.ajaxJson(formData.url,JSON.stringify(data),function(result) {
                                if (result.success == true) {
                                    var wuliao = result.AA.wuliao||data.wuliao;
                                    //更新选中行中的物料数据

                                }else{
                                    Mom.layAlert(result.message);
                                }
                            });
                        }
                    }},
                    {btn:'槽/罐量计量',fn:function (layerIdx,layero) {
                        var iframeWin = layero.find('iframe')[0].contentWindow;
                        var formData = iframeWin.getTankFormData();
                        if(formData){
                            var data = formData.data;
                            //调用接口：生成数据采集数据
                            Api.ajaxJson(formData.url,JSON.stringify(data),function(result) {
                                if (result.success == true) {
                                    var wuliao = result.AA.wuliao||data.wuliao;
                                    //更新选中行中的物料数据

                                }else{
                                    Mom.layAlert(result.message);
                                }
                            });
                        }
                    }},
                    {btn:'确定',fn:'doSubmit'}
                ]
            };
            $("#construction").unbind("click").on("click",function () {
                Bus.openDialogCfg("槽/罐检尺信息录入","../material/materialMove/informationEntryFrom.html",'1128px','692px',tankOptions)
            });
            /*
            * 批量检尺
            * */
            $("#batch").unbind("click").on("click",function () {
                Bus.openEditDialog("批量检尺","../material/materialMove/batchMeasureForm.html",'864px','427px')
            });

            require(['ztree_my'], function (ZTree) {
                var orgTree, curClickTreeNode;
                var orgZtreeSetting = $.extend(true,{},{
                    callback: {onClick: orgOnClick}
                },{});
                var orgApiCfg = $.extend(true,{},{
                    url: "../../json/ztreeJson/ztree.json",
                    data: {},
                    contentType: 'json'
                },{});
                var orgConType = orgApiCfg.contentType||'json';
                loadOrgData();
                function loadOrgData(){
                    if(orgConType == 'json'){
                        //json的方式调用接口
                        Api.ajaxJson(orgApiCfg.url, JSON.stringify(orgApiCfg.data||{}), function(result) {
                            if (result.success) {
                                loadOrgTree(result.rows);
                            } else {
                                Mom.layMsg(result.message);
                            }
                        });
                    }else{
                        //form的方式调用接口
                        Api.ajaxForm(orgApiCfg.url, orgApiCfg.data||{}, function(result) {
                            if (result.success) {
                                loadOrgTree(result.rows);
                            } else {
                                Mom.layMsg(result.message);
                            }
                        });
                    }
                }
                function loadOrgTree(rows){
                    var ztree1 = new ZTree();
                    orgTree = ztree1.loadData($("#zTree"),rows,false,orgZtreeSetting);
                    // ztree1.registerSearch(orgTree, $('#org_searchText'), 'name');
                }
                function orgOnClick(event, treeId, treeNode, clickFlag){
                    if(orgTree){
                        curClickTreeNode = treeNode;
                        orgTree.expandNode(treeNode);
                        // loadWaitUserData();
                    }
                }
            });
        },
        tabBtnclick:function (temPlate) {
            var flage = true;
            //tab切换
            $(".tabBtn li").each(function (index,item) {
                $(item).unbind("click").on("click",function () {
                    $(this).addClass("active").siblings("li").removeClass("active");
                    $(".msgbox").eq(index).removeClass("hide").siblings(".msgbox").addClass("hide");
                    $(".operationBtn").eq(index).removeClass("hide").siblings(".operationBtn").addClass("hide");
                    // if(index == 0){
                        PageModule.getData(index,temPlate[index]);
                    // }else if(index == 1){
                    //     PageModule.materialMoveInit(temPlate[index])
                    // }else if(index == 2){
                    //     PageModule.accountInit(temPlate[index]);
                    // }
                });
                if(index==0){
                    $(item).addClass("active");
                    $(".msgbox").eq(index).removeClass("hide");
                    PageModule.getData(index,temPlate[index])
                    $(".operationBtn").eq(0).removeClass("hide")
                }
            });
        },
        getData:function (index,temPlate) {
            console.log(temPlate)
            //请求列表接口
            Api.ajaxForm("../../json/tankManage/dataType.json",{},function (result) {
                var dataTable = result.rows;
                if(index == 0){
                    PageModule.createPrimary(index,dataTable,temPlate);
                }else if(index == 1){
                    PageModule.renderPotTable(index,dataTable,temPlate);
                }else if(index == 2){
                    PageModule.accountInit(index,dataTable,temPlate);
                }
            });
        },
        getTemPlate:function () {
            var templateArr = [];
            $.get("../../json/factoryModel/materialMove/tankManage.json",function (result) {
                temPlate = result.rows;
                return temPlate;
                // PageModule.tabBtnclick(temPlate);//tab切换选择不同的json配置
            });
         }
        /*
        *index:是索引
        * dataTable是加载的数据
        * temPlate:是jqGrid基础配置的模板
        * */
        createPrimary:function (index,dataTable,temPlate) {
           var  settings1 = {   //主表配置
               colNames:temPlate.primaryTable[0].colNames,
               colModel:temPlate.primaryTable[0].colModel,
               data:dataTable,
               multiselect: true
           };
           var settings2 = {
               colNames:temPlate.seedTable[0].colNames,
               colModel:temPlate.seedTable[0].colModel
           };
           var config = {
               url:"../../json/tankManage/children.json",
               dataParams:{},
               subtable:[],
               contentType:"json"
           };
                var subtable = [];
                jqGridAll.jG_jqGridTableLevel("#dataTable"+index,settings1,settings2,config,subtable);
                jqGridAll.jG_Resize("#dataTable"+index,"#measure"); //根据屏幕大小改变表格
        },
        initializeFrom:function () {
            var id = Mom.getUrlParam("id");
            var url = "12312312";
            Api.ajaxJson(url,{id:id},function(result){
                if(result.success){
                    Validator.renderData(result, '#inputForm');
                }else{
                    Mom.layAlert(result.message);
                }
            });
            window.getFormData = function(){
                var formObj = $('#inputForm');
                if(!Validator.valid(formObj,1.3)){
                    return;
                }
                return {
                    url: formObj.attr('action'),
                    data: formObj.serializeJSON()
                }
            };
        },
        loadClass:function () {
            var url_ = Api.aps+'/api/ctrl/Shift/list';
            Api.ajaxJson(url_, {}, function(result){
                if(result.success){
                    var rows = result.rows;
                    var options = new Array();
                    $(rows).each(function(i,o){
                        var label = o['name']+'('+o['startTime']+'-'+o['endTime']+')';
                        options.push({'value':o['id'], 'label':label});
                    });
                    Bus.appendOptions($('#classes'), options);
                }else{
                    Mom.layMsg(result.message);
                }
            });
        },
        //新建检尺
        createTankInit:function () {
            var url = "123213";
            Api.ajaxJson(url,{},function(result){
                if(result.success){
                    Validator.renderData(result, '#inputForm');
                }else{
                    Mom.layAlert(result.message);
                }
            });
            window.getTankFormData = function(){
                var formObj = $('#inputForm');
                if(!Validator.valid(formObj,1.3)){
                    return;
                }
                return {
                    // url: formObj.attr('action'),
                    data: formObj.serializeJSON()
                }
            };
        },
        //批量检尺
        batchMeasureInit:function () {
                //加载配置模板
            var newData = [];
            var newtemplate = [];
            var dataCollection = [];
            Api.ajaxJson("../../../json/factoryModel/materialMove/batchMeasureData.json",{},function (data) {
                $.get("../../../json/factoryModel/materialMove/batchMeasure.json",function (result) {
                    newData = data.rows;
                    newtemplate = result.batchInit;
                    PageModule.createBatch(newData,newtemplate,"0");
             });
                //只可以点击新建按钮，点击结束后，移除数据采集和计算的不可点击
                $("#btn-add").unbind("click").on("click",function () {
                    var tableArr = [];
                    var modelArr = [];
                   $("#btn-batch").attr("disabled",false);
                   $("#btn-total").attr("disabled",false);
                   var ids = jqGridAll.jG_getCheckAllIds("#dataTable");
                    for (var i=0;i<newData.length;i++){
                        for(var k=0;k<ids.length;k++){
                            if(newData[i].id == ids[k]){
                                tableArr.push(newData[i])
                            }
                        }
                    }
                    dataCollection = tableArr
                    PageModule.createBatch(tableArr,newtemplate,"1")
                });
                //侦听批量采集时间
                $("#btn-batch").unbind("click").on("click",function () {
                    //获取到点位号，以及时间重新加载table；
                    console.log(dataCollection);
                    var data={};
                    Api.ajaxJson("",data,function (result) {
                        //调用createBatch方法重新渲染table
                    })
                });
                //侦听批量计算按钮
                $("#btn-total").unbind("click").on("click",function () {
                    //获取到要计算的参数，然后计算;
                    var data = {};
                    Api.ajaxJson("",data,function (result) {
                        //调用createBatch方法重新渲染table

                    })
                })
            });
        },
        createBatch:function (tableArr,template,status) {
            var  colNames = template.colNames; //表头
            var  colModel = template.colModel;  //数据字段
            var len = tableArr.length;           //显示条数
            var configData  = jqGridAll.jG_configData(tableArr);  //创建table的数据
            var gridConfig = jqGridAll.jG_config('',colNames,colModel,len);
            var editRowFn;
            var itemHtml;
            if(status == "1"){  //如果是新建table
                $(".tablebox").eq(0).empty();
                editRowFn = jqGridAll.jG_editRowFn("#dataTable1",'',true);
                itemHtml = "#dataTable1";
                // $("")
            }else{    //如果是初始化table
                editRowFn = '';
                itemHtml = "#dataTable";
            }
            jqGridAll.jG_Resize(itemHtml,".tablebox"); //根据屏幕大小改变表格
            $(itemHtml).jqGrid($.extend(configData,gridConfig,editRowFn));
        },
        /**************物料移动*********************************/
          renderPotTable: function (index,dataTable,temPlate) {
                    var  templateArr = PageModule.getTemPlate();
                    var optionsPot = {
                        colNames: temPlate.primaryTable.colNames,
                        colModel: temPlate.primaryTable.colModel,
                        data: dataTable,
                        multiselect: true
                    };
                    var optionsMMove = {
                        colNames: temPlate.seedTable.colNames,
                        colModel: temPlate.seedTable.colModel,
                        multiselect: true
                    };
                    var config = {
                        url: '../../json/factoryModel/materialMove/subdata.json'
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
                     $("#btn-add").unbind("click").on("click",function () {
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
              })
                    //关闭按钮
                    $('#btn-close').on('click', function () {
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
                        Api.ajaxJson('../../json/factoryModel/materialMove/formInit.json', {}, function (result) {
                            if (result.success) {
                                Bus.appendOptionsValue($('#operationType'), result.moveTypeList);
                                Validator.renderData(result.nodeMtrlMove,'#inputForm')
                            } else {
                                Mom.layAlert(result.message);
                            }
                        });
                        /*初始化对方节点*/
                        Api.ajaxJson('../../json/factoryModel/materialMove/class2.json', {}, function (result) {
                            if (result.success) {
                                console.log(result);
                                Bus.appendOptionsValue($('#oppositeNode'), result.NodeList,'id','nodename');
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
                                /**作者：贾旭光 ***描述：差两个本方量、对方量点击弹窗检尺*/
                            }
                            //罐收付进出厂点
                            else if (moveTypeS == 'TANK_RETO_IOF' || moveTypeS == 'TANK_TO_IOF') {
                                tankMove('table tr td', '#operationType,#oppositeNode,#startTime', '#startTime');
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
                        //判断方法
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
            },
          /************************封账********************************/
          accountInit: function(index,dataTable,template){
              var  templateArr = PageModule.getTemPlate();
              var optionsPot = {   //主表
                  colNames: template.primaryTable.colNames,
                  colModel: template.primaryTable.colModel,
                  data: dataTable,
                  multiselect: true
              };
              var optionsMMove = {   //子表
                  colNames: template.seedTable.colNames,
                  colModel: template.seedTable.colModel,
                  multiselect: true
              };
              var config = {
                  url: '../../json/factoryModel/materialMove/fengzhangson.json'
              };
              var colModel1 = [
                  {"name": "id","label": "id","align": "center","hidden":true},
                  {"name": "nodename","label": "nodename","align": "center","title":false,formatter:function(cellvalue, options, rowObject){
                      return "<div>"+rowObject.node.nodename+"</div>";
                  }},
                  {"name": "submitFlag","label": "submitFlag","align": "center",formatter:function(cellvalue, options, rowObject){
                      if(rowObject.submitFlag == 0){
                          return "否";
                      }else{
                          return "是";
                      }

                  }},
                  {"name": "mtrlName","label": "mtrlName","align": "center",formatter:function(cellvalue, options, rowObject){
                      return "<div>"+rowObject.node.mtrl.mtrlName+"</div>";
                  }},
                  {"name": "sealFlag","label": "sealFlag","align": "center",formatter:function(cellvalue, options, rowObject){
                      if(rowObject.sealFlag == 0){
                          return "未提交";
                      }else{
                          return "已提交";
                      }

                  }},
                  {"name": "submitBy","label": "submitBy","align": "center"},
                  {"name": "freeBy","label": "freeBy","align": "center"},
                  {"name": "submitDate","label": "submitDate","align": "center"},
                  {"name": "freeDate","label": "freeDate","align": "center"},
                  {"name": "paySum","label": "paySum","align": "center",formatter:function(cellvalue, options, rowObject){
                      return "<div>"+rowObject.collectSum+'收'+rowObject.paySum +"付</div>";
                  }}
              ];
              var subtable =[];
              var setting1 = {
                  colNames:optionsPot.colNames,
                  colModel:colModel1,
                  //colModel:data.primaryTable[0].colModel,
                  multiselect:true,
                  height: '100%',//高度
                  hoverrows:true,//表行是否有鼠标悬停效果
                  data:dataTable,
                  gridComplete: function () {
                      var ids = $("#treeTable").getDataIDs();
                      for (var i = 0; i < ids.length; i++) {
                          var rowData = $("#treeTable").getRowData(ids[i]);
                          console.log(rowData,999);
                          if (rowData.sealFlag=="已提交" && rowData.submitFlag=="是") {//useable-- 单元格的name 或 index
                              $("#treeTable").find('#' + ids[i]).css("color",'green');
                              //$("#treeTable").setCell(ids[i],"enable",'已提交',{color:'green'});//setCell 设置单元格样式 值 或属性
                          }else if(rowData.sealFlag=="未提交"&& rowData.submitFlag=="是"){
                              $("#treeTable").find('#' + ids[i]).css("color",'#000');
                              //$("#treeTable").setCell(ids[i],"enable",'未提交',{color:'red'});
                          }else{
                              $("#treeTable").find('#' + ids[i]).css("color",'red');
                              //$("#treeTable").setCell(ids[i],"enable",'未提交',{color:'red'});
                          }
                      }
                  }
              }
              jqGridAll.jG_jqGridTableLevel('#treeTable',optionsPot,optionsMMove,config,subtable)
              var arr = jqGridAll.jG_getCheckAllIds('#materialMTable');



              //提交按钮
              $('#btn-save').unbind('click').click(function(){
                  //var ids = $("#treeTable").getDataIDs();
                  //var id =jqGridAll.jG_getCheckId('#treeTable');
                  var ids =jqGridAll.jG_getCheckAllIds('#treeTable');
                  console.log(ids,56565);

                  if(ids.length == 0){
                      Mom.layMsg('请勾选后在提交');
                      return false;
                  }
                  for (var i = 0; i < ids.length; i++) {
                      var rowData = $("#treeTable").getRowData(ids[i]);
                      console.log(rowData,999);
                      if (rowData.submitFlag=="否") {//useable-- 单元格的name 或 index
                          Mom.layMsg('红色字体的不可提交,请重新选择');
                          return false;
                      }
                  }
                  // 发送接口
                  Api.ajaxJson("http://localhost/json/factoryModel/materialMove/fengzhang.json",{}, function (res) {
                      load();

                  });
              });
              //解除按钮
              $('#btn-delete').unbind('click').click(function(){
                  //var ids = $("#treeTable").getDataIDs();
                  //var id =jqGridAll.jG_getCheckId('#treeTable');
                  var ids =jqGridAll.jG_getCheckAllIds('#treeTable');
                  if(ids.length == 0){
                      Mom.layMsg('请勾选后在解除');
                      return false;
                  }
                  console.log(ids,56565);
                  for (var i = 0; i < ids.length; i++) {
                      var rowData = $("#treeTable").getRowData(ids[i]);
                      console.log(rowData,999888);
                      if (rowData.sealFlag=="未提交") {//useable-- 单元格的name 或 index
                          Mom.layMsg('未提交不可解除,请重新选择');
                          return false;
                      }
                  }
                  // 发送接口
                  Api.ajaxJson("http://localhost/json/factoryModel/materialMove/fengzhang.json",{}, function (res) {
                      load();

                  });
              })
          }
    };
    $(function () {
        if($("#measure").length>0){   //初始化加载
            PageModule.init();
        }else if($("#initializeFrom").length>0){   //罐初始化
            PageModule.initializeFrom();
        }else if($("#informationEntryFrom").length>0){   //新建检尺
            PageModule.createTankInit();
        }else if($("#batchMeasureForm").length>0){    //批量检尺
            PageModule.batchMeasureInit()
        } else if ($('#materialMove').length > 0) {  //参数配置列表
            PageModule.materialMoveInit();
        } else if ($('#addMove').length > 0) {
            PageModule.addMoveInit();
        }else  if ($('#fengzhang').length > 0) {
            PageModule.accountInit();
        }
     })
    });
});