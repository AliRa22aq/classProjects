#! /usr/bin/env node
import { coursesList, instructorsList } from "./types.js";
import PIAIC_SMS from "./SMS.js";
import inquirer from "inquirer";
let studentData;
let quit = false;
PIAIC_SMS.AddCoursesinUMS(coursesList);
PIAIC_SMS.AddInstructorsInUMS(instructorsList);
const dummyStudent = PIAIC_SMS.enrollStudentinUMS("Ali", 33102, "Morning");
PIAIC_SMS.logIn(dummyStudent.id, dummyStudent.password);
PIAIC_SMS.setPassword(dummyStudent.id, "1234", dummyStudent.password);
const student = PIAIC_SMS.getStudentById(dummyStudent.id);
studentData = student;
const delay = async (ms = 2000) => {
    return new Promise((res) => setTimeout(res, ms));
};
const updatingComponent = async (msg) => {
    for (let i = 1; i < 100; i++) {
        const show = "=".repeat(i);
        console.clear();
        console.log();
        console.log(msg);
        console.log(show);
        console.log();
        await delay(10);
    }
};
const welcomeMsg = () => {
    console.log("Welcome to", PIAIC_SMS.name + "\n");
};
const handleLoggedOutUser = async () => {
    welcomeMsg();
    const answers = await inquirer.prompt([
        {
            name: "LogIn",
            type: "list",
            choices: ["Log In", "Sign Up", "Quit"],
            message: "Log in or create a new account"
        }
    ]);
    switch (answers.LogIn) {
        case "Log In":
            await handleLogin();
            break;
        case "Sign Up":
            await handleSingUp();
            break;
        case "Quit":
            handleQuit();
            break;
    }
};
const handleSingUp = async () => {
    const ans = await inquirer.prompt([
        {
            name: "name",
            message: "enter you name",
            type: "input"
        },
        {
            name: "CNIC",
            message: "enter your CNIC",
            type: "number"
        },
        {
            name: "secion",
            message: "Choose a section",
            type: "list",
            choices: ["Morning", "Evening"]
        }
    ]);
    const newStudent = PIAIC_SMS.enrollStudentinUMS(ans.name, ans.CNIC, ans.secion);
    console.clear();
    console.log("");
    console.log("Student Id: ", newStudent.id);
    console.log("Password: ", newStudent.password + "\n");
    console.log("");
};
const handleLogin = async () => {
    const ans = await inquirer.prompt([
        {
            name: "id",
            message: "enter your student Id",
            type: "number"
        },
        {
            name: "password",
            message: "enter your password",
            type: "password",
            masked: true
        }
    ]);
    const res = PIAIC_SMS.logIn(ans.id, ans.password);
    if (res.status) {
        let student = PIAIC_SMS.getStudentById(ans.id);
        studentData = student;
    }
    else {
        console.log("");
        console.log(res.msg);
        console.log("");
    }
};
const handleQuit = () => {
    quit = true;
    console.log("Bye. See you later");
};
const handleLogOut = () => {
    console.clear();
    studentData = undefined;
};
const loggedInWelcomMsg = () => {
    if (studentData) {
        console.clear();
        console.log("Welcome to PIAIC Student Management System");
        console.log("");
        console.table([
            {
                "Name": studentData?.name,
                "Student Id": studentData?.studentId,
                "Balance": studentData?.balance
            }
        ]);
        console.log("");
    }
};
const availabelCoursesList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allCourses = PIAIC_SMS.getAllCourseInUMS();
        console.table(allCourses);
        console.log("");
    }
};
const availabelInstructorsList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allInstructors = PIAIC_SMS.getAllInstructorsInUMS();
        const formatedData = [];
        allInstructors.forEach((instructor) => {
            const coursesName = instructor.course_codes.map((code) => PIAIC_SMS.getCourseById(code)?.course_name).join(", ");
            formatedData.push({
                "Name": instructor.name,
                "Courses Teaching": coursesName
            });
        });
        console.table(formatedData);
        console.log("");
    }
};
const studentCompleteProfile = () => {
    if (studentData) {
        loggedInWelcomMsg();
        console.table([studentData]);
        console.log("");
    }
};
const editProfile = async () => {
    loggedInWelcomMsg();
    const ans = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Your name",
            default: studentData?.name
        },
        {
            name: "age",
            type: "number",
            message: "Your Age",
            default: studentData?.age
        },
        {
            name: "address",
            type: "input",
            message: "Your Address",
            default: studentData?.address
        },
        {
            name: "cnic",
            type: "number",
            message: "Your CNIC",
            default: studentData?.cnic
        },
    ]);
    const { name, age, address, cnic } = ans;
    if (studentData) {
        PIAIC_SMS.setProfile(studentData.studentId, name, age, address, cnic);
    }
    await updatingComponent("Updating Profile");
    loggedInWelcomMsg();
};
const enrollInACourse = async () => {
    if (studentData) {
        loggedInWelcomMsg();
        // console.log("Your Balance: ", studentData.balance);
        console.log("Already Enrolled In Courses:");
        // console.table(studentData.courses_enrolled)
        if (studentData.courses_enrolled.length === 0) {
            console.log("None");
            console.log("");
        }
        else {
            const coursesNames = studentData.courses_enrolled.map((course) => {
                return PIAIC_SMS.getCourseById(course)?.course_name;
            });
            console.table(coursesNames);
            console.log("");
        }
        // console.log("=".repeat(100));
        // console.log("");
        console.log("(See detail in courses section) Available Courses:");
        let allCourses = PIAIC_SMS.getAllCourseInUMS();
        let allAvailabeCourses = [];
        allCourses.map((course) => {
            if (studentData && !studentData.courses_enrolled.includes(course.course_code)) {
                allAvailabeCourses.push(course);
            }
        });
        const listOfCourseNames = allAvailabeCourses.map((course) => course.course_name);
        const ans = await inquirer.prompt([{
                name: "course",
                type: "checkbox",
                choices: listOfCourseNames,
                message: "Select A Course"
            }]);
        let totalfee = 0;
        let allSelectedCorseCodes = [];
        allAvailabeCourses.map((course) => {
            if (ans.course.includes(course.course_name)) {
                totalfee = totalfee + Number(course.tuition_fee);
                allSelectedCorseCodes.push(course.course_code);
            }
        });
        console.log("Total Fee for selected courses: ", totalfee);
        console.log("");
        if (totalfee > studentData.balance) {
            console.log("You don't have enough Balance for this transaction");
        }
        else {
            const ans = await inquirer.prompt([{
                    name: "course",
                    type: "confirm",
                    message: `Your balance is ${studentData.balance} and this will cost you ${totalfee}`
                }]);
            if (ans.course) {
                PIAIC_SMS.enrollInCourses(studentData.studentId, allSelectedCorseCodes);
                await updatingComponent(`Enrolling in following courses: ${allSelectedCorseCodes}`);
                loggedInWelcomMsg();
            }
        }
    }
};
const updatePassword = async () => {
    if (!studentData)
        return;
    loggedInWelcomMsg();
    const ans = await inquirer.prompt([
        {
            name: "oldPassword",
            type: "input",
            message: "Enter Your old password",
        },
        {
            name: "newPassword",
            type: "input",
            message: "Enter Your new password",
        },
        {
            name: "confimredNewPassword",
            type: "input",
            message: "Enter Your confirmed new password",
        },
    ]);
    console.log("ans: ", ans);
    console.log("studentData.password: ", studentData.password);
    if (ans.oldPassword !== studentData.password) {
        console.log("Password not matched with old password");
    }
    else if (ans.newPassword !== ans.confimredNewPassword) {
        console.log("Confirmed password not matched with new password");
    }
    else {
        PIAIC_SMS.setPassword(studentData.studentId, ans.newPassword, studentData.password);
        await updatingComponent(`Updating Password`);
        loggedInWelcomMsg();
    }
};
const handleLoggedInUser = async () => {
    const options = await inquirer.prompt([
        {
            name: "Options",
            type: "list",
            choices: ["My Profile", "Edit Profile", "Update Password", "Enroll In a Course", "All Courses", "All Instructors", "Log Out"]
        }
    ]);
    switch (options.Options) {
        case "My Profile":
            studentCompleteProfile();
            break;
        case "Edit Profile":
            await editProfile();
            break;
        case "Update Password":
            await updatePassword();
            break;
        case "Enroll In a Course":
            await enrollInACourse();
            break;
        case "All Courses":
            availabelCoursesList();
            break;
        case "All Instructors":
            availabelInstructorsList();
            break;
        case "Log Out":
            handleLogOut();
            break;
    }
};
console.clear();
do {
    if (!studentData || !studentData.loginStatus) {
        await handleLoggedOutUser();
    }
    else {
        await handleLoggedInUser();
    }
} while (!quit);
