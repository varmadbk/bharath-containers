FROM python
# download python image from docker hub
LABEL name=bharath1
RUN mkdir /bharathcode
# run is to run only during runtime
COPY *.py /bharathcode/
#copy data from docker client to build process
CMD ["python","/bharathcode/bharath1.py"]
#CMD is to set default process for container
