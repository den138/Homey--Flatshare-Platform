# 2021-10-04 Hints

## TS project template

-   [x] init npm project

```Text
npm init -y

```

**remark:**

`-y` ans yes to all questions

-   [x] install packages for TS project

```Text
npm install  ts-node typescript @types/node

```

**Folder Structure:**

```Text
node_modules      package-lock.json package.json

```

-   [ ] create and configure `.gitignore`

```Text
node_modules
.DS_Store

```

-   [ ] create 3 files: `tsconfig.json`, `index.js` and `app.ts`

```Text
touch tsconfig.json index.js app.ts

```

-   [ ] configure `tsconfig.json`, `index.js` and `app.ts`

`tsconfig.json`:

```JSON
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "lib": ["es6", "dom"],
        "sourceMap": true,
        "allowJs": true,
        "jsx": "react",
        "esModuleInterop":true,
        "moduleResolution": "node",
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "suppressImplicitAnyIndexErrors": true,
        "noUnusedLocals": true
    },
    "exclude": [
        "node_modules",
        "build",
        "scripts",
        "index.js"
    ]
}
```

`index.js`:

```Javascript
require('ts-node/register');
require('./app');

```

`app.ts`:

```Typescript
console.log('hello, world!');
```

&nbsp;

## Express Template

-   [ ] install related packages

```Bash
npm i express @types/express

```

-   [ ] configure `app.ts`

```Typescript
import express from "express";

const app = express();

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`[info] listening to port ${PORT}`);
});

```

-   [ ] install `ts-node-dev` for development

```Bash
npm i ts-node-dev

```

-   [ ] configure `package.json`

```JSON
{
    ...
    "scripts": {
        "start": "node index.js",
        "dev": "ts-node-dev app.ts",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    ...
}
```

&nbsp;

## Student Registration System

-   [ ] student dataset (`.json`)
-   [ ] create html files (Form)
-   [ ] create routes for registration

### Form Submit

-   FrontEnd (`.html`), add action, method in form tag

```HTML
<form action="/students" method="POST">
    ...
    ...
</form>
```

-   Server (Setup)

```Typescript
...
const app = express();
app.use(express.urlencoded({ extended: true }));
...

```

-   Server (Create related Route Handler)

```Typescript
app.post("/students", async (req, res) => {
    console.log(req.body);
    const students: Student[] = await jsonfile.readFile(path.join(__dirname, "students.json"));
    students.push({ id: students.length + 1, name: req.body.studentName, email: req.body.studentEmail });
    await jsonfile.writeFile(path.join(__dirname, "students.json"), students);
    res.redirect("/home.html");
});
```

&nbsp;

### Form Submit with File Upload

-   Modify the form

```HTML
<form ... enctype="multipart/form-data">
    ...
    ...
</form>
```

-   Server Setup

```Typescript
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
    },
});
const upload = multer({ storage });

```

-   Update the route, add **upload.single("image")**

```Typescript
app.post("/students", upload.single("image"), async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    // read data from jsonfile
    const students: Student[] = await jsonfile.readFile(path.join(__dirname, "students.json"));
    // add a new student record to the array
    students.push({
        id: students.length + 1,
        name: req.body.studentName,
        email: req.body.studentEmail,
        filename: req.file?.filename,
    });
    // save the data into jsonfile
    await jsonfile.writeFile(path.join(__dirname, "students.json"), students);
    // redirect the client to new location
    res.redirect("/home.html");
});
```
