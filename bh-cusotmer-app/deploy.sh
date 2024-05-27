#!/bin/bash

if [ "$myapp" == "dev" ]
then
cp -rf /common/dev_app/* /var/www/html
httpd -DFOREGROUND 
elif [ "$myapp" == "prod" ]
then
cp -rf /common/prod_app/* /var/www/html
httpd -DFOREGROUND 
else
echo "you need to provide correct env selection" > /var/www/html/index.html
httpd -DFOREGROUND 
fi
