export class Course {
  course_code: string;
  course_name: string;
  course_description: string;
  course_instructor: string;
  tuition_fee: number;


  constructor(
    code: string,
    name: string,
    description: string,
    course_instructor: string,
    tuition_fee: number
  ) {
    this.course_code = code;
    this.course_name = name;
    this.course_description = description;
    this.course_instructor = course_instructor;
    this.tuition_fee = tuition_fee;
  }
}
