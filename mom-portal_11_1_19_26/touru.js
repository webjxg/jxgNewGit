
require(['/js/zlib/app.js'], function (App) {
    require(['checkUser']);
    var PageModule = {
        init: function(){
            require(['jqGrid_my'], function (jqGridAll) {
                var html = $('.table-content').html();
                var tableSon = $('.ibox-tableSon').html();
                window.pageLoad = function () { //Api.mtrl +"/api/mv/FormulaDef/form"
                    var  dataList = {
                        createDate:$("#shiftHidden").val(),//日期
                        shift:$("#shiftHidden").attr("data-time"),//班次
                    }
                    Api.ajaxJson("http://localhost/json/factoryModel/materialMove/touru.json", dataList, function (res) {
                        if(res.success){
                            $('.treeTable-num').text(res.count);
                            var colModel1 = [
                                {"name": "id","label": "id","align": "center","hidden":true},
                                {"name": "liaoxianname","label": "liaoxianname","align": "center"},
                                {"name": "wuliao","label": "wuliao","align": "center"},
                                {"name": "jinchu","label": "jinchu","align": "center"},
                                {"name": "zhiliang","label": "zhiliang","align": "center"},
                                {"name": "liaoxianstart","label": "liaoxianstart","align": "center"},

                                {"name": "liaoxianend","label": "liaoxianend","align": "center","editable": true},
                                {"name": "qianliang","label": "qianliang","align": "center"},
                                {"name": "houliang","label": "houliang","align": "center"},

                                {"name": "chacunliang","label": "chacunliang","align": "center"},
                                {"name": "chaquery","label": "chaquery","align": "center","editable": true},
                                {"name": "jiequliang","label": "jiequliang","align": "center"},
                                {"name": "jieququery","label": "jieququery","align": "center","editable": true},
                                {"name": "pingguling","label": "pingguling","align": "center"},
                                {"name": "shift","label": "shift","align": "center"},
                                {"name": "save","label": "save","align": "center"},
                                {"name": "savetime","label": "savetime","align": "center"},
                                {"name": "jiequformula","label": "jiequformula","align": "center"},
                                {"name": "liaoxianformula","label": "liaoxianformula","align": "center"},
                            ];
                            var lastsel;
                            var optionsPot = {   //主表
                                colNames: ["id","料线名称","物料名称","进出","质量等级","料线原始值","料线确认值","缓存前量","缓存后量","差存量","差存确认量","界区原始量","界区确认量","评估差异量","当前班次","保存人","保存时间","界区公式","料线公式"],
                                colModel: colModel1,
                                data: res.rows,
                                rownumbers: true,//显示行号
                                cellEdit: false,
                                onSelectRow: function (id,status) {
                                    if (id && id != lastsel) {
                                        $('#treeTable').saveRow(lastsel, false, 'clientArray');
                                        $('#treeTable').restoreRow(lastsel);
                                        $('#treeTable').editRow(id, false);
                                        lastsel = id;
                                    }

                                    $('.ibox-tableSon').empty().html(tableSon);
                                    Api.ajaxJson("http://localhost/json/factoryModel/materialMove/touruSon.json", {}, function (res) {
                                        var colModel2 = [
                                            {"name": "id","label": "id","align": "center","hidden":true},
                                            {"name": "type","label": "type","align": "center","title":false},
                                            {"name": "fangshi","label": "fangshi","align": "center"},
                                            {"name": "name","label": "name","align": "center"},
                                            {"name": "qianlaing","label": "qianlaing","align": "center"},
                                            {"name": "houliang","label": "houliang","align": "center"},
                                            {"name": "tiaozheng","label": "tiaozheng","align": "center"},
                                            {"name": "query","label": "query","align": "center"}
                                        ];
                                        var optionsMMove = {   //子表
                                            colNames: ["id","节点类型","计量方式","料仓名称/测量点名称","前量/前读数","后量/后读数","调整量","后量确认量"],
                                            colModel: colModel2,
                                            rownumbers: true,
                                            data:res.rows
                                        };
                                        jqGridAll.jG_jqGridTable('#tableSon',optionsMMove);
                                    });
                                },
                            };

                            var config = {
                                url: 'http://localhost/json/factoryModel/materialMove/classSon.json',
                                //url: Api.mtrl+'/api/mv/TankSeal/view',
                                //otherId:'tankId',
                                contentType:'form',
                                //tableParentId:'.treeTableParent'
                            };
                            jqGridAll.jG_jqGridTable('#treeTable',optionsPot);
                        }else{
                            Mom.layMsg(res.message);
                        }
                    });
                };
                pageLoad();
                ////查询按钮
                //$('#btn-search').unbind('click').click(function(){
                //    $('.table-content').empty().html(html);
                //    // 保存日期和班次
                //    $("#shiftHidden").val($('#shift').val());  //设置隐藏班次
                //    $("#shiftHidden").attr("data-time",$('#createDate').val());//设置隐藏时间
                //    pageLoad();
                //});
                //重新计算
                $('#btn-tiqu').unbind('click').click(function(){
                    $('.table-content').empty().html(html);
                    $('.ibox-tableSon').empty().html(tableSon);
                    pageLoad();
                });
                //保存
                $('#save-btn').unbind('click').click(function(){
                    $('input[type=text].editable').each(function (i, item) {
                        $(this).parents('td').text($(this).val());
                        $(this).remove();
                    });
                    var data = $('#treeTable').getRowData();
                    console.log(data);
                    //Api.ajaxJson("http://localhost/json/factoryModel/materialMove/class.json", data, function (res){
                    //    if(res.success){
                    //        Mom.layMsg(res.message);
                    //    }else{
                    //        Mom.layMsg(res.message);
                    //    }
                    //});
                });
            });



        },

    }
    $(function () {
        if ($('#touru').length > 0) {
            PageModule.init();
        }
    });
})
