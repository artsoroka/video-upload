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
