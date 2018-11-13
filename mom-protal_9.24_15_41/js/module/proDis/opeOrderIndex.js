require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            ajaxproc();//获取工序数据
            ajaxkind();//获取指令分类
            //Page插件
            require(['Page'],function(){
                Page.init(Api.aps+"/api/ctrl/BaseDirectiveCZ/page",{},true,function(tableData){
                    renderTableData(tableData);
                });
            });
            //渲染表格
            function renderTableData(data) {
                //↓接口到后修改↓
                var datas=data;
                var tableStr = "",grade='';
                for (var i = 0; i < datas.length; i++) {
                    if(data[i].grade==1){
                        grade= '一';
                    }else if(data[i].grade==2){
                        grade= '二';
                    }else{
                        grade='三';
                    }
                    tableStr += "<tr class='alignCenter' >"
                        + "<td class='i-Checks' id='" + datas[i].id + "'>" + datas[i].proc + "</td>"
                        + "<td>"+data[i].content+"</td>"
                        + "<td>" + grade+"级指令</td>"
                        + "<td>" + datas[i].kind + "</td>"
                        + "<td>" + datas[i].createDate + "</td>"
                        + "</tr>";
                }
                if (tableStr.length == 0) {
                    var len = $("#treeTable thead tr").children("th").length;
                    tableStr = "<tr style='text-align: center'><td colspan='" + len + "'><font color='#cd0a0a'>暂无记录，请重新选择条件后再试</font></td></tr>";
                }
                $('#treeTableBody').html(tableStr);
            }
            //获取工序数据
            function ajaxproc(){
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
                        "proc":procValue,
                        "grade":gradeValue,
                        "kind":kindValue,
                        "contentParam":contentParme
                    };
                    Page.init(Api.aps+"/api/ctrl/BaseDirectiveCZ/page",data,true,function(tableData){
                        renderTableData(tableData);
                    })
                });
            });

        },

    };

    $(function(){
        //操作指令列表
        if($('#opeOrderIndex').length > 0){
            PageModule.listInit();
        }

    });
});