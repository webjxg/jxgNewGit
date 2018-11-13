require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            loadGrade();
            loadProcess();
            ajaxkind();
            //Page插件
            require(['Page'],function(){
                Page.init(Api.aps+"/api/ctrl/BaseDirective/page",{},true,function(tableData){
                    console.log(tableData,888);
                    renderTableData(tableData);
                });
            });
            //渲染表格
            function renderTableData(data) {
                //↓接口到后修改↓
                var datas=data;
                var tableStr = "";
                for (var i = 0; i < datas.length; i++) {
                    tableStr += "<tr class='alignCenter' >"
                        + "<td class='i-Checks  alignCenter' id='" + datas[i].id + "'>" + datas[i].proc + "</td>"
                        + "<td class='alignCenter'>"+data[i].content+"</td>"
                        + "<td class='alignCenter'>" + data[i].gradeLabel+"</td>"
                        + "<td>" + datas[i].kind + "</td>"
                        + "<td>" + datas[i].createDate + "</td>"
                        + "</tr>";
                }
                if (tableStr.length == 0) {
                    var len = $("#treeTable thead tr").children("th").length;
                    tableStr = "<tr style='text-align: center'><td colspan='" + len + "'><font color='#cd0a0a'>暂无记录，请重新选择查询条件</font></td></tr>";
                }
                $('#treeTableBody').html(tableStr);
            }
            //获取等级
            function loadGrade() {
                var url=Api.admin+'/api/sys/SysDict/type/directiveLeaveyType';
                Api.ajaxJson(url,{},function (result) {
                    if(result.success){
                        var rows = result.rows;
                        Bus.appendOptionsValue($('#grade'), rows, 'value', 'label');
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }
            //获取工序数据
            function loadProcess(){
                id = Mom.getCookie("loginUserid")
                Api.ajaxJson(Api.admin+'/api/sys/SysAuthProperty/getAttributeValue/'+id+'/GXJQ/syswp',{},function (result) {
                    if(result.success){
                        var rows = result.rows;
                        Bus.appendOptionsValue($('#proc'), rows, 'value', 'name');
                    }else{
                        Mom.layMsg(result.message);
                    }
                });

            }
            //获取指令分类
            function ajaxkind() {
                Api.ajaxJson(Api.admin+'/api/sys/SysDict/type/directiveCassifyType',{},function (result) {
                    if(result.success){
                        var rows = result.rows;
                        Bus.appendOptionsValue($('#kind'), rows, 'value', 'label');
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }

            //得到下拉菜单的值
            $("#btn-search").click(function () {
                require(['Page'],function(){
                    var procValue=$('#proc').val(), gradeValue=$('#grade').val(),kindValue=$('#kind').val(),contentParme=$('#contentParam').val();
                    data={
                        "proc":procValue=="请选择"?"":procValue,
                        "grade":gradeValue=="请选择"?"":gradeValue,
                        "kind":kindValue=="请选择"?"":kindValue,
                        "contentParam":contentParme=="请选择"?"":contentParme
                    };
                    Page.init(Api.aps+"/api/ctrl/BaseDirective/page",data,true,function(tableData){
                        renderTableData(tableData);
                    })
                });
            });
        },

    };

    $(function(){
        //调度指令列表
        if($('#disCommandsIndex').length > 0){
            PageModule.listInit();
        }

    });
});