import {
  applyDecorators,
  ClassSerializerInterceptor,
  Get,
  Type,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";

import { AclAction } from "../../acl/decorators/acl-action.decorator";
import { LangCodeEnum } from "../../shared/enums/lang-code.enum";
import { CrudRequestInterceptor } from "../interceptors/crud-request.interceptor";
import { CrudRequestSoftDeleteInterceptor } from "../interceptors/crud-request-soft-delete.interceptor";

export const CrudFindOne: any = <TModel extends Type<any>>(entity: TModel) => {
  return applyDecorators(
    AclAction("CRUD_FIND_ONE", `Retrieve one item ${entity.name}`),
    Get(":id"),
    ApiOperation({
      summary: `Retrieve one item ${entity.name}`,
      description: "find on item",
    }),
    UseInterceptors(
      CrudRequestInterceptor,
      ClassSerializerInterceptor,
      CrudRequestSoftDeleteInterceptor
    ),
    ApiOkResponse({
      schema: {
        title: `${entity.name}`,
        $ref: getSchemaPath(entity),
      },
    }),
    ApiQuery({
      name: "fields",
      required: false,
      type: String,
      isArray: false,
      description:
        'Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a>',
    }),
    ApiQuery({
      name: "join",
      required: false,
      explode: true,
      type: String,
      isArray: true,
      description:
        'Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a>',
    }),
    ApiQuery({
      name: "softDelete",
      required: false,
      type: Boolean,
      description: "Load deleted items",
    }),
    ApiQuery({
      name: "lang",
      required: false,
      type: "enum",
      enum: LangCodeEnum,
      enumName: "LangCodeEnum",
      description: "Language. Default EN",
    })
  );
};
