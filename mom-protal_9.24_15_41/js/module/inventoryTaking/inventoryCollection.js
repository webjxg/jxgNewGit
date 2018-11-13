require(['/js/zlib/app.js'], function (App) {
    var PageModel = {
        model:{},
        //初始化加载时间插件
        init:function () {
             $(".maindiskUser").text(Mom.getCookie("userName"));//主盘人当前登陆用户
             require(['/js/plugins/datetimepicker/js/bootstrap-datetimepicker.js'], function () {
                 $(".Acquisition .time").text();//获取系统时间
                 var dataTime = Mom.getUrlParam("data");
                 if(dataTime != null){
                     $("#startDate1").val(dataTime);
                 }else{
                     $("#startDate1").val("").datetimepicker({   //时间插件
                         bootcssVer: 3,        //显示箭头，部分如不显示箭头要加这个
                         format: "yyyy-mm-dd",  //保留到日
                         showMeridian: true,     //显示上、下午
                         language: "zh-CN",   //中文显示
                         minView: "3",    //月视图
                         autoclose: true,  //选择时间后自动隐藏
                         clearBtn: true,
                         todayBtn: true
                     });
                 }
             });
            var data = PageModel.getTime();
            $(".time").text(data)
             //渲染时间下拉
             PageModel.selectTime();
             //返回按钮
             $("#back-btn").click(function () {
                 location.href = "./invDataCollection.html";
             });
             var checkType = Mom.getUrlParam("check");
             if(checkType == "check"){
              $(".btnHide").hide();
             }
             var dataobj = PageModel.getLoaddata();
             PageModel.loadData(dataobj)
         },
        selectTime: function () {
            var url = Api.admin + "/api/sys/SysDict/type/STOCKTAKE_ACQUISITION_TIME";
            Api.ajaxForm(url, {}, function (result) {
                var rows = result.rows;
                Bus.appendOptionsValue($('#Interval'), rows, 'value', 'label');
            })
        },
        //通过列表页面传过来的id以及type判断url以及保存时候要传给后台的参数
        getLoaddata:function () {
            var id = Mom.getUrlParam("id");
            var type = Mom.getUrlParam("type");
            var status = Mom.getUrlParam("status");
            var url = "";
            var msgObj ={};
            if(id){
                if (type == "Mineral"){   //矿石石灰
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.type = type;
                    msgObj.collectDate = "collectDate"; //采集时间
                    msgObj.data = "mineralData";      //表数组
                    msgObj.id = id;
                    msgObj.stocktakeType = "KSSHCC";
                    msgObj.saveUrl = "/api/aps/Mineral/save";      //保存接口
                    msgObj.colBol = true;
                    msgObj.status = status
                }else if(type == "NaoHAL"){  //氧化铝
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.type = type;
                    msgObj.data = "aoData";          //表数组
                    msgObj.id = id;
                    msgObj.stocktakeType = "YHLCQYHLDZ";
                    msgObj.saveUrl = "/api/aps/Ao/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Decgroove"){  //分解槽
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.type = type;
                    msgObj.data = "groovesData";
                    msgObj.id = id;
                    msgObj.stocktakeType = "FJCYWCL";
                    msgObj.saveUrl = "/api/aps/CollectGroove/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "dcs"){   //dcs
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.type = type;
                    msgObj.data = "groovesData";    //表数组
                    msgObj.id = id;
                    msgObj.stocktakeType = "DCSCGYW";
                    msgObj.saveUrl = "/api/aps/CollectGroove/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Deposit"){   //煤存
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.type = type;
                    msgObj.data = "coalsData";
                    msgObj.id = id;
                    msgObj.stocktakeType = "MC";
                    msgObj.saveUrl = "/api/aps/collectCoal/save"; //保存接口
                    msgObj.colBol = true;
                    msgObj.status = status
                }else if(type == "Process"){  //过程
                    msgObj.type = type;
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.id = id;
                    msgObj.data = "processMtrlData";
                    msgObj.stocktakeType = "GCWL";
                    msgObj.saveUrl = "/api/aps/CollectProcessMtrl/save";
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Field"){   //进场
                    msgObj.type = type;
                    msgObj.url = "/api/aps/collect/collectView/"+id;
                    msgObj.id = id;
                    msgObj.stocktakeType = "JCWL";
                    msgObj.data = "mtrlsData";
                    msgObj.saveUrl = "/api/aps/collectMtrl/save";
                    msgObj.colBol = true;
                    msgObj.status = status
                };
            }else {
                if (type == "Mineral"){   //石灰
                    msgObj.id = "";
                    msgObj.url = "/api/stocktake/PageView/mineral";
                    msgObj.type = type;
                    msgObj.stocktakeType = "KSSHCC";
                    msgObj.data = "mineralData";      //表数组
                    msgObj.saveUrl = "/api/aps/Mineral/save";      //保存接口
                    msgObj.colBol = true;
                    msgObj.status = status
                }else if(type == "NaoHAL"){  //氧化铝
                    msgObj.url = "/api/stocktake/PageView/ao";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "YHLCQYHLDZ";
                    msgObj.data = "aoData";          //表数组
                    msgObj.saveUrl = "/api/aps/Ao/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Decgroove"){   //分解槽
                    msgObj.url = "/api/stocktake/PageView/groove/PCSJSJ_FJCYWCLPC";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "FJCYWCL";
                    msgObj.data = "groovesData";
                    msgObj.saveUrl = "/api/aps/CollectGroove/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "dcs"){        //dcs
                    msgObj.url = "/api/stocktake/PageView/groove/PCSJSJ_DCSCGYWPC";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "DCSCGYW";
                    msgObj.data = "groovesData";    //表数组
                    msgObj.saveUrl = "/api/aps/CollectGroove/save";      //保存接口
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Deposit"){    //煤存
                    msgObj.url = "/api/stocktake/PageView/coal";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "MC";
                    msgObj.data = "coalsData";
                    msgObj.saveUrl = "/api/aps/collectCoal/save"; //保存接口
                    msgObj.colBol = true;
                    msgObj.status = status
                }else if(type == "Process"){   //过程
                    msgObj.url = "/api/stocktake/PageView/collectPmAnalysis";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "GCWL";
                    msgObj.data = "processMtrlData";
                    msgObj.saveUrl = "/api/aps/CollectProcessMtrl/save";
                    msgObj.colBol = false;
                    msgObj.status = status
                }else if(type == "Field"){    //进场
                    msgObj.url = "/api/stocktake/PageView/collectInMaterial";
                    msgObj.type = type;
                    msgObj.id = "";
                    msgObj.stocktakeType = "JCWL";
                    msgObj.data = "mtrlsData";
                    msgObj.saveUrl = "/api/aps/collectMtrl/save";
                    msgObj.colBol = true;
                    msgObj.status = status
                };
            }
            return msgObj;
        },
        //加载模板
        loadData:function (obj) {
            Api.ajaxForm(Api.aps+obj.url,{},function (result) {
                $.get("../json/invData/json-shihui.json",function (template) { //通过json创建模板
                    if(result.success){
                        $(".supervisionplate").val(result.secMan);
                        $("#otherPlate").val(result.thrMan);
                        var type = Mom.getUrlParam("type");
                        if (type == "Mineral"){
                            PageModel.createTab(result.rows,template.oPage,obj);
                        }else if(type == "NaoHAL"){
                            PageModel.multiple(result.rows,template.oPage,obj);
                        }else if(type == "Decgroove"){
                            for(var i=0;i<result.rows[0].nodes.length;i++){
                                result.rows[0].nodes[i].types  = "FJCYWCL"
                            }
                            PageModel.fsTable(result.rows,template.oPage,obj);
                        }else if(type == "dcs"){
                            for(var i=0;i<result.rows[0].nodes.length;i++){
                                result.rows[0].nodes[i].types  = "DCSCGYW"
                            }
                            PageModel.fsTable(result.rows,template.oPage,obj);
                        }else if(type == "Deposit"){
                            PageModel.fsTable(result.rows,template.oPage,obj);
                        }else if(type == "Process"){
                            PageModel.fsTable(result.rows,template.oPage,obj);
                        }else if(type == "Field"){
                            PageModel.createTab(result.rows,template.oPage,obj);
                        };
                    }else{
                        Mom.layMsg(result.message);
                    }

                })
            })
        },
        //创建tab切换
        /*
        * data:数据加载后的result.rows
        * temData：模板加载后的result
        * obj：是判断那个页面进来的对象，有保存接口，字段；方法是getLoaddata
        * */
        createTab:function (data,temData,obj) {
            for(var i=0;i<data.length;i++){  //根据返回的数据创建tab切换按钮
                var li=  "<li type='"+data[i].code+"'>"+data[i].name+"</li>";
                $(".tabBtn").append(li);
            };
            //添加点击事件，添加className；
            $(".tabBtn li").each(function (index,item) {   //遍历所有按钮，实现点击切换
                $(item).click(function (e) {
                    $(this).addClass("active").siblings('li').removeClass('active');
                    var tabtype = $(this).attr("type");
                    var btnI = index;
                    PageModel.clickBtn(data,temData,obj,btnI,tabtype);
                    $(".datagridsContent").eq(btnI).removeClass("hide").siblings('.datagridsContent').addClass('hide');
                    $(".ui-jqgrid,.ui-jqgrid-view,.ui-state-default,.ui-jqgrid-bdiv,.ui-jqgrid-htable").css({
                        "width":"100%"
                    });
                    $(".ui-jqgrid-bdiv table").css({
                        "width":"100%"
                    });
                    if(index==2){
                        $(".Acquisition").removeClass("hide")
                    }else{
                        $(".Acquisition").addClass("hide")
                    }
                });
                //如果result中的第一个值的索引等于tab切换的所以，就加载数据
                for(var i=0;i<data.length;i++){
                    if(index==2){
                        $(".Acquisition").removeClass("hide")
                    }else{
                        $(".Acquisition").addClass("hide")
                    }
                    if(index == i){
                        var tabtype = $(this).attr("type");
                        var btnI = index;
                        if (index == 0){
                            $(".tabBtn li").eq(0).addClass("active");
                            var tabtype = $(this).attr("type");
                            var btnI = index;
                            $(".datagridsContent").eq(btnI).siblings('.datagridsContent').addClass('hide');
                            $(".datagridsContent").eq(btnI).removeClass("hide");
                            $(".datagridsContent").eq(btnI).find("table").css({
                                "width":"100%"
                            })
                            PageModel.clickBtn(data,temData,obj,btnI,tabtype);
                        };
                        PageModel.clickBtn(data,temData,obj,btnI,tabtype)
                    }
                }
            });
        },
        clickBtn:function (tabArr,comments,obj,btnI,tabtype) {
            var dataList = [];
            var modelList = [];
            //根据点击的tab拿到对应的nodes数组
            for(var i=0;i<tabArr.length;i++){
                if(tabArr[i].code == tabtype){
                    dataList = tabArr[i].nodes;
                }
            };
            //拿到模板中对应的jqGrid的基础配置
            for(var j=0;j<comments.length;j++){
                if(comments[j].itemCode == obj.type){
                    for(var k=0;k<comments[j].itemList.length;k++){
                        if(comments[j].itemList[k].itemCode == tabtype){
                            modelList = comments[j].itemList[k];
                        }
                    }
                }
            };
            // //添加排序
            // for(var i=0;i<dataList.length;i++){
            //     dataList[i].sort = i+1;
            // };
            PageModel.createTable(dataList,modelList,obj,btnI)
        },
        //一个页面有多个表
        multiple:function (data,temData,obj) {
            var dataList = [];
            var modelList = [];
            for(var i=0;i<temData.length;i++){
                if(temData[i].itemCode == obj.type){
                    modelList = temData[i].itemList
                }
            };
            for(var j=0;j<data.length;j++){
                for(var k=0;k<modelList.length;k++){
                    if(data[j].code == modelList[k].itemCode){
                        PageModel.createTable(data[j].nodes,modelList[k],obj,j)
                    }
                }
            }
        },
        //一个页面只有一个表
        fsTable:function (data,temData,obj) {
            var modelList = [];
            for(var i=0;i<temData.length;i++){
                if(temData[i].itemCode == obj.type){
                    modelList = temData[i].itemList;
                }
            }
            // for(var i=0;i<data[0].nodes.length;i++){
            //     data[0].nodes[i].sort = i+1;
            // };
            PageModel.createTable(data[0].nodes,modelList[0],obj)
        },
        createTable:function (tableArr,temArr,obj,index) {
            PageModel.model = temArr;
            require(["jqGrid_my"], function (jqGridAll) {
                var colNames = temArr.colNames;  //表头
                var colModel = temArr.colModel;  //基础配置
                var conSum = "";
                //设置合并单元格
                if(obj.type == "Mineral"&&index==1){
                    obj.colBol = false;
                    conSum = jqGridAll.jG_conSum("#dataTable"+index,["valueView","valueModify","valueReport"]);
                    $(".ui-jqgrid-sdiv,ui-jqgrid-hbox,.ui-jqgrid-ftable").css({
                        "width":"100%"
                    });
                    $(".ui-jqgrid-ftable tr td").eq(0).text("合计")
                };
                if(obj.colBol){
                    var cellattr=function(rowId, tv, rawObject, cm, rdata) {
                        //合并单元格
                        return 'id=\'name' + rowId + "\'";
                    };
                    for(var i=0;i<colModel.length;i++){
                        if(colModel[i].name == "name"){
                            colModel[i].cellattr = cellattr;
                        }
                    };

                    if(index !=undefined){
                        var gridCellattr = jqGridAll.jG_gridComplete("dataTable"+index,"name");
                    }else{
                        var gridCellattr = jqGridAll.jG_gridComplete("dataTable","name");
                    }
                }else{
                    var gridCellattr;
                }
                var configData  = jqGridAll.jG_configData(tableArr);  //创建table的数据
                var gridEdit = jqGridAll.jG_editFn();//编辑
                // var soreData = jqGridAll.jG_Sortdata(); //排序
                var gridConfig = jqGridAll.jG_config(temArr.title,colNames,colModel);
                var scrollTop = jqGridAll.jG_scrollTop();
                if (index != undefined){
                    $("#dataTable"+index).jqGrid($.extend(configData,gridConfig,gridEdit,gridCellattr,scrollTop,conSum));
                    jqGridAll.jG_Resize("#dataTable"+index);
                }else{
                    $("#dataTable").jqGrid($.extend(configData,gridConfig,gridEdit,gridCellattr,scrollTop,conSum));
                    jqGridAll.jG_Resize("#dataTable")
                };
                // $("#dataTable"+index).closest(".ui-jqgrid-bdiv").css({ 'overflow-y' : 'scroll' });
                $("#dataTable").closest(".ui-jqgrid-bdiv").css({ 'overflow-y' : 'scroll' });
                //保存按钮
                $(".btn-save").unbind("click").on("click",function () {
                    $('td.edit-cell').each(function (i, item) {
                        $(this).siblings('td').siblings('td').eq(0).trigger('click');
                    });
                    var ids=[];
                    // ids.push("dataTable")
                    if(index != undefined){
                        $(".datatable").each(function (index,item) {
                            ids.push("dataTable"+index);
                        });
                    }else {
                        ids.push("dataTable");
                    };
                    if($("#startDate1").val() == ""){
                        Mom.layMsg('请选择盘存日期！');
                    }else if($(".supervisionplate").val() == ""){
                        Mom.layMsg('请填写监盘人员！');
                    }else if($("#otherPlate").val() == ""){
                        Mom.layMsg('请填写参与盘存人员！');
                    }else{
                        PageModel.saveTable(ids,obj);
                    }
                });
                //计算
                $("#dataCollection").unbind("click").on("click",function () {
                    $('td.edit-cell').each(function (i, item) {
                        $(this).siblings('td').siblings('td').eq(0).trigger('click');
                    });
                    var ids = [];
                    ids.push("dataTable");
                    PageModel.calculation(ids,obj);
                 });
                // 数据采集按钮
                $("#dataCollection-btn").unbind("click").on("click",function () {
                    $('td.edit-cell').each(function (i, item) {
                        $(this).siblings('td').siblings('td').eq(0).trigger('click');
                    });
                    var ids = [];
                    ids.push("dataTable");
                    PageModel.dataCollection(ids,obj,tableArr);
                });
            });
        },
        saveTable:function (ids,obj) {
            var arrAll = '', arrfjc = '';
            var contentArr = [], allObj = {};
            /**_____测试假数据保存*/
            require(["jqGrid_my"],function (jqGridAll) {
                if (ids.length === 1) {
                    arrAll = $('#' + ids).jqGrid('getRowData');
                } else if (ids.length > 1) {
                    for (var i = 0; i < ids.length; i++) {
                        arrfjc = $('#' + ids[i]).jqGrid('getRowData');
                        contentArr.push(arrfjc);
                    }
                    arrAll = contentArr;
                }
                var saveObj = { rows: arrAll};
                var dtamsg = saveObj.rows;
                var dataArr = [];
                if(ids.length==1){
                    for(var i=0;i<dtamsg.length;i++){
                        dataArr.push(dtamsg[i])
                    }
                }else{
                    for(var i=0;i<dtamsg.length;i++){
                        for(var j=0;j<dtamsg[i].length;j++){
                            dataArr.push(dtamsg[i][j]);
                        }
                    }
                }
                var data = {
                    id:obj.id,
                    fstMan: Mom.getCookie("userName"),
                    secMan:$(".supervisionplate").val(),
                    thrMan:$("#otherPlate").val(),
                    stocktakeDate:$("#startDate1").val(),
                    stocktakeType:obj.stocktakeType,//KSSHCC   YHLCQYHLDZ   FJCYWCL  DCSCGYW  MC  GCWL   JCWL
                    status:obj.status==null?"0":obj.status
                };
                data[obj.data] = JSON.stringify(dataArr);
                Api.ajaxForm(Api.aps+obj.saveUrl,data,function (result) {
                    if(result.success){
                        Mom.layMsg('保存成功');
                    }else{
                        alert(result.message)
                    }
                })
            })
        },
        calculation:function (ids,obj) {
            var arrAll = '';
            require(["jqGrid_my"],function (jqGridAll) {
            arrAll = $('#' + ids).jqGrid('getRowData');
            var saveObj = { rows: arrAll};
            var data = {
                processMtrlMap: JSON.stringify(saveObj.rows)
            };
            Api.ajaxForm(Api.aps+"/api/aps/CollectProcessMtrl/calculate",data,function (result) {
                if(result.success){
                    $("#dataTable").parents(".datagridsContent").hide();
                    PageModel.createTable(result.rows,PageModel.model,obj,1)
                }
            });
            })
        },
        dataCollection:function (ids,obj,dataArr) {
            var arrAll = '';
            require(["jqGrid_my"],function (jqGridAll) {
            arrAll = $('#' + ids).jqGrid('getRowData');
            var saveObj = { rows: arrAll};
            var collArr = [];
            var collObj = {};
            for(var i=0;i<saveObj.rows.length;i++){
                collObj.tagName = saveObj.rows[i].tagName;
                collObj.timeStep = saveObj.rows[i].timeStep;
                collArr.push(collObj)
            }
            var data = {
                cltTime:$(".time").text()+"-"+$(".data option:selected").val()+""+ "10:00:00",
                tagInfo:JSON.stringify(collArr)
            };
            Api.ajaxForm("http://192.168.38.129:8082/pi-api/api/PiApi/tagNearLocal",data,function (result) {
                if(result.success){
                    for(var i=0;i<result.rows.length;i++){
                        dataArr[i].timeStep = result.rows[i].timeStep;
                        dataArr[i].highPos = result.rows[i].val
                    }
                }
                $("#dataTable").parents(".datagridsContent").hide();
                PageModel.createTable(dataArr,PageModel.model,obj,1)
            });
            })
        },
        getTime:function () {
                var date = new Date();
                var seperator1 = "-";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                return currentdate;
            }
    };

$(function () {
    PageModel.init();
})
});