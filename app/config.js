module.exports = {
    port: process.env.VA_PORT || 8080, 
    file_upload_dir: __dirname + '/uploads', 
    db_path: __dirname + '/db', 
    session: {
        name: 'video-upload', 
        key:  'sid', 
        cookie: {
            httpOnly: false, 
            secure: false
        },
        secret: 'keyboard cat', 
        resave: true, 
        saveUninitialized: true
    }
}; 