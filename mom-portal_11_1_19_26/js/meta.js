(function(){
    //获取上下文路径
    var basePath = function(){
        var obj=window.location;
        // var contextPath=obj.pathname.split("/")[1];
        // var path=obj.protocol+"//"+obj.host+"/"+contextPath;
        var path=obj.protocol+"//"+obj.host;
        return path;
    };

     window.include = function(file) {
        var files = typeof file == "string" ? [file] : file;
        var path = basePath();
        for (var i = 0; i < files.length; i++){
            var name = files[i].replace(/^\s|\s$/g, "");
            if(name.length == 0) continue;
            var ext = name.substr(name.lastIndexOf('.')+1).toLowerCase();
            var fileref;
            var fullName = path+name+'?r='+(new Date()).getTime();
            if(ext == "css"){
                fileref = document.createElement('link');
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", fullName);
            }else{
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", fullName);
            }
            if(fileref){
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(fileref);
            }
        }
    };
    include([
        '/js/plugins/bootstrap/css/bootstrap.min.css',
        '/js/plugins/font-awesome/css/font-awesome.min.css',
        '/js/plugins/icheck/skins/flat/green.css',
        '/js/plugins/select2/dist/css/select2.min.css',
        '/js/plugins/datetimepicker/css/bootstrap-datetimepicker.css',
        '/css/common.css'
    ]);

})();
