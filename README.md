## Rhythm : Music sharing Web Platform

Rhythm is a web platform used to share music with other users . it is made using sveltkit and firebase .
I made this for my Main Project during my Bachelor of Computer Applications in 2024

live demo : https://rhythm-three.vercel.app/auth

## How to Run this project 

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

then inside .env file
put the env variable of your firebase project

``` VITE_PROJECTID =
VITE_APIKEY =
VITE_AUTHDOMAIN =
VITE_STORAGEBUCKET =
VITE_MESSAGESENDERID =
VITE_APPID =
```



``` bash

" npm run dev " to run the project

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

