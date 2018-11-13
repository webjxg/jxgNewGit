require(['/js/zlib/app.js'], function(App) {
    //获取参数
    var multiple = Mom.getUrlParam('multiple')||'false';//是否多选
    var showSearch = Mom.getUrlParam('showSearch')||'true';//是否显示搜索框
    if(showSearch != 'true'){
        $('#has_searchText').parent().hide();
    }
    require(['ztree_my'],function(ZTree){
        /**
         * 部门
         */
        var orgTree, curClickTreeNode;
        var orgZtreeSetting = $.extend(true,{},{
            callback: {onClick: orgOnClick}
        },orgOptions.settting||{});
        var orgApiCfg = $.extend(true,{},{
            url: Api.admin+"/api/sys/SysOrg/orgTree",
            data: {},
            contentType: 'json'
        },orgOptions.apiCfg||{});
        var orgConType = orgApiCfg.contentType||'json';
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
            orgTree = ztree1.loadData($("#officeTree"),rows,false,orgZtreeSetting);
            ztree1.registerSearch(orgTree, $('#org_searchText'), 'name');
        }
        function orgOnClick(event, treeId, treeNode, clickFlag){
            if(orgTree){
                curClickTreeNode = treeNode;
                orgTree.expandNode(treeNode);
                loadWaitUserData();
            }
        }

        /**
         * 待选
         */
        var waitUserTree;
        var waitZtreeSetting = $.extend(true,{},{
            edit: {
                enable:true, showRemoveBtn:false, showRenameBtn:false,
            },
            callback: {
                onDblClick: waitDbClick,    //双击添加到已选列表
                beforeDrop: waitBeforeDrop
            }
        },waitUserOptions.settting||{});
        function loadWaitUserData(){
            if(curClickTreeNode){
                var treeNode=curClickTreeNode, orgId=curClickTreeNode.id;
                var waitApiCfg = $.extend(true,{},{
                    url: Api.admin+"/api/sys/SysUser/list",
                    data: treeNode.type=='1'?{companyId:orgId}:{deptId:orgId},
                    contentType: 'json'
                },waitUserOptions.apiCfg||{});
                var waitConType = waitApiCfg.contentType||'json';
                //获取部门下的用户
                if(waitConType == 'json'){
                    Api.ajaxJson(waitApiCfg.url,JSON.stringify(waitApiCfg.data),function(userResult){
                        if(userResult.success) {
                            loadWaitUserTree(userResult.rows);
                        }else {
                            Mom.layMsg(result.message);
                        }
                    });
                }else{
                    Api.ajaxForm(waitApiCfg.url,waitApiCfg.data,function(userResult){
                        if(userResult.success) {
                            loadWaitUserTree(userResult.rows);
                        }else {
                            Mom.layMsg(result.message);
                        }
                    });
                }
            }
        }
        //加载待选用户树
        function loadWaitUserTree(rows){
            var ztree2 = new ZTree();
            var newIds = [];//已选用户id数组
            $.each(hasUserTree.getNodes(),function(i2,o2){
                newIds.push(o2.id);
            });
            var dataArr = [];
            //过滤掉已选用户
            $.each(rows, function(i,o){
                if($.inArray(o.id, newIds) < 0){
                    dataArr.push(o);
                }
            });
            waitUserTree = ztree2.loadData($("#userTree"),dataArr,false,waitZtreeSetting);
            ztree2.registerSearch(waitUserTree, $('#wait_searchText'), 'name');
        }
        function waitDbClick(event, treeId, treeNode, clickFlag){
            var newValues = hasUserTree.transformToArray(hasUserTree.getNodes());
            if(multiple != 'true'){
                if(newValues && newValues.length > 0){
                    Mom.layMsg('只能选择一个用户');
                    return false;
                }
            }
            var newIds = [];//已选用户id数组
            $.each(newValues,function(i2,o2){
                newIds.push(o2.id);
            });
            //如果存在则不添加
            if($.inArray(treeNode.id, newIds) > -1){
                return false;
            }
            waitUserTree.removeNode(treeNode);
            hasUserTree.addNodes(null, treeNode);
            newValues.push(treeNode);
            return true;
        }
        function waitBeforeDrop(treeId, treeNodes, targetNode, moveType, isCopy){
            //只能拖拽到根节点
            if(targetNode==null && treeNodes.length>0){
                waitDbClick(null,treeId,treeNodes[0]);
            }
            return false;
        }


        /**
         * 已选列表
         */
        var oldValues=[];
        var hasUserTree;
        var hasZtreeSetting = $.extend(true,{},{
            edit: {
                enable:true, showRemoveBtn:false, showRenameBtn:false,
                drag: {
                    isCopy:false, isMove:false  //不允许拖拽
                }
            },
            callback: {
                onDblClick: hasDbClick     //双击移除
            }
        },hasUserOptions.settting||{});
        var hasApiCfg = $.extend(true,{},{
            url: '',
            data: {},
            contentType: 'json'
        },hasUserOptions.apiCfg||{});
        var defaultVals = hasUserOptions.checkDefaultVal;
        var hasConType = hasApiCfg.contentType||'json';
        function loadHasUserData(loadOrgFlag) {
            var defaultValArr=[], oldValues=[];
            if(defaultVals && defaultVals!=''){
                //格式：[{id:1,name:'zhangsan'},{id:2,name:'lisi'}]
                if(Object.prototype.toString.call(defaultVals) === '[object Array]'){
                    defaultValArr = defaultVals;
                }
                //格式：{id:1,name:'zhangsan'}
                else if(typeof(defaultVals) == 'object'){
                    if(defaultVals.id){
                        defaultValArr = [defaultVals];
                    }
                }else{
                    var defaultValArrTmp = defaultVals.split(',');
                    $.each(defaultValArrTmp, function(i,o){
                        defaultValArr.push({id:o, name:"<font color='red'>"+o+"</font>"});
                    });
                }
                loadHasUserTree(defaultValArr);
                if(loadOrgFlag==true){
                    loadOrgData();
                }
            }
            if(hasApiCfg.url && hasApiCfg.url!='') {
                if (hasConType == 'json') {
                    Api.ajaxJson(hasApiCfg.url, JSON.stringify(hasApiCfg.data), function (result) {
                        if (result.success) {
                            loadHasUserTree(result.rows);
                        } else {
                            Mom.layMsg(result.message);
                        }
                        if(loadOrgFlag==true){
                            loadOrgData();
                        }
                    });
                } else {
                    Api.ajaxForm(hasApiCfg.url, hasApiCfg.data, function (result) {
                        if (result.success) {
                            loadHasUserTree(result.rows);
                        } else {
                            Mom.layMsg(result.message);
                        }
                        if(loadOrgFlag==true){
                            loadOrgData();
                        }
                    });
                }
            }
        }
        //加载已选择的用户树
        function loadHasUserTree(rows){
            var hasList=[];
            $.each(rows,function(i,o){
                hasList.push({
                    id: o.id,
                    name: "<font color='red'>"+o.name+"</font>"
                });
                oldValues.push(o);
            });
            if(hasUserTree){
                hasUserTree.addNodes(null,hasList);
            }else{
                var ztree3 = new ZTree();
                hasUserTree = ztree3.loadData($('#selectedTree'),hasList,false,hasZtreeSetting);
                ztree3.registerSearch(hasUserTree, $('#has_searchText'), 'name');
            }
            hasRevertBtn();
        }
        function hasDbClick(event, treeId, treeNode, clickFlag){
            waitUserTree.addNodes(null,[treeNode]);
            hasUserTree.removeNode(treeNode);
        }
        function hasRevertBtn(){
            $('.hasRevertBtn').unbind('click').bind('click',function(){
                Mom.layConfirm('所做的人员调整将被还原<br>确定继续吗?',function(layIdx, layero){
                    var nodes = hasUserTree.transformToArray(hasUserTree.getNodes());
                    $.each(nodes,function(i,o){
                        hasUserTree.removeNode(o);
                    });
                    loadHasUserData(false);
                    loadWaitUserData();
                    return true;
                });
            });
        }


        /**
         * 在外部获取选中的值
         */
        window.getCheckValues = function() {
            var newValues = hasUserTree.transformToArray(hasUserTree.getNodes());
            if(newValues.length == 0){
                Mom.layMsg('请选择用户');
                return {
                    success: false,
                    message: '请选择用户'
                }
            }
            else if(newValues.length > 1){
                if(multiple != 'true'){
                    Mom.layMsg('只能选择一个用户');
                    return {
                        success: false,
                        message: '只能选择一个用户'
                    }
                }
            }
            //判断已选用户是否有变化
            if(oldValues.length == newValues.length){
                var oldIds=[];
                $.each(oldValues,function(i,o){
                    oldIds.push(o.id);
                });
                //如果新选择的值都在oldIds（初始值）中存在，说明没有变化
                for(var i=0; i<newValues.length; i++){
                    if($.inArray(newValues[i].id, oldIds) < 0){
                        return {
                            success: false,
                            oldValues: oldValues,
                            newValues: newValues,
                            message: '选择的用户没有发生变化'
                        }
                    }
                }
            }
            return {
                success: true,
                oldValues: oldValues,
                newValues: newValues,
                message: ''
            }
        };

        //检测到获取配置后执行
        var timer = setInterval(function(){
            if(userSelect3 == true){
                //立即调用，加载数据
                loadHasUserData(true);
                clearInterval(timer);
            }
        },500);

    });
});