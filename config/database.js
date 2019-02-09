if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://tulsee:tulsee1@ds127655.mlab.com:27655/vidot-db'}
}else{
     module.exports = {mongoURI: 'mongodb://localhost/vidot-db'}
}