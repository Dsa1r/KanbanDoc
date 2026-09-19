# Stage 1 Report: Team Formation and Idea Development

---

## 1. Team Formation Overview
Our team brings together a diverse blend of technical software engineering skills, business analysis, enterprise architecture, and domain expertise.

### Team Members & Bios:
* **Areej Alghamdi:**
  * **Background:** Healthcare Sector background (Nursing) transitioning into software engineering, combining domain insights with technical development for the Holberton School final project.
* **Noura Alosaimi:**
  * **Background:** Software Engineering student at Holberton School with experience in individual and collaborative programming projects.
  * **Technical Skills:** Python, C, JavaScript, HTML & CSS, Flask, RESTful APIs, SQL/MySQL, Git & GitHub, OOP.
* **Reema Alshahrani:**
  * **Background:** Computer Information Systems (CIS) student and Software Engineering student at Holberton School, bringing practical expertise in the Software Development Life Cycle (SDLC), enterprise architecture, project management concepts, and drafting technical proposals for companies.
  * **Technical Skills:** Frontend and Backend development, databases, Python, C, Java, JavaScript, HTML & CSS, Flask, RESTful APIs, SQL/MySQL, Git & GitHub, OOP, and basic UX design.
* **Dana Alqwaifel:**
  * **Background:** Software Engineering student at Holberton School, collaborating on technical problem-solving and system architecture.
  * **Technical Skills:** .


---

## 2. Ideas Explored & Rejected
During our brainstorming phase, we explored several potential concepts before finalizing our MVP:

### Idea 1: Supplier Sourcing Platform for Small Businesses
* **Overview:** A web platform designed to help new entrepreneurs and small business owners find, compare, and communicate with suitable suppliers and materials in one centralized place instead of scattering across multiple channels[cite: 1].
* **Key Features:** Buyer/supplier accounts, categorized supplier search, Request for Quotation (RFQ), and quotation comparisons[cite: 1].
* **Strengths:** Solves a real-world search friction, clear target audience, and high scalability potential[cite: 1].
* **Weaknesses & Challenges:** Existing B2B competition, two-sided marketplace dependency, and the complexity of supplier data acquisition and verification[cite: 1].
* **Reason for Rejection:** Although it addressed a genuine problem, the complexity of building a two-sided marketplace and acquiring suppliers made it unsuitable for the strict MVP timeline[cite: 1].

### Idea 2: EduPulse — EduPulse: AI Academic Analytics
* **Overview:** An intelligent platform designed to aggregate academic data, analyze student study journeys, and provide explainable recommendations and adaptive support.
* **Strengths:** Addresses student fragmentation of schedules and grades; introduces proactive advisory logic.
* **Weaknesses & Challenges:** High friction in data input/transcript acquisition, and high algorithmic complexity in accurately predicting individual student circumstances.
* **Reason for Rejection:** High technical complexity and scope risk within the short timeframe.

### Idea 3: [Friend's Idea Concept]
* **Overview:** Evaluated as an alternative educational or workflow concept.
* **Reason for Rejection:** Discussed collaboratively, but the team ultimately aligned on a more targeted developer-centric MVP goal.

---

## 3. Selected MVP Concept: DevCompass
* **Project Name:** DevCompass (A next-step Kanban for the junior developer’s journey)
* **Summary of the Chosen MVP:** A minimalist, junior-focused 3-column Kanban board (To Do, In Local Coding, Code Review) enhanced with a dynamic **'Next Up' Action Banner** that explicitly tells the developer their immediate next priority, reducing cognitive overload.
* **Reasons for Selection:**
  * **Feasibility:** Built using lightweight React and browser LocalStorage, avoiding complex database configurations and fitting the strict timeframe.
  * **Potential Impact:** High potential because it solves a universal pain point (decision paralysis and Jira clutter for junior developers).
  * **Innovation (SCAMPER Framework Applied):** Strips away 80% of corporate Jira administrative clutter and replaces it with automated developer workflow guidance.
* **Risks and Constraints:**
  * Risk of scope creep (adding too many features like dark mode or extra notifications too fast). *Mitigation:* Strict adherence to the core MVP scope.
  * Data persistence on refresh. *Mitigation:* Implementing browser `LocalStorage`.
