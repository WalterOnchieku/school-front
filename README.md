
# Student Management System

A comprehensive web application for managing students, teachers, classes, scores, reports, fee management, and more. This project leverages React for the frontend and Flask for the backend to deliver an efficient, feature-rich platform.

---

## Features

### General
- Responsive and user-friendly interface.
- Integrated search and filtering options.
- Pagination support for large datasets.

### Student Management
- Add, update, and delete student records.
- Manage key student data:
  - Name
  - Date of Birth
  - Gender
  - Date of Admission
  - Class
  - Pickup Location
  - NEMIS and Assessment Numbers

### Teacher Management
- Add, update, and delete teacher records.
- Manage teacher details such as:
  - Name
  - Subject(s) taught
  - Hire date
  - Contact information

### Scores Management
- Record and update student scores for various assessments.
- Link scores to specific students and classes.
- View a summary of student performance.

### Reports
- Generate and view reports for:
  - Student performance
  - Attendance
  - Fee payments
- Export reports as PDF for offline use.

### Fee Management
- Record and manage fee payments for students.
- Display payment history and balance.
- Generate reminders for outstanding payments.

### Classes
- View a list of available classes.
- Assign students and teachers to classes.

### Pickup Locations
- Manage pickup locations for students.
- Assign students to appropriate pickup points.

---

## Tech Stack

### Frontend
- **React**: Manages the UI and component structure.
- **React Toastify**: Provides notifications for user actions.
- **CSS/TailwindCSS**: Ensures clean and responsive design.

### Backend
- **Flask**: RESTful API for handling CRUD operations.
- **SQLite/PostgreSQL**: Database for storing and managing application data.

---

## Installation

### Prerequisites
- Node.js (for running the React app)
- Python (for running the Flask backend)

### Frontend Setup
1. Navigate to the `my-school-app` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   

### Backend Setup
The backend will be on a separate Repository: https://github.com/WalterOnchieku/school-back
 1. After forking and cloning, do the following:
   ```bash
   cd school
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the database and Run the Flask server:
   ```bash
  python app.py
   ```

   
   The API will be available at `http://127.0.0.1:5000`.

---

## API Endpoints

### Students
- `GET /students`: Retrieve a paginated list of students.
- `POST /students`: Add a new student.
- `PUT /students/<id>`: Update a student’s details.
- `DELETE /students/<id>`: Delete a student.

### Teachers
- `GET /teachers`: Retrieve a list of teachers.
- `POST /teachers`: Add a new teacher.
- `PUT /teachers/<id>`: Update a teacher’s details.
- `DELETE /teachers/<id>`: Delete a teacher.

### Classes
- `GET /classes`: Retrieve a list of classes.

### Pickup Locations
- `GET /pickup-locations`: Retrieve a list of pickup locations.

### Scores
- `GET /scores`: Retrieve scores for students.
- `POST /scores`: Add or update scores for a student.

### Reports
- `GET /reports`: Generate various reports.
- `POST /reports/export`: Export reports as PDF.

### Fee Management
- `GET /fees`: Retrieve fee payment history and balances.
- `POST /fees`: Record a new fee payment.
- `GET /fees/balance`: Get outstanding balances for students.

---

## Usage

### Managing Students
- Add, update, and delete students via the **Students** page.
- Use the search bar to filter students by name or ID.

### Managing Teachers
- Navigate to the **Teachers** page to add or edit teacher information.
- Assign subjects and classes to each teacher.

### Recording Scores
- Go to the **Scores** page to enter or update scores.
- Filter scores by class or student.

### Generating Reports
- Access the **Reports** section to generate reports.
- Export reports as PDF for offline sharing or storage.

### Managing Fees
- View fee payment history and outstanding balances on the **Fee Management** page.
- Record new payments and send reminders for overdue fees.

---



## Future Enhancements
- User authentication for secure access.
- Role-based access control for admin, teachers, and staff.
- Advanced reporting with customizable filters.
- Mobile application support for easier access.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

