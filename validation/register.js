const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    //data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.gender = !isEmpty(data.gender) ? data.gender : '';

    if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
        errors.firstName = `ชื่อต้องอยู่ระหว่าง 2 ถึง 30 ตัวอักษร`;
    }
    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = `กรุณากรอกชื่อของคุณ`;
    }

    if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
        errors.lastName = `นามสกุลต้องอยู่ระหว่าง 2 ถึง 30 ตัวอักษร`;
    }
    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = `กรุณากรอกนามสกุลของคุณ`;
    }

    if (Validator.isEmpty(data.gender)) {
        errors.gender = `กรุณาระบุเพศของคุณ`;
    }
    if (Validator.isEmpty(data.phone)) {
        errors.phone = `กรูณากรอกเบอร์โทรศัพท์ของคุณ`;
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = `กรุณากรอกอีเมลล์ของคุณ`;
    }
    if (!Validator.isEmail(data.email) && !isEmpty(data.email)) {
        errors.email = `อีเมล์ไม่ถูกต้อง`;
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = `กรุณากรอกพาสเวิร์ดของคุณ`;
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 }) && !isEmpty(data.password)) {
        errors.password = `พาสเวิร์ดต้องมีความยาวอย่างน้อย 6 ตัวอักษร`;
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}