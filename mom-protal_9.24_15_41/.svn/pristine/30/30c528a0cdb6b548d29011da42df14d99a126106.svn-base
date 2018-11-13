define(['ztree_all'],function(require){
    var lastValue='', treeObj, _type='';

    /*
     * ztree配置
     * multiple: 是否多选
     * checkedVals： 默认选中值
     * type: 类型（如果是部门选择且type=3时自动加载部门下的用户）
     */
    function ztreeSetting(multiple, checkedVals, type, asyncUrl){
        _type= type;
        $("#key").keyup(function(e){
            searchNode(treeObj, 'name', $(this).val());
        });
        $('#searchBtn').click(function(){
            $('#key').trigger("keyup");
        });
        //加载所需的文件
        Mom.include('ztreeCss',ctxStatic+'/js/plugins/zTree_v3/css/metroStyle/','metroStyle.css');

        var asyncSetting = {};
        if(asyncUrl && asyncUrl!=''){
            asyncSetting = {enable:true,url:asyncUrl,autoParam:["id=parentId"]};
        }
        else if(type == 3){
            //如果type=3则异步加载部门下的用户，将当前节点的id作为officeId的参数值
            asyncSetting = {enable:(type==3),url:ctx+"/User/treeData",autoParam:["id=officeId"]};
        }
        var setting = {
            check: {enable:multiple, nocheckInherit: true},
            view: {selectedMulti:multiple, dblClickExpand:false, nameIsHTML:true},
            async: asyncSetting,
            data: {simpleData:{enable:true}},
            callback:{
                beforeClick:function(id, node){
                    if(multiple == true){
                        treeObj.checkNode(node, !node.checked, true, true);
                        return false;
                    }
                }
                ,onClick:function(event, treeId, treeNode){
                    treeObj.expandNode(treeNode);
                }
                ,onCheck: function(e, treeId, treeNode){
                    var nodes = treeObj.getCheckedNodes(true);
                    for (var i=0, l=nodes.length; i<l; i++) {
                        treeObj.expandNode(nodes[i], true, false, false);
                    }
                    return false;
                }
                ,onAsyncSuccess: function(event, treeId, treeNode, msg){
                    var nodes = treeObj.getNodesByParam("pId", treeNode.id, null);
                    for (var i=0, l=nodes.length; i<l; i++) {
                        try{treeObj.checkNode(nodes[i], treeNode.checked, true);}catch(e){}
                        //tree.selectNode(nodes[i], false);
                    }
                    selectCheckNode(checkedVals, multiple);
                }
                ,onDblClick: function(){

                }
            }
        };
        return setting;
    }

    // 默认选择节点
    function selectCheckNode(checkedVals, multiple){
        checkedVals = checkedVals!=undefined?checkedVals:'';
        if(checkedVals != ''){
            var ids = checkedVals.split(",");
            for(var i=0; i<ids.length; i++) {
                var node = treeObj.getNodeByParam("id", (_type==3?"u_":"")+ids[i]);
                if(multiple == true){
                    try{treeObj.checkNode(node, true, true);}catch(e){}
                    treeObj.selectNode(node, false);
                }else{
                    treeObj.selectNode(node, true);
                }
            }
        }
    }

    //搜索节点
    function searchNode(treeObj_, prop, value) {

        // 如果和上次一次，就退出不查了。
        if (lastValue === value) {
            return;
        }

        // 保存最后一次
        lastValue = value;

        var nodes = treeObj_.getNodes();
        // 如果要查空字串，就退出不查了。
        if (value == "") {
            showAllNode(nodes);
            return;
        }
        hideAllNode(treeObj_, nodes);
        var nodeList = treeObj_.getNodesByParamFuzzy(prop, value);
        updateNodes(treeObj_, nodeList);
    }

    //更新节点状态
    function updateNodes(treeObj_, nodeList) {
        treeObj_.showNodes(nodeList);
        for(var i=0, l=nodeList.length; i<l; i++) {
            //展开当前节点的父节点
            treeObj_.showNode(nodeList[i].getParentNode());
            //treeObj.expandNode(nodeList[i].getParentNode(), true, false, false);
            //显示展开符合条件节点的父节点
            while(nodeList[i].getParentNode()!=null){
                treeObj_.expandNode(nodeList[i].getParentNode(), true, false, false);
                nodeList[i] = nodeList[i].getParentNode();
                treeObj_.showNode(nodeList[i].getParentNode());
            }
            //显示根节点
            treeObj_.showNode(nodeList[i].getParentNode());
            //展开根节点
            treeObj_.expandNode(nodeList[i].getParentNode(), true, false, false);
        }
    }

    //隐藏所有节点
    function hideAllNode(treeObj_, nodes){
        nodes = treeObj_.transformToArray(nodes);
        treeObj_.hideNodes(nodes);
    }

    //显示所有节点
    function showAllNode(nodes){
        nodes = treeObj.transformToArray(nodes);
        for(var i=nodes.length-1; i>=0; i--) {
            /* if(!nodes[i].isParent){
             treeObj.showNode(nodes[i]);
             }else{ */
            if(nodes[i].getParentNode()!=null){
                treeObj.expandNode(nodes[i],false,false,false,false);
            }else{
                treeObj.expandNode(nodes[i],true,true,false,false);
            }
            treeObj.showNode(nodes[i]);
            showAllNode(nodes[i].children);
            /* } */
        }
    }

    function expandNodes(nodes) {
        if (!nodes) return;
        for (var i=0, l=nodes.length; i<l; i++) {
            treeObj.expandNode(nodes[i], true, false, false);
            if (nodes[i].isParent && nodes[i].zAsync) {
                expandNodes(nodes[i].children);
            }
        }
    }

    /**
     * 在外部窗口中获取treeSelect页面选中的值
     * @return:
     *    success:[boolean]成功/失败
     *    id: 选择的id，多个时用逗号隔开
     *    name: 选择的name，多个时用逗号隔开
     */
    window.getSelectValues=function(multiple, notAllowSelectParent, notAllowSelectRoot, module){
        multiple = multiple==true||multiple=='true';
        notAllowSelectParent = notAllowSelectParent==true||notAllowSelectParent=='true';
        notAllowSelectRoot = notAllowSelectRoot==true||notAllowSelectRoot=='true';
        module = module||'';
        var retObj = new Object(), success=true;
        var ids=[], names=[], selNodes=[], retNodes=[];
        if (multiple == true) {
            selNodes = treeObj.getCheckedNodes(true);
        } else {
            selNodes = treeObj.getSelectedNodes();
        }
        for (var i = 0; i < selNodes.length; i++) {
            var selNode = selNodes[i];
            if (notAllowSelectParent == true && selNode.isParent) {
                // 如果为复选框选择，则过滤掉父节点
                Mom.msg("不能选择父节点（" + selNode.name + "）请重新选择。");
                success=false;
                break;
            }
            if (notAllowSelectRoot == true && selNode.level == 0) {
                Mom.msg("不能选择根节点（" + selNode.name + "）请重新选择。");
                success=false;
                break;
            }
            if (module != '' && selNode.module != module) {
                Mom.msg("不能选择当前栏目以外的栏目模型，请重新选择。");
                success=false;
                break;
            }
            //type=3时只选择人员
            if(_type==3 && selNode.isParent) {
                continue;
            }
            ids.push(selNode.id);
            names.push(selNode.name);
            retNodes.push(selNode);
            if (multiple != true) { //如果不是复选框选择，则返回第一个选择
                break;
            }
        }
        retObj['success']=success;
        retObj['id']=ids.join(",").replace(/u_/ig, "");
        retObj['name']=names.join(",");
        retObj['nodes']=retNodes;
        return retObj;
    };

	//使用json数据渲染tree
    var loadJsonData = function(id, jsonNodes, multiple, checkedVals, type, asyncUrl){
        multiple = multiple==true||multiple=='true';
        type = type==undefined?'':type;
        var setting = ztreeSetting(multiple,checkedVals,type,asyncUrl);
        // 初始化树结构
        treeObj=$.fn.zTree.init($("#"+id), setting, jsonNodes);
        treeObj.setting.check.chkboxType = { "Y":"p", "N":"s" };
        //设置选中状态
        selectCheckNode(checkedVals, multiple);
        return treeObj;
    };

	//使用url渲染tree，url需要返回tree格式的json对象（具体参照ztree官网）
    var loadUrlData = function(zTreeId, url, multiple, checkedVals, callBack, asyncUrl){
        if(url==undefined || url==''){
            if(callBack) {
                // 初始化树结构
                var setting = ztreeSetting(multiple,checkedVals,'',asyncUrl);
                treeObj=$.fn.zTree.init($("#"+zTreeId), setting, []);
                callBack(treeObj);
            }
            return;
        }
        var param = Mom.getUrlParam(url);
        var type=param['type']!=undefined?param['type']:'';
        var asyncUrl = asyncUrl?asyncUrl:param['asyncUrl'];
        if(asyncUrl && asyncUrl!='')asyncUrl=decodeURIComponent(asyncUrl);
        multiple = multiple==true||multiple=='true';
        zTreeId = zTreeId!=undefined?zTreeId:'tree';
        url +=(url.indexOf('?')==-1?'?':'&')+'t='+new Date().getTime();
        var setting = ztreeSetting(multiple,checkedVals,type,asyncUrl);
        $.get(url, function(zNodes){
            // 初始化树结构
            treeObj=$.fn.zTree.init($("#"+zTreeId), setting, zNodes);
            // 默认展开一级节点
            var nodes = treeObj.getNodesByParam("level", 0);
            for(var i=0; i<nodes.length; i++) {
                treeObj.expandNode(nodes[i], true, false, false);
            }
            //异步时加载子节点
            if(treeObj.setting.async.enable==true){
                var nodesOne = treeObj.getNodesByParam("isParent", true);
                for(var j=0; j<nodesOne.length; j++) {
                    treeObj.reAsyncChildNodes(nodesOne[j],"!refresh",true);
                }
            }
            //默认选中
            selectCheckNode(checkedVals, multiple);
            //回调函数
            if(callBack) callBack(treeObj);
        });
        //异步加载，无法在此处获取zTree对象
        //return $.fn.zTree.getZTreeObj(zTreeId);
    };


    return {
        loadJsonData: loadJsonData,
        loadUrlData: loadUrlData,
        searchNode: searchNode
    }

});