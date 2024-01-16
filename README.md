# fragments - Cloud Computing for Programmers - Winter 2024
## Lab 01 - Notes on the Scripts:

- **lint**

Executes the ESLint command.\
Analyzes the code pointing out errors.

`npm run lint`

- **start**

Starts the server on http://localhost:8080.

`npm start`

- **dev**

Starts the server on http://localhost:8080 via nodemon.\
(nodemon - a utility that watches the src/\*\* folder for changes ->\
dev - restarts the server automatically whenever smth is updated/ start - launches normally (needs manual reloads) )

`npm run dev`

- **debug**

The same as dev, but also starts a node inspector on port 9229.\
The running process needs to be attached for debugging.

To debug through VSCode - press F5 / Run and Debug -> Run Script: debug\
***! Don't forget to load the page to see the breakpoint get hit !***
