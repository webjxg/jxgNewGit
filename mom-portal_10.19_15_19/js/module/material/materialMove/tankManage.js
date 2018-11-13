/**
 * Created by admin on 2018/10/16.
 */
require(['/js/zlib/app.js'], function(App) {
    var Pagemobul = {
        init:function () {
            var temPlate = [];
            $.get("../../json/factoryModel/materialMove/tankManage.json",function (result) {
                temPlate = result.rows;
                //tab切换
                $(".tabBtn li").each(function (index,item) {
                    $(item).unbind("click").on("click",function () {
                        $(this).addClass("active").siblings("li").removeClass("active");
                        $(".msgbox").eq(index).removeClass("hide").siblings(".msgbox").addClass("hide");
                        Pagemobul.getData(index,temPlate[index])
                    });
                    if(index==0){
                        $(item).addClass("active");
                        $(".msgbox").eq(index).removeClass("hide");
                        Pagemobul.getData(index,temPlate[index])
                    }
                });
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
                    orgTree = ztree1.loadData($("#zTee"),rows,false,orgZtreeSetting);
                    ztree1.registerSearch(orgTree, $('#org_searchText'), 'name');
                }
                function orgOnClick(event, treeId, treeNode, clickFlag){
                    if(orgTree){
                        curClickTreeNode = treeNode;
                        orgTree.expandNode(treeNode);
                        // loadWaitUserData();
                    }
                }
            })
        },
        getData:function (index,temPlate) {
            console.log(index,temPlate);
        }
    };
    $(function () {
        if($("#measure").length>0){
            Pagemobul.init();
            console.log($("#measure"))
        }else if($("#matrlMove").length>0){
            console.log("bbb");
        }else if($("#sealingAccount").length>0){
            console.log("ccc");
        }else if($("#sceneGraph").length>0){
            console.log("ddd");
        }
    })
});