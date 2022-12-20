// Types

export type CourseInput = {
    course_code: string,
    course_name: string,
    des: string,
    instructor: string,
    tuition_fee: number
}

export type InstructorInput = {
    course_codes: string[],
    instructor_name: string,
}


// Dummy Data

export const coursesList: CourseInput[] = [
    {
        course_code: "01MD",
        course_name: "Meraverse Development",
        des: "Meraverse Development",
        instructor: "Zia Khan",
        tuition_fee: 3000
    },
    {
        course_code: "02BC",
        course_name: "Blockchain",
        des: "Blockchian",
        instructor: "Zeeshan Hanif",
        tuition_fee: 5000

    },
    {
        course_code: "03CC",
        course_name: "Cloud Computing",
        des: "Cloud Computing",
        instructor: "Daniyal Nagori",
        tuition_fee: 4000

    },
    {
        course_code: "04AI",
        course_name: "Artificial Intelligence",
        des: "Artificial Intelligence",
        instructor: "Zia Khan",
        tuition_fee: 2500

    },
    {
        course_code: "05IOT",
        course_name: "Internet of things",
        des: "Internet of things",
        instructor: "Zia Khan",
        tuition_fee: 2800

    }
]

export const instructorsList: InstructorInput[] = [
    {
        instructor_name: "Zia Khan",
        course_codes: ["01MD", "04AI", "05IOT"]
    },
    {
        instructor_name: "Daniyal Nagori",
        course_codes: ["03CC"]
    },
    {
        instructor_name: "Zeeshan Hanif",
        course_codes: ["02BC"]
    }
]