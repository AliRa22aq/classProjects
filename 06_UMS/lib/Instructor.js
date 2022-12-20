export class Instructor {
    name;
    course_codes = [];
    constructor(name, course_codes) {
        this.name = name;
        if (course_codes) {
            this.course_codes.push(...course_codes);
        }
    }
}
