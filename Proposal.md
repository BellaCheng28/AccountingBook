# Project Proposal 
## - [x]Accouting book 
## Project Description 
My app is called money bulg, a danamic designed to help persons efficiently track and manage their personal finances.This app will provide a user-friendly interface for user to easily record their income and expenses,view financial summaries,set budgets,and monitor their financial progress over time.by offering visualizations,notificatons,and categorization features, the app aims to improve users' financial awareness and planning.

  

## User Stories
### MVP Goals
*   As a User , I want to sign up for an account and sign in, so that I can access my personal user profile and manage my accoutingBook
*   As a User, I want to add my families in my accoutingBook,so that my families can manage accoutingBook.
*   As a user, I want to add income and expense records easily so that I can track my financial activities.
*  As a user, I want to view my financial summary so that I can track my spending and savings.
*  As a user, I want to see simple charts that show where I am spending the most money, so I can make better financial decisions.
  
### Stretch Goals
* As a user, I want to set recurring expenses (e.g., rent, subscriptions) so that I don't have to manually enter them each month.
  
## Data modeling 
In this project, I create three primary models:User,Accouting book and Entry.These models represent the core components of AccoutingBook app.The Accouting book will reference the user model to manage their finance and the user also reference the accouting book that he can have many accouting books.The Entry will be embedded in the accouting book


## ERD
An ERD (Entity-Relationship Diagram) will help you visualize the relationships between these models:
[ERD](https://lucid.app/lucidchart/b440368b-2cb3-4c59-8285-994850d32c79/edit?viewport_loc=74%2C-19%2C1685%2C748%2C0_0&invitationId=inv_33563eba-3aa7-4d2a-a79c-9a764700ee14)

## Define RESTful routes for managing data
Use the following charts as guides when building your RESTful routes.
User routes
| Action | Route          | HTTP  Verb |
| ------ | -------------- | ---------- |
| Index  | /users         | GET        |
| New    | /users/new     | GET        |
| Create | /users         | POST       |
| Show   | /users/:userId | GET        |



accouting book routes
| Action | Route                                | HTTP  Verb |
| ------ | ------------------------------------ | ---------- |
| Index  | /accoutingBook                       | GET        |
| New    | /accoutingBook/new                   | GET        |
| Create | /accoutingBook                       | POST       |
| Show   | /accoutingBook/:accoutingBookId      | GET        |
| Edit   | /accoutingBook/:accoutingBookId/edit | GET        |
| Update | /accoutingBook/:accoutingBookId      | PUT        |
| Delete | /accoutingBook/:accoutingBookId      | DELETE     |
>Note:you may not need all of these routes and views in your application

Entry routes
| Action | Route                | HTTP  Verb |
| ------ | -------------------- | ---------- |
| Index  | /entry               | GET        |
| New    | /entry/new           | GET        |
| Create | /entry               | POST       |
| Show   | /entry/:entryId      | GET        |
| Edit   | /entry/:entryId/edit | GET        |
| Update | /entry/:entryId      | PUT        |
| Delete | /entry/:entryId      | DELETE     |

>Note:you may not need all of these routes and views in your application

## Wire Frames
Initial Landing View: 
[Wire Frames](https://lucid.app/lucidchart/fa227e8d-762f-45f8-8fc9-01f574f9e785/edit?beaconFlowId=4C3622244B97950B&invitationId=inv_a1910e5a-d775-4fab-b40e-644e250e5233&page=0_0#)

1. Home Screen: 
  * A dashboard showing date ,total income,total expenses,current balance and budget.
  * Quick acccess to add new income/expese records and see more recording statements.
   
2. Report Screen:
  * Pie chart or bar graph showing expenses by category.
  * A monthly summary of total income and expenses.  
  * Option to filter by date range (weekly, monthly, yearly).
  
3. Settings Screen:
 * Account settings  
 * Add catergories 
 * Add families

## Timeline - Daily Accountability
| Day       | Task                                        |
| --------- | ------------------------------------------- |
| Friday    | Writing Proposal and Submit to github       |
| Satuday   | Create Structure and Setup                  |
| Sunday    | Build the routes and views                  |
| Monday    | Build the new page and Create functionality |
| Tuesday   | Add index pages and show pages              |
| Monday    | Build Delete routes , Edit pages            |
| Tuesday   | Build Update functionality                  |
| Wednesday | Connect user to acccoutingBook and entry    |
| Thursday  | Test and fix codings                        |
| Friday    | Presentation                                |


  

  
