/**
 * 业务工具类，命名空间为Bus
 * @see 使用方法：Bus.windowOpen()
 * @type {Function}
 * @Auth Qiyh
 * @Data 2018-6-01
 */
var Bus = window.Bus || (function() {

    // 打开一个模态窗体
    var windowOpen = function(url, name, width, height){
        var top=parseInt((window.screen.height-height)/2,10),left=parseInt((window.screen.width-width)/2,10);
        var options="location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,"+
                "resizable=yes,scrollbars=yes,"+"width="+width+",height="+height+",top="+top+",left="+left;
        if(window.showModalDialog) {
            window.showModalDialog(url, name, options);
        }else{
            window.open(url, name, options);
        }
    };

    var windowOpenPost = function(url, params, target){
        var tempform = document.createElement("form");
        tempform.action = url;
        tempform.method = "post";
        tempform.style.display="none";
        if(target) {
            tempform.target = target;
        };
        if(params){
            for (var x in params) {
                var opt = document.createElement("input");
                opt.name = x;
                opt.value = params[x];
                tempform.appendChild(opt);
            }
        }
        var opt = document.createElement("input");
        opt.type = "submit";
        tempform.appendChild(opt);
        document.body.appendChild(tempform);
        tempform.submit();
        document.body.removeChild(tempform);
    };

    var openDialog = function(title, url, width, height, callback){
        if(undefined==width || width==''){
            width = '800px';
        }
        if(undefined==height || height==''){
            height = '500px';
        }
        var btnArr = [];
        if(callback){
            btnArr.push({ btn: '确定', fn: callback });
        }
        var options = {
            btnArr : btnArr
        };
        return openDialogCfg(title, url, width, height, options);
    };

    var openEditDialog = function(title, url, width, height, callback){
        if(title==null || title==''){
            title = '修改';
        }
        var layIndex=openDialog(title, url, width, height, callback || function(layerIdx,layero){
            var p_ = top;//window.parent?window.parent:top;
            var iframeBody = p_.layer.getChildFrame('body', layerIdx);
            var iframeWin = layero.find('iframe')[0].contentWindow; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            //body.find('#inputForm').attr("target",Contabs.getActiveTab().attr("name"));//提交到当前激活的页签,在回调的doSubmit方法中设置
            var flag_ = false;
            //默认回调父窗口的doSubmit()方法
            try{
                flag_=iframeWin.doSubmit(layerIdx, layero);
            }catch(e){window.alert(e.message);}

            return flag_;
        });
        return layIndex;
    };

    var openDialogCfg = function(title, url, width, height, options){
        var p_ = top;//window.parent?window.parent:top;
        var config = {
            type: 2,
            area: [width, height],
            title: title,
            maxmin: true, //开启最大化最小化开关
            content: url,
            btn: []
        };
        config.success = config.success || function(layero, index){
            //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            //var iframeWin = p_.window[layero.find('iframe')[0]['name']];//外部窗口
            var iframeWin = layero.find('iframe')[0].contentWindow; //内部窗口
            //自动高度
            if(height=='auto'){
                p_.layer.iframeAuto(index);
            }
            //加载完成后设置内部的关闭按钮
            $('.closeBtn',iframeWin.document).each(function(i,o){
                var closeBtnStr = $(o).prop("outerHTML");
                var _fun = closeBtnStr.match(/\([^\)]*\)/g);
                if(_fun==null || _fun=='()'){
                    $(o).unbind("click").click(function(){p_.layer.close(index);return false;});
                }
            });
        };
        var btnArr_=[];
        if(options){
            config = $.extend(true,{},config,options);
            //获取按钮数组对象
            if(options.btnArr){
                btnArr_ = options.btnArr.concat();
            }
        }
        btnArr_.push({ btn: '关闭', fn: function(){} });
        $(btnArr_).each(function(i,o){
            config.btn.push(o.btn);
            if(i == btnArr_.length-1){
                config.cancel = function(index, layero){
                    var iframeWin = layero.find('iframe')[0].contentWindow; //内部窗口
                    var fn = o.fn;
                    if(typeof fn == 'string'){
                        fn = iframeWin[fn];
                    }
                    fn(index, layero);
                };
            }
            else{
                config['btn'+(i+1)]=function(index, layero){
                    var iframeWin = layero.find('iframe')[0].contentWindow; //内部窗口
                    var fn = o.fn;
                    if(typeof fn == 'string'){
                        fn = iframeWin[fn];
                    }
                    var flag = fn(index, layero);
                    if(flag == true){
                        setTimeout(function(){p_.layer.close(index)}, 200);//延时0.1秒，对应360 7.1版本bug
                    }
                };
            }
        });
        var layIndex=p_.layer.open(config);
        return layIndex;
    };

    /**
     * 打开树选择窗口
     * @param title[必填]：标题
     * @param apiCfg[必填]：获取tree参数对象{url:'',data:{}}
     * @param options[必填]：树选择配置参数对象
     *      {
     *          treeHtmlUrl[非必填]：要打开的树选择的html,
     *          defaultVals[非必填]：默认值对象{value:'',prop:''}（值和字段）,
     *          multiple[非必填]：是否多选（true/false）
     *          noRoot[非必填]：是否不能选择根节点（true/false）
     *          onlyLeaf[非必填]：是否只能选择叶子节点（true/false）
     *          showSearch[非必填]：是否显示搜索框（true/false）
     *      }
     * @param okFn[必填]：点‘确定’的回调函数，返回选中的值
     * @param clearFn[非必填]：
     */
    var openTreeSelect = function(title, apiCfg, options, okFn, clearFn){
        var btnArr = ['确定'];
        if(clearFn){
            btnArr.push('清除');
        }
        btnArr.push('关闭');
        var treeHtmlUrl = options.treeHtmlUrl||(Mom.basePath+'/common/treeSelect.html');
        var defaultVals = options.defaultVals||'';
        var treeSelParam = {
            multiple: options.multiple||false,
            noRoot: options.noRoot||false,
            onlyLeaf: options.onlyLeaf||false,
            showSearch: options.showSearch||true
        };
        var layerCfg = {
            type: 2,
            btn: btnArr,
            maxmin: false, //开启最大化最小化按钮
            shadeClose: true,
            shade: [0.4, '#000'], //0.1透明度的白色背景
            title: title||'请选择',
            area: ['300px', '424px'],
            content: Mom.extractUrl(treeHtmlUrl,treeSelParam),
            success: function(layero, index){
                var iframeWin = layero.find('iframe')[0].contentWindow; //内部窗口
                iframeWin.setConfig(apiCfg.url, apiCfg.data, defaultVals);
            },
            yes:function (layIdx,layero) {
                var iframeWin = layero.find('iframe')[0].contentWindow;
                var selResult=iframeWin.getCheckValues();//在layer中运行当前弹出页内的getSelectVal方法
                if(selResult.success){
                    var ret = true;
                    if(okFn){
                        //如果有‘确定’的回调函数，则执行自定义回调函数
                        //其他一些自定义校验也可以放在回调函数中
                        ret = okFn(selResult, layIdx, layero);
                    }
                    if(ret){
                        top.layer.close(layIdx);
                    }
                }
            }
        };
        if(clearFn){
            layerCfg.btn2 = function(layIdx, layero){
                clearFn(layIdx, layero);
                return true;//关闭
            }
        }
        return top.layer.open(layerCfg);
    };

    /**
     * 选择公司或部门
     * @param param 参数配置
     * @param name 表单回显文字
     * @param id 表单回显隐藏域
     * @param title 标题
     * @param callback 回调函数
     */
    var openOrgSelect = function(param, name, id, title, callback){
        top.layer.open({
            type: 2,
            maxmin: false, //关闭最大化最小化按钮
            shadeClose: true,
            btn: ['确定', '清除', '取消'],
            shade: [0.4, '#000'], //0.1透明度的白色背景
            title: title||'请选择',
            area: ['300px', '424px'],
            content: Mom.extractUrl('./systemSettings/orgSelect.html',param),
            yes:function (index,layero) {
                var iframeWin = layero.find('iframe')[0];
                var selRows=iframeWin.contentWindow.getSelectVal();//在layer中运行当前弹出页内的getSelectVal方法
                if(selRows && selRows.length>0){
                    var ret = true;
                    if(callback){
                        ret = callback(selRows);
                    }else{
                        var ids='', names = '';
                        $(selRows).each(function(i,o){
                            ids += ','+o.id;
                            names += ','+o.name;
                        });
                        if(ids.length > 0){
                            $(id).val(ids.substr(1));
                            $(name).val(names.substr(1));
                        }
                    }
                    if(ret){
                        top.layer.close(index);
                    }
                }
            },btn2: function(index, layero){
                $(name).val('');
                $(id).val('');
                return true;//关闭
            }
            ,btn3: function(index, layero){
                return true; //关闭
            }
        })
    };

	
    /**
     * 回调函数，在修改和添加时，供openEditDialog调用提交表单。
     * 注意：需要在form的action中写上提交的接口地址
     *      地址的Domain地址可以使用$Api.domain$进行定义
     *      如：action="$Api.admin$/api/User/save"
     */

    window.doSubmit = function(layerIdx, layero){
        if(!Validator.valid(document.forms[0],1.3)){
            return false;
        }
        //自定义校验
        var formObj = $('#inputForm');
        var url = formObj.attr('action');
        var formdata = formObj.serializeJSON();
        Api.ajaxJson(url,JSON.stringify(formdata),function(result){
            if(result.success == true){
                // Mom.layMsg('已成功提交',{time: 1000});
                //关闭弹出层
                top.layer.close(layerIdx);
                //刷新父层
                var frameActive = top.TabsNav.getActiveTab().attr("name");
                var obj = $('#search-btn', top.window.frames[frameActive].document);
                if(obj.length == 0){
                    obj = $('#refresh-btn', top.window.frames[frameActive].document);
                }
                obj.trigger('click');
            }else{
                Mom.layAlert(result.message);
            }
        });
        return false;
    };


    /*
     * 修改数据
     */
    var editCheckedTable = function(title,url,width,height,tableId){
        var len = $(tableId +" tbody tr td input.i-checks:checked").length;
        if(len == 0 ){
            top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
            return;
        }

        if(len > 1 ){
            top.layer.alert('只能选择一条数据!', {icon: 0, title:'警告'});
            return;
        }
        var id =  $(tableId +" tbody tr td input.i-checks:checkbox:checked").attr("id");
        var url = Mom.extractUrl(url, "id="+id);
        openEditDialog(title,url,width, height);
    };

    // 删除多条数据
    function delCheckTable(tit,url,tableId){
        var str="";
        var ids="";
        $(tableId +" tbody tr td input.i-checks:checkbox").each(function(){
            if(true == $(this).is(':checked')){
                str+=","+$(this).attr("id");
            }
        });
        if(str.length>0){
            var data = {
                ids:str.substr(1)
            };
            top.layer.confirm(tit, {icon: 3, title:'系统提示'}, function(index){
                Api.ajaxForm(url,data,function (result) {
                    if(result.success == true){
                        var frameActive = top.TabsNav.getActiveTab().attr("name");
                        var obj = $('#search-btn', top.window.frames[frameActive].document);
                        if(obj.length == 0){
                            obj = $('#refresh-btn', top.window.frames[frameActive].document);
                        }
                        obj.trigger('click');
                        // pageLoad();
                    }else{
                        Mom.layMsg(result.message);
                    }
                });
                top.layer.close(index);
            });
        }else{
            top.layer.alert('请至少选择一条数据!', {icon: 0, title:'警告'});
        }
    }

    var deleteItem = function(mess,url,id,callbackFn){
        var data = id?{ids:id}:{};
        top.layer.confirm(mess, {icon: 3, title:'系统提示'}, function(layerIndex){
            Api.ajaxForm(url,data,function(result){
                if(callbackFn){
                    callbackFn(result, layerIndex);
                }else {
                    if (result.success == true) {
                        var frameActive = top.TabsNav.getActiveTab().attr("name");
                        var obj = $('#search-btn', top.window.frames[frameActive].document);
                        if (obj.length == 0) {
                            obj = $('#refresh-btn', top.window.frames[frameActive].document);
                            if (obj.length == 0) {
                                top.TabsNav.refreshActiveTab();
                            }
                        }
                        obj.trigger('click');
                        top.layer.close(layerIndex);
                    }else{
                        Mom.layAlert(result.message);
                    }
                }
            });
        });
        return false;
    };

    //删除成功后的回调函数
    function deleteCheck(result){
        if(result.success){
            Mom.layMsg('删除成功',{time: 1000});
            setTimeout(function(){
                top.TabsNav.refreshActiveTab();
            },1000)
        }
    }


    /**
     * 用户选择
     * @param dataUrl: 已选择的用户
     * @param multiple: 是否多选
     * @param selectUserCallback
     */
    var openSelUserWin = function(dataUrl, multiple, selectUserCallback){
        multiple = multiple!=undefined?multiple:false;
        var url_=basePath()+'/User/userSelect?multiple='+multiple+'&url='+encodeURIComponent(dataUrl);
        openDialog('选择用户',url_,'800px','600px',false, function(index,layero){
            var innerWindow=layero.find("iframe")[0].contentWindow;
            var retUser=innerWindow.getSelectUsers();
            var userIds = retUser['id'];
            if(userIds==''){
                Mom.layMsg('请选择用户!');
                return false;
            }
            if(multiple==false){
                if(userIds.indexOf(',')>-1){
                    Mom.layMsg('最多只能选择一个用户!');
                    return false;
                }
            }
            else if(selectUserCallback) {
                return selectUserCallback(retUser);
            }
            return true;
        });
    };

    /**
     * 用户选择2
     * @param dataUrl: 已选择的用户
     * @param multiple: 是否多选
     * @param selectUserCallback
     */
    var openSelUserWin2 = function(multiple, checkedVals, params, selectUserCallback){
        multiple = multiple!=undefined?multiple:false;
        params = params||'';
        var _url = basePath()+'/Common/officeTree?type=3&'+params;
        var p_ = top;
        // 正常打开
        p_.layer.open({
            type: 2,
            area: ['300px', '420px'],
            title: "选择用户",
            content: basePath()+'/Common/treeSelect?url='+_url+'&multiple='+multiple+'&checkedVals='+checkedVals,
            btn: ['确定','关闭'],
            yes: function (index, layero) { //或者使用btn1
                var innerWindow=layero.find("iframe")[0].contentWindow;
                var retObj=innerWindow.getSelectValues(multiple, true, true);
                var retSucess = retObj.success;
                if(retSucess==true){
                    var userIds = retObj['id'];
                    if(userIds==''){
                        layMsg('请选择用户!');
                        return false;
                    }
                    if(multiple==false){
                        if(userIds.indexOf(',')>-1){
                            layMsg('最多只能选择一个用户!');
                            return false;
                        }
                    }
                    var userNames = retObj['name'];
                    if(selectUserCallback) {
                        retSucess = selectUserCallback(userIds, userNames, retObj);
                    }
                    if(retSucess != false) {
                        p_.layer.close(index);
                    }
                }
            },
            cancel: function (index) { //或者使用btn2
                //按钮【按钮二】的回调
            }
        });
    };

    //获取字典标签
    var getDictLabel = function(data, value, defaultValue){
        for (var i=0; i<data.length; i++){
            var row = data[i];
            if (row.value == value){
                return row.label;
            }
        }
        return defaultValue;
    };

    //动态添加Select的option
    function createSelect(url,appendEl,valueField, textFile){
        Api.ajaxJson(url,{},function(result){
            if(result.success){
                var rows = result.rows;
				$(appendEl).empty();
                $(appendEl).append('<option value="" selected="selected">--请选择--</option>');
                appendOptionsValue($(appendEl),rows,valueField,textFile);
            }else{
                Mom.layMsg(result.message);
            }
        })
    }

    function resetSelect(obj, blankLabel){
        $(obj).empty();
        blankLabel = blankLabel || '-- 全部 --';
        $(obj).append("<option value=''>"+blankLabel+"</option>");
    }
    /**
     * 动态添加Select的option
     */
    function appendOptionsValue(obj, rows, valueField, textFile){
        if(typeof(obj) == "string"){
            obj = $(obj);
        }
        if(rows && rows.length > 0){
            var options = new Array();
            valueField = valueField||'value';
            textFile = textFile||'label';
            $(rows).each(function(i,o){
                options.push({'value':o[valueField], 'label':o[textFile]});
            });
            appendOptions(obj, options,options.length);
        }
    }
    // 追加select的options
    function appendOptions(obj, options){
        if(options){
            $(options).each(function(i,o){
                $(obj).append("<option value='"+o.value+"'>"+o.label+"</option>");
            });
        }
    }

	/**权限控制通用方法，若无权限则元素被隐藏*/
	function permissionContorl(code_, arr, permitCtrlCallback) {
		getPermission(code_, arr, function(retObj,rows){
			for (var k in retObj) {
				if(retObj[k].permit){
					var eo = null;
					for(var j=0; j<arr.length; j++){
						//找到与之相匹配的元素
						if(arr[j].code == k){
							eo = arr[j];
							break;
						}
					}
					if(eo){
						$(eo.selector).removeClass('hidden').css({'display':'inline-block'});
					}
				}
			}
			if(permitCtrlCallback){
				permitCtrlCallback(retObj,rows);
			}
		});
	}

	/**获取权限工具类*/
	function getPermission(code,arr,callbackFn){
		var retObj = {};
		var url = Api.admin + "/api/sys/SysOperation/currentUserOperation/"+code;
		Api.ajaxJson(url, {} ,function (result) {
			if(result.success){
				var retCoderArr = [], operArr = [];
				$.each(arr,function(j,o){
					$(o.selector).hide();
					operArr.push(o.code);
				});
				for(var i=0;i<result.rows.length;i++){
					retCoderArr.push(result.rows[i].code);
				}

				for(var j = 0;j<operArr.length;j++){
					var o = operArr[j], permit = false;
					if(retCoderArr.contains(o)){
						permit = true;
					}
					retObj[o] = {'permit':permit};
					/*retObj[o].permit = permit;
					 retObj[o] = {'permit':permit};*/
				}
				if(callbackFn){
					callbackFn(retObj,result.rows);
				}
			}else{
				Mom.layAlert("查询权限失败！"+result.message)
			}
		});
	}


    return {
        //打开模态窗口
        windowOpen: windowOpen,
        windowOpenPost: windowOpenPost,
        //打开layer窗口
        openDialog: openDialog,
        openEditDialog: openEditDialog,
        openDialogCfg: openDialogCfg,
        openTreeSelect: openTreeSelect,
        delCheckTable: delCheckTable,
        deleteItem: deleteItem,
        editCheckedTable: editCheckedTable,

        //用户选择窗口
        openSelUserWin: openSelUserWin,
        openSelUserWin2: openSelUserWin2,
        //组织机构选择
        openOrgSelect: openOrgSelect,
        //获取字典的label
        getDictLabel: getDictLabel,

        //下拉框操作方法
        createSelect: createSelect,
        resetSelect: resetSelect,
        appendOptionsValue: appendOptionsValue,
        appendOptions: appendOptions,

		//权限控制
		permissionContorl: permissionContorl,
		//获取权限
		getPermission: getPermission,

    }
})();