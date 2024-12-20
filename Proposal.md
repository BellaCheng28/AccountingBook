# Project Proposal 
## - [x]Accouting book 
## Project Description 
My app is called accountingbooks, a danamic designed to help persons efficiently track and manage their personal finances.This app will provide a user-friendly interface for user to easily record their income and expenses,view financial summaries,and monitor their financial progress over time.by offering visualizations,notificatons,and categorization features, the app aims to improve users' financial awareness and planning.

  

## User Stories
### MVP Goals
*   As a User , I want to sign up for an account and sign in, so that I can access my personal user profile and manage my accoutingBook
*   As a User, I want to add my families in my accoutingBook,so that my families can manage accoutingBook.
*   As a user, I want to add income and expense records easily so that I can track my financial activities.
*  As a user, I want to view my financial summary so that I can track my spending and savings.

  
### Stretch Goals
* As a user, I want to set recurring expenses (e.g., rent, subscriptions) so that I don't have to manually enter them each month.
  
## Data modeling 
In this project, I create three primary models:User,Accouting book and Entry.These models represent the core components of AccoutingBook app.The Accouting book will reference the user model to manage their finance and the user also reference the accouting book that he can have many accouting books.The Entry will be embedded in the accouting book


## ERD
An ERD (Entity-Relationship Diagram) will help you visualize the relationships between these models:
![ERD](./public/image/ERD.png)

## Define RESTful routes for managing data
Use the following charts as guides when building your RESTful routes.
User routes
| Action | Route          | HTTP  Verb |
| ------ | -------------- | ---------- |
| Index  | / users        | GET        |
| Index  | /users:id/personal-books            | GET        |
| Index  | /users:id/shared-books              | GET        |




accouting book routes
| Action | Route                                | HTTP  Verb |
| ------ | ------------------------------------ | ---------- |
| Index  | /accoutingbooks                      | GET        |
| Index  | /accoutingbooks/personal-books       | GET        |
| Index  | /accoutingbooks/shared-books         | GET        |
| New    | /accoutingbooks/new                  | GET        |
| Create | /accoutingbooks/new                  | POST       |
| Edit   | /accoutingbooks/:id/edit             | GET        |
| Update | /accoutingbooks/:id                  | PUT        |
| Delete | /accoutingbooks/:id                  | DELETE     |
>Note:you may not need all of these routes and views in your application

Entry routes
| Action | Route                                          | HTTP  Verb                        
| ------ | ---------------------------------------------- | ---------- |
| Index  | /accoutingbooks /:bookId/entries               | GET        |
| New    | /accoutingbooks /:bookId/entries/new           | GET        |
| Create | /accoutingbooks /:bookId/entries               | POST       |
| Show   | /accoutingbooks /entry/:entryId                | GET        |
| Edit   | /accoutingbooks /:bookId/entries/:entryId/edit | GET        |
| Update | /accoutingbooks /:bookId/entries/:entryId      | PUT        |
| Delete | /accoutingbooks /:bookId/entries/:entryId/delete| DELETE    |

>Note:you may not need all of these routes and views in your application

## Wire Frames
Initial Landing View: 
![accountingbook](./public/image/accountingbooks.png)
![sharebook](./public/image/sharebook.png)
![accessToBook](./public/image/accessToBook.png)
![personalbook](./public/image/personalbook.png)
![income and expense](./public/image/income%20and%20expense.png)
![entries form](./public/image/entriesform.png)
![Recurring Transactions](./public/image/Recurring%20Transactions.png)

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


  

  
