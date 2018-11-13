require(['/js/zlib/app.js'], function (App) {
    var PageModule = {

        dicValue:'', // 把修改计算公式配置中的计算公式保存到指标值
        formula: '', //计算公式保存带span的格式
        //字典树
        planDicInit: function () {
            //引入zTree样式
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
                '../js/plugins/ztree/css/metroStyle/metroStyle.css',
                '../js/plugins/easyui/themes/default/easyui.css',
                '../js/plugins/treetable/css/jquery.treetable.css',
                '../js/plugins/treetable/css/jquery.treetable.theme.default.css',
                '../js/plugins/datatables/css/jquery.dataTables.min.css'
            ]);
            $('#officeContent').attr('src', 'planDicInner.html');
            Api.ajaxForm(Api.aps + '/api/aps/Device/tree', {}, function (da) {
                zTree(da)
            });
            page(0);
            function zTree(da) {
                var data = da.rows;
                var zTreeObj;
                // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,   //设置是否使用简单数据模式(Array)
                            idKey: "id",    //设置节点唯一标识属性名称
                            pIdKey: "pId"      //设置父节点唯一标识属性名称
                        },
                        key: {
                            name: "name",//zTree 节点数据保存节点名称的属性名称
                            title: "name"//zTree 节点数据保存节点提示信息的属性名称
                        }
                    },
                    callback: {
                        onClick: function (e, treeId, node) {
                            if (node.id) {
                                rendersun(node.id)
                            }
                        }
                    }

                };
                // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                var zNodes = data;
                require(['/js/plugins/ztree/js/jquery.ztree.core.js'],function () {
                    var treeObj = $.fn.zTree.init($("#tree"), setting, zNodes);
                })
                //执行ztree

            }

            function rendersun(data) {
                page(data);
            }

            function btncilck(){
                // 查看
                $('.btn-check').unbind().click(function () {
                    var id = $(this).attr('id');
                    var types = $(this).attr('data-types');
                    Bus.openDialog('查看指标信息', './inventoryTaking/planDicCheckView.html?id=' + id+'&types='+ types, '800px', '350px')
                });
                //修改
                $('.btn-change').unbind().click(function () {
                    var id = $(this).attr('id');
                    var types = $(this).attr('data-types');
                    openEditDialogDic('修改指标信息', './inventoryTaking/planDicCheckView.html?id=' + id+'&types='+ types, '800px', '350px')
                });
                //删除
                $('.btn-delete').unbind().click(function () {
                    var id = $(this).attr('id');
                    var types = $(this).attr('data-types');
                    deleteItem('确定要删除该指标吗', Api.aps + '/api/aps/Device/delete/',id)
                });
                // 添加下级菜单
                $('.btn-add').unbind().click(function(){
                    var id = $(this).attr('id');
                    var types = $(this).attr('data-types');
                    openEditDialogLevel('添加下级菜单', './inventoryTaking/planDicCheckView.html?pid=' + id+'&types='+ types, '800px', '350px')
                });

            }

            function page(node) {
                Api.ajaxJson(Api.aps + "/api/aps/Device/ajaxTreeJson/" + node, {}, function (tableData) {
                    if (tableData.success) {
                        tableData.rows.forEach(function(item){
                            if(item.state == 'closed'){
                                item.state = 'open';
                            }
                        })
                        require(['easyui_my'],function(){
                            $('#tt').treegrid({
                                idField:'id',
                                treeField:'name',
                                collapsible: true,
                                fitColumns: true,
                                singleSelect : true,
                                columns:[[
                                    {field:'name',title:'指标名称',width:150,align:'left'},
                                    {field:'code',title:'指标编码',width:150,align:'center'},
                                    {field:'val',title:'指标值',width:150,align:'center'},
                                    {field:'unit',title:'指标单位',width:80,align:'center'},
                                    {field:"text",title:"操作",align:'center',width:300,formatter: function(value,row,index){
                                        if(row.types != 'column'){
                                            return "<a class='btn  btn-info btn-check' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                                " <a class='btn btn-success  btn-change' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa icon-change'></i>修改</a>" +
                                                " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa fa-trash'></i> 删除</a>"  +
                                                " <a class='btn  btn-add btn-target' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa fa-plus'></i>添加下级指标</a>";
                                        }else{
                                            return "<a class='btn  btn-info btn-check' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa fa-search-plus'></i>查看</a>" +
                                                " <a class='btn btn-success  btn-change' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa icon-change'></i>修改</a>" +
                                                " <a class='btn bg-f75c5c btn-delete' id='"+ row.id+"' data-types='"+ row.types+"'><i class='fa fa-trash'></i> 删除</a>";
                                        }

                                    }},
                                ]],
                                data:tableData

                            });

                            btncilck();

                        });
                        //PageModule.dicRenderTableData(tableData.rows);
                        //clickButton();
                    } else {
                        Mom.layMsg(tableData.message)
                    }

                })
            }

            //修改
            function openEditDialogDic(title,url,width,height,innerCallbackFn){
                var clickFlag = true;
                if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
                    width='auto';
                    height='auto';
                }else{//如果是PC端，根据用户设置的width和height显示。
                }
                var ind =  top.layer.open({
                    type: 2,
                    area: [width, height],
                    title: title,
                    maxmin: false, //开启最大化最小化按钮
                    content: url ,
                    btn: ['确定', '关闭'],
                    yes: function(index, layero){
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if(clickFlag){
                            if(!innerCallbackFn){
                                iframeWin.contentWindow.doSubmit1(iframeWin.contentWindow,body,index);
                                var objDic = iframeWin.contentWindow.formdata;
                                // 通过id获取要修改数据
                                //var editNode = '';
                                setTimeout(function(){
                                    Api.ajaxJson(Api.aps + "/api/aps/Device/ajaxTreeJson/" +objDic.id,{},function(tableData){
                                        var editNode =tableData.rows[0];
                                        var data = {
                                            name: editNode.name ,
                                            code: editNode.code,
                                            val: editNode.val,
                                            unit: editNode.unit
                                        }
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_editTreegridNode('#tt',objDic.id, data);
                                            btncilck();
                                        });

                                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                                        var node = treeObj.getNodeByParam("id", objDic.id, null);
                                        node.name = editNode.name;
                                        treeObj.updateNode(node);

                                    })
                                },3000);


                            }else{
                                //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                                innerCallbackFn(iframeWin, body, index);

                            }
                            clickFlag = false;
                            setTimeout(function(){
                                clickFlag = true;
                            },3000);
                        }
                    },
                    cancel: function(index){
                    }
                });

            }


            //添加下级指标
            function openEditDialogLevel(title,url,width,height,innerCallbackFn){
                var clickFlag = true;
                if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){//如果是移动端，就使用自适应大小弹窗
                    width='auto';
                    height='auto';
                }else{//如果是PC端，根据用户设置的width和height显示。
                }
                var ind =  top.layer.open({
                    type: 2,
                    area: [width, height],
                    title: title,
                    maxmin: false, //开启最大化最小化按钮
                    content: url ,
                    btn: ['确定', '关闭'],
                    yes: function(index, layero){
                        var body = top.layer.getChildFrame('body', index);  //获取子iframe
                        var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        if(clickFlag){
                            if(!innerCallbackFn){
                                iframeWin.contentWindow.doSubmit1(iframeWin.contentWindow,body,index);
                                var objDic = iframeWin.contentWindow.formdata;

                                // 添加到父节点需要获取添加子节点
                                var editNode = '';
                                setTimeout(function(){
                                    Api.ajaxJson(Api.aps +"/api/aps/Device/ajaxTreeJson/"+0,{},function(tableData){
                                        var ArrayData =tableData.rows;
                                        getNodeId(ArrayData);
                                        function getNodeId (data) {
                                            data.forEach(function(item){
                                                if(item.code == objDic.code && item.unit == objDic.unit){
                                                    editNode = item;
                                                }
                                                //if(item.children.length > 0 ){
                                                //    getNodeId(item.children);
                                                //}
                                            })
                                        }
                                        // 添加到父节点下面
                                        var data = [{
                                            id: editNode.id,
                                            name: editNode.name,
                                            code: editNode.code,
                                            val: editNode.val,
                                            unit: editNode.unit
                                        }];
                                        require(['easyui_my'],function(easyuiObj){
                                            easyuiObj.tg_appendTreegridNode('#tt',objDic.parentId, data);
                                            btncilck();
                                        });
                                        // 重新加载左侧树，由于存在异步操作，用到定时器
                                        setTimeout(function(){
                                            var newNodes  = '';
                                            Api.ajaxForm(Api.aps + '/api/aps/Device/tree',{},function (data) {
                                                var ArrayDic =data.rows;
                                                ArrayDic.forEach(function(item,index){
                                                    if(item.code == objDic.code){
                                                        newNodes  = item;
                                                    }
                                                })
                                                var treeObj = $.fn.zTree.getZTreeObj("tree");
                                                var node = treeObj.getNodeByParam("id",newNodes.pId, null);
                                                newNode = treeObj.addNodes(node, newNodes);
                                            });
                                        },1000);
                                    });
                                },3000)

                            }else{
                                //iframeWin.contentWindow[innerCallbackFn]();   //有bug  innerCallbackFn必须是字符串 待解决
                                innerCallbackFn(iframeWin, body, index);

                            }
                            clickFlag = false;
                            setTimeout(function(){
                                clickFlag = true;
                            },3000);
                        }
                    },
                    cancel: function(index){
                    }
                });

            }

            //删除单条数据
            function deleteItem(mess,url,id){
                var data = {ids:id} || {};
                top.layer.confirm(mess, {icon: 3, title:'系统提示'},function(index){
                    Api.ajaxForm(url,data,function(result){
                        if(result.success == true){
                            require(['easyui_my'],function(easyuiObj){
                                easyuiObj.tg_removeTreegridNode('#tt',id);
                                btncilck();
                            });
                            // 重新加载左侧树，由于存在异步操作，用到定时器
                            setTimeout(function(){
                                var treeObj = $.fn.zTree.getZTreeObj("tree");
                                var node = treeObj.getNodeByParam("id",id, null);
                                treeObj.removeNode(node);
                            },1000);

                        }
                    });
                    top.layer.close(index);
                });
                return false;
            }

        },

        /**字典数查看新增编辑*/
        //字典数查看编辑
        planDicCheckView:function () {
            $('#inputForm').attr('action',Api.aps+'/api/aps/Device/save');
            var id = Mom.getUrlParam('id');
            var pId = Mom.getUrlParam('pid');
            var types = Mom.getUrlParam('types');
            $('#id').val(id);
            var targetDic = '';
            $('#computerBtn').click(function(){
                targetDic = $('#val').val();
                top.layer.open({
                    btn: ['确定','取消 '],
                    shade: [0.4, '#000'], //0.1透明度的白色背景
                    type: 2,
                    title: '修改计算公式配置',
                    shadeClose: true,
                    maxmin: false, //开启最大化最小化按钮
                    area: ['800px', '500px'],
                    content: './inventoryTaking/comForZtree.html?targetDic='+ escape(targetDic)+'&id='+ id,
                    yes:function(index,layero){
                        var dicValue = layero.find("iframe")[0].contentWindow.getDicValue();
                        var dicformula = layero.find("iframe")[0].contentWindow.getDicformula();

                        $('#val').val(dicValue);
                        $('#formula').val(dicformula);
                        top.layer.close(index);
                    }
                })


                //Bus.openEditDialog('?????', './inventoryTaking/comForZtree.html', '1000px', '800px')
            })


            if (id == null && pId == null) {
                // 说明是添加 当添加时指标类型只能为空
                $('#parentIdH').val(0);
                $('#names').remove();
                $('#types').html('<option value="">请选择</option>' + '<option value="">空</option>');
            } else {
                // 说明是添加下级指标 names是select的id name是input的id
                if (id == null) {
                    if(types == 'row'){
                        // 通过types来判断指标名称是input还是select
                        $('#name').remove();
                        $('#names').css('display','block');

                    }else{
                        $('#name').css('display','block');
                        $('#names').remove();

                    }
                    // 通过types来判断指标类型是空还是行或者列
                    if(types !='row' && types != 'column'){
                        $('#types').val('');
                        $('#types').html('<option value="">请选择</option>' + '<option value="row">行</option>');
                    }else{
                        //$('#types').val('column');
                        $('#types').html('<option value="column">列</option>');
                    }
                    var url = Api.aps+"/api/aps/Device/view/" + pId;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            SysOrg = result.stockTakeDevice;
                            //targetDic = result.stockTakeDevice.val;
                            var id = SysOrg.id;
                            $('#parentIdH').val(id);
                            $('#_parentId').val(result.stockTakeDevice.name);
                        } else {
                            layer.msg(result.message);
                        }
                    });

                } else {
                    // 说明是修改 查看
                    $('#types').attr('disabled','disabled');
                    // 通过types判断指标名称是input还是select
                    if(types =='column'){
                        $('#name').remove();
                        $('#names').css('display','block');
                    }else{
                        $('#name').css('display','block');
                        $('#names').remove();
                    }
                    var url = Api.aps+"/api/aps/Device/view/" + id;
                    Api.ajaxJson(url, {}, function (result) {
                        if (result.success) {
                            SysOrg = result.stockTakeDevice;
                            //targetDic = result.stockTakeDevice.val;
                            var parentid = SysOrg.parentId;
                            $('#parentIdH').val(parentid);
                            Validator.renderData(SysOrg, $('#inputForm'));
                            /*渲染parentName*/
                            Validator.renderData(result, $('#inputForm'));
                            if(types =='column'){
                                // 下拉选项
                                Api.ajaxJson(Api.admin+'/api/sys/SysDict/queryValue/t_inventoryType', {}, function (result) {
                                    if(result.success){
                                        var arrayList = [];
                                        var obj = result.t_inventoryType;
                                        for(var item in obj){
                                            var objList = {
                                                val:'',
                                                laber:''
                                            };
                                            objList.val = item;
                                            objList.laber = obj[item];

                                            arrayList.push(objList);
                                        }
                                        //调用select2
                                        Bus.appendOptionsValue('#names',arrayList,'val','laber');
                                        $("#names").select2().val(SysOrg.name).trigger('change');
                                    }
                                });

                            }
                            /*渲染parentName*/
                            //Validator.renderData(result, $('#inputForm'));


                        } else {
                            layer.msg(result.message);
                        }
                    });
                }
            }
            window.doSubmit1 = function(iframeWin, iframeBody, layerIdx){
                if(!Validator.valid(document.forms[0],1.3)){
                    return;
                }
                var formObj = $('#inputForm');
                var url = formObj.attr('action');
                var formdata = formObj.serializeJSON();
                window.formdata = formdata;
                Api.ajaxJson(url,JSON.stringify(formdata),function(result){
                    if(result.success == true){
                        Mom.layMsg('已成功提交',{time: 1000});
                        setTimeout(function(){
                            //关闭弹出层
                            top.layer.close(layerIdx);

                        },500);
                    }else{
                        Mom.layAlert(result.message);
                    }
                });
            };
        },

        /**计算内页*/
        //初始化ztree页面
        comForZtree: function () {
            window.getDicValue = function(){
                return PageModule.dicValue;
            };
            window.getDicformula = function(){
                return PageModule.formula;
            };
            PageModule.dicValue = ''; //定义全局
            PageModule.formula = ''; //定义全局

            var targetDic = Mom.getUrlParam('targetDic');
            //$('#paramRecord').html(targetDic);
            //$('#inputForm').attr('action', Api.aps + '/api/aps/Formula/save');
            var id = Mom.getUrlParam('id');
            var paramRecord = $("#paramRecord"),
                html = "", htmlArr = [], inputArr = [];
            if (id) {
                $("#objId").val(id);
                Api.ajaxForm(Api.aps + "/api/aps/Device/view/" + id, {}, function (result) {
                    if (result.success) {
                        var Formula = result.stockTakeDevice,
                            str = Formula.formula;
                        //Validator.renderData(Formula, $('#inputForm'));
                        $("#paramRecord").html(str);
                        html = str;
                        if(str == ''){

                        }else{
                            htmlArr = Formula.formula.match(/<[^>]+>([^<]+)<\/[^>]+>/g);
                            PageModule.formulaHiddenValue(inputArr, htmlArr);
                        }


                    }
                })
            }
            renderHtml(html, htmlArr, inputArr);
            function setFontCss(treeId, treeNode) {
                return treeNode.type != 'column' ? {color:"#ccc"} : {};
            };
            var setting = {
                view: {
                    fontCss: setFontCss // 设置颜色
                },
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
                callback: {
                    onClick: zTreeOnDblClick
                }
            };

            Api.ajaxJson(Api.aps + '/api/aps/Device/tree', {}, function (result) {
                if (result.success) {
                    require(['/js/plugins/ztree/js/jquery.ztree.core.js'], function () {
                        zTreeObj = $.fn.zTree.init($("#tree"), setting, result.rows);

                    });
                }
            });
            //ztree渲染 点击事件
            function zTreeOnDblClick(event, treeId, treeNode) {
                // html += "<span>" + treeNode.name + "[" + treeNode.itemCode + "]</span>";
                //html += treeNode.name + "[" + treeNode.itemCode + "]";
                //htmlArr.push(treeNode.name + "[" + treeNode.itemCode + "]");
                if(treeNode.type == 'column'){
                    html += "<span>" + treeNode.name + "</span>";
                    //html += treeNode.name ;
                    htmlArr.push(treeNode.name);
                    inputArr.push(treeNode.nameCode);
                    renHtmlFn(html, inputArr);
                    //向数组动态push元素
                }else{
                    Mom.layAlert('灰色字段不可选,请选择其它配置公式');
                }


            }

            function renderHtml() {
                $(".paramTag span").click(function () {
                    if ($(this).hasClass("clearAll")) {
                        html = "";
                        htmlArr = [];
                        inputArr = [];
                        renHtmlFn(html, htmlArr);
                    } else if ($(this).hasClass("clearOne")) {
                        html = "";
                        htmlArr.pop();
                        inputArr.pop();
                        var len1 = htmlArr.length;
                        for (var i = 0; i < len1; i++) {
                            html += htmlArr[i];
                        }
                        renHtmlFn(html, inputArr)
                    } else {
                        html += "<span>" + $(this).html() + "</span>";
                        //html += $(this).html();
                        htmlArr.push($(this).html());
                        inputArr.push($(this).html());
                        renHtmlFn(html, inputArr);

                    }

                });
            }

            //将htmlArr、inputArr数组中的元素遍历之后作为paramRecordHide、paramRecordShow的值插入。
            function renHtmlFn(html, inputArr) {
                $("#paramRecord").html(html);
                //PageModule.dicValue = html; //定义全局


                var inputHtml = "";
                var len = $(inputArr).length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        inputHtml += inputArr[i];
                        $("#paramRecordHide").empty().val(inputHtml);
                        PageModule.dicValue = inputHtml; //定义全局

                    }
                } else {
                    $("#paramRecordHide").empty().val("");
                    PageModule.dicValue = ''; //定义全局

                }
                $("#paramRecordShow").val(html);
                PageModule.formula = html; //定义全局

            }


        },
        //加载数据之后获取隐藏元素paramRecordHide的值，使用正则将匹配后的元素放入到inputArr数组中。
        formulaHiddenValue: function (inputArr, htmlArr) {
            for (var i = 0; i < htmlArr.length; i++) {
                var h = htmlArr[i].replace('<span>', '').replace('</span>', '');
                var m = h.match(/\[(.+)\]/g);
                if (m && m.length > 0) {
                    var ss = m[0];
                    ss = ss.substr(1, ss.length - 2);
                    inputArr.push(ss);
                } else {
                    inputArr.push(h);
                }
            }
        }

    };

    $(function () {
        //参数配置列表
        if ($('#dicTree').length > 0) {
            PageModule.planDicInit()
        }else if($('#planDicCheckView').length > 0){
            PageModule.planDicCheckView()
        }else if($('#comForZtree').length > 0){
            PageModule.comForZtree()
        }
    });

})
;
