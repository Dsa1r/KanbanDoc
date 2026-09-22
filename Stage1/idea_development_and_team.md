# Stage 1 Report: Team Formation and Idea Development

---

## 1. Team Formation Overview
Our team brings together a diverse blend of technical software engineering skills, business analysis, enterprise architecture, and domain expertise.

### 1.1 Team Members & Bios:
* **Areej Alghamdi:**
  * **Background:** Healthcare Sector background (Nursing) transitioning into software engineering, combining domain insights with technical development for the Holberton School final project.
* **Noura Alosaimi:**
  * **Background:** Software Engineering student at Holberton School with experience in individual and collaborative programming projects.
  * **Technical Skills:** Python, C, JavaScript, HTML & CSS, Flask, RESTful APIs, SQL/MySQL, Git & GitHub, OOP.
* **Reema Alshahrani:**
  * **Background:** Computer Information Systems (CIS) student and Software Engineering student at Holberton School, bringing practical expertise in the Software Development Life Cycle (SDLC), enterprise architecture, project management concepts, and drafting technical proposals for companies.
  * **Technical Skills:** Frontend and Backend development, databases, Python, C, Java, JavaScript, HTML & CSS, Flask, RESTful APIs, SQL/MySQL, Git & GitHub, OOP, and basic UX design.
* **Dana Alqwaifel:**
  * **Background:** computer information systems student (Data Science and Management Track), and Software Engineering student at Holberton School, collaborating on technical problem-solving and system architecture.
  * **Technical Skills:** C, C#, Java, Python, ASP.NET, SQL, OOP, System Design, APIs, Cloud Computing.
  * 
---
### 1.2 Collaboration & Communication Strategy:

* **Communication Tools:** We use WhatsApp for daily syncs, quick asynchronous updates, and real-time technical troubleshooting.
* **Task Management & Documentation:** We use Notion specifically for task distribution and workflow tracking, while project documentation and code versioning are handled entirely via GitHub.
* **Workflow & Decision Making:** Tasks and workflows are managed and distributed by the Project Manager, who oversees and ensures the completion of all assignments. Technical decisions are made collaboratively.

---

## 2. Ideas Explored & Rejected
During our brainstorming phase, we explored several potential concepts before finalizing our MVP:

### Idea 2.1: Supplier Sourcing Platform for Small Businesses
* **Overview:** A web platform designed to help new entrepreneurs and small business owners find, compare, and communicate with suitable suppliers and materials in one centralized place instead of scattering across multiple channels[cite: 1].
* **Key Features:** Buyer/supplier accounts, categorized supplier search, Request for Quotation (RFQ), and quotation comparisons[cite: 1].
* **Strengths:** Solves a real-world search friction, clear target audience, and high scalability potential[cite: 1].
* **Weaknesses & Challenges:** Existing B2B competition, two-sided marketplace dependency, and the complexity of supplier data acquisition and verification[cite: 1].
* **Reason for Rejection:** Although it addressed a genuine problem, the complexity of building a two-sided marketplace and acquiring suppliers made it unsuitable for the strict MVP timeline[cite: 1].

### Idea 2.2: EduPulse — EduPulse: AI Academic Analytics
* **Overview:** An intelligent platform designed to aggregate academic data, analyze student study journeys, and provide explainable recommendations and adaptive support.
* **Strengths:** Addresses student fragmentation of schedules and grades; introduces proactive advisory logic.
* **Weaknesses & Challenges:** High friction in data input/transcript acquisition, and high algorithmic complexity in accurately predicting individual student circumstances.
* **Reason for Rejection:** High technical complexity and scope risk within the short timeframe.


### Idea 2.3: PathFinder (Adaptive Tech Career Roadmap Platform)
- **Overview:** A web platform that helps tech students discover which specialization path (web, mobile, data, cybersecurity, etc.) suits them best. Instead of a single static roadmap, the platform generates multiple roadmap variants per path tailored to the learner's style (project-first vs. theory-first), and uses AI-driven analysis of post-task reflection answers to build a dynamic, evolving skill profile.
- **Key Features:** Adaptive multi-variant roadmaps per tech path; AI-powered reflection analysis that converts free-text answers into structured skill scores; per-task time/effort estimation; auto-generated PDF skill report and lightweight HTML portfolio upon roadmap completion; sequential progress-lock tied to sharing progress on LinkedIn.
- **Strengths:** Addresses a widely relatable pain point, most tech students genuinely struggle to pick a specialization and waste significant time on trial and error. Differentiates clearly from static tools like roadmap.sh by adapting to the individual learner and producing a tangible, shareable proof-of-skill output rather than just a completion badge. The LinkedIn-sharing mechanic also creates organic, built-in marketing potential.
- **Weaknesses & Challenges:** The full feature set is large for a short MVP window adaptive roadmap generation, continuous AI-based skill analysis, automated PDF/portfolio generation, and LinkedIn integration are each non-trivial on their own. The platform also depends on curating sufficient quality course/project content per path, which is a manual content-acquisition bottleneck.
- **Reason for Rejection:** Although the idea solves a genuine and highly relatable problem, its combined feature scope (multi-variant adaptive roadmaps + continuous AI skill analysis + automated PDF/portfolio generation + LinkedIn-gated progression) effectively describes a complete product rather than an MVP achievable within the project's strict short timeline.

### Idea 2.4: StartupLens (Idea-to-Market Comparison Tool for Entrepreneurs)

- **Overview:** A web tool that helps aspiring entrepreneurs validate their business idea by comparing it against a database of existing startups and companies. The user describes their idea through a structured input flow, and an AI-powered matching engine returns a report of similar companies, the key people behind them, the main challenges and opportunities they faced, and common traits shared across companies similar to the user's idea.
- **Key Features:** Structured idea-intake form (domain, problem solved, target audience, rough business model); AI-based analysis of the submitted idea to extract domain and potential weaknesses; comparison engine matching the idea against a curated company/startup database; output report showing similar companies, founders/stakeholders, key challenges, opportunities, and shared traits; development suggestions directing the user toward relevant consultation resources based on their idea type and identified gaps.
- **Strengths:** Addresses a real gap for early-stage entrepreneurs, who often lack practical exposure to how similar ventures actually played out. Provides a realistic, evidence-based reality check instead of generic advice, and could integrate with existing entrepreneurship support programs (e.g. Monsha'at, Misk, Tuwaiq) as a lightweight triage layer. Clear national relevance given ongoing efforts to grow youth entrepreneurship.
- **Weaknesses & Challenges:** The biggest bottleneck is data, there is no ready-made, comprehensive dataset of Saudi/regional startups with structured details on challenges, opportunities, and founders, so the database would need to be manually curated for an MVP. The AI-based idea-to-company matching logi adds technical complexity. A later-stage feature, a privacy preserving AI interface for partner organizations to screen ideas without reading full details, expands scope well beyond a typical MVP.
- **Reason for Rejection:** While the idea has strong real-world value, its core value proposition depends entirely on the quality and breadth of the company/startup dataset, which is not available off-the-shelf and would require significant manual data collection to be credible even at MVP scale. Combined with the added complexity of building a reliable matching engine within a short project timeline, the data-acquisition risk made this idea less suitable than the selected MVP.


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

 ---

 ### THE SCAMPER FRAMEWORK: 
 (Innovating Jira/Trello FOR JUNIOR SOFTWARE DEVELOPER)

* S- Substitute (What can we swap out?)
We can substitute Jira’s heavy corporate managers’ data dashboard with a simple, beginner friendly checklist.

* C- Combine (What can we merge?)
We combined Kanban board with an educational guide, so that it tracks work and teaches workflow at the same time.

* A- Adapt (What can we borrow from elsewhere?)
We adopt the concept of a GPS navigation system. Just like the GPS tells the driver the immediate next turn we will tell the junior developer in our top banner the immediate next task.

* M- Modify/Magnify (What can we make bigger/magnify?)
We can magnify the ‘Where to start’ action button, and [START CODING] banner at the top of the screen.

* P- Put it to another use (Who else can use this?)
We take the Kanban concept and put it to use specifically and exclusively for junior software engineers.

* E- Eliminate (What can we delete entirely?)
We can take off about 80% _is is just estimation- of Jiras’ screen clutter. Deleting complex Charts, configurations sidebar, setting tabs.

* R- Reverse/ Rearrange (What can we flip around?)
Instead of making the junior developers search the board to find the task, we reverse it to make the board automatically appear the correct task at the top of the header for them.

---

### What makes Developers compass project MVP idea stand-out?
Junior Developers often experience cognitive overload and decision paralysis when looking at traditional Project Management Tools. They don't know where to start?, where each phase starts and ends?, what the next steps are?, or what it is called?.
In our idea we introduce the top ‘Next Up’ Action Banner and stripping the interface down to only three columns to act as an educational guardrail.

---

### Expected Outcomes (The Result)
* Reduced Time-to-Start: The user will spend zero minutes wondering what task to pick up next when they open the website.
* Eliminates Screen Clutter: The user can look at the workspace without feeling overwhelmed or lost in administrative data.
* Independent onboarding: A Junior engineer can easily and successfully navigate their daily task cycle without needing a manager to constantly tell them their next step.

---

### Conclusion
By focusing entirely on the junior experience, we turn a tedious management tool into a supportive learning environment. We are confident that our Kanban will be completely distinct from anything else on the market.
