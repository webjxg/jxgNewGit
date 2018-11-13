require(['/js/zlib/app.js'], function(App) {
    //引入用户登录校验
    require(['checkUser']);

    var PageModule = {
        listInit: function(){
            Mom.include('myCss', '', [
                '../js/plugins/ztree/css/zTreeStyle/zTreeStyle.css',
                '../js/plugins/ztree/css/metroStyle/metroStyle.css'
            ]);
            require(['ztree_all','Page'],function(){
                var page = new Page();
                window.pageLoad = function () {
                    var data = {
                        companyId: $("#companyId").val(),
                        loginNameParam: $('#loginName').val(),
                        deptId: $('#officeId').val(),
                        nameParam: $('#name').val(),
                        treeId: $('#treeId').val()
                    };
                    page.init(Api.admin+"/api/sys/SysUser/page", data, true, function (tableData, result) {
                        dataout(tableData);
                        clickButton()
                    });
                };
                pageLoad();

                //点击重置按钮
                $("#reset-btn").click(function () {
                    $("#companyName,#companyId,#loginName,#officeName,#officeId,#name").val("");
                    page.reset(["nameParam","deptId","loginNameParam","companyId"]);
                });

                //加载左侧树
                Api.ajaxJson(Api.admin+'/api/sys/SysOrg/selectOrg','json',zTree);
                //左边的结构数
                function zTree(da) {
                    var data=da.rows;
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
                            onClick: function (e, treeId, node){
                                if(node.id){
                                    updatason(node)
                                }
                            }
                        }
                    };
                    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                    var zNodes = data;
                    //执行ztree
                    var treeObj =$.fn.zTree.init($("#tree"), setting, zNodes);
                }
                function updatason(node){
                    var data;
                    if(node.type==1){
                        data={"companyId":node.id};
                    }else{
                        data={"deptId":node.id};
                    }
                    page.init(Api.admin+"/api/sys/SysUser/page", data, true, function (tableData, result) {
                        dataout(tableData); //创建table
                        clickButton()       //加载点击事件
                    })
                }
                function clickButton() {
                    $('.btn-check').click(function () {
                        var id = $(this).parents("tr").find('.i-checks').attr('id');
                        Bus.openDialog('查看用户信息', './systemSettings/userIndexInner.html?id=' + id, '800px', '500px')
                    });
                    $('.btn-change').click(function () {
                        var id = $(this).parents("tr").find('.i-checks').attr('id');
                        Bus.openEditDialog('修改用户信息', './systemSettings/userIndexInner.html?id=' + id, '800px', '500px')
                    });
                    $('.btn-delete').click(function () {
                        var id = $(this).parents("tr").find('.i-checks').attr('id');
                        Bus.deleteItem('确定要删除该用户吗',Api.admin+'/api/sys/SysUser/delete/',id)
                    });
                }
            });

            //选择公司
            $('.first-input-group').click(function () {
                Bus.openOrgSelect('type=1','#companyName', '#companyId', '请选择归属公司');
            });
            //选择部门
            $('.second-input-group').click(function () {
                var companyId=$('#companyId').val();
                Bus.openOrgSelect('type=2&id='+companyId,'#officeName', '#officeId', '请选择部门');
            });
            var treeId = Mom.getUrlParam("treeId");
            $('#treeId').val(treeId);

            //   ajax请求渲染datatable数据
            function dataout(data) {
                $('#treeTable').dataTable({
                    "bPaginate": false,
                    "bDestroy": true,
                    "bAutoWidth": false,
                    "paging": false,
                    "bProcessing": true,
                    "searching": false, //禁用aa原生搜索
                    "info": false,  //底部文字
                    "order": [],
                    "pagingType": "full_numbers",
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0, 5]}
                    ],
                    "oLanguage": dataTableLang,
                    "data": data,
                    //定义列 宽度 以及在json中的列名
                    "columns": [
                        {
                            "data": null, "width": "8%", "defaultContent": "",
                            "render": function (data, type, row, meta) {
                                return data = "<input type='checkbox' id=" + row.id + " class='i-checks'>"
                            }
                        },
                        {"data": "loginName", "width": "auto",'sClass':"alignCenter"},
                        {"data": "name", "width": "auto",'sClass':"alignCenter"},
                        {"data": "phone", "width": "auto",'sClass':"alignCenter"},
                        {"data": "mobile", "width": "auto",'sClass':"alignCenter"},
                        {"data": "id", "width": "auto","orderable": false, "defaultContent": "", 'sClass':'alignCenter  autoWidth',
                            "render": function (data, type, row, meta) {
                                return data = "<a class='btn btn-info btn-xs  btn-check'><i class='fa fa-search-plus'></i>查看</a >" +
                                    "<a class='btn btn-success btn-xs btn-change'><i class='fa icon-change'></i>修改</a >" +
                                    "<a class='btn btn-danger btn-xs btn-delete'><i class='fa fa-trash-o' ></i>删除</a >"
                            }
                        }],

                });
                renderIChecks();
            }
        },

        formInit: function(){
            Mom.include('myCss', '', [
                '../css/comInnerTable.css'
            ]);
            var id = Mom.getUrlParam('id');
            $('#id').val(id);
            if (id) {
                /*此处后端接口  id为弹出窗口自带的id 通过浏览器方法传参得到*/
                var url = Api.admin+"/api/sys/SysUser/form/"+id;
                Api.ajaxJson(url, {}, function (result) {
                    if (result.success) {
                        $('#loginName').attr('readonly','readonly');
                        //先渲染下拉菜单
                        getSubmitFormId();

                        // 所属岗位
                        var jobTypeList = result.jobTypeList;
                        Bus.appendOptionsValue('#jobTypeList',jobTypeList,'value','label');
                        // $('#jobTypeList').select2().val(result.sysUser.job).trigger('change');
                        //归属部门
                        var deptArr = result.sysUser.deptList;
                        var deptHtml="";
                        if(deptArr.length>0){
                            $(deptArr).each(function(i,o){
                                if(o.type != '5'){
                                    deptHtml += "<span>"+o.name+"</span>";
                                }
                            });
                            $('.deptList').empty().append(deptHtml);
                        }

                        //用户角色
                        Bus.appendOptionsValue('#roleName',result.allRoleList,'id','name');

                        //渲染数据
                        Validator.renderData(result.sysUser, $('#inputForm'));

                        $('#companyName').val(result.company.name);

                        /*上传头像*/
                        require(['../js/plugins/webUpLoader/js/webuploader.js'],function(WebUploader){
                            initWebuploader(WebUploader,'/img/sys/SysUpload/upimg?imgPath=img',
                                '#filePicker',
                                "#nameImagePreview",
                                Api.admin+'/img/sys/SysUpload/showImg/'+id
                            );
                        });

                        $('.passwordTr').hide();
                    } else {
                        Mom.layMsg(result.message);
                    }

                });

            }else{
                var url = Api.admin+"/api/sys/SysUser/form/-1";
                Api.ajaxJson(url, {}, function (result) {
                    if(result.success){
                        // 所属岗位
                        var jobTypeList = result.jobTypeList;
                        Bus.appendOptionsValue('#jobTypeList',jobTypeList,'value','label');
                        //用户角色
                        Bus.appendOptionsValue('#roleName',result.allRoleList,'id','name');
                        /*上传头像*/
                        require(['../js/plugins/webUpLoader/js/webuploader.js'],function(WebUploader){
                            initWebuploader(WebUploader,'/img/sys/SysUpload/upimg?imgPath=img',
                                '#filePicker',
                                "#nameImagePreview",
                                null
                            );
                        });
                        getSubmitFormId();
                    }else{
                        Mom.layMsg(result.message)
                    }
                })
            }

            //表单页面：绑定‘归属公司’点击事件
            $('.changeCompany').click(function () {
                Bus.openOrgSelect('type=1','#companyName', '#companyId', '请选择归属公司');
            });

            /*清除头像*/
            function getSubmitFormId() {
                $('#filePicker').children('div').attr('style','');
                return "#inputForm";
            }

            //上传头像
            function initWebuploader(WebUploader,url,filePicker, ImagePreview,ImgUrl) {
                var $list = $(ImagePreview),//获取文件列表
                    $li = $(
                        '<div id="" class="file-item thumbnail">' +
                        '<img >' +
                        '</div>'
                    );
                $img = $li.find('img');
                $div =$li.find('div');
                $list.append($li);// $list为容器jQuery实例
                var cc=$('#nameImage').val();
                // if(cc==0){
                //     $img.attr('src',null);
                // }else{
                    $img.attr('src',ImgUrl);
                // }
                var uploader = WebUploader.create({
                    // 选完文件后，是否自动上传。
                    auto: true,
                    // // swf文件路径
                    swf: Api.admin+'/js/plugins/webUploader/Uploader.swf',

                    // 文件接收服务端。
                    server: Api.admin+url,
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: {
                        id: filePicker,
                        multiple:false
                    },

                    // 只允许选择图片文件。
                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    },
                    fileNumLimit: 1

                });
                uploader.on('fileQueued', function (file) {
                    // 创建缩略图
                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr('src', src);//设置预览图
                    }, 100, 100); //100x100为缩略图尺寸

                });
                uploader.on( 'uploadSuccess', function( file,response) {
                    $('#nameImage').val(response.saveName);
                });
            }
        },
    };

    $(function(){
        if($('#userIndex').length > 0){
            PageModule.listInit();
        }
        else if($('#userIndexInner').length > 0){
            PageModule.formInit();
    }
    });
});