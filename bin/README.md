# The DAE archive

## bin Directory

This directory maps to `/usr/local/bin` in the archive container. A TON of logic of the archive lives here, and is heavily wrapped and leveraged by `dae-api`.

### add\_file.sh

Adds a file to the users archive repository using `git` with commit message.

### add\_user.sh

Adds a new user to the archive, the container.  Initializes their git archive intheir home directory.

### auth.sh

(Deprecated) Checks a users credential against their system credentials.

### classify\_image.py

Used by `index.sh`.  Runs tensorflow against an image, returns tags.

### commits.py

Used by `index.sh`. Grabs commits related to a given file.

### deploy.sh

(Deprecated) Used to deploy the archive on blackbox.

### fork.sh

Forks a user's repository to another user.

### index.sh

The main indexing script. Indexes the archive into Apache Solr.

### jbg-post-receive

(Deprecated) Git pushes to jbg user used to deploy the archive.

### ntc.js

Used by the index process to convert hex codes to colors.

### parse\_tf.py

Used by the index process to parse output from `classify_image.py` to a format for the Apache Solr document.

### post-receive

This ends up in every users `/home/$USER/archive.git/hooks` directory, to deploy to `/archive` on git pushes.

### reset\_solr.sh

Destroys and recreates the Apache Solr dae core.

### rm\_file.sh

Removes a file from a users repository with a commit message.

### rm\_user.sh

Removes a user from the archive.

### run.sh

The script that runs the container.

### video.sh

Used by the indexer to color tag and tensorflow a video.







