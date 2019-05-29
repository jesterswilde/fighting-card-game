## Recommended Install Instructions:
    * Install parcel `yarn global add parcel-bundler` or `npm install -g parcel-bundler` for game-client
    * Install nodemon for server
    
## Running it
    * Run nodemon from root to start server. Note you will want to run tsc watch if you modify server code.
    * Run `parcel index.html` from game-client folder to run local version of the game
    * Run `parcel index.html` from cardMaker folder to run card maker
   
    Server runs on port 8080
    Game Client runs on port 1234
    Card Editor run son port 3000
    
To run client and card editor at the same time, pass the port flag to parcel, eg. --port 4321

## Writing Server Code
   * run `tsc watch` to pick up changes to server code
