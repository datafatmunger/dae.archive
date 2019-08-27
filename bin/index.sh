#!/bin/bash 

#bash $PWD/reset_solr.sh 

find /archive -type f -print0 | while IFS= read -r -d $'\0' line; do
  LOC=$line
  USER=$(echo "$line" | awk '{split($0,a,"/"); print a[3]}')
  FILE=$(echo "$line" | xargs -I{} basename {})
  DIR=$(echo "$line"  | xargs -I{} dirname {})

  #echo $USER
  #echo $DIR
  #echo $FILE

  DATE=$(ls -l --time-style="+%Y-%m-%dT%H:%M:%SZ" "$line" | awk '{split($0,a," "); print a[6]}')
  #echo $DATE

  ID="$(echo $DIR | \
    sed 's/\//_/g')_$(echo $FILE | \
    sed 's/\./_/g' | \
    sed 's/ /_/g')"
  echo $ID

  EXT=$(echo ${FILE##*.} | awk '{print tolower($0)}')
  echo $EXT

  if [ $EXT == 'txt' ] || [ $EXT == 'md' ]; then
    CONTENTS=$(cat $line | sed 's/\"/\\\"/g')
  else
    CONTENTS=''
  fi

  JSON="[{\"id\": \"$ID\", \"date\": \"$DATE\", \"name\": \"$FILE\", \"path\": \"$DIR\", \"user\": \"$USER\", \"contents\": \"$CONTENTS\", \"location\": \"$LOC\"}]"

  curl -d "$JSON" http://localhost:8983/solr/dae/update

done

service solr restart
