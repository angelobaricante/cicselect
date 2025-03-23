# CICSelect: Online Voting System for CICS-SC

## Product Requirements Document

### 1. Introduction

#### 1.1 Purpose
CICSelect is an online voting system designed specifically for the College of Informatics and Computing Sciences Student Council (CICS-SC). It facilitates secure and efficient student council elections and other voting activities within the college.

#### 1.2 Scope
The system provides a comprehensive platform for conducting elections, managing candidates, tracking results, and ensuring transparent voting processes for both students and administrators.

#### 1.3 Target Users
- **Students (Voters)**: CICS students who participate in the election process
- **Administrators**: CICS-SC officers responsible for managing the election process

### 2. System Overview

#### 2.1 System Architecture
CICSelect is a web-based application built with:
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI components and custom Shadcn UI
- **Authentication**: Currently using mock authentication, to be replaced with a secure auth system
- **Database**: Supabase (PostgreSQL) for data persistence

#### 2.2 Key Features
- User authentication with role-based access control
- Election campaign creation and management
- Candidate registration and profile management
- Secure voting system
- Real-time election results and analytics
- Mobile-responsive design for accessibility

### 3. User Roles and Permissions

#### 3.1 Student (Voter)
- Authenticate with SR code and password
- View active election campaigns
- Cast votes in active elections
- View election results after they are published
- View personal voting history

#### 3.2 Administrator
- Authenticate with admin credentials
- Create, edit, and manage election campaigns
- Add and manage candidates
- Monitor voting progress
- Generate and view election results
- Publish results to students

### 4. Functional Requirements

#### 4.1 Authentication System
- **Login Page**
  - Role-based login (Student/Admin)
  - Secure authentication with SR code for students
  - Admin authentication with admin credentials
  - Session management and persistence

#### 4.2 Admin Dashboard
- **Campaign Management**
  - Create new election campaigns
  - Set election parameters (title, description, deadline)
  - Define positions for election
  - Edit existing campaigns
  - Delete or archive past campaigns

- **Candidate Management**
  - Add candidates for each position
  - Edit candidate profiles
  - Remove candidates from elections

- **Results Management**
  - View real-time voting statistics
  - Generate final election results
  - Publish results to students

#### 4.3 Student (Voter) Features
- **Dashboard**
  - View active and upcoming elections
  - See voting status (voted/not voted)
  - Access to election details

- **Voting Process**
  - Select candidates for each position
  - Review selections before submission
  - Submit votes securely
  - Receive confirmation of successful voting

- **Results Viewing**
  - View published election results
  - See statistics and voter turnout

### 5. Non-Functional Requirements

#### 5.1 Performance
- The system should load pages within 2 seconds
- Support for at least 1000 concurrent users
- Handle peak traffic during election periods

#### 5.2 Security
- Secure authentication and authorization
- Data encryption for sensitive information
- Prevention of double voting
- Audit logs for all administrative actions

#### 5.3 Usability
- Mobile-responsive design
- Intuitive user interface
- Accessibility compliance (WCAG 2.1)
- Clear error messages and feedback

#### 5.4 Reliability
- 99.9% uptime during active election periods
- Automated backups of election data
- Fault tolerance for system failures

### 6. Data Models

#### 6.1 User
- SR Code (unique identifier)
- Name
- Role (voter/admin)
- Course (for voters)
- Password (hashed)

#### 6.2 Campaign
- ID (unique identifier)
- Title
- Description
- Deadline
- Positions
- Status (active/closed)

#### 6.3 Candidate
- ID (unique identifier)
- Campaign ID (foreign key)
- Name
- Course
- Position
- Platform

#### 6.4 Entry (Vote Record)
- ID (unique identifier)
- Campaign ID (foreign key)
- Voter SR Code
- Timestamp
- Votes (position -> candidate mapping)

#### 6.5 Result
- Campaign ID (foreign key)
- Position
- Candidate ID (foreign key)
- Vote count

### 7. User Interface Design

The UI follows modern web design principles with a clean, minimalist approach:
- Consistent layout across all pages
- Responsive design for all device sizes
- Intuitive navigation
- Tailwind CSS for styling
- Accessible form controls and interactive elements

### 8. Future Enhancements

#### 8.1 Short-term (Next 3 months)
- Integration with school database for student verification
- Email notifications for voting and results
- Enhanced security features
- Comprehensive admin dashboard analytics

#### 8.2 Long-term (6-12 months)
- Mobile application version
- Integration with CICS-SC website
- Advanced analytics and reporting
- Support for different types of voting systems (ranked choice, etc.)
- API for third-party integrations

### 9. Implementation Timeline

#### Phase 1: Core System (Months 1-2)
- Authentication system
- Basic admin and voter dashboards
- Campaign and candidate management
- Voting functionality

#### Phase 2: Enhancements (Months 3-4)
- Results visualization
- Security improvements
- UI/UX refinements
- Testing and bug fixes

#### Phase 3: Launch and Monitoring (Month 5)
- System deployment
- User training
- Support and maintenance
- Feedback collection

### 10. Appendix

#### 10.1 Glossary
- **CICS-SC**: College of Informatics and Computing Sciences Student Council
- **SR Code**: Student Registration Code, unique identifier for students
- **Campaign**: An election event within the system
- **Entry**: A record of a student's vote submission

#### 10.2 References
- Next.js documentation
- React documentation
- Tailwind CSS guidelines
- CICS-SC election guidelines 