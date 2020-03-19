## The DAE API 

## Create user

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "name": "jbg", "password": "password"}' ${base_url}/api/users

## Login

    $ curl -H "Content-Type: application/json" -d '{"email": "jbg@example.com", "password": "password"}' --cookie-jar cookies ${base_url}/api/users/login

## Get user

    $ curl --cookie cookies ${base_url}/api/users/1

## Remove a user

    $ curl -X DELETE --cookie cookies ${base_url}/api/users/1

## Upload file to archive

    $ curl -F file=@foo --cookie cookies ${base_url}/api/files

## Remove a file from archive

    $ curl -X DELETE --cookie cookies "${base_url}/api/files/foo?note=delbar"

## Fork an archive to your own home directory

    $ curl -H "Content-Type: application/json" -d '{"archive": "<USER-NAME>"}' --cookie cookies ${base_url}/api/fork

