/**
 * 机构选择组件
 * 通过传入参数可实现：单选、多选、不能选择根节点、只能选择叶子节点等功能
 * Auth：Qiyh
 * Date：2018-07-25
 */
require(['/js/zlib/app.js'], function(App) {

    var PageModule = {
        init: function(){
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
            ]);

            //ztree配置
            var ztSetting = {
                data: {
                    simpleData: {
                        enable: true,   //设置是否使用简单数据模式(Array)
                        idKey: "id",    //设置节点唯一标识属性名称
                        pIdKey: "pId"      //设置父节点唯一标识属性名称
                    },
                    key: {
                        name: "name",//zTree 节点数据保存节点名称的属性名称
                        title: "name" //zTree 节点数据保存节点提示信息的属性名称
                    }
                },
                view : {
                    // showIcon : false,
                    selectedMulti : false,//只能单选
                    showLine : false,   //不显示连接线
                    expandSpeed : 'fast',   //展开速度
                    dblClickExpand : false  //双击展开
                },
                check : {
                    enable : false,  //不显示 checkbox / radio
                    chkStyle : "checkbox",    //复选框
                    chkboxType : {
                        "Y" : "s",
                        "N" : "ps"
                    }
                }
            };

            /**
             * 获取参数
             */
            //类型（0：集团；1：公司；2：部门；3：车间；4：工序；5：班组）
            var type = Mom.getUrlParam('type'),
                //查询哪个id下的子机构
                parentId = Mom.getUrlParam('id'),
                //是否多选
                multiple = Mom.getUrlParam('multiple')||'false',
                //不能选择根节点
                noRoot = Mom.getUrlParam('noRoot')||'false',
                //只能选择叶子节点
                onlyLeaf = Mom.getUrlParam('onlyLeaf')||'false';

            //可以多选
            if(multiple == 'true'){
                ztSetting.view.selectedMulti = true;
                ztSetting.check.enable = true;
            }

            require(['ztree_all'],function(){
                //设置参数
                var data = {};
                if(type == '1'){
                    data.type = type;
                }else{
                    if(parentId){
                        data.companyId = parentId;
                    }
                    // data.officeId = parentId;
                }
                Api.ajaxForm(Api.admin+'/api/sys/SysOrg/selectOrg',data,ztreecompany);
            });
            var zTreeObj;
            function ztreecompany(data) {
                var zNodes = data.rows;
                zTreeObj= $.fn.zTree.init($('#tree'), ztSetting, zNodes);
                var nodes = zTreeObj.getNodes();
                for (var i = 0; i < nodes.length; i++) { //设置节点展开
                    zTreeObj.expandNode(nodes[i], true, false, true);
                }
            }
            //点击确定按钮，获取选中的值
            window.getSelectVal = function(){
                var rows=[];
                if(zTreeObj){
                    if(multiple == 'true'){
                        var nodes = zTreeObj.getCheckedNodes(true);//获取勾选的节点集合
                        if(nodes.length == 0){
                            Mom.layAlert('请至少选择一项');
                            return;
                        }
                        for(var i=0; i<nodes.length; i++){
                            var nd = nodes[i];
                            var validFlag = validatorNode(nd);
                            if(validFlag==true){
                                rows.push({
                                    'id':nd.id,
                                    'name':nd.name,
                                    'pId':nd.pId,
                                    'type':nd.type
                                });
                            }else{
                                return;
                            }
                        }
                    }else{
                        var nodes = zTreeObj.getSelectedNodes();
                        if(nodes.length != 1){
                            Mom.layAlert('只能选择一项');
                            return;
                        }
                        var nd = nodes[0];
                        var validFlag = validatorNode(nd);
                        if(validFlag==true){
                            rows.push({
                                'id':nd.id,
                                'name':nd.name,
                                'pId':nd.pId,
                                'type':nd.type
                            });
                        }
                    }
                }
                return rows;
            };

            //校验选择的节点是否符合
            var validatorNode = function(nd){
                if(nd){
                    if(type){
                        if(type == '2'){
                            if(nd.type=='0' || nd.type=='1'){
                                Mom.layAlert('请选择部门');
                                return false;
                            }
                        }else if(nd.type != type){
                            var msg = '请选择'+getTypeLabel(type);
                            Mom.layAlert(msg);
                            return false;
                        }
                    }
                    //不能选择根节点
                    if(noRoot == 'true'){
                        var parentNode = nd.getParentNode();
                        //如果没有父节点，说明nd是根节点
                        if(!parentNode){
                            Mom.layAlert('不能选择根节点');
                            return false;
                        }

                    }
                    //只能选择叶子节点
                    if(onlyLeaf == 'true'){
                        var childNodes = nd.children;
                        if(childNodes && childNodes.length > 0){
                            Mom.layAlert('只能选择叶子节点');
                            return false;
                        }
                    }
                }
                return true;
            };

            var getTypeLabel = function(type){
                var label = '';
                if(type){
                    switch (type){
                        case '0':
                            label = '集团';
                            break;
                        case '1':
                            label = '公司';
                            break;
                        case '2':
                            label = '部门';
                            break;
                        case '3':
                            label = '车间';
                            break;
                        case '4':
                            label = '工序';
                            break;
                        case '5':
                            label = '班组';
                            break;
                        default:
                            label = '合适的机构类型';
                            break;
                    }
                }
                return label;
            }

        },
    };

    $(function(){
        if($('#orgSelect').length > 0){
            PageModule.init();
        }
    });
});