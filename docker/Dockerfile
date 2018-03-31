FROM ubuntu:16.04
USER root

#apt installs
RUN apt-get update


RUN apt-get install openssh-server -y

RUN apt-get install curl wget -y

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs

#download and install stuff

RUN wget -O acs-engine.tar.gz https://github.com/Azure/acs-engine/releases/download/v0.14.6/acs-engine-v0.14.6-linux-amd64.tar.gz 
RUN tar -xvf acs-engine.tar.gz
RUN mv acs-engine-v0.14.6-linux-amd64/acs-engine /usr/local/bin
RUN chmod +x /usr/local/bin/acs-engine

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN mv kubectl /usr/local/bin
RUN chmod +x /usr/local/bin/kubectl

RUN npm install -g generator-acsengine

#install az cli
COPY installaz.sh ./installaz.sh
RUN chmod +x installaz.sh
RUN ./installaz.sh

 #customisations and things
RUN mkdir -p /var/run/sshd

RUN echo "root:temppw" | chpasswd

RUN echo "alias k=\"kubectl\"" > ~/.bash_profile
RUN echo "PermitRootLogin yes" > /etc/ssh/sshd_config

COPY sp.sh ./sp.sh
RUN chmod +x sp.sh

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]