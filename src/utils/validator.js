const validator  = require('validator')


function checkMandatory(data, ...mandatoryFields) {
    const missing = mandatoryFields.filter(field => !Object.keys(data).includes(field));
    if (missing.length > 0) {
      throw new Error(`Mandatory fields missing: ${missing.join(', ')}`);
    }
  }
  


function validate(data){

    checkMandatory(data,'firstName','emailId','password');
    
    const {firstName ,lastName, emailId,password}=data;
    if(!validator.isEmail(emailId)){
        throw new Error('Invalid Email')
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('Weak Password')
    }
    if(firstName.length<3 || firstName.length>20){
        throw new Error('Invalid Name format')
    }

    if(lastName && (lastName.length<3 || lastName.length >20)){
        throw new Error('Invalid LastName format')
    }
}

module.exports={validate,checkMandatory};