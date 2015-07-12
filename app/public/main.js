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

$('#filePicker').click(function(e){
    $('#videoFile').trigger('click'); 
}); 

$('#clearSelectedFiles').click(function(e){
    clearInput('#videoFile'); 
    renderSelectedFilesTable(null); 
}); 

$('#videoFile').change(function(e){
    var files = e.target.files; 
    
    renderSelectedFilesTable(files);     
    
}); 

$('#fileUpload').submit(function(e){
    e.preventDefault(); 
    
    var fd = new FormData();
    
    var fileInputElement = document.getElementById('videoFile');
    var files = fileInputElement.files; 
    
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
            } else {
                console.log("error " + this.status);
            }
        }, 
        
        onprogress:  function(event) {
            console.log(event.loaded + ' / ' + event.total);
            console.log('percent ready: ', event.loaded * 100 / event.total); 
        }
        
    }); 
    
}); 
