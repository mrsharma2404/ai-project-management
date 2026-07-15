export type Member = {
  name: string;
  position: string;
  completed: number;
  wip: number;
  todo: number;
};

export type UserGroup = {
  pod: string;
  members: Member[];
};

export const userGroups: UserGroup[] = [
  {
    pod: "SND",
    members: [
      { name: "Vardan Arora", position: "SDE-2", completed: 62, wip: 23, todo: 15 },
      { name: "Sandeep Bisht", position: "SDE-1", completed: 48, wip: 30, todo: 22 },
      { name: "Shanmukha", position: "SDE-3", completed: 71, wip: 14, todo: 15 },
      { name: "Ishita Verma", position: "SDE-1", completed: 55, wip: 25, todo: 20 },
      { name: "Kunal Deshmukh", position: "SDE-2", completed: 40, wip: 35, todo: 25 },
    ],
  },
  {
    pod: "Checkout",
    members: [
      { name: "Aditya Verma", position: "SDE-2", completed: 58, wip: 27, todo: 15 },
      { name: "Priya Nair", position: "SDE-1", completed: 44, wip: 31, todo: 25 },
      { name: "Karan Mehta", position: "SDE-3", completed: 66, wip: 19, todo: 15 },
      { name: "Isha Kapoor", position: "SDE-1", completed: 37, wip: 38, todo: 25 },
      { name: "Rahul Chawla", position: "SDE-2", completed: 51, wip: 29, todo: 20 },
    ],
  },
  {
    pod: "Consumer Post Order",
    members: [
      { name: "Meera Iyer", position: "SDE-2", completed: 60, wip: 20, todo: 20 },
      { name: "Arjun Rao", position: "SDE-1", completed: 42, wip: 33, todo: 25 },
      { name: "Simran Kaur", position: "SDE-1", completed: 53, wip: 27, todo: 20 },
      { name: "Yash Malhotra", position: "SDE-3", completed: 68, wip: 17, todo: 15 },
      { name: "Neha Joshi", position: "SDE-2", completed: 46, wip: 29, todo: 25 },
      { name: "Vikram Shah", position: "SDE-1", completed: 35, wip: 40, todo: 25 },
    ],
  },
  {
    pod: "Supply Chain",
    members: [
      { name: "Rohit Sharma", position: "SDE-2", completed: 64, wip: 21, todo: 15 },
      { name: "Navdeep Kaur", position: "SDE-1", completed: 49, wip: 31, todo: 20 },
      { name: "Amrit Singh", position: "SDE-3", completed: 72, wip: 13, todo: 15 },
      { name: "Rauneet Singh", position: "SDE-1", completed: 41, wip: 34, todo: 25 },
      { name: "Divyansh Tripathi", position: "SDE-2", completed: 56, wip: 24, todo: 20 },
    ],
  },
  {
    pod: "Devops",
    members: [
      { name: "Ankit Yadav", position: "SDE-2", completed: 59, wip: 26, todo: 15 },
      { name: "Pooja Reddy", position: "SDE-1", completed: 45, wip: 30, todo: 25 },
      { name: "Karthik Menon", position: "SDE-3", completed: 70, wip: 15, todo: 15 },
      { name: "Divya Pillai", position: "SDE-1", completed: 38, wip: 37, todo: 25 },
      { name: "Rohan Desai", position: "SDE-2", completed: 52, wip: 28, todo: 20 },
    ],
  },
  {
    pod: "Data",
    members: [
      { name: "Sneha Gupta", position: "SDE-2", completed: 61, wip: 24, todo: 15 },
      { name: "Aman Khurana", position: "SDE-1", completed: 43, wip: 32, todo: 25 },
      { name: "Ritu Chauhan", position: "SDE-3", completed: 67, wip: 18, todo: 15 },
      { name: "Naveen Pillai", position: "SDE-1", completed: 39, wip: 36, todo: 25 },
      { name: "Tanvi Saxena", position: "SDE-2", completed: 54, wip: 26, todo: 20 },
    ],
  },
  {
    pod: "UAE",
    members: [
      { name: "Omar Al Farsi", position: "SDE-2", completed: 57, wip: 28, todo: 15 },
      { name: "Fatima Noor", position: "SDE-1", completed: 47, wip: 28, todo: 25 },
      { name: "Zainab Hussain", position: "SDE-3", completed: 69, wip: 16, todo: 15 },
      { name: "Hamza Sheikh", position: "SDE-1", completed: 36, wip: 39, todo: 25 },
      { name: "Layla Ahmed", position: "SDE-2", completed: 50, wip: 30, todo: 20 },
    ],
  },
  {
    pod: "Testing",
    members: [
      { name: "Rakesh Kumar", position: "QA-1", completed: 63, wip: 22, todo: 15 },
      { name: "Swati Singh", position: "QA-2", completed: 48, wip: 27, todo: 25 },
      { name: "Nikhil Bansal", position: "QA-1", completed: 55, wip: 25, todo: 20 },
      { name: "Anjali Rao", position: "QA-2", completed: 40, wip: 35, todo: 25 },
      { name: "Deepak Nair", position: "QA-1", completed: 65, wip: 20, todo: 15 },
      { name: "Kritika Sharma", position: "QA-2", completed: 44, wip: 31, todo: 25 },
    ],
  },
];
