FROM alpine:latest
RUN apk add --update --no-cache python3
RUN mkdir /pycodes
ADD https://raw.githubusercontent.com/redashu/pythonLang/main/while.py /pycodes/

