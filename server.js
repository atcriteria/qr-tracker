// Import the express library
const express = require("express")

// allow us to serve local html templates
// __dirname is the same directory THIS file is located in (which is the root)
const path = require("path")

// create a server instance of express
const server = express()

// Use a port defined in our environment, or default to 3221 for dev
const port = process.env.PORT || 3221

// JS object (or JSON) can be used in place of a database since they use key/value pairs
// Key is the unique code associated with the QR Code
// Value is a bool, true if the code is valid, false if it is not.
const codes = {
    "12345": true,
    "67890": true
}

// Establishes the root endpoint for the server
// respond with html based on the status of the queried key
server.use("/", (req, res) => {
    // destructure the "key" key from the request query, ex: localhost:3221/?key=12345, const key = "12345"
    const {key} = req.query
    // localhost:3221/  no query was sent, send default message
    if (!key) return res.sendFile(path.join(__dirname, "default.html"))
    // A query was sent, check if it is in our "database"
    if (key in codes){
        // query was found
        // check the validity of the voucher
        if (codes[key]){
            // voucher is valid. Invalidate the voucher then send a redeemed message (allow entry)
            codes[key] = false
            return res.sendFile(path.join(__dirname, "valid.html"))
        } else {
            // voucher has already been used, 
            return res.sendFile(path.join(__dirname, "already-used.html"))
        }
    // if the query is not in our "database", return an invalid voucher message
    } else {
        return res.sendFile(path.join(__dirname, "invalid.html"))
    }
})

// Enables our server to listen on the specific port
// localhost is for developing locally, this would be different in production
server.listen(port, () => {
    console.log(`server listening on port ${port}\n\nhttp://localhost:${port}`)
})