require(['/js/zlib/app.js'], function(App) {

	 var PageModule = {
	 	init:function(){
		 	//获取级别
	        PageModule.loadRank();
	        //获取工序
        	PageModule.loadProcess();
        	//获取事件数据
        	PageModule.loadREvent();
        	//获取原因数据
        	PageModule.loadRCause();
        	//pageLoad加载列表
			 require(['Page'], function () {  //加载分页js
			 	require(['datetimepicker'], function () {//加载时间插件
			 		     $("#startDateParam,#endDateParam").val("").datetimepicker({
                                bootcssVer: 3,        //显示箭头，部分如不显示箭头要加这个
                                format: "yyyy-mm-dd",  //保留到日
                                showMeridian: true,     //显示上、下午
                                language: "zh-CN",   //中文显示
                                minView: "3",    //月视图
                                autoclose: true,  //选择时间后自动隐藏
                                clearBtn: true,
                                todayBtn: true
                            });
                         $("#endDateParam,#startDateParam").on('change', function () {
                              if ($('#endDateParam').val() < $('#startDateParam').val() && $('#endDateParam').val() != '') {
                                 Mom.layMsg('结束时间应大于起始时间，请重新选择');
                                 $('#endDateParam').val('')
                               }
                       });
                    window.pageLoad = function(){
                    	var data = {
                    		type:$("#type option:selected").val(),  //事件类型
                    		proc:$("#proc option:selected").val(), //工序
                    		event:$("#event option:selected").val(),  //事件
                    		grade:$("#grade option:selected").val(),   //等级
                    		cause:$("#cause option:selected").val(),   //原因
                    		startTime:$("#startDateParam").val(),      //开始时间
							endTime:$("#endDateParam").val()     //结束时间
                     };
	                Page.init(Api.aps+"/api/oper/ManageControl/page",data,true,function(tableData){
                    	PageModule.createTable(tableData);
	                  })
                    };
			 window.pageLoad()
			 	})
			 })

	 	},
	 	//等级
	 	loadRank:function(){
	 		Api.ajaxForm(Api.admin+'/api/sys/SysDict/type/directiveLeaveyType',{},function (result) {
	            if(result.success){
	                var rows = result.rows;
	                Bus.appendOptionsValue($('#grade'), rows, 'value', 'label');
	            }else{
	                Mom.layMsg(result.message);
	            }
        	});
	 	},
	 	//工序
	 	loadProcess:function(){
	 		id = Mom.getCookie("loginUserid")
        	Api.ajaxForm(Api.admin+'/api/sys/SysAuthProperty/getAttributeValue/'+id+'/GXJQ/syswp',{},function (result) {
	            if(result.success){
	                var rows = result.rows;
	                Bus.appendOptionsValue($('#proc'), rows, 'value', 'name');
	            }else{
                    Mom.layMsg(result.message);
	            }
        	});
	 	},
	 	//事件
	 	loadREvent:function(){
	 		Api.ajaxForm(Api.admin+'/api/sys/SysDict/type/accidentEventType',{},function (result) {
	            if(result.success){
	                var rows = result.rows;
	                Bus.appendOptionsValue($('#event'), rows, 'value', 'label');
	            }else{
                    Mom.layMsg(result.message);
	            }
        	});
	 	},
	 	//原因
	 	loadRCause:function(){
	 		Api.ajaxForm(Api.admin+'/api/sys/SysDict/type/accidentCauseType',{},function (result) {
	            if(result.success){
	                var rows = result.rows;
	                Bus.appendOptionsValue($('#cause'), rows, 'value', 'label');
	            }else{
                    Mom.layMsg(result.message);
	            }
        	});
	 	},
	 	//创建table
	 	createTable:function(tableData){
	 			 $("#treeTable").dataTable({
                        "bPaginate": false,
                        "bAutoWidth": false,
                        "bDestroy": true,
                        "paging": false,
                        "bProcessing": true,
                        "searching": false, //禁用aa原生搜索
                        "info": false,  //底部文字
                        "order": [],
                        "oLanguage": dataTableLang,
                        "data": tableData,
                        "ordering": false,
                        "aoColumns": [
                        	{"data": "id", 'sClass': "alignCenter id"},
                            {"data": null, 'sClass': "alignCenter "},
                            {"data": "event", 'sClass': "alignCenter"},
                            {"data": "cause", 'sClass': "alignCenter"},
                            {"data": "reportUser", 'sClass': "alignCenter"},
                            {"data": "reportTime", 'sClass': "alignCenter"},
                            {"data": "status", 'sClass': "alignCenter",
                            	"render":function (data,type,row,meta) {
                        			if(row.status == "0"){
                            			var setText = "上报";
                            			var  html = "<span class='newspapers'>"+setText+"</span>"
                        			}else if(row.status == "1"){
			                            var setText = "处理中";
			                            var html = "<span class='dispose'>"+setText+"</span>"
                        			}else{
			                            var setText = "关闭";
			                            var  html = "<span class='closes'>"+setText+"</span>"
                        			};
                        		return html
                    			}
                            },
                            {"data": null, 'sClass': "alignCenter",
                            	"render":function (data,type,row,meta) {
                        		       var html ;
                       				   if(row.status == "0" || row.status == "1"){
                            				html =  "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >" +
				                                    "<a class='btn btn-success btn-xs btn-change' ><i class='fa icon-change'></i>修改</a >"+
				                                    "<a class='btn btn-success btn-xs btn-delete' ><i class='fa fa-trash-o'></i>删除</a >"
                        				}else{
				                            html =  "<a class='btn btn-info btn-xs btn-check' ><i class='fa fa-search-plus'></i>查看</a >" +
				                                    "<a class='btn btn-success btn-xs btn-delete' ><i class='fa fa-trash-o'></i>删除</a >"
                        				}
                        				return html;
                    			}
                            },
                        ],
                        "fnDrawCallback" : function(){
                			this.api().column(1).nodes().each(function(cell, i) {
                    		cell.innerHTML =  i + 1;
                		});
            			},
                    });
                    renderIChecks();
                    PageModule.btneventHandler();
	 		},
	 	//列表按钮加载事件
	 	btneventHandler:function(){
	 		//创建
	 		$("#btn-add").unbind("click").on("click",function(){
	 			location.href = "./productioncontrolInner.html";
	 		})
	 		//查看
	 		$(".btn-check").unbind("click").on("click",function(){
	 			var id = $(this).parents('tr').find('.id').text();
	 			location.href = "./productioncontrilCheck.html?id="+id;
	 		})
	 		//修改
	 		$(".btn-change").unbind("click").on("click",function(){
	 			var id = $(this).parents('tr').find('.id').text();
	 			location.href = "./productioncontrolInner.html?id="+id;
	 		})
	 		//删除
	 		$(".btn-delete").unbind("click").on("click",function(){
	 			var id = $(this).parents('tr').find('.id').text();
				Bus.deleteItem("确定要删除",Api.aps+"/api/oper/ManageControl/deleteBatch",id)
	 		})
	 	},
	 	//查看
		checkInit:function(){
			PageModule.getDatamsg();
            //获取级别
            PageModule.loadRank();
            //获取工序
            PageModule.loadProcess();
            //获取事件数据
            PageModule.loadREvent();
            //获取原因数据
            PageModule.loadRCause();
			//返回按钮
			$("#back-btn").unbind("click").on("click",function(){
	 			location.href = "./chattelsControl.html";
			});
			//渲染下拉，以及内容
			PageModule.getDatamsg();
			$("select").each(function (index,item) {
				$(item).attr("disabled",true)
            })
		},
		//修改  新增
		createNew:function(){
			var id = Mom.getUrlParam("id");
			//PageModule.getDatamsg();

			//获取级别
	        PageModule.loadRank();
	        //获取工序
        	PageModule.loadProcess();
        	//获取事件数据
        	PageModule.loadREvent();
        	//获取原因数据
        	PageModule.loadRCause();


			//页面创建的时候
			function createNew() {
				//用于事故描述以及解决方案
				var str =  "<div class='newbox'>" +
					"<textarea class='textarea'></textarea>"+
					"<input type='button' class='btn bg-1ab394 btnaddr' value='+'>" +
					"<input type='button' class='btn btnremove' value='-'>" +
					"</div>";
				$("#SGMS").append($(str));
				$("#JJFA").append($(str));
				$("#ZXGZ").append($(str));
			}
			//如果有数据就渲染
			function msgCreact(data) {
				var ShiftMainMap  = data.groupMap;
				var keyarrs = ["SGMS","JJFA","ZXGZ"];
				for(var i=0;i<keyarrs.length;i++){
					for(var item in ShiftMainMap){
						if(item == keyarrs[i]){
							for(var j=0;j<ShiftMainMap[item].length;j++){
								//var str = "<div>" +
								//	"<i class='fa fa-quote-left'></i>"+
								//	"<span class='context'>"+ShiftMainMap[item][j].content+"</span>" + "<span class='time'>" + ShiftMainMap[item][j].createDate + "</span>" +
								//	"<i class='fa fa-quote-right'></i>";
								//"</div>"

								var str = "<div>"+
									"<i class='fa fa-quote-left'></i>"+
									"<input type='text' class='context inputc' value="+ShiftMainMap[item][j].content+" disabled='disabled' >"+
									"<i class='fa fa-quote-right'></i>"+
									"</div>"
								$("#"+keyarrs[i]).append(str)
							}
						}
					}
				}
			}

			//点击创建
			function clickNew() {
				var str = "<div class='newbox'>" +
					"<textarea name='safe' class='context'></textarea>"+
					"<input type='button' class='btn bg-1ab394 btnaddr btnadd4' value='+'>" +
					"<input type='button' class='btn btnremove btnadd4' value='-'>" +
					"</div>";
				$(".addbtn1").click(function () {
					$("#SGMS").append(str)
				});
				$(".addbtn2").click(function () {
					$("#JJFA").append(str);
				});
				$(".addbtn3").click(function () {
					$("#ZXGZ").append(str)
				});
			}
			$('.big').on('click', '.btnaddr', function () {
				var str = "<div class='newbox'>" +
					"<textarea name='safe' class='context'></textarea>" +
					"<input type='button' class='btn bg-1ab394 btnaddr btnadd4' value='+'>" +
					"<input type='button' class='btn btnremove btnadd4' value='-'>" +
					"</div>";
				$(this).parents('.newbox').after(str);
			});
			//减号按钮
			$('.big').on('click', '.btnremove', function () {
				//var len = $(this).parents(".big").find("textarea").length;
				//if(len<=1){
				//	top.layer.alert("至少填写一条");
				//}else{
				//	$(this).parents('.newbox').remove();
				//}
				$(this).parents('.newbox').remove();

			});

			//ajax获取数据
			function loadData(id) {
				var data = {
					id:id
				};
				Api.ajaxJson(Api.aps+ "/api/oper/ManageControl/form",JSON.stringify(data),function (result) {
					console.log(result,21212);
					if(result.success==true){
						changeselect(result);
						msgCreact(result);
					}else{
						Mom.layAlert(result.message);
					}
				})
			}



			//查看和修改时select的显示
			function changeselect(data) {
				var selecteds = data.manageControl;
				$("#event option").each(function () {
					if(selecteds.event == $(this).attr('value')){
						$(this).attr("selected",true);
					}
				});
				$("#type option").each(function () {
					if(selecteds.type == $(this).attr('value')){
						$(this).attr("selected",true);
					}
				});
				$("#proc option").each(function () {
					if(selecteds.proc == $(this).attr('value')){
						$(this).attr("selected",true);
					}
				});
				$("#cause option").each(function () {
					if(selecteds.cause == $(this).attr('value')){
						$(this).attr("selected",true);
					}
				});
				$("#grade option").each(function () {
					if(selecteds.grade == $(this).attr('value')){
						$(this).attr("selected",true);
					}
				})
			}







			if(id == null){
				createNew();  //页面加载时创建页面
				clickNew();
                //PageModule.createNewtext();
                //$(".btnaddr").unbind("click").on("click",function(){
                //    var item = $(this).parents(".big").next(".datamsg");
                //    PageModule.createtextInput(item);
                //});
			}else{
				loadData(id); //ajax得到数据
				// clickHandler()
				clickNew()
                //PageModule.getDatamsg();
                //$(".btnaddr").unbind("click").on("click",function(){
                //    var item = $(this).parents(".big").next(".datamsg");
                //    PageModule.createtextInput(item);
                //});
			}
			//返回
			$("#back-btn").on("click",function(){
				location.href = "./chattelsControl.html";
			});
			//保存
			$("#add-btn").unbind("click").on("click",function(){
				var arr = ["type","event","proc","cause","grade"];
				for(var i=0;i<arr.length;i++){
					if($("#"+arr[i]).find("option:selected").val() == ""){
						var titleTexe = $("#"+arr[i]).prev(".title").text()
                        Mom.layMsg('请选择'+titleTexe+'信息再进行保存');
						return;
					}
				}
                if($(".SGMS .context").val() == ""){
                    Mom.layMsg('请填写事故描述信息');
                    return;
                }
                var data = PageModule.getmsgdata();
                console.log(data)
               	Api.ajaxForm(Api.aps+"/api/oper/ManageControl/save",data,function (result) {
					if(result.success){
                        Mom.layMsg("保存成功");
					}
                })
			});
			//关闭事故单
			$("#close-btn").unbind("click").on("click",function () {
                var arr = ["type","event","proc","cause","grade"];
                for(var i=0;i<arr.length;i++){
                    if($("#"+arr[i]).find("option:selected").val() == ""){
                        var titleTexe = $("#"+arr[i]).prev(".title").text()
                        Mom.layMsg('请选择'+titleTexe+'信息再进行保存');
                        return;
                    }
                }
                if($(".SGMS .context").val() == ""){
                    Mom.layMsg('请填写事故描述信息');
                    return;
                }
                var data = PageModule.getmsgdata();
                data.status = "2";
                Api.ajaxForm(Api.aps+"/api/oper/ManageControl/save",data,function (result) {
                    if(result.success){
                        Mom.layMsg("操作成功");
                    }
                })
            })
		},
		//渲染下拉框
		selectedmsg:function(datamsg){
			var arr = [];
			$("select").each(function(index,item){
				arr.push($(item).attr("id"))
			});
			for(var items in datamsg){
				for(var i=0;i<arr.length;i++){
					if(items == arr[i]){
						$("#"+arr[i]).find("option").each(function (index,item) {
	            			if((datamsg[items]) == $(item).attr('value')){
	                			$(this).attr("selected",true);
	            			}
        				});
					}
				}
			}
		},
		//渲染信息
		eventmsg:function(groupMap){
			console.log(groupMap)
			for(var item in groupMap){
				var content;
				for(var i=0;i<groupMap[item].length;i++){ 
					content = "<div class='datamsg'>"+
								"<i class='fa fa-quote-left'></i>"+
									"<input type='text' class='context inputc' value="+groupMap[item][i].content+" disabled='disabled' >"+
								"<i class='fa fa-quote-right'></i>"+
								"</div>"
				}
				$("."+item).append(content);
			  }
			},
		//通过id获取数据信息
		getDatamsg:function(){
				var id = Mom.getUrlParam("id");
				var data = {
					id:id
					}
				Api.ajaxJson(Api.aps+"/api/oper/ManageControl/form",JSON.stringify(data),function(result){
					if(result.success){
						PageModule.selectedmsg(result.manageControl)
						PageModule.eventmsg(result.groupMap)
					}
				})
		},
	 	////点击创建输入框
	 	//createtextInput:function(item){
	 	//	var textInput = "<div class='textinput'>"+
	 	//						"<textarea class='context'></textarea>"+
	 	//						 "<input type='button' class='btn btnadd' value='+'/>"+
	 	//						 "<input type='button' class='btn btnremove' value='-'/>"+
	 	//					 "</div>"
	 	//	$(item).append(textInput);
	 	//	$(".btnadd").on("click",function(){
			//	$(this).parent(".textinput").after(textInput);
			//	PageModule.createInput(textInput,)
			//})
	 	//	$(".btnremove").each(function(index,item){
			//	$(item).on("click",function(){
			//		$(this).parent(".textinput").remove()
			//	})
			//})
	 	//},
			 //新增创建输入框
		//createNewtext:function () {
		//		var itemArr = ["SGMS","JJFA","ZXGZ"];
		//		var itemStr = "<div class='textinput'>"+
         //           "<textarea class='context'></textarea>"+
         //           "<input type='button' class='btn btnadd' value='+'/>"+
         //           "<input type='button' class='btn btnremove' value='-'/>"+
         //           "</div>"
		//		for(var i=0;i<itemArr.length;i++){
		//			$("."+itemArr[i]).append(itemStr);
		//		}
        //},
		//createInput:function(textInput){
		//	$(".btnadd").each(function(index,item){
		//		$(item).on("click",function(){
		//			$(this).parent(".textinput").after(textInput)
		//		})
		//	})
		//	$(".btnremove").each(function(index,item){
		//		$(item).on("click",function(){
		//			$(this).parent(".textinput").remove()
		//		})
		//	})
		//},
		//保存获取关闭事故单获取到事件信息
		getmsgdata:function(){
			var SGMS=[];
			var JJFA = [];
			var ZXGZ = [];
			//事故描述
			$(".SGMS .context").each(function(index,item){
				var obj = {
					content:$(item).val(),
					id:Mom.getUrlParam("id") || '',
					controlId:Mom.getUrlParam("id") || '',
					eventFlag:"SGMS"
				}
                SGMS.push(obj)
			})
			//解决方案
			$(".JJFA .context").each(function (index,item) {
                var obj = {
                    content:$(item).val(),
                    id:Mom.getUrlParam("id") || '',
                    controlId:Mom.getUrlParam("id") || '',
                    eventFlag:"JJFA"
                }
                JJFA.push(obj)
            })
			//执行跟踪
            $(".ZXGZ .context").each(function (index,item) {
                var obj = {
                    content:$(item).val(),
                    id:Mom.getUrlParam("id") || '',
                    controlId:Mom.getUrlParam("id") || '',
                    eventFlag:"ZXGZ"
                }
                ZXGZ.push(obj)
            })
			var data = {
				id:Mom.getUrlParam("id") || '',
                event:$("#event option:selected").val(),
                cause:$("#cause option:selected").val(),
                grade:$("#grade option:selected").val(),
                proc:$("#proc option:selected").val(),
				type:$("#type option:selected").val(),
                SGMS_dataArr:JSON.stringify(SGMS),
                JJFA_dataArr:JSON.stringify(JJFA),
                ZXGZ_dataArr:JSON.stringify(ZXGZ),
			};
            return data
		},

	 	 };
	 	//初始化加载
	 $(function(){
	      if($('#productioncontrol').length > 0){
            PageModule.init();
            //查看
        }else if($("#productioncontrilCheck").length>0){
			 PageModule.checkInit();
			 //修改  新增
        }else if($("#productioncontrolInner").length>0){
        	 PageModule.createNew()
        }
	})
});

