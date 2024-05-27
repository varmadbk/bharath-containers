FROM oraclelinux:8.4
LABEL name=oraclelinux
RUN yum install python3 -y \
&& mkdir /mycode
COPY *.py /mycode/
CMD ["python","/bharathcode/hello.py"]