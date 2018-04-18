!function(a,b){"use strict";function c(a,c){var d=this;c=b.extend({breadcrumbElement:"div.ccm-search-results-breadcrumb.ccm-file-manager-breadcrumb",bulkParameterName:"fID",searchMethod:"get",appendToOuterDialog:!0,selectMode:"multiple"},c),d.currentFolder=0,d.interactionIsDragging=!1,d.$breadcrumb=b(c.breadcrumbElement),d._templateFileProgress=_.template('<div id="ccm-file-upload-progress" class="ccm-ui"><div id="ccm-file-upload-progress-bar"><div class="progress progress-striped active"><div class="progress-bar" style="width: <%=progress%>%;"></div></div></div></div>'),ConcreteAjaxSearch.call(d,a,c),ConcreteTree.setupTreeEvents(),d.setupEvents(),d.setupAddFolder(),d.setupFolderNavigation(),d.setupFileUploads(),d.setupFileDownloads()}c.prototype=Object.create(ConcreteAjaxSearch.prototype),c.prototype.setupRowDragging=function(){var a=this,c=a.$element.find("tr[data-file-manager-tree-node-type!=file_folder]"),d=navigator.appVersion,e=/android/gi.test(d),f=/iphone|ipad|ipod/gi.test(d),g=e||f||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);g||(a.$element.find("tr[data-file-manager-tree-node-type]").each(function(){var d,e=b(this);switch(b(this).attr("data-file-manager-tree-node-type")){case"file_folder":d="ccm-search-results-folder";break;case"file":d="ccm-search-results-file"}d&&e.draggable({delay:300,start:function(d){a.interactionIsDragging=!0,b("html").addClass("ccm-search-results-dragging"),c.css("opacity","0.4"),d.altKey&&a.$element.addClass("ccm-search-results-copy"),a.$element.find(".ccm-search-select-hover").removeClass("ccm-search-select-hover"),b(window).on("keydown.concreteSearchResultsCopy",function(b){18==b.keyCode?a.$element.addClass("ccm-search-results-copy"):a.$element.removeClass("ccm-search-results-copy")}),b(window).on("keyup.concreteSearchResultsCopy",function(b){18==b.keyCode&&a.$element.removeClass("ccm-search-results-copy")})},stop:function(){b("html").removeClass("ccm-search-results-dragging"),b(window).unbind(".concreteSearchResultsCopy"),c.css("opacity",""),a.$element.removeClass("ccm-search-results-copy"),a.interactionIsDragging=!1},revert:"invalid",helper:function(){var c=a.$element.find(".ccm-search-select-selected");return b('<div class="'+d+' ccm-draggable-search-item"><span>'+c.length+"</span></div>").data("$selected",c)},cursorAt:{left:-20,top:5}})}),a.$element.find("tr[data-file-manager-tree-node-type=file_folder], ol[data-search-navigation=breadcrumb] a[data-file-manager-tree-node]").droppable({tolerance:"pointer",hoverClass:"ccm-search-select-active-droppable",drop:function(c,d){var e=d.helper.data("$selected"),f=[],g=b(this).data("file-manager-tree-node"),h=c.altKey;e.each(function(){var a=b(this),c=a.data("file-manager-tree-node");c==g?e=e.not(this):f.push(b(this).data("file-manager-tree-node"))}),0!==f.length&&(h||e.hide(),new ConcreteAjaxRequest({url:CCM_DISPATCHER_FILENAME+"/ccm/system/tree/node/drag_request",data:{ccm_token:a.options.upload_token,copyNodes:h?"1":0,sourceTreeNodeIDs:f,treeNodeParentID:g},success:function(b){h||a.reloadFolder(),ConcreteAlert.notify({message:b.message,title:b.title})},error:function(a){e.show();var b=a.responseText;a.responseJSON&&a.responseJSON.errors&&(b=a.responseJSON.errors.join("<br/>")),ConcreteAlert.dialog(ccmi18n.error,b)}}))}}))},c.prototype.setupBreadcrumb=function(a){var c=this;if(a.breadcrumb&&(c.$breadcrumb.html(""),a.breadcrumb.length)){var d=b('<ol data-search-navigation="breadcrumb" class="breadcrumb" />');b.each(a.breadcrumb,function(a,e){var f="";e.active&&(f=' class="active"');var g=b(b.parseHTML('<a data-file-manager-tree-node="'+e.folder+'" href="'+e.url+'"></a>'));g.text(e.name),b("<li"+f+'><a data-file-manager-tree-node="'+e.folder+'" href="'+e.url+'"></a></li>').append(g).appendTo(d),d.find("li.active a").on("click",function(a){if(a.stopPropagation(),a.preventDefault(),e.menu){var f=b(e.menu);c.showMenu(d,f,a)}})}),d.appendTo(c.$breadcrumb),d.on("click.concreteSearchBreadcrumb","a",function(){return c.loadFolder(b(this).attr("data-file-manager-tree-node"),b(this).attr("href")),!1})}},c.prototype.setupFileDownloads=function(){var a=this;b("#ccm-file-manager-download-target").length?a.$downloadTarget=b("#ccm-file-manager-download-target"):a.$downloadTarget=b("<iframe />",{name:"ccm-file-manager-download-target",id:"ccm-file-manager-download-target"}).appendTo(document.body)},c.prototype.setupFileUploads=function(){var a=this,c=b("#ccm-file-manager-upload"),d=c.data("image-max-width"),e=c.data("image-max-height"),f=d>0&&e>0,g=c.data("image-quality"),h=[],i=[],j=_.template("<ul><% _(errors).each(function(error) { %><li><strong><%- error.name %></strong><p><%- error.error %></p></li><% }) %></ul>"),k={url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/upload",dataType:"json",disableImageResize:!f,imageQuality:g>0?g:85,imageMaxWidth:d>0?d:1920,imageMaxHeight:e>0?e:1080,error:function(a){var b=a.responseText,c=this.files[0].name;try{b=jQuery.parseJSON(b).errors,_(b).each(function(a){h.push({name:c,error:a})})}catch(a){h.push({name:c,error:b})}},progressall:function(c,d){var e=parseInt(d.loaded/d.total*100,10);b("#ccm-file-upload-progress-wrapper").html(a._templateFileProgress({progress:e}))},start:function(){h=[],b("<div />",{id:"ccm-file-upload-progress-wrapper"}).html(a._templateFileProgress({progress:100})).appendTo(document.body),b.fn.dialog.open({title:ccmi18n_filemanager.uploadProgress,width:400,height:50,onClose:function(a){a.jqdialog("destroy").remove()},element:b("#ccm-file-upload-progress-wrapper"),modal:!0})},done:function(a,b){i.push(b.result[0])},stop:function(){jQuery.fn.dialog.closeTop(),h.length?ConcreteAlert.dialog(ccmi18n_filemanager.uploadFailed,j({errors:h})):(a._launchUploadCompleteDialog(i),i=[])}};c.fileupload(k),c.bind("fileuploadsubmit",function(b,c){c.formData={currentFolder:a.currentFolder,ccm_token:a.options.upload_token}}),b("a[data-dialog=add-files]").on("click",function(c){c.preventDefault(),b.fn.dialog.open({width:620,height:500,modal:!0,title:ccmi18n_filemanager.addFiles,href:CCM_DISPATCHER_FILENAME+"/tools/required/files/import?currentFolder="+a.currentFolder,onClose:function(){a.refreshResults()}})})},c.prototype.refreshResults=function(a){var b=this;b.loadFolder(this.currentFolder,!1,!0)},c.prototype._launchUploadCompleteDialog=function(a){var b=this;c.launchUploadCompleteDialog(a,b)},c.prototype.setupFolders=function(a){var c=this,d=c.$element.find("tbody tr");a.folder&&(c.currentFolder=a.folder.treeNodeID),c.$element.find("tbody tr").on("dblclick",function(){var a=d.index(b(this));if(a>-1){var e=c.getResult().items[a];e&&e.isFolder&&c.loadFolder(e.treeNodeID)}})},c.prototype.setupEvents=function(){var a=this;ConcreteEvent.subscribe("AjaxFormSubmitSuccess",function(b,c){"add-folder"!=c.form&&"move-to-folder"!=c.form||a.reloadFolder()}),ConcreteEvent.unsubscribe("FileManagerAddFilesComplete"),ConcreteEvent.subscribe("FileManagerAddFilesComplete",function(b,c){a._launchUploadCompleteDialog(c.files)}),ConcreteEvent.unsubscribe("FileManagerDeleteFilesComplete"),ConcreteEvent.subscribe("FileManagerDeleteFilesComplete",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("ConcreteTreeUpdateTreeNode.concreteTree"),ConcreteEvent.subscribe("ConcreteTreeUpdateTreeNode.concreteTree",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("FileManagerJumpToFolder.concreteTree"),ConcreteEvent.subscribe("FileManagerJumpToFolder.concreteTree",function(b,c){a.loadFolder(c.folderID)}),ConcreteEvent.unsubscribe("ConcreteTreeDeleteTreeNode.concreteTree"),ConcreteEvent.subscribe("ConcreteTreeDeleteTreeNode.concreteTree",function(b,c){a.reloadFolder()}),ConcreteEvent.unsubscribe("SavedSearchCreated"),ConcreteEvent.subscribe("SavedSearchCreated",function(b,c){a.ajaxUpdate(c.search.baseUrl,{})})},c.prototype.setupImageThumbnails=function(){b(".ccm-file-manager-list-thumbnail[data-hover-image]").each(function(){var a=b(this),c=new Image;c.src=a.data("hover-image"),a.popover({animation:!0,html:!0,content:'<img class="img-responsive" src="'+c.src+'" alt="Thumbnail"/>',container:"#ccm-dashboard-content",placement:"auto",trigger:"hover"})})},c.prototype.showMenu=function(a,b,c){var d=this,e=new ConcreteFileMenu(a,{menu:b,handle:"none",container:d});e.show(c)},c.prototype.activateMenu=function(a){var c=this;if(c.getSelectedResults().length>1&&a.find("a").on("click.concreteFileManagerBulkAction",function(a){var d=b(this).attr("data-bulk-action"),e=b(this).attr("data-bulk-action-type"),f=[];b.each(c.getSelectedResults(),function(a,b){f.push(b.fID)}),c.handleSelectedBulkAction(d,e,b(this),f)}),"choose"!=c.options.selectMode){var d=a.find("a[data-file-manager-action=clear]").parent();d.next("li.divider").remove(),d.remove()}},c.prototype.setupBulkActions=function(){var a=this;a.$element.on("click","button.btn-menu-launcher",function(c){var d=a.getResultMenu(a.getSelectedResults());if(d){d.find(".dialog-launch").dialog();var e=d.find("ul");e.attr("data-search-file-menu",d.attr("data-search-file-menu")),b(this).parent().find("ul").remove(),b(this).parent().append(e);var f=new ConcreteFileMenu;f.setupMenuOptions(b(this).next("ul")),ConcreteEvent.publish("ConcreteMenuShow",{menu:a,menuElement:b(this).parent()})}})},c.prototype.handleSelectedBulkAction=function(a,c,d,e){var f=this,g=[];"choose"==a?(ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:e}),ConcreteEvent.publish("FileManagerSelectFile",{fID:e})):"download"==a?(b.each(e,function(a,b){g.push({name:"item[]",value:b})}),f.$downloadTarget.get(0).src=CCM_TOOLS_PATH+"/files/download?"+jQuery.param(g)):ConcreteAjaxSearch.prototype.handleSelectedBulkAction.call(this,a,c,d,e)},c.prototype.reloadFolder=function(){this.loadFolder(this.currentFolder)},c.prototype.setupAddFolder=function(){var a=this;b("a[data-launch-dialog=add-file-manager-folder]").on("click",function(c){b("div[data-dialog=add-file-manager-folder] input[name=currentFolder]").val(a.currentFolder),b("div[data-dialog=add-file-manager-folder] input[name=folderName]").val(""),jQuery.fn.dialog.open({element:"div[data-dialog=add-file-manager-folder]",modal:!0,width:320,title:"Add Folder",height:"auto"}),b("div[data-dialog=add-file-manager-folder]").on("dialogopen",function(){var a=b(this);a.off("dialogopen"),a.find("[autofocus]").focus()}),c.preventDefault()})},c.prototype.setupFolderNavigation=function(){b("a[data-launch-dialog=navigate-file-manager]").on("click",function(a){a.preventDefault(),jQuery.fn.dialog.open({width:"560",height:"500",modal:!0,title:ccmi18n_filemanager.jumpToFolder,href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/jump_to_folder"})})},c.prototype.hoverIsEnabled=function(a){var b=this;return!b.interactionIsDragging},c.prototype.updateResults=function(a){var c=this;ConcreteAjaxSearch.prototype.updateResults.call(c,a),c.setupFolders(a),c.setupBreadcrumb(a),c.setupRowDragging(),c.setupImageThumbnails(),"choose"==c.options.selectMode&&(c.$element.unbind(".concreteFileManagerHoverFile"),c.$element.on("mouseover.concreteFileManagerHoverFile","tr[data-file-manager-tree-node-type]",function(){b(this).addClass("ccm-search-select-hover")}),c.$element.on("mouseout.concreteFileManagerHoverFile","tr[data-file-manager-tree-node-type]",function(){b(this).removeClass("ccm-search-select-hover")}),c.$element.unbind(".concreteFileManagerChooseFile").on("click.concreteFileManagerChooseFile","tr[data-file-manager-tree-node-type=file]",function(a){return ConcreteEvent.publish("FileManagerBeforeSelectFile",{fID:b(this).attr("data-file-manager-file")}),ConcreteEvent.publish("FileManagerSelectFile",{fID:b(this).attr("data-file-manager-file")}),c.$downloadTarget.remove(),!1}),c.$element.unbind(".concreteFileManagerOpenFolder").on("click.concreteFileManagerOpenFolder","tr[data-file-manager-tree-node-type=search_preset],tr[data-file-manager-tree-node-type=file_folder]",function(a){a.preventDefault(),c.loadFolder(b(this).attr("data-file-manager-tree-node"))}))},c.prototype.loadFolder=function(a,c,d){var e=this,f=e.getSearchData();if(c)e.options.result.baseUrl=c;else var c=e.options.result.baseUrl;f.push({name:"folder",value:a}),e.options.result.filters&&b.each(e.options.result.filters,function(a,b){var c=b.data;f.push({name:"field[]",value:b.key});for(var d in c)f.push({name:d,value:c[d]})}),d&&(f.push({name:"ccm_order_by",value:"folderItemModified"}),f.push({name:"ccm_order_by_direction",value:"desc"})),e.currentFolder=a,e.ajaxUpdate(c,f),e.$element.find("#ccm-file-manager-upload input[name=currentFolder]").val(e.currentFolder)},c.prototype.getResultMenu=function(a){var b=this,c=ConcreteAjaxSearch.prototype.getResultMenu.call(this,a);return c&&b.activateMenu(c),c},c.launchDialog=function(a,c){var d,e=b(window).width()-100,f={},g={filters:[],multipleSelection:!1};if(b.extend(g,c),g.filters.length>0)for(f["field[]"]=[],d=0;d<g.filters.length;d++){var h=b.extend(!0,{},g.filters[d]);f["field[]"].push(h.field),delete h.field,b.extend(f,h)}b.fn.dialog.open({width:e,height:"80%",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/search",modal:!0,data:f,title:ccmi18n_filemanager.title,onOpen:function(c){ConcreteEvent.unsubscribe("FileManagerSelectFile"),ConcreteEvent.subscribe("FileManagerSelectFile",function(c,d){var e="[object Array]"===Object.prototype.toString.call(d.fID);if(g.multipleSelection&&!e)d.fID=[d.fID];else if(!g.multipleSelection&&e){if(d.fID.length>1)return b(".ccm-search-bulk-action option:first-child").prop("selected","selected"),void alert(ccmi18n_filemanager.chosenTooMany);d.fID=d.fID[0]}jQuery.fn.dialog.closeTop(),a(d)})}})},c.getFileDetails=function(a,c){b.ajax({type:"post",dataType:"json",url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/get_json",data:{fID:a},error:function(a){ConcreteAlert.dialog(ccmi18n.error,a.responseText)},success:function(a){c(a)}})},c.launchUploadCompleteDialog=function(a,c){if(a&&a.length&&a.length>0){var d="";_.each(a,function(a){d+="fID[]="+a.fID+"&"}),d=d.substring(0,d.length-1),b.fn.dialog.open({width:"660",height:"500",href:CCM_DISPATCHER_FILENAME+"/ccm/system/dialogs/file/upload_complete",modal:!0,data:d,onClose:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogClose",a)},onOpen:function(){var a={filemanager:c};ConcreteEvent.publish("FileManagerUploadCompleteDialogOpen",a)},title:ccmi18n_filemanager.uploadComplete})}},b.fn.concreteFileManager=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileManager=c}(window,$),!function(a,b){"use strict";function c(a,c){var d=this,c=b.extend({chooseText:ccmi18n_filemanager.chooseNew,inputName:"concreteFile",fID:!1,filters:[]},c),e={};e.filters=c.filters,d.$element=a,d.options=c,d._chooseTemplate=_.template(d.chooseTemplate,{options:d.options}),d._loadingTemplate=_.template(d.loadingTemplate),d._fileLoadedTemplate=_.template(d.fileLoadedTemplate),d.$element.append(d._chooseTemplate),d.$element.on("click","div.ccm-file-selector-choose-new",function(){return ConcreteFileManager.launchDialog(function(a){d.loadFile(a.fID,function(){d.$element.closest("form").trigger("change")})},e),!1}),d.options.fID&&d.loadFile(d.options.fID)}c.prototype={chooseTemplate:'<div class="ccm-file-selector-choose-new"><input type="hidden" name="<%=options.inputName%>" value="0" /><%=options.chooseText%></div>',loadingTemplate:'<div class="ccm-file-selector-loading"><input type="hidden" name="<%=inputName%>" value="<%=fID%>"><img src="'+CCM_IMAGE_PATH+'/throbber_white_16.gif" /></div>',fileLoadedTemplate:'<div class="ccm-file-selector-file-selected"><input type="hidden" name="<%=inputName%>" value="<%=file.fID%>" /><div class="ccm-file-selector-file-selected-thumbnail"><%=file.resultsThumbnailImg%></div><div class="ccm-file-selector-file-selected-title"><div><%=file.title%></div></div><div class="clearfix"></div></div>',loadFile:function(a,c){var d=this;d.$element.html(d._loadingTemplate({inputName:d.options.inputName,fID:a})),ConcreteFileManager.getFileDetails(a,function(a){var e=a.files[0];d.$element.html(d._fileLoadedTemplate({inputName:d.options.inputName,file:e})),d.$element.find(".ccm-file-selector-file-selected").on("click",function(a){var c=e.treeNodeMenu;if(c){var f=new ConcreteFileMenu(b(this),{menuLauncherHoverClass:"ccm-file-manager-menu-item-hover",menu:b(c),handle:"none",container:d});f.show(a)}}),ConcreteEvent.unsubscribe("ConcreteTreeDeleteTreeNode"),ConcreteEvent.subscribe("ConcreteTreeDeleteTreeNode",function(a,c){if(c.node&&c.node.treeJSONObject){var e=c.node.treeJSONObject.fID;e&&b("[data-file-selector]").find(".ccm-file-selector-file-selected input[value="+e+"]").each(function(a,b){_.defer(function(){d.$element.html(d._chooseTemplate)})})}}),c&&c(a)})}},b.fn.concreteFileSelector=function(a){return b.each(b(this),function(d,e){new c(b(this),a)})},a.ConcreteFileSelector=c}(this,$),!function(a,b,c){"use strict";function d(a,c){var d=this,c=c||{};c=b.extend({container:!1},c),d.options=c,a&&ConcreteMenu.call(d,a,c)}d.prototype=Object.create(ConcreteMenu.prototype),d.prototype.setupMenuOptions=function(a){var d=this,e=ConcreteMenu.prototype,f=a.attr("data-search-file-menu"),g=d.options.container;e.setupMenuOptions(a),a.find("a[data-file-manager-action=clear]").on("click",function(){var a=ConcreteMenuManager.getActiveMenu();return a&&a.hide(),c.defer(function(){g.$element.html(g._chooseTemplate)}),!1}),a.find("a[data-file-manager-action=download]").on("click",function(a){a.preventDefault(),window.frames["ccm-file-manager-download-target"].location=CCM_TOOLS_PATH+"/files/download?fID="+f}),a.find("a[data-file-manager-action=duplicate]").on("click",function(){return b.concreteAjax({url:CCM_DISPATCHER_FILENAME+"/ccm/system/file/duplicate",data:{fID:f},success:function(a){"undefined"!=typeof g.refreshResults&&g.refreshResults()}}),!1})},b.fn.concreteFileMenu=function(a){return b.each(b(this),function(c,e){new d(b(this),a)})},a.ConcreteFileMenu=d}(this,$,_);