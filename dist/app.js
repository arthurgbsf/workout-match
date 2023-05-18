"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routers_1 = __importDefault(require("./routers"));
const database_1 = __importDefault(require("./config/database"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_doc_json_1 = __importDefault(require("./docs/swagger.doc.json"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const app = (0, express_1.default)();
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_doc_json_1.default));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routers_1.default);
app.use(errorHandler_middleware_1.errorHandler);
const port = 3000;
database_1.default.then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log("App online in port: ", port);
    });
}).catch((err) => console.log(err));
