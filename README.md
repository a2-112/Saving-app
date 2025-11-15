)
📌 Project Summary

This is a savings group web application built with HTML, CSS, and JavaScript.
The app simulates a cooperative where 12 students contribute money weekly based on a tier, and their savings grow using compound interest.

Students can:

Register using a name + tier

Earn weekly interest

Withdraw

Free their slot for a new student

The dashboard updates dynamically at every event.

🎯 Goals of the Application

Teach saving behavior using a tier system

Simulate compound interest used in blockchain play-to-earn games

Practice form validation, dynamic UI updates, and array manipulation

Demonstrate real-world JavaScript skills

🧮 Tier Breakdown
Tier	Amount	Weekly Interest
1	₦10,000	5%
2	₦20,000	10%
3	₦30,000	20%

Each student’s savings grow using compound interest, meaning:

newTotal = oldTotal + (oldTotal * rate)

🧠 How the App Works
✔ 1. Student Registration

A student enters:

Name

Tier

The app automatically:

Assigns the correct amount

Assigns the correct weekly interest rate

Starts the student at week 0

Stores the student in an array

✔ 2. Tier Validation

The user cannot:

Enter a wrong amount

Skip name

Skip tier

Add more than 12 members

✔ 3. Weekly Update (Compound Interest)

Every time the Next Week button is clicked:

Each student’s savings grow:

interest = currentTotal * interestRate
currentTotal += interest


Weeks increase by 1

Dashboard updates

Total group savings recalculated

✔ 4. Withdrawals

When a student withdraws:

They are removed from the array

Total savings updates

A new student can join

/-- Project Structure --/
/
│── index.html     → UI markup
│── style.css      → Styling (optional)
│── savings.js     → Main logic
│── README.md      → Documentation

/-- How to Use the App --/
1. Enter a name
2. Select a tier
3. Click Register Student
4. Click Next Week to compound interest
5. Click Withdraw to remove a member
🌍 Deployment Options
You can deploy on:

✔ GitHub Pages
