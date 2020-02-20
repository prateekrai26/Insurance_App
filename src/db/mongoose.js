let mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Insurance_App', {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:false
})

module.exports =mongoose;