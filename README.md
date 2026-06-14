# 🏥 QueueCure

QueueCure is a real-time clinic queue management system designed to streamline patient flow, reduce receptionist workload, and improve the waiting experience for patients.

## Problem Statement

Many small clinics still manage queues manually using paper slips or verbal announcements. This often creates confusion regarding token numbers, waiting times, and patient order.

QueueCure solves this problem through a digital queue system with real-time updates.

## Features

* Add Patient with unique token generation
* Call Next Patient
* Live Queue Tracking
* Search Token Position
* Cancel Token
* Real-Time Waiting Room Updates using Socket.IO
* Estimated Wait Time Calculation
* LocalStorage Persistence
* Responsive User Interface

## Tech Stack

* React.js
* Socket.IO
* Node.js
* Express.js
* CSS
* LocalStorage

## How It Works

### Receptionist Dashboard

* Adds patients to the queue
* Calls next patient
* Searches token position
* Cancels patient tokens
* Monitors queue statistics

### Waiting Room

* Displays current patient being served
* Shows patients waiting
* Displays estimated waiting time
* Receives real-time updates

## Key Concepts Used

* React Hooks (useState, useEffect)
* Socket.IO Real-Time Communication
* Local Storage Persistence
* Array Methods (map, filter, findIndex)
* Conditional Rendering

## Future Scope

* Doctor Dashboard
* Multiple Counters
* Database Integration
* SMS/WhatsApp Notifications
* QR-Based Token System

## Developed By

Sanskriti Parida
B.Tech CSE, KIIT University
