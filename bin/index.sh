#!/bin/bash 

#bash $PWD/reset_solr.sh 

find /archive -type f -print0 | while IFS= read -r -d $'\0' line; do
  #echo "$line"
  USER=$(echo "$line" | awk '{split($0,a,"/"); print a[3]}')
  FILE=$(echo "$line" | xargs -I{} basename {})
  DIR=$(echo "$line"  | xargs -I{} dirname {})
  EXT="${FILE##*.}"
  BASE="${FILE%.*}"

  #echo $USER
  #echo $DIR
  #echo $FILE
  #echo $EXT
  #echo $BASE

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
    #echo $CONTENTS
  elif [ $EXT == 'png' ] || [ $EXT == 'gif' ]; then
    TF_TAGS=$(python3 /usr/local/bin/classify_image.py --image $DIR/$FILE 2> /dev/null | python3 /usr/local/bin/parse_tf.py)
  fi

  CONTENTS_JSON=""
  if [ -z "$CONTENTS" ]; then
    CONTENTS_JSON=", \"contents\": \"$CONTENTS\""
  fi

  JSON="[{\"id\": \"$ID\", \"date\": \"$DATE\", \"name\": \"$FILE\", \"base\": \"$BASE\", \"ext\": \"$EXT\", \"path\": \"$DIR\", \"tf_tags\": $TF_TAGS, \"type\": \"archive\", \"user\": \"$USER\" $CONTENTS_JSON}]"

  echo $JSON

  curl -d "$JSON" http://localhost:8983/solr/dae/update

done

service solr restart
