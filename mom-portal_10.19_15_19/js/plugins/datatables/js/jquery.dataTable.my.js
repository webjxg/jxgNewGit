define(function(require){

    //dataTable样式
    var cssArr = [
        // "/js/plugins/datatables/css/jquery.dataTables.min.css",
        "../css/customDataTable.css"
    ];
    $.each(cssArr,function(i,o){
        var head = document.getElementsByTagName('head')[0],
            linkTag = document.createElement('link');
        linkTag.href = o;
        linkTag.setAttribute('rel','stylesheet');
        linkTag.setAttribute('type','text/css');
        head.appendChild(linkTag);
    });

    //dataTable默认配置
    $.fn.dataTable.defaults.bSort = false;
    $.fn.dataTable.defaults.order = [];
    $.fn.dataTable.defaults.paging = false;
    $.fn.dataTable.defaults.bPaginate = false;
    $.fn.dataTable.defaults.pagingType = "full_numbers";
    $.fn.dataTable.defaults.info = false; //底部文字
    $.fn.dataTable.defaults.bAutoWidth = false;
    $.fn.dataTable.defaults.bDestroy = true;
    $.fn.dataTable.defaults.bProcessing = true;
    $.fn.dataTable.defaults.searching = false;
    $.fn.dataTable.defaults.bFilter = false; //是否显示搜索框
    $.fn.dataTable.defaults.oLanguage = {
        "sProcessing": "处理中...",
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sZeroRecords": "没有找到符合条件的数据",
        "sInfo": "显示第 _START_ ~ _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "没有数据",
        "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
        "sInfoPostFix": "",
        "sSearch": "搜索：",
        "sUrl": "",
        "sEmptyTable": "没有找到符合条件的数据",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    };

});
