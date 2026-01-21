# Smart Water Management System (SWMS)

## Overview
SWMS is an intelligent system designed to monitor and manage water resources efficiently. It leverages AI and IoT technologies to optimize water usage, detect leaks, and predict consumption patterns.

## Architecture
The project is divided into two main components:
- **Frontend**: Built with **Vanilla HTML/CSS/JS** for a lightweight, premium, and zero-dependency interface.
- **Backend**: Built with **Python and FastAPI** to handle data processing, AI model integration, and API requests.

## Getting Started

### Prerequisites
- **Python (v3.9+)** (Required for Backend)

### Quick Start (Windows)
Double-click `setup_and_run.bat` to automatically install backend dependencies and launch the system.

### Manual Installation

#### Backend (API)
1.  Open terminal in `backend/` folder.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```

#### Frontend (Website)
1.  Go to the `frontend/` folder.
2.  Double-click `index.html` to open it in your browser.
