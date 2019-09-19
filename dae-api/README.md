# The DAE API 

## Create user

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "name": "jbg", "password": "password"}' http://localhost:8000/users

## Login

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "password": "password"}' --cookie-jar cookies http://localhost:8000/users/login

## Get user

    $ curl --cookie cookies http://localhost:8000/users/1
## Upload a file

    $ curl -F file=@foo --cookie cookies http://localhost:8000/upload

## Remove a user

    $ curl -X DELETE --cookie cookies http://localhost:8000/users/1

## Upload file to archive

    $ curl -F file=@foo --cookie cookies http://localhost:8000/upload
