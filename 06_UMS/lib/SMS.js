import { Course } from "./Course.js";
import { Instructor } from "./Instructor.js";
import { Student } from "./Student.js";
export class SMS {
    _idsGenetor = 0;
    name;
    students = new Map();
    courses = new Map();
    instructors = new Map();
    balance = 0;
    constructor(_name) {
        this.name = _name;
    }
    AddInstructorsInUMS(_instructors) {
        _instructors.map((instructor) => {
            let newIstructor = new Instructor(instructor.instructor_name, instructor.course_codes);
            this.instructors.set(instructor.instructor_name, newIstructor);
        });
    }
    AddCoursesinUMS(_courses) {
        _courses.map((course) => {
            const { course_code, course_name, des, instructor, tuition_fee } = course;
            const newCourse = new Course(course_code, course_name, des, instructor, tuition_fee);
            this.courses.set(course.course_code, newCourse);
        });
    }
    getAllCourseInUMS() {
        return [...this.courses.values()];
    }
    getCourseById(code) {
        return this.courses.get(code);
    }
    getAllInstructorsInUMS() {
        return [...this.instructors.values()];
    }
    getInstructorByName(name) {
        return this.instructors.get(name);
    }
    enrollStudentinUMS(name, cnic, section) {
        const newId = ++this._idsGenetor;
        var password = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const student = new Student(name, cnic, section, newId, password);
        this.students.set(newId, student);
        return { id: newId, password: password };
    }
    getAllStudents() {
        return [...this.students.values()];
    }
    getStudentById(id) {
        return this.students.get(id);
    }
    /**
     Student related Methods
     
     * Student set and reset a password
     * Student should be able to sign in the system
     * Student should read enrolled courses, enroll in or drop off one or many courses using courseId
     
     */
    logIn(studentId, password) {
        let student = this.students.get(studentId);
        if (!student) {
            return {
                status: false,
                msg: "Student do not exist"
            };
        }
        if (student.password == password) {
            student.loginStatus = true;
            this.students.set(studentId, student);
            return {
                status: true,
                msg: "Successfully Logged In"
            };
        }
        else {
            return {
                status: false,
                msg: "Incorrect password"
            };
        }
    }
    setPassword(studentId, newPassword, oldPassword) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("Not logged In");
        if (student.password === oldPassword) {
            student.password = newPassword;
            this.students.set(studentId, student);
        }
        else {
            throw Error("Incorrect password");
        }
    }
    setProfile(studentId, name, age, address, cnic) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("Not logged In");
        student.name = name;
        student.age = age;
        student.address = address;
        student.cnic = cnic;
    }
    enrollInCourses(studentId, courseCodes) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("You are not logged In");
        let totalFeeToPay = 0;
        courseCodes.map((code) => {
            const course = this.courses.get(code);
            if (course) {
                totalFeeToPay = totalFeeToPay + course.tuition_fee;
            }
        });
        if (student.balance < Number(totalFeeToPay)) {
            throw Error("You don't have enough balance to enroll in these courses");
        }
        courseCodes.forEach((code) => {
            const course = this.courses.get(code);
            if (!course)
                throw Error(`course do not exist ${code}`);
            if (student) {
                this.balance += course.tuition_fee;
                student.balance -= course.tuition_fee;
                student.courses_enrolled.push(course.course_code);
            }
        });
        this.students.set(studentId, student);
    }
    dropOffCourses(studentId, courseCodes) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("You are not logged In");
        courseCodes.forEach((code) => {
            if (student) {
                const course = this.courses.get(code);
                if (course) {
                    this.balance -= (course.tuition_fee * 0.5);
                    student.balance += (course.tuition_fee * 0.5);
                    student.courses_enrolled = student.courses_enrolled
                        .filter((course_code) => course_code !== code);
                }
            }
        });
        this.students.set(studentId, student);
    }
}
