require(['/js/zlib/app.js'], function(App) {
    Mom.include('myCss', '', [
        '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
    ]);
    var PageModule = {
        init: function() {
            var multiple = false;

            var zTreeObj;
            var dataUrl = Mom.getUrlParam("dataUrl"),
                defaultVal = Mom.getUrlParam("defaultVal");
            multiple = Mom.getUrlParam("multiple")||false;
            require(['ztree_all'],function(){
                Api.ajaxJson(dataUrl,{},function(result){
                    if(result.success){
                        var setting = {
                            data: {
                                simpleData: {
                                    enable: true,   //设置是否使用简单数据模式(Array)
                                    idKey: "id",    //设置节点唯一标识属性名称
                                    pIdKey: "pId"      //设置父节点唯一标识属性名称
                                }
                            },
                            view:{
                                selectedMulti:false
                            },
                            callback: {
                                onClick: zTreeOnClick
                            }
                        };
                        if(multiple =="true" || multiple == true){
                            setting.check = {
                                enable:true,
                                chkStyle: "checkbox",
                                chkboxType: { "Y": "ps", "N": "ps" }
                            }
                        }
                        var zNodes = result.rows;
                        zTreeObj= $.fn.zTree.init($('#tree'), setting, zNodes);
                        checkDefaultVal(defaultVal)
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            });

            function zTreeOnClick(event,treeId,treeNode,clickFlag){
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                treeObj.expandNode(treeNode)
            }

            window.getCheckVal = function(){
                var retArr = [];
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                if(multiple =="true" || multiple == true){
                    var nodes = treeObj.getCheckedNodes(true);
                    for(var i = 0;i<nodes.length;i++){
                        if(nodes[i].isParent){
                            continue;
                        }
                        var retObj = {
                            "id":nodes[i].id,
                            "name":nodes[i].name
                        };

                        retArr.push(retObj);
                    }
                }else{
                    var nodes = treeObj.getSelectedNodes();
                    if(nodes.length != 1){
                        Mom.layMsg("请选择一项！");
                        return null;
                    }
                    var retObj = {
                        "id":nodes[0].id,
                        "name":nodes[0].name
                    };
                    retArr.push(retObj);

                }
                //获取父层
                var index = top.layer.getFrameIndex(window.name);
                //关闭弹出层
                top.layer.close(index);
                return retArr;

            }
            function checkDefaultVal(vals,param){
                if(vals && vals.length > 0){
                    param = param || "id";
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    var nodeArr = [];
                    var valueArr = vals.split(',');
                    for(var j=0; j<valueArr.length; j++){
                        if(0 <valueArr[j].length){
                            var nodes = treeObj.getNodesByParam(param, valueArr[j], null);
                            if(nodes.length > 0){
                                nodeArr.push(nodes[0]);
                            }
                        }
                    }
                    for (var i=0; i<nodeArr.length; i++) {
                        if(nodes[i]){
                            if(multiple =="true" || multiple == true){
                                treeObj.checkNode(nodeArr[i], true, true);
                            }else{
                                treeObj.selectNode(nodes[i]);
                            }
                            treeObj.expandNode(nodes[i].getParentNode(), true, true, true);
                        }

                    }
                }
            }
        }
    };

    $(function(){
        if($('#selectTree').length > 0){
            PageModule.init();
        }
    });
});