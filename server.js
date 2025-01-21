<<<<<<< HEAD
=======
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
>>>>>>> b34398931dea4e0bcc4f41e516f54d75c063ddc4
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
<<<<<<< HEAD
const expressLayouts = require("express-ejs-layouts")

=======
const expressLayouts = require("express-ejs-layouts").
>>>>>>> b34398931dea4e0bcc4f41e516f54d75c063ddc4
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

<<<<<<< HEAD
//index route
app.get("/", function(req, res){
  res.render("index", {title: "Home"})

})
=======
/* ***********************
 * View engine and templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


>>>>>>> b34398931dea4e0bcc4f41e516f54d75c063ddc4

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

<<<<<<< HEAD
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



=======
>>>>>>> b34398931dea4e0bcc4f41e516f54d75c063ddc4
/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
<<<<<<< HEAD
})
=======
})
>>>>>>> b34398931dea4e0bcc4f41e516f54d75c063ddc4
