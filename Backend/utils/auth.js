const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cryptoRandomString = require("crypto-random-string");
const pino = require('pino');
const logger = pino({
    prettyPrint: true
  })
var crypto = require("crypto");
const { dbConnect,dbClose} = require('./db');


const { User } = require("../models/user");
const { Code } = require("../models/secretCode");
const { hash, compare } = require("../utils/bcrypt");
const {emailRegex,passwordRegex} = require('./Constants')
const emailService = require("../utils/nodemailer");
const authenticateTokenWhilePending = require("./middleware/checkAuthWhilePending");
const authenticateToken = require("./middleware/checkAuth");



// #route:  POST /Login
// #desc:   Login a user
// #access: Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: "Please fill in all fields!" });
        res.json({ success: false, errors });
    } else {
        try {
            dbConnect();
            const user = await User.findOne({ email: email });

            if (!user) {
                errors.push({ msg: "The provided email is not registered." });
                res.json({ success: false, errors });
            } else {
                const pwCheckSuccess = await compare(password, user.password);

                if (!pwCheckSuccess) {
                    errors.push({ msg: "Email and password do not match." });
                    res.json({ success: false, errors });
                } else {
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userStatus:user.status
                        },
                        res.locals.secrets.JWT_SECRET,
                        {
                            expiresIn: 60 * 60 * 24 * 14,
                        }
                    );

                    res.json({
                        success: true,
                        userStatus: user.status,
                        accessToken : token,
                    });
                }
            }
        } catch (err) {
            logger.error("Error on /api/auth/login: ", err);
            res.json({ success: false });
        }
        finally{
            dbClose();
        }
    }
});

// #route:  POST /register
// #desc:   Register a new user
// #access: Public
router.post("/register", async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
    } = req.body;
    let errors = [];
    try{
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            errors.push({ msg: "Please fill in all fields!" });
            logger.debug(errors);
        }
        if (password != confirmPassword) {
            errors.push({ msg: "The entered passwords do not match!" });
        }
        if(!email.match(emailRegex)){
            errors.push({
                msg:
                    "Invalid Email",
            });
        }
        if (!password.match(passwordRegex)){
            errors.push({
                msg:
                    "Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
            });
        }
    }
    catch(err){
        res.json({ success: false, errors });
    }
    // Check if data is correctly provided
    
    

    if (errors.length > 0) {
        res.json({ success: false, errors });
    } else {
        try {
            dbConnect();
            // Check if user already exists
            const existingUser = await User.findOne({ email: email });

            if (existingUser) {
                errors.push({
                    msg: "The provided email is registered already.",
                });
                res.json({ success: false, errors });
            } else {
                const hashedPw = await hash(password);

                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPw,
                });

                const user = await newUser.save();
                const token = jwt.sign(
                    {
                        userId: user._id,
                        userStatus: user.status,
                    },
                    res.locals.secrets.JWT_SECRET,
                    {
                        expiresIn: 60 * 60 * 24 * 14,
                    }
                );
                // const baseUrl = req.protocol + "://" + req.get("host");
                const baseUrl = req.protocol + "://localhost:3000";
                // const secretCode = cryptoRandomString({
                //     length: 6,
                // });
                const secretCode = crypto.randomBytes(10).toString('hex');
                const newCode = new Code({
                    code: secretCode,
                    email: user.email,
                });
                await newCode.save();

                const data = {
                    from: `PREM KUMAR <${res.locals.secrets.EMAIL_USERNAME}>`,
                    to: user.email,
                    subject: "Your Activation Link for Todo APP",
                    text: `Please use the following link within the next 10 minutes to activate your account on Todo APP: ${baseUrl}/verify-account/${user._id}/${secretCode}`,
                    html: `<p>Please use the following link within the next 10 minutes to activate your account on Todo APP: <strong><a href="${baseUrl}/verify-account/${user._id}/${secretCode}" target="_blank">Activation Link</a></strong></p>`,
                };
                await emailService.sendMail(data);

                res.json({
                    success: true,
                    accessToken:token
                });
            }
        } catch (err) {
            logger.error("Error on /api/auth/register: ", err);
            errors.push({
                msg: "Oh, something went wrong. Please try again!",
            });
            res.json({ success: false, errors });
        }
        finally{
            dbClose();
        }
    }
});



// #route:  GET /verification/get-activation-email
// #desc:   Send activation email to registered users email address
// #access: Private
router.get(
    "/verification/get-activation-email",
    authenticateTokenWhilePending,
    async (req, res) => {
        // const baseUrl = req.protocol + "://" + req.get("host");
        const baseUrl = req.protocol + "://localhost:3000";

        try {
            dbConnect();
            const user = await User.findById(req.userId);

            if (!user) {
                res.json({ success: false });
            } else {
                await Code.deleteMany({ email: user.email });

                const secretCode = cryptoRandomString({
                    length: 6,
                });
                const newCode = new Code({
                    code: secretCode,
                    email: user.email,
                });
                await newCode.save();

                const data = {
                    from: `PREM KUMAR <${res.locals.secrets.EMAIL_USERNAME}>`,
                    to: user.email,
                    subject: "Your Activation Link for YOUR APP",
                    text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/verify-account/${user._id}/${secretCode}`,
                    html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/verify-account/${user._id}/${secretCode}" target="_blank">Activation Link</a></strong></p>`,
                };
                await emailService.sendMail(data);

                res.json({ success: true });
            }
        } catch (err) {
            logger.error("Error on /api/auth/get-activation-email: ", err);
            res.json({ success: false });
        }
        finally{
            dbClose();
        }
    }
);

router.get(
    "/verification/verify-account/:userId/:secretCode",
    async (req, res) => {
        try {
            await dbConnect();
            const user = await User.findById(req.params.userId);
            const response = await Code.findOne({
                email: user.email,
                code: req.params.secretCode,
            });
            // logger.info("from verification:",response);
            if (!user) {
                res.sendStatus(401);
            } else {
                await User.updateOne(
                    { email: user.email },
                    { status: "active" }
                );
                await Code.deleteMany({ email: user.email });


                // let redirectPath;

                // if (process.env.NODE_ENV == "production") {
                //     redirectPath = `${req.protocol}://${req.get(
                //         "host"
                //     )}account/verified`;
                // } else {
                //     redirectPath = `http://127.0.0.1:5000/api/auth/verified`;
                // }

                // res.redirect(redirectPath);
                res.json({
                    success:true,
                    msg:"Your account is verified"
                })
            }
        } catch (err) {
            logger.error(
                "Error on /api/auth/verification/verify-account: ",
                err
            );
            res.sendStatus(500).json({
                success:false,
                msg:"There is some problem in verifying your account"
            });
        }
        finally{
            dbClose();
        }
    }
);

router.get('/verified',async (req,res) =>{
    const token = req.header("x-access-token");
    logger.info(token);
    const customers = [
        {id: 1, firstName: 'John', lastName: 'Doe'},
        {id: 2, firstName: 'Brad', lastName: 'Traversy'},
        {id: 3, firstName: 'Mary', lastName: 'Swanson'},
      ];
    // res.send({
    //     msg:'account verified'
    // })
    res.json(customers)
});

router.post("/password-reset/get-code", async (req, res) => {
    const { email } = req.body;
    let errors = [];

    if (!email) {
        errors.push({ msg: "Please provide your registered email address!" });
        res.json({ success: false, errors });
    } else {
        try {
            dbConnect();
            if(!email.match(emailRegex)){
                errors.push({
                    msg:
                        "Invalid Email",
                });
            }

            const user = await User.findOne({ email: email });

            if (!user) {
                errors.push({
                    msg: "The provided email address is not registered!",
                });
                res.json({ success: false, errors });
            } else {
                // const secretCode = cryptoRandomString({
                //     length: 6,
                // });
                const secretCode = crypto.randomBytes(3).toString('hex');
                const newCode = new Code({
                    code: secretCode,
                    email: email,
                });
                await newCode.save();

                const data = {
                    from: `PREM KUMAR <${res.locals.secrets.EMAIL_USERNAME}>`,
                    to: email,
                    subject: "Your Password Reset Code for TODO APP",
                    text: `Please use the following code within the next 10 minutes to reset your password on TODO APP: ${secretCode}`,
                    html: `<p>Please use the following code within the next 10 minutes to reset your password on TODO APP: <strong>${secretCode}</strong></p>`,
                };
                await emailService.sendMail(data);

                res.json({ success: true });
            }
        } catch (err) {
            logger.error("Error on /api/auth/password-reset/get-code: ", err);
            errors.push({
                msg: "Oh, something went wrong. Please try again!",
            });
            res.json({ success: false, errors });
        }
        finally{
            dbClose();
        }
    }
});

// #route:  POST /password-reset/verify
// #desc:   Verify and save new password of user
// #access: Public
router.post("/password-reset/verify", async (req, res) => {
    const { email, password, confirmPassword, code } = req.body;
    let errors = [];
    logger.info(email,password,confirmPassword,code);
    if (!email || !password || !confirmPassword || !code) {
        errors.push({ msg: "Please fill in all fields!" });
        // res.json({ success: false, errors });
    }
    else{
        if (password != confirmPassword) {
            errors.push({ msg: "The entered passwords do not match!" });
        }
        if (
            !password.match(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
            )
        ) {
            errors.push({
                msg:
                    "Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
            });
        }
    }
    
    if (errors.length > 0) {
        res.json({ success: false, errors });
    } else {
        try {
            dbConnect();
            logger.info(email,code);
            // const response = await Code.findOne({ email:email, code:code });
            const response = await Code.findOne({ 
                email:email, 
                code:code 
            });
            logger.info(response);
            if (!response || response.length === 0) {
                errors.push({
                    msg:
                        "The entered code is not correct. Please make sure to enter the code in the requested time interval.",
                });
                res.json({ success: false, errors });
            } else {
                
                const newHashedPw = await hash(password);
                await User.updateOne({ email }, { password: newHashedPw });
                await Code.deleteOne({ email, code });
                res.json({ success: true ,msg:"Password is changed! Please Login"});
            }
        } catch (err) {
            logger.error("Error on /api/auth/password-reset/verify: ", err);
            errors.push({
                msg: "Oh, something went wrong. Please try again!",
            });
            res.json({ success: false, errors });
        }
        finally{
            dbClose();
        }
    }
});
router.post("/validate-token", async (req, res) => {
    try {
        await dbConnect();
        const tokenData = req.header("Authorization").split(" ");
        logger.info(tokenData);
        const token = tokenData[1];
        // logger.info("from backend",token);
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // logger.info(verified);
        if (!verified) return res.json(false);
        // logger.info("v ",verified.userId);
        const user = await User.findById(verified.userId);
        // logger.info("user",user);
        if (!user) return res.json(false);

        return res.json({
            userStatus:user.status
        });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
    finally{
        dbClose();
    }
  });
  
  router.get("/todos", authenticateToken, async (req, res) => {
    try {
        await dbConnect();
        const user = await User.findById(req.userId,(err)=>{
            console.log("from eroor");
            logger.error(err);
        });
        logger.info("user",user.firstName);
        logger.info("userTodos",user.todos);
        if (!user) return res.json(false);
    
        return res.json({
            name:user.firstName,
            todos:user.todos
        });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
    finally{
        await dbClose();
    }
});

router.post("/add-todo", authenticateToken, async (req, res) => {
    try {
        await dbConnect();
        const { id, content, created_at, completed } = req.body;
        const newTodo = {id, content, created_at, completed};
        console.log(newTodo);
        const response = await User.findOneAndUpdate({ _id: req.userId }, 
        { $push: { 
                  todos: newTodo
                } 
        });
        logger.error(response);
        if (!response) return res.status(401).json({success : false, msg : "something went wrong! Please try again"});
    
        return res.status(200).json({
            success : true,
            todos : response.todos,
            msg : "Todo added Successfuly"
        });
    } 
    catch (err) {
        res.status(500).json({ success : false, msg: err.message });
    }
    finally{
        await dbClose();
    }
});

router.put("/edit-todo",authenticateToken,async(req,res)=>{
    try{
        await dbConnect();
        const { id, content, created_at } = req.body;
        console.log(req.body);
        const response = await User.updateMany(
            {_id : req.userId , 'todos.id': id }, 
            {'$set': {'todos.$.content': content , 'todos.$.created_at': created_at}},
            { new : true }
        );
        logger.error(response);
        if (!response) return res.status(401).json({success : false, msg:"something went wrong! Please try again"});
    
        return res.status(200).json({
            success : true,
            todos : response.todos,
            msg : "Edited Successfully"
        });
    } 
    catch (err) {
        res.status(500).json({ success : false, msg: err.message });
    }
    finally{
        await dbClose();
    }
})

router.delete("/delete-todo",authenticateToken,async(req,res) => {
    try{
        await dbConnect();
        const { todo_id } = req.body;

        console.log(req.body);
        console.log(todo_id);

        const response = await User.findOneAndUpdate( {_id: req.userId}, 
            { $pull: {todos: {id : todo_id} } },
            { safe: true } );
        console.log(response)
        if (!response) return res.status(500).json({success:false, msg : "Something went wrong! Please Try Again"});

        return res.status(200).json({
            success : true,
            msg : "Deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({ success : false , msg : err.message })
    }
    finally{
        await dbClose();
    }
});


router.put("/completed", authenticateToken ,async(req,res) => {
    try{
        await dbConnect();
        const { id } = req.body;
        console.log(id);
        const response = await User.updateOne(
            {_id : req.userId , 'todos.id': id }, 
            {'$set': {'todos.$.completed': true}},
            { new : true }
        );

        console.log(response);
        if (!response) return res.status(500).json({success:false, msg : "Something went wrong! Please Try Again"});

        return res.status(200).json({
            success:true,
            msg : "Marked as completed successfully"
        })

    }
    catch(err){
        return res.status(500).json({ success : false , msg:err.message })
    }
    finally{
        await dbClose();
    }
});

module.exports = router;