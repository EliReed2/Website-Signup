const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require("./config");
const bodyParser = require('body-parser')
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Login Opener
app.get("/", (req, res) => {
    res.render("login");
});
//Signup Opener
app.get("/signup", (req, res) => {
    res.render("signup");
});
//Sign Up Post Request, Takes Inputted Info and Creates User
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    if (!username || !password) {
        res.send("Username and Password required");
    }
    else if (await checkForUser(username, hashedPassword)) {
        res.send("User already exists");
    }
    else {
        await addUserToDatabase(username, hashedPassword);
        res.redirect("/");
    }
});
//Log In Post Request, Confirms that the user exists and logs them in
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    if (await checkForUserLogIn(username, password)) {
        res.render("home");
    }
    else {
        res.send("User does not exist");
    }
})

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
const addUserToDatabase = async (username, hashedPassword) => {
    let newUser = new User ({
        username: username,
        password: hashedPassword,
    });
    await newUser.save();
}
//Check for user in database
const checkForUser = async (username, hashedPassword) => {
    const user = await User.findOne({username: username});
    console.log(!!user);
    return !!user;
}

const checkForUserLogIn = async (username, password) => {
    const user = await User.findOne({username: username});
    if (user) {
        const comparePasswords = await bcrypt.compare(password, user.password);
        console.log(comparePasswords);
        return comparePasswords;
    }
    else {
        return false;
    }
    }
const port = 3002;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});