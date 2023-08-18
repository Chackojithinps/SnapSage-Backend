const cloudinary = require('cloudinary').v2;
  
cloudinary.config({ 
  cloud_name: 'dmuikdem0', 
  api_key:"849976336843467", 
  api_secret:"2YUBNmeJ6cAl9x3QZX0Tj05UxIA",
  secure: true
});

module.exports = cloudinary;