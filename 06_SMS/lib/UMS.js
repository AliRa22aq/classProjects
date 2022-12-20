import { Course } from "./Course.js";
import { Instructor } from "./Instructor.js";
import { Student } from "./Student.js";
export class UMS {
    _idsGenetor = 0;
    name;
    students = new Map();
    courses = new Map();
    instructors = new Map();
    constructor(_name) {
        this.name = _name;
    }
    AddInstructorsInUMS(_instructors) {
        _instructors.map((instructor) => {
            let newIstructor = new Instructor(instructor.name, instructor.course_codes);
            this.instructors.set(instructor.name, newIstructor);
        });
    }
    AddCoursesinUMS(_courses) {
        _courses.map((course) => {
            const newCourse = new Course(course.code, course.name, course.des, course.instructor);
            this.courses.set(course.code, newCourse);
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
        if (!student)
            throw Error("Student do not exist");
        if (student.password === password) {
            student.loginStatus = true;
            this.students.set(studentId, student);
        }
        else {
            throw Error("Incorrect password");
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
    enrollInCourses(studentId, courseCodes) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        courseCodes.forEach((code) => {
            const course = this.courses.get(code);
            if (!course)
                throw Error(`course do not exist ${code}`);
            if (student) {
                student.courses_enrolled.push(course.course_code);
            }
        });
        this.students.set(studentId, student);
    }
    dropOffCourses(studentId, courseCodes) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        courseCodes.forEach((code) => {
            if (student) {
                student.courses_enrolled = student.courses_enrolled
                    .filter((course_code) => course_code !== code);
            }
        });
        this.students.set(studentId, student);
    }
}
