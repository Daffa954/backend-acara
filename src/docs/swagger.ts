import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";
import { OutputFileType } from "typescript";

const doc = {
  info: {
    version: "v0.0.1",
    title: "DOCUMENTATION EVENT API",
    description: "EVENT API DOCUMENTATION",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server development",
    },
    {
      url: "https://backend-acara-flax.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        // bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "daffa",
        password: "123",
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
