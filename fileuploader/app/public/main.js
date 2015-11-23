var getChannelId = function(){
	var div = document.getElementById('channel'); 
	
	if( ! div ) {
		console.log('could not find channel id containing element'); 
		return null; 
	}

	var channel = div.dataset.channel || null; 

	if( ! channel ) {
		console.log('channel div does not contain key'); 
		return null; 
	}

	return channel; 
}

var subscribeForNotifications = function(channel){
	var ws = window.location.host; 

	console.log('channel id', channel); 

	var socket = io.connect(ws, {query: ['channelId', channel].join('=')}); 
    
    socket.on('progress', function (data) {
    	console.log(data);
    	$('#status').text(data);  
    });

}

$(document).ready(function(){

	var channel = getChannelId(); 
	subscribeForNotifications(channel); 

}); 

$('#uploadBtn').click(function(){

	var files = document.getElementById('file').files || null; 
	
	if( ! files ) return; 

	var channel = getChannelId(); 
	var fd 		= new FormData();  

	fd.append('channelId', channel); 

	for(f in files){
		fd.append('file', files[f])
	} 

	var request = new XMLHttpRequest();
	    
	request.upload.onprogress = function(event) {
    	var percentLoaded = event.loaded * 100 / event.total; 
        console.log(event.loaded + ' / ' + event.total);
        console.log('percent ready: ', event.loaded * 100 / event.total); 
            
        $('#status').text('loading file: ' + parseInt(percentLoaded));  
    }  
	    
	request.onload = request.onerror = function() {
    	if (this.status == 200) {
        	console.log("success");
        } else {
        	console.log("error " + this.status);
        }
    }; 
	    
	request.open("POST", "/upload");
	request.send(fd);

})