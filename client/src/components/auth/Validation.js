import validator from 'validator'
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export const validateEmail = (mail) =>{
    if (!validator.isEmail(mail)) {
        return false;
      }
    else{
        return true;
    }
}

export const validateEmpty = (content) =>{
    if(content){
        return true;
    }
    else{
        return false;
    }
}

export const validatePassword = (pwd) =>{
    if(strongRegex.test(pwd)){
        return true
    }
    else{
        return false;
    }
}

export const comparePassword = (pwd1,pwd2) =>{
    console.log(pwd1,pwd2);
    if(pwd1 === pwd2){
        return true
    }
    else{
        return false;
    }
}