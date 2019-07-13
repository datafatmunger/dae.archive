# The DAE API 

## Create user

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "name": "jbg", "password": "password"}' http://localhost:8000/users

## Login

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "password": "password"}' --cookie-jar cookies http://localhost:8000/users/login

## Get user

    $ curl --cookie cookies http://localhost:8000/users/5c825538a1f86f702d08d438 

## Get all users

    $ curl --cookie cookies http://localhost:8000/users

## Update the user

    $ curl -X PUT -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "password": "password", "name": "jbg"}' --cookie cookies http://localhost:8000/users/5c825538a1f86f702d08d438

## Upload a file

    $ curl -F file=@foo --cookie cookies http://localhost:8000/upload

