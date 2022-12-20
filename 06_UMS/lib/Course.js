export class Course {
    course_code;
    course_name;
    course_description;
    course_instructor;
    tuition_fee;
    constructor(code, name, description, course_instructor, tuition_fee) {
        this.course_code = code;
        this.course_name = name;
        this.course_description = description;
        this.course_instructor = course_instructor;
        this.tuition_fee = tuition_fee;
    }
}
