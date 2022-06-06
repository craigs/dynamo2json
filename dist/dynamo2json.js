#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs_1 = __importDefault(require("fs"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
// @ts-ignore
var read_each_line_sync_1 = __importDefault(require("read-each-line-sync"));
var items = [];
var program = new commander_1.Command();
program
    .description('convert dynamodb export format to json file')
    .requiredOption('-i, --input <infile>', 'input file name')
    .option('-o, --output <outfile>', 'output file name, default is stdout');
program.parse();
var options = program.opts();
(0, read_each_line_sync_1.default)(options.input, 'utf8', function (line) {
    var item = JSON.parse(line).Item;
    items.push(aws_sdk_1.default.DynamoDB.Converter.unmarshall(item));
});
if (options.output) {
    fs_1.default.writeFile(options.output, JSON.stringify(items), 'utf8', function (err) {
        if (err)
            throw err;
        console.log("exported ".concat(items.length, " items to ").concat(options.output));
    });
}
else {
    process.stdout.write(JSON.stringify(items));
}
