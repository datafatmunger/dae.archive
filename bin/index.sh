#!/bin/bash 

#bash $PWD/reset_solr.sh 

find /archive -type f -print0 | while IFS= read -r -d $'\0' line; do
  #echo "$line"
  USER=$(echo "$line" | awk '{split($0,a,"/"); print a[3]}')
  FILE=$(echo "$line" | xargs -I{} basename {})
  DIR=$(echo "$line"  | xargs -I{} dirname {})

  #echo $USER
  #echo $DIR
  #echo $FILE

  DATE=$(ls -l --time-style="+%Y-%m-%dT%H:%M:%SZ" "$line" | awk '{split($0,a," "); print a[6]}')
  #echo $DATE

  CONTENTS=$(cat $line | sed 's/\"/\\\"/g')
  #echo $CONTENTS

  ID="$(echo $DIR | sed 's/\//_/g')_$FILE"
  echo $ID

  JSON="[{\"id\": \"$ID\", \"date\": \"$DATE\", \"name\": \"$FILE\", \"path\": \"$DIR\", \"user\": \"$USER\", \"contents\": \"$CONTENTS\"}]"
  #echo $JSON

  curl -d "$JSON" http://localhost:8983/solr/dae/update

done

service solr restart
