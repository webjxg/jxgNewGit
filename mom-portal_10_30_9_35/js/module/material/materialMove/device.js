require(['/js/zlib/app.js'], function (App) {
    require(['jqGrid_my'], function (jqGridAll) {
        var PageModule = {
            /***描述：搜索orgApiCfg接口用的是罐区的*/
            //————————初始化————————//
            init: function () {
                PageModule.loadClass();
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
                    }

                    function orgOnClick(event, treeId, treeNode, clickFlag) {
                        if (orgTree) {
                            curClickTreeNode = treeNode;
                            orgTree.expandNode(treeNode);
                        }
                    }
                });
                PageModule.tabBtnclick('.tabBtn li','.msgbox','.operationBtn');
                pageLoad = function () {
                    Api.ajaxJson("http://localhost:8000/json/factoryModel/list.json",{},function (result) {
                        PageModule.renderDevice(result.rows)

                    });
                };
                pageLoad()

            },
            /***描述：搜索url_接口用的是罐区的*/
            //————————渲染班次下拉框————————//
            loadClass: function () {
                var url_ = Api.aps + '/api/ctrl/Shift/list';
                Api.ajaxJson(url_, {}, function (result) {
                    if (result.success) {
                        var rows = result.rows;
                        var options = new Array();
                        $(rows).each(function (i, o) {
                            var label = o['name'] + '(' + o['startTime'] + '-' + o['endTime'] + ')';
                            var value = o['startTime'] + '-' + o['endTime']
                            options.push({'value': value, 'label': label});
                        });
                        Bus.appendOptions($('#shift'), options);
                    } else {
                        Mom.layMsg(result.message);
                    }
                });
            },

            //————————Tab切换方法————————//
            /*参数lis是li   selector是被隐藏容器集合*/
            tabBtnclick:function (lis,selector,btnSel) {
                //tab切换
                $(lis).each(function (index,item) {
                    $(item).unbind("click").on("click",function () {
                        $(this).addClass("active").siblings("li").removeClass("active");
                        $(selector).eq(index).removeClass('hide').siblings(selector).addClass('hide');
                        if(index==1||index==2||index==3){
                            $(btnSel).eq(index-1).removeClass('hide').siblings(btnSel).addClass('hide');
                        }else{
                            $(btnSel).addClass('hide')
                        }
                    });
                });

            },

            //————————渲染列表页方法————————//
            renderDevice:function (tableData) {
                $('#schemeMTable').dataTable({
                    "bSort": true,
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0]}
                    ],
                    "data": tableData,
                    "aoColumns": [
                        {"data": "name", 'sClass': "center","width":"34%"},
                        {"data": "startDate", 'sClass': "center","width":"34%"},
                        {
                            "data": "id", "orderable": false, "defaultContent": "", 'sClass': " center " ,"width":"24%",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn-delete' title='删除'><i class='fa fa-trash-o'></i></a >";
                            }
                        }

                    ]
                });

            }
        };
        $(function () {
            //————————主页列表页————————//
            if ($("#deviceIndex").length > 0) {
                PageModule.init();
            }
        })
    });
});