var uploadFiles = function(config){
        
    var request = new XMLHttpRequest();
    
    request.upload.onprogress = config.onprogress;  
    
    request.onload = request.onerror = config.onload; 
    
    request.open("POST", "/upload");
    request.send(config.files);

}; 

var clearInput = function(elementId){
    elementId = elementId.match('#') ? elementId : '#' + elementId; 
    var input = $(elementId);
    input.replaceWith(input.val('').clone(true));
}; 

var renderSelectedFilesTable = function(files){
    
    var tableBody = document.getElementById('selectedFiles'); 
    
    if( ! files || ! files.length ) return tableBody.innerHTML = '';   
    
    var rows = []; 
    var tbody = ''; 
    
    for(var i = 0; i < files.length; i++ ){
        var tr = '<tr>'; 
        tr += '<td>' + files[i].name + '</td>'; 
        tr += '<td>' + files[i].size + '</td>'; 
        tr += '</tr>'; 
        
        rows.push(tr); 
    }
    
    for(var r in rows){
        tbody += rows[r];     
    }
    
    tableBody.innerHTML = tbody;  
    
}; 

var renderTable = function(data){
    
    var tableBody = document.getElementById('existingFiles'); 
    
    if( ! data || ! data.length ) return tableBody.innerHTML = '';   
    
    var rows = []; 
    var tbody = ''; 
    
    for(var i = 0; i < data.length; i++ ){
        var tr = '<tr>'; 
        tr += '<td>' + data[i].file.name + '</td>'; 
        tr += '<td>' + data[i].meta.video.container + '</td>';
        tr += '<td>' + data[i].meta.duration.raw + '</td>';
        tr += '<td>' + data[i].file.path + '</td>';
        tr += '</tr>'; 
        
        rows.push(tr); 
    }
    
    for(var r in rows){
        tbody += rows[r];     
    }
    
    tableBody.innerHTML = tbody;  
    
}; 

$.fn.showMessage = function(msg){
    this.text(msg); 
    this.show(); 
}; 

var updateProgressBar = function(percent){
    //document.getElementById('uploadStatus').innerText = percent; 
    $('#uploadStatus').css('width', percent + '%' ); 
}; 

$('#filePicker').click(function(e){
    e.preventDefault(); 
    $('#videoFile').trigger('click'); 
}); 

$('#clearSelectedFiles').click(function(e){
    e.preventDefault(); 
    clearInput('#videoFile'); 
    renderSelectedFilesTable(null); 
    $('#selectedFilesTable').hide(); 
    $('#uploadMsg').hide(); 
    
}); 

$('#uploadSelectedFiles').click(function(e){
    e.preventDefault(); 
    $('#uploadMsg').hide(); 
    $('#fileUpload').submit(); 
}); 

$('#videoFile').change(function(e){
    var files = e.target.files; 
    
    renderSelectedFilesTable(files);
    $('#uploadMsg').hide(); 
    $('#selectedFilesTable').show(); 
    
}); 

$('#fileUpload').submit(function(e){
    e.preventDefault(); 
    
    var fileInputElement = document.getElementById('videoFile');
    var files = fileInputElement.files; 
    
    if( ! files.length ) return; 
    
    $('#uploadStatusPanel').show(); 
    var fd = new FormData();
    
    for(var i=0; i <= files.length; i++){
      fd.append("upload", files[i]);
    }
        
    console.log(fd); 

    uploadFiles({
        files: fd, 
        
        onload: function() {
            if (this.status == 200) {
                console.log("success");
                clearInput('videoFile'); 
                renderSelectedFilesTable(null); 
                $('#uploadStatusPanel').hide(); 
                $('#selectedFilesTable').hide(); 
            } else {
                console.log("error " + this.status);
                $('#uploadMsg').showMessage(this.statusText);
                
            }
        }, 
        
        onprogress:  function(event) {
            var percentLoaded = event.loaded * 100 / event.total; 
            console.log(event.loaded + ' / ' + event.total);
            console.log('percent ready: ', event.loaded * 100 / event.total); 
            
            updateProgressBar(parseInt(percentLoaded));  
        }
        
    }); 
    
}); 

