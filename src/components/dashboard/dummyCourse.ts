import type { Course } from "./CourseCard";

export const ACTIVE_COURSES: Course[] = [
    {
        id: "1",
        title: "Database Systems",
        code: "CS-301",
        schedule: "Tue, Fri",
        color: "yellow",
        status: "on-track",
        statusLabel: "On track",
    },
    {
        id: "2",
        title: "Data Structures",
        code: "CS-201",
        schedule: "Mon, Wed",
        color: "teal",
        status: "behind",
        statusLabel: "1 week behind",
    },
    {
        id: "3",
        title: "Operating Systems",
        code: "CS-304",
        schedule: "Tue, Thu",
        color: "purple",
        status: "on-track",
        statusLabel: "On track",
    },
    {
        id: "4",
        title: "Software Eng.",
        code: "CS-401",
        schedule: "Fri",
        color: "pink",
        status: "on-track",
        statusLabel: "On track",
    },
];

export const PAST_COURSES: Course[] = [
    {
        id: "5",
        title: "Intro to Programming",
        code: "CS-101",
        schedule: "Mon, Wed",
        color: "blue",
        status: "ahead",
        statusLabel: "Completed",
    },
    {
        id: "6",
        title: "Discrete Math",
        code: "MATH-210",
        schedule: "Thu",
        color: "orange",
        status: "ahead",
        statusLabel: "Completed",
    },
];