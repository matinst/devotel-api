import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function getSwaggerDocument(app: NestFastifyApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle("The Devotel api document")
    .setDescription("The Devotel API description")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "authorization",
        in: "header",
      },
      "authorization",
    )

    .setVersion("1.0.0")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, swaggerDocument);
}
