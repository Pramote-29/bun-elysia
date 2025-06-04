import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors"; // bun add @elysiajs/cors
import { swagger } from "@elysiajs/swagger"; // bun add @elysiajs/swagger
import { staticPlugin } from "@elysiajs/static"; // bun add @elysiajs/static
import { jwt }  from "@elysiajs/jwt"; // bun add @elysiajs/jwt


const app = new Elysia()

// Middleware for CORS
  .use(cors())
// Middleware for Swagger documentation
  .use(swagger())
// Middleware for serving static files
  .use(staticPlugin(
    {
      prefix: "/uploads",
      assets: "./uploads", // Directory where uploaded files are stored
    }
  ))
// Middleware for JWT authentication
  .use(jwt ({
    name: "my_jwt",
    secret: 'secret',
  }))


  // authentication middleware
  .post("/auth/login", async ({ my_jwt, cookie: { auth } }) => {
    const user = {
      id: "user123",
      name: "John Doe",
      level: "admin"
    }

    const token = await my_jwt.sign(user);

    auth.set({
      value: token,
      httpOnly: true,
      secure: true, // Set to true in production
      maxAge: 60 * 60 * 24, // 1 day
    })

    return {
      token: token,
      message: "Login successful",
    }
  })
  
  .get("/auth/user", ({ my_jwt, cookie: { auth }}) =>{
    const user = my_jwt.verify(auth.value);
    return user;
  })

  // logout endpoint
  .get("/auth/logout", ({ cookie: { auth } }) => {
    auth.remove(); // Remove the auth cookie
    return {
      message: "Logout successful",
    };
  })

  // Define the API routes
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello World")
  .get("/json-data",() => {
    return {
      message: "Hello, this is JSON data",
      timestamp: new Date().toISOString()
    };
  })
  .get("/hello/:name", ({ params }) => {
    return `Hello, ${params.name}!`;
  })
  .get("/hello/:name/:age", ({ params }) => {
    const { name, age } = params;
    return {
      name: name,
      age: parseInt(age, 10),
    }
  })
  .get("/api/person/:id/:name", ({params} : {
    params: { id: string; name: string };
  }) => {
    const id = params.id;
    const name = params.name;
    return {
      id: id,
      name: name,
      message: `Person with ID ${id} and name ${name} found!`
    };
  })
  .get("/api/query", ({ query}: {
    query: {
      id?: string;
      name?: string;
      age?: number;
    }
  }) => {
    const id = query.id || "unknown";
    const name = query.name || "unknown";
    const age = query.age ? parseInt(query.age.toString(), 10) : 0;
    return{
      id: id,
      name: name,
      age: age,
      message: `Query received with ID ${id}, name ${name}, and age ${age}!`
    }
  })

  //post
  .post("/book/create", ({ body } : {
    body : {
      id: string;
      title: string;
      price: number;
    }
  }) => {
    const id = body.id;
    const title = body.title;
    const price = body.price;
    return {
      id: id,
      title: title,
      price: price,
      message: `Book with ID ${id}, title ${title}, and price ${price} created!`
    };
  })

  //put
  .put("/book/update/:id", ({ params, body } : {
    params: { id: string };
    body: {
      title: string;
      price: number;
    }
  }) => {
    const id = params.id;
    const title = body.title;
    const price = body.price;
    return {
      id: id,
      title: title,
      price: price,
      message: `Book with ID ${id} updated to title ${title} and price ${price}!`
    };
  })
  //delete
  .delete("/book/delete/:id", ({ params } : {
    params: { id: string };
  }) => {
    const id = params.id;
    return {
      id: id,
      message: `Book with ID ${id} deleted!`
    };
  })

  //upload file
  .post("/upload/file", ({ body}: {
    body: {
      file: File;
    }
  }) => {
    Bun.write('uploads/' + body.file.name, body.file);
    return {
      message: `File ${body.file.name} uploaded successfully!`
    }
  })
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
