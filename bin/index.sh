#!/bin/bash 

#bash $PWD/reset_solr.sh 

find /archive -type f -print0 | while IFS= read -r -d $'\0' line; do
  #echo "$line"
  USER=$(echo "$line" | awk '{split($0,a,"/"); print a[3]}')
  FILE=$(echo "$line" | xargs -I{} basename {})
  DIR=$(echo "$line"  | xargs -I{} dirname {})
  EXT="${FILE##*.}"
  BASE="${FILE%.*}"
  SUBDIR=$(echo "$DIR" | sed -e 's/\/archive\/$USER//g')/

  #echo $USER
  #echo $DIR
  #echo $FILE
  #echo $EXT
  #echo $BASE
  echo $SUBDIR

  DATE=$(ls -l --time-style="+%Y-%m-%dT%H:%M:%SZ" "$line" | awk '{split($0,a," "); print a[6]}')
  #echo $DATE

  ID="$(echo $DIR | \
    sed 's/\//_/g')_$(echo $FILE | \
    sed 's/\./_/g' | \
    sed 's/ /_/g')"
  echo $ID

  EXT=$(echo ${FILE##*.} | awk '{print tolower($0)}')
  echo $EXT

  CONTENTS=""
  TF_TAGS=""
  if [ $EXT == 'txt' ] || [ $EXT == 'md' ]; then
    CONTENTS=$(cat $line | sed 's/\"/\\\"/g')
    #echo $CONTENTS
  elif [ $EXT == 'png' ] || [ $EXT == 'jpg' ]; then
    TF_TAGS=$(python3 /usr/local/bin/classify_image.py --image $DIR/$FILE 2> /dev/null | python3 /usr/local/bin/parse_tf.py)
  fi

  CONTENTS_JSON=""
  if [[ ! -z "$CONTENTS" ]]; then
    CONTENTS_JSON=", \"contents\": \"$CONTENTS\""
  fi

  TF_JSON=""
  COLOR_JSON=""
  if [[ ! -z "$TF_TAGS" ]]; then
    TF_JSON=", \"tf_tags\": $TF_TAGS"
    COLOR_JSON=$(/usr/bin/convert "$DIR/$FILE" -resize 64x64 -unique-colors -format %c -depth 8 histogram:info:- | sort -r | head -10 | grep -o "#......" | node /usr/local/bin/ntc.js)
  fi

  TMP_ARCHIVE=/tmp/$USER.archive

  [ ! -d /tmp/$USER.archive ] && git clone /home/$USER/archive.git $TMP_ARCHIVE
  COMMIT_FILE_PATH="$TMP_ARCHIVE$SUBDIR$FILE"
  echo $COMMIT_FILE_PATH
  COMMITS=$(python3 /usr/local/bin/commits.py $TMP_ARCHIVE $COMMIT_FILE_PATH)
  COMMITS_JSON=", \"commits\": $COMMITS"


  JSON="[{\"id\": \"$ID\", \"date\": \"$DATE\", \"name\": \"$FILE\", \"base\": \"$BASE\", \"ext\": \"$EXT\", \"path\": \"$DIR\", \"type\": \"archive\", \"user\": \"$USER\" $CONTENTS_JSON $TF_JSON $COLOR_JSON $COMMITS_JSON}]"

  echo $JSON

  curl -d "$JSON" http://localhost:8983/solr/dae/update

done

rm -rf /tmp/*.archive
service solr restart

