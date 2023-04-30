
<p align="center">
  <a href="https://academy.mjvinnovation.com/br/mjvschool/">
    <img width=400px src="https://content.mjvinnovation.com/hubfs/MJV%20School/Logo%20School.jpeg"/>
  </a>
</p> 



# Workout Match

Workout Match is an API for creating and managing customized exercises and workouts. With this API, you can create exercises with sets, reps, and exercise classification (type), as well as group them into workouts that can have a defined difficulty level.

Additionally, Workout Match also offers the ability to search for exercises and workouts from other users and copy them to your own account, which is especially useful for those looking for new workout ideas and variations.


## Run the Project

Clone the project

```bash
  git clone
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start-dev
```


## How to use 

To get started with Workout Match, you need to create a user account and authenticate with the API. Once authenticated, you can create, edit, and delete exercises and workouts, as well as search for and copy workouts and exercises from other users.

To create an exercise, simply provide the exercise name, the number of sets and reps, and the exercise type (e.g., pull, push, or legs). To create a workout, you need to provide the workout name, the list of exercises that are part of the workout, and the difficulty level of the workout (optional).

<strong> You can also test the API using Swagger by accessing http://localhost:3000/api-docs. </strong>

Contributions are always welcome! If you want to help improve Workout Match, please open a pull request with your suggestions and improvements.
## Routes

#### Users

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `POST`    | `/users/authentication` | Route for authenticate an user. |
|`GET`| `/users`| Route to get all users registered. |
|`GET`| `/users/user`| Route to get the authenticated user information.|
| `POST`    | `/users/user` | Route to create an user.|
| `PUT`    | `/users/user` | Route to update the registered user.|
| `DELETE`    | `/users/user` | Route to delete registered user.|


#### Exercises

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `GET`    | `/exercises` | Route to get all users exercises registered.|
|`POST`| `/exercises`| Route to create an enxercise.|
|`GET`| `/exercises/{id}`| Route to get an exercise by id.|
|`PUT`| `/exercises/{id}`| Route to update an exercise by id.|
|`DELETE`| `/exercises/{id}`| Route to delete an exercise.|
|`POST`| `/exercises/{id}`| Route to copy an exercise. |
| `GET`    | `/exercises/user` | Route to get all registered and copied user's exercises.|


#### Workouts

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `GET`    | `/workouts` | Route to get all users workouts registered.|
|`POST`| `/workouts`| Route to create an workout.|
|`GET`| `/workouts/{id}`| Route to get an workout by id.|
|`PUT`| `/workouts/{id}`| Route to update an workout.|
|`DELETE`| `/workouts/{id}`| Route to delete an workout.|
|`POST`| `/workouts/{id}`| Route to copy an workout. |
| `GET`    | `/workouts/user` | Route to get all registered and copied user's workouts.|


## Technologies

[![My Skills](https://skillicons.dev/icons?i=mongodb,nodejs,express,typescript,javascript&theme=dark)](https://skillicons.dev)

## Develop by

| [<img src="https://avatars.githubusercontent.com/u/31219833?v=4" width=115><br><sub>Arthur Godinho</sub>](https://github.com/arthurgbsf) | 
| :---: |
<a href="https://linkedin.com/in/arthurgodinhobarbosa" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="arthurgodinhobarbosa" height="30" width="40" /></a>
