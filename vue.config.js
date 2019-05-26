

module.exports = {

  configureWebpack: config =>{
    config.optimization = {
                minimize: true
    }     
    
    
  }   
  
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/weave-nodes-dist/'
  //   : '/'
}
