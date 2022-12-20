export class Instructor {
  name: string;
  course_codes: string[] = [];

  constructor(name: string, course_codes?: string[]) {
    this.name = name;

    if (course_codes) {
      this.course_codes.push(...course_codes)
    }

  }

}
