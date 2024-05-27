FROM oraclelinux:8.4
ENV myapp=bha
RUN yum install httpd -y \
&& mkdir -p /common/{dev_app,prod_app}
COPY dev-env-app /common/dev_app
ADD prod-env-app /common/prod_app
COPY deploy.sh /common/
WORKDIR /common
RUN chmod +x deploy.sh
ENTRYPOINT [ "./deploy.sh" ]