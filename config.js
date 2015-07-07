module.exports = {
    port: 8080, 
    file_upload_dir: './uploads', 
    session: {
        name: 'video-upload', 
        key:  'sid', 
        cookie: {
            httpOnly: false, 
            secure: false
        },
        secret: 'keyboard cat'
    }
}; 