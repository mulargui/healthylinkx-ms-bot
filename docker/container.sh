sudo docker stop MSBOT
sudo docker rm MSBOT
sudo docker run -ti --name MSBOT -p 80:80 -v /vagrant/apps/healthylinkx-ms-bot:/myapp --link NODEJSAPI:NODEJSAPI msbot /bin/bash

# for basic testing without external dependencies
#sudo docker run -ti --name MSBOT -p 80:80 -v /vagrant/apps/healthylinkx-ms-bot:/myapp msbot /bin/bash