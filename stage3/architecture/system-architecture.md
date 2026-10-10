## System Architecture

## 1. High-Level System Architecture

This diagram illustrates the macro-level architecture of **DevCompass**, establishing how the React frontend, the Flask backend (utilizing a Strategy Pattern), and the Supabase cloud database interact natively without local stack bloat.

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Client Layer — React App"]
        Frontend["Web Browser / React Interface"]
    end
   
    subgraph Server ["Backend API — Python & Flask"]
        Backend["Flask Application Logic"]
    end
   
    subgraph Database ["Cloud Storage — Supabase & Postgres"]
        DB["Supabase Cloud Database"]
    end
   
    Frontend --->|Sends user requests via HTTPS| Backend
    Backend --->|Queries & updates data via Python SDK| DB
