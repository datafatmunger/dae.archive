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

    $ curl -F file=@foo --cookie cookies http://80.100.106.160/api/upload

## Fork an archive to your own home directory

    $ curl -H "Content-Type: application/json" -d '{"archive": "<USER-NAME>"}' --cookie cookies http://80.100.106.160/api/fork

## Image Processing with ImageMagick!

## Make 'thumbs' subdirectory and convert images to thumbnails into that directory

    $ mogrify -path ./thumbs/ -resize 100x100 *

## Print the 5 most recurring pixels in an image (for searching / indexing)

    $ convert FILENAME -format %c -depth 8 histogram:info:- | sort -r | head -5


