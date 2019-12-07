#!/bin/bash

LEN=$(/usr/bin/ffprobe -i $1 -show_entries format=duration -v quiet -of csv="p=0")
LEN=$(printf "%.0f" $LEN)
SEC=$(( ( RANDOM % $LEN )  + 1 ))
/usr/bin/ffmpeg -nostdin -y -i $1 -ss $SEC -vframes 1 $2 
