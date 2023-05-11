# File-Mobility-System

File Mobility System is a web application which provides an online document uploading system in different government ministries and departments. This web application is very useful especially for those people who live in remote areas or their home is very far from the government offices. It also saves time as people do not have to stand in long queues just for submitting their documents.

---
## Requirements

For development, you will only need Node.js and PostgreQL to be installed on your PC.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

      $ node --version
      $ npm --version

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### PostgreSQL
  To install PostgreSQL just go to the [Official PostgreSQL website](https://www.postgresql.org/) and download the installer.

---
## Install

    $ git clone https://github.com/ShreyanshGarg/File-Mobility-System
    $ cd File-Mobility-System
    $ npm i
    
## Configure app

Create `dev.env` file inside the config folder to setup the environment variables. You will need:

- A port, for example PORT=3000;
- An email to send the mail, for example USER=<your_email>;
- The password of the mail, for example PASS=<your_password>;
    
## Running the project

    $ npm start
