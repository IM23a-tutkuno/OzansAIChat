# Ozan's AI Chat

Ozan's AI Chat is a Website with a dedicated Express backend based on Node.js.
To use this yourself, you need a Supabase Database that is compactible with this code, or you alter the code to make it work with yours. The communication between the front and backend is encrypted with a JWT Token. 
#### I don't recommend trying to set up your project with this repo, since the structure of the backend and frontend is specific for my own database.

#### This app does not include an APIKey you must provide your own in your database.

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the packages.

```bash
npm install
```
Navigate into the backend folder
```bash
cd backend
```
Once again run

```bash
npm install
```

## Usage
Create a .env file with the following structure and add your supabase url, supabase key and secret JWT.
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SECRET_JWT=
```
To run the frontend, use this commmand in the root folder:
```bash
npm run dev
```
To run the backend, use this commmand in the backend folder:
```bash
node server.js
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)