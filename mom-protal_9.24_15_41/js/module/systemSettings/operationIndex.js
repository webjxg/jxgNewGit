require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            //引入Page插件
            require(['Page'],function(){
                window.pageLoad = function (){
                    var data = {
                        nameParam: $("#operationName").val(),
                        codeParam: $('#operationCode').val(),
                        desParam: $('#opeDescription').val(),
                        enable:   $('#enable').val(),
                    };
                    //修改默认每页显示条数
                    Page.init(Api.admin+"/api/sys/SysOperation/page",data,true,function(tableData){
                        renderTableData(tableData);
                        $('tbody tr').attr('class','alignCenter');
                        $('.btn-check').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openDialog('查看属性信息', '/systemSettings/operationIndexInner.html?id=' + id, '640px','285px')
                        });
                        $('.btn-change').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改属性', '/systemSettings/operationIndexInner.html?id=' + id, '640px','285px')
                        });
                        $('.btn-delete').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除该属性吗', Api.admin+'/api/sys/SysOperation/delete',id)
                        });
                        //点击重置按钮
                        $("#reset-btn").click(function () {
                            $("#operationName").val("");
                            $('#operationCode').val("");
                            $('#opeDescription').val("");
                            $('#enable').val("");
                            Page.reset(["nameParam","codeParam","desParam","enable"]);
                        });
                    });
                };
                $("#search-btn").click(function(){
                    pageLoad();
                });
                pageLoad();
            });

            function renderTableData(tableData) {
                $('#treeTable').dataTable({
                    "bSort":false,
                    "bPaginate": false,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "pagingType": "full_numbers",
                    "oLanguage": window.dataTableLang,
                    "data": tableData,
                    //定义列 宽度 以及在json中的列名
                    "columns": [
                        {
                            "data": null, "defaultContent": "",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": null,"width":"6%" },
                        {"data": "name",'sClass':"alignCenter  "},
                        {"data": "code",'sClass':"alignCenter","width":"15%"},
                        {"data": "des", 'sClass':"alignCenter","width":"15%"},
                        {"data": "sort","width":"6%" },
                        {
                            "data": null,"width":"6%",
                            "render":function (data) {
                                if(data.enable==0){
                                    return data = '否'
                                }else{
                                    return data = '是'
                                }
                            }
                        },
                        {"data": "id", "orderable": false, "defaultContent": "",
                            "render": function (data, type, row, meta) {
                                return data = "<a class='btn btn-info btn-xs  btn-check'><i class='fa fa-search-plus'></i>查看</a >" +
                                    "<a class='btn btn-success btn-xs btn-change'><i class='fa fa icon-change'></i>修改</a >" +
                                    "<a class='btn btn-danger btn-xs btn-delete'><i class='fa fa-trash' ></i>删除</a >"
                            }
                        }],
                    "fnDrawCallback" : function(){
                        this.api().column(1).nodes().each(function(cell, i) {
                            cell.innerHTML =  i + 1;
                        });
                    },

                });
                renderIChecks();
            }
        },

        formInit: function(){
            var id = Mom.getUrlParam('id'),
                api = Mom.getUrlParam('api') || 'form';
            $("#value").focus();
            if(id){
                var url = Api.admin+"/api/sys/SysOperation/"+api+"/"+id;
                Api.ajaxJson(url,{},function(result){
                    if(result.success){
                        Validator.renderData(result.SysOperation,$('#inputForm'));
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
            }
        }
    };

    $(function(){
        //操作管理列表
        if($('#operationIndex').length > 0){
            PageModule.listInit();
        }
        else if($('#operationIndexInner').length > 0){
            PageModule.formInit();
        }
    });
});