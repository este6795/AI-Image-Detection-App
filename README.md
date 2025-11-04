# AI-Image-Detection-App
An Project for BACS 350 


## Description
Our project, AI Image Detector, is a web-based application designed to determine
whether an uploaded image is AI-generated or authentic. Using a React frontend and a
Node.js backend, the system allows users to upload an image, which is then analyzed
through an AI detection API or pretrained model. The backend processes the image and
returns a probability score indicating the likelihood of the image being synthetic. The
goal is to provide a simple and intuitive tool that helps users verify image authenticity,
raise awareness about AI-generated media, and demonstrate how modern full-stack
systems can integrate AI-based decision-making.

## Comments
Here are few things to consider:

- As MERN stack app, database is important part.

- 1-incorporating MongoDB database, for example to store images, results, etc.

- 2-Add access and add user management (signup, signin, add, update, delete) and use the database for that. Assuming the app can be used by multiple users and each user need to signup to use the app.

## Notes
- We will be using Sightengine's API so credit to them https://sightengine.com/


## Updates 
- 10/22/25 Repo is created and has a placeholder functional product list web app
- 10/29/25 API for image dectection was found and the provided node.js connection file has been added to repo
- 11/14/25 Simple AI image dectection requests should be working, however we need to process output properly. Moreover, we need to identify what API parameters are (what files/files sizes are supported)
