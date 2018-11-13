/**
 * Created by lumaosai on 2018/9/21.
 */
require(['/js/zlib/app.js'], function (App) {
    var PageModule = {
        momWorkshop: function(){

            //引入Page插件
            require(['Page'], function () {
                var page = new Page();
                Api.ajaxJson(Api.mtrl + "/api/fm/Fctr/fctrSelect",{},function(result){
                    if(result.success){
                        Bus.appendOptionsValue('#fctrId',result.rows,'id','fctrName');
                    }
                });
                window.pageLoad = function () {
                    var data = {
                        enable: $("#enable option:selected").val(),
                        wspName: $('#wspName').val(),
                        fctr: {
                            id:$("#fctrId option:selected").val()
                        }
                    };
                    //修改默认每页显示条数http://localhost/json/fwork/chejian.json
                    page.init(Api.mtrl + "/api/fm/Workshop/page", data, true, function (tableData) {
                        renderTableData(tableData);
                        $('.btn-edit').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.openEditDialog('修改MOM车间', '/material/factoryModels/momWorkshopView.html?id=' + id, '700px', '300px');
                        });
                        $('.btn-delete').click(function () {
                            var id = $(this).parents("tr").find('.i-checks').attr('id');
                            Bus.deleteItem('确定要删除改MOM车间吗', Api.mtrl + '/api/fm/Workshop/delete/', {ids:id});
                        });
                    });
                };
                $("#btn-search").click(function () {
                    pageLoad();
                });
                pageLoad();
            });
            function renderTableData(tableData) {
                $('#treeTable').dataTable({
                    "bSort": true,
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0,5,8]}
                    ],
                    "data": tableData,
                    "aoColumns": [
                        {
                            "data": null, "defaultContent": "", 'sClass': "autoWidth alignCenter",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "wspNo", 'sClass': " alignCenter", "width": "12%"},
                        {"data": "wspCode", 'sClass': "alignCenter ", "width": "12%"},
                        {"data": "wspName", 'sClass': "alignCenter", "width": "12%"},
                        {"data": "wspAlias", 'sClass': "alignCenter","width": "12%"},
                        {
                            "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                return "<div>"+ row.fctr.fctrName+"</div>"
                            }
                        },
                        {"data": "enable", 'sClass': "alignCenter", "width": "12%",
                            "render": function (data, type, row, meta) {
                                return "<i class='fa gray-check-"+row.enable+"'></i>";
                            }
                        },
                        {"data": "displayOrder", 'sClass': "alignCenter", "width": '8%'},
                        {"data": "remark", 'sClass': "alignCenter"},
                        {
                            "data": "id", "orderable": false, "defaultContent": "", 'sClass': " alignCenter autoWidth",
                            "render": function (data, type, row, meta) {
                                return "<a class='btn-edit' title='编辑'><i class='fa fa-edit '></i></a >" +
                                    "<a class='btn-delete' title='删除'><i class='fa fa-trash-o '></i></a >";
                            }
                        }]
                });
                renderIChecks();
            };
        },
        //编辑页面
        momWorkshopView: function() {
            var id =Mom.getUrlParam('id');
            if(id){
                    Api.ajaxJson(Api.mtrl + "/api/fm/Workshop/form/" + id,{},function(result){
                        if(result.success){
                            Bus.appendOptionsValue('#fctr',result.fctrList,'id','fctrName');
                            Validator.renderData(result.Workshop, $('#inputForm'));
                        }
                        $('#wspNo').attr('disabled','disabled');
                    });
            }else{
                Api.ajaxJson(Api.mtrl + "/api/fm/Workshop/form/0",{},function(result){
                    if(result.success){
                        Bus.appendOptionsValue('#fctr',result.fctrList,'id','fctrName');
                    }
                });
            }

        }
    }
    $(function () {
        if ($('#momWorkshop').length > 0) {
            PageModule.momWorkshop();
        }else if($('#momWorkshopView').length > 0){
            PageModule.momWorkshopView();
        }
    });
})