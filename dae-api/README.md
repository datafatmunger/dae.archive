## The DAE API 

## Create user

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "name": "jbg", "password": "password"}' ${base_url}/users

## Login

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "password": "password"}' --cookie-jar cookies ${base_url}/users/login

## Get user

    $ curl --cookie cookies ${base_url}/users/1
## Upload a file

    $ curl -F file=@foo --cookie cookies ${base_url}/upload

## Remove a user

    $ curl -X DELETE --cookie cookies ${base_url}/users/1

## Upload file to archive

    $ curl -F file=@foo --cookie cookies ${base_url}/upload

## Remove a file from archive

    $ curl -X DELETE --cookie cookies "${base_url}/api/files/foo?note=delbar"

## Fork an archive to your own home directory

    $ curl -H "Content-Type: application/json" -d '{"archive": "<USER-NAME>"}' --cookie cookies ${base_url}/api/fork

