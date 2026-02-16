var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Catch, HttpException, HttpStatus, } from '@nestjs/common';
import { pinoLogger } from '../../logger/pino.provider';
let AllExceptionsFilter = (() => {
    let _classDecorators = [Catch()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AllExceptionsFilter = _classThis = class {
        catch(exception, host) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            let status = HttpStatus.INTERNAL_SERVER_ERROR;
            let message = 'Internal server error';
            let error = 'InternalServerError';
            if (exception instanceof HttpException) {
                status = exception.getStatus();
                const res = exception.getResponse();
                if (typeof res === 'string') {
                    message = res;
                }
                else if (typeof res === 'object' && res !== null) {
                    // Use a safe typed access instead of ts-ignore
                    const resObj = res;
                    if (typeof resObj.message === 'string')
                        message = resObj.message;
                    if (typeof resObj.error === 'string')
                        error = resObj.error;
                }
            }
            else if (exception instanceof Error) {
                message = exception.message;
                error = exception.name;
            }
            const responseBody = {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message,
                error,
            };
            // Structured error log using pino
            const reqAny = request;
            pinoLogger.error({
                timestamp: new Date().toISOString(),
                requestId: reqAny.id,
                context: 'Exceptions',
                method: request.method,
                url: request.url,
                status,
                error: error,
                message,
                stack: exception instanceof Error ? exception.stack : undefined,
            }, 'unhandled exception');
            response.status(status).json(responseBody);
        }
    };
    __setFunctionName(_classThis, "AllExceptionsFilter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AllExceptionsFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AllExceptionsFilter = _classThis;
})();
export { AllExceptionsFilter };
