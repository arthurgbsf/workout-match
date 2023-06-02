
<p align="center">
  <a href="https://academy.mjvinnovation.com/br/mjvschool/">
    <img width=400px src="https://content.mjvinnovation.com/hubfs/MJV%20School/Logo%20School.jpeg"/>
  </a>
</p> 



# Workout Match

Workout Match is an API for creating and managing customized exercises and workouts. With this API, you can create exercises with sets, reps, and exercise classification (type), as well as group them into workouts that can have a defined difficulty level.

Additionally, Workout Match also offers the ability to search for exercises and workouts from other users and copy them to your own account, which is especially useful for those looking for new workout ideas and variations.

<!--
<p align="center">
<img src="http://img.shields.io/static/v1?label=STATUS&message=UNDER%20MAINTENANCE&color=GREEN&style=for-the-badge"/>
</p>
-->

## Run the Project

Clone the project

```bash
  git clone https://github.com/arthurgbsf/workout-match.git
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

<strong> 
  <p>
    You can also test the API using Swagger by accessing:
  </p>
  <p>
    Locally: <a href="http://localhost:3000/api-docs">http://localhost:3000/api-docs</a>
  </p>
  <p>
    Web: <a href="https://workout-match.onrender.com/api-docs"> https://workout-match.onrender.com/api-docs </a>
  </p>
</strong>


Contributions are always welcome! If you want to help improve Workout Match, please open a pull request with your suggestions and improvements.
## Routes

#### Auth

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `POST`    | `/auth/login` | Route for authenticate an user. |
|`POST`| `/auth/forget_password`| Route to request a temporary password. The password is sent to the user's email, witch is only valid for 15 min. |
|`POST`| `/auth/change_password`| Route to change password from temporary password.|

#### Users

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
|`GET`| `/users`| Route to get users information. Optional query parameter, pass `user = true` to get the logged user information. |
|`GET`| `/users/user/{id}`| Route to get user iformation by 'id'.|
| `POST`    | `/users/user` | Route to create an user.|
| `PUT`    | `/users/user` | Route to update the registered user.|
| `DELETE`    | `/users/user` | Route to delete registered user.|


#### Exercises

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `GET`    | `/training-data/exercises` | Route to get all users exercises registered. Optional query parameter, pass `user = true` to get the logged user exercises.|
|`POST`| `/training-data/exercises/exercise`| Route to create an enxercise.|
|`GET`| `/training-data/exercises/exercise/{id}`| Route to get an exercise by id.|
|`PUT`| `/training-data/exercises/exercise/{id}`| Route to update an exercise by id.|
|`DELETE`| `/training-data/exercises/exercise/{id}`| Route to delete an exercise by id.|
|`POST`| `/training-data/exercises/exercise/{id}`| Route to copy an exercise. |



#### Workouts

| Method    | Endpoint | Description                |
| :-------- | :------- | :------------------------- |
| `GET`    | `/training-data/workouts` | Route to get all users workouts registered. Optional query parameter, pass `user = true` to get the logged user workouts.|
|`POST`| `/training-data/workouts/workout`| Route to create an workout.|
|`GET`| `/training-data/workouts/workout/{id}`| Route to get an workout by id.|
|`PUT`| `/training-data/workouts/workout/{id}`| Route to update an workout by id.|
|`DELETE`| `/training-data/workouts/workout/{id}`| Route to delete an workout.|
|`POST`| `/training-data/workouts/workout/{id}`| Route to copy an workout. |



## Technologies

[![My Skills](https://skillicons.dev/icons?i=mongodb,nodejs,express,typescript,javascript&theme=dark)](https://skillicons.dev)

## Develop by

[<img src="https://avatars.githubusercontent.com/u/31219833?v=4" width=115><br><sub>Arthur Godinho</sub>](https://github.com/arthurgbsf) 

<p align="left"><strong>Connect with me:</strong></p>
<p align="left">
  <a href="https://www.linkedin.com/in/arthurgodinhobarbosa">
    <img src="https://skillicons.dev/icons?i=linkedin" />
  </a>
  <a href="https://instagram.com/arthurgbsf">
    <img src="https://skillicons.dev/icons?i=instagram" />
  </a>
  <a href="https://discord.com/users/880631851964837928">
    <img src="https://skillicons.dev/icons?i=discord"/>
  </a>
</p>


