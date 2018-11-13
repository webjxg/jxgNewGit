require(['/js/zlib/app.js'], function(App) {

    require(['easyui_my'],function(){alert(21);
        Api.ajaxJson(Api.admin+"/api/sys/SysMenu/getTreeGraidJson",{},function(tableData){
            $('#tt').jqGrid({
                // idField:'id',
                // treeField:'name',
                // rownumbers: false,
                // collapsible: true,
                // fitColumns: true,
                // striped: true,
                // // 下面参数可以获取全选或多选
                // singleSelect : false,
                // checkOnSelect : false,
                // selectOnCheck : true,

                iconCls: 'icon-ok',
                rownumbers: true,
                animate: true,
                collapsible: true,
                fitColumns: true,
                idField: 'id',
                treeField: 'name',
                data:tableData
            });
        });
    });

});