export class Student {
    name;
    cnic;
    studentId;
    student_section;
    password;
    // Default parameters
    courses_enrolled = [];
    loginStatus = false;
    balance = 10000;
    // Optional parameters
    age;
    address;
    constructor(_name, _cnic, _student_section, _studentId, _password) {
        this.name = _name;
        this.cnic = _cnic;
        this.student_section = _student_section;
        this.studentId = _studentId;
        this.password = _password;
    }
}
