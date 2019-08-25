#!/bin/bash

USER=$(grep $1 /etc/shadow | awk '{split($0, a, ":"); print a[1]}')
SALTPASS=$(grep $1 /etc/shadow | awk '{split($0, a, ":"); print a[2]}')
SALT=$(echo $SALTPASS | awk '{split($0, a, "$"); print a[3]}')
PASS=$(echo $SALTPASS | awk '{split($0, a, "$"); print a[4]}')
ALGO=$(echo $SALTPASS | awk '{split($0, a, "$"); print a[2]}')
CHECK_ME=$(openssl passwd -$ALGO -salt $SALT $2)

if [ "$1" == "$USER" ]; then
  if [ "$SALTPASS" == "$CHECK_ME" ]; then
    echo "OK"
  else
    echo "FAIL"
  fi
else
  echo "FAIL"
fi

