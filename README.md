# FinWise: Agentic Financial Underwriting Engine
### *Precision Credit Analysis for the Modern Fintech Landscape*

**FinWise** is an automated, agentic underwriting pipeline designed to transform raw corporate data into actionable credit intelligence. By combining advanced document parsing, heuristic-driven data filtering, and real-time market research, FinWise generates comprehensive **Credit Appraisal Memos (CAM)** in seconds.

---

## 🎨 Frontend Architecture & UX

The frontend is a high-performance Single Page Application (SPA) designed for financial analysts who require speed and clarity.

* **Framework**: **React 18** utilizing Functional Components and Hooks for state management.
* **Styling**: **Tailwind CSS** for a responsive, mobile-first professional dashboard.
* **Stateful UI Flow**:
    * **Dynamic Onboarding**: Multi-step form validation using controlled components to capture applicant metadata.
    * **Real-time Processing Feedback**: Integrated polling mechanism to track backend AI processing status (`Pending` ➔ `Extracting` ➔ `Analyzing` ➔ `Completed`).
    * **Interactive Analysis Dashboard**: Data visualization of the SWOT analysis and credit recommendation using Tailwind-styled cards.
* **Deployment**: Hosted on **Vercel** with optimized production builds and edge-network distribution.

---

## 🛠️ Technical Architecture

### The Intelligence Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Orchestration** | **FastAPI** | High-performance, asynchronous API gateway. |
| **Extraction** | **LlamaParse** | Industry-leading document intelligence for complex financial tables. |
| **Core LLM** | **Google Gemini (GenAI)** | Advanced reasoning for SWOT and credit risk modeling. |
| **Persistence** | **SQLAlchemy / SQLite** | Robust local state management and application tracking. |
| **Research** | **ddgs API** | Real-time secondary research and sentiment analysis. |

---

## 📦 Deployment & Orchestration

To ensure environmental parity between local development and production, this project utilizes custom shell scripts for deployment on Render.

### Automated Build & Startup
* **`render-build.sh`**: Handles dependency resolution, environment patching, and directory structure initialization.
* **`render-start.sh`**: Manages the production server binding to dynamic ports and production-grade Uvicorn orchestration.

---

## 🚀 Getting Started

### Local Environment Setup
1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/Devil-8790/Intelli_credit_os.git](https://github.com/Devil-8790/Intelli_credit_os.git)
    cd fintech-underwriter-pro/backend
    ```
2.  **Initialize Virtual Environment**:
    ```bash
    python -m venv myenv
    source myenv/bin/activate  # Windows: myenv\Scripts\activate
    ```
3.  **Install Production Dependencies**:
    ```bash
    python -m pip install -r requirements.txt
    ```

### Required Configuration
Create a `.env` file in the root directory:
```text
GOOGLE_API_KEY=your_gemini_api_key
LLAMA_CLOUD_API_KEY=your_llamaparse_key
DATABASE_URL=sqlite:///./underwriter.db
