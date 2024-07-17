const mongoose = require('mongoose');

const connect = mongoose.connect('mongodb+srv://elireed1414:Wcc1924471!!@signin.5hcswpk.mongodb.net/?retryWrites=true&w=majority&appName=SignIn');

//Ensure Database conects
connect.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.error("Could not connect");
    throw err;
});
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
