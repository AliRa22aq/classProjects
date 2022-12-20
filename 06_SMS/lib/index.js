#! /usr/bin/env node
import { coursesList, instructorsList } from "./types.js";
import { SMS } from "./SMS.js";
import inquirer from "inquirer";
let studentData;
let quit = false;
const MyUMS = new SMS("PIAIC STUDENT MANAGEMENT SYSTEM");
MyUMS.AddCoursesinUMS(coursesList);
MyUMS.AddInstructorsInUMS(instructorsList);
// const dummyStudent = MyUMS.enrollStudentinUMS("Ali", 33102, "Morning");
// MyUMS.logIn(dummyStudent.id, dummyStudent.password);
// MyUMS.setPassword(dummyStudent.id, "1234", dummyStudent.password);
// const student = MyUMS.getStudentById(dummyStudent.id);
// studentData = student
const delay = async (ms = 2000) => {
    return new Promise((res) => setTimeout(res, ms));
};
const welcomeMsg = () => {
    console.log("Welcome to", MyUMS.name + "\n");
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
    const newStudent = MyUMS.enrollStudentinUMS(ans.name, ans.CNIC, ans.secion);
    console.log("Student Id: ", newStudent.id);
    console.log("Password: ", newStudent.password + "\n");
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
    // console.log(ans.id, ans.password);
    const res = MyUMS.logIn(ans.id, ans.password);
    if (res.status) {
        let student = MyUMS.getStudentById(ans.id);
        studentData = student;
        // console.log("You are successfully logged In");
    }
    else {
        console.log(res.msg);
    }
};
const handleQuit = () => {
    quit = true;
    console.log("Bye. See you later");
};
const handleLogOut = () => {
    console.clear();
    if (studentData) {
        studentData.loginStatus = false;
    }
};
const loggedInWelcomMsg = () => {
    if (studentData) {
        // if(clear) 
        console.clear();
        console.log("Welcome to PIAIC Student Management System");
        console.log("");
        console.log("Name: ", studentData?.name);
        console.log("Student Id: ", studentData?.studentId);
        console.log("Balance: ", studentData?.balance);
        console.log("==========================================================");
        console.log("");
    }
};
const availabelCoursesList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allCourses = MyUMS.getAllCourseInUMS();
        allCourses.forEach((course) => {
            console.log("Code: ", course.course_code);
            console.log("Name: ", course.course_name);
            console.log("Tuition Fee: ", course.tuition_fee);
            console.log("Instructor: ", course.course_instructor);
            console.log("");
        });
    }
};
const availabelInstructorsList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allInstructors = MyUMS.getAllInstructorsInUMS();
        allInstructors.forEach((instructor) => {
            console.log("Name: ", instructor.name);
            console.log("Courses Teaching: ", instructor.course_codes.map((code) => MyUMS.getCourseById(code)?.course_name).join(", "));
            console.log("");
        });
    }
};
const studentCompleteProfile = () => {
    if (studentData) {
        loggedInWelcomMsg();
        console.log("Student Id: ", studentData.studentId);
        console.log("Your Courses: ", studentData.courses_enrolled.map((code => MyUMS.getCourseById(code)?.course_name)).join(", "));
        console.log("Balance: ", studentData.balance);
        console.log("Section: ", studentData.student_section);
        console.log("Name: ", studentData.name);
        console.log("Age: ", studentData.age);
        console.log("Address: ", studentData.address);
        console.log("CNIC: ", studentData.cnic);
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
        MyUMS.setProfile(studentData.studentId, name, age, address, cnic);
    }
    console.log("Updating Profile");
    console.log("================================");
    await delay();
    loggedInWelcomMsg();
};
const enrollInACourse = async () => {
    if (studentData) {
        loggedInWelcomMsg();
        console.log("Your Balance: ", studentData.balance);
        console.log("");
        console.log("Already Enrolled In Courses:");
        if (studentData.courses_enrolled.length === 0) {
            console.log("None");
        }
        else {
            studentData.courses_enrolled.map((course) => {
                console.log(MyUMS.getCourseById(course)?.course_name);
            });
        }
        console.log("===============================");
        console.log("");
        console.log("(See detail in courses section) Available Courses:");
        let allCourses = MyUMS.getAllCourseInUMS();
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
                MyUMS.enrollInCourses(studentData.studentId, allSelectedCorseCodes);
                console.log("Enrolling in following courses ", allSelectedCorseCodes);
                console.log("================================");
                await delay();
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
    if (ans.oldPassword === studentData.password) {
        console.log("Password not matched with old password");
    }
    else if (ans.newPassword === ans.confimredNewPassword) {
        console.log("Confirmed password not matched with new password");
    }
    else {
        MyUMS.setPassword(studentData.studentId, ans.newPassword, studentData.password);
        console.log("Updating Password");
        console.log("==============================");
        await delay();
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
