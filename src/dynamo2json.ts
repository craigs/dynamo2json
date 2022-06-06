#!/usr/bin/env node
import { Command } from 'commander'
import fs from 'fs'
import AWS from 'aws-sdk'
// @ts-ignore
import readEachLineSync from 'read-each-line-sync'

const items: any[] = []

const program = new Command()

program
  .description('convert dynamodb export format to json file')
  .requiredOption('-i, --input <infile>', 'input file name')
  .option('-o, --output <outfile>', 'output file name, default is stdout')

program.parse()

const options = program.opts()

readEachLineSync(options.input, 'utf8', (line: string) => {
  const { Item: item } = JSON.parse(line)
  items.push(AWS.DynamoDB.Converter.unmarshall(item))
})

if (options.output) {
  fs.writeFile(options.output, JSON.stringify(items), 'utf8', err => {
    if (err) throw err
    console.log(`exported ${items.length} items to ${options.output}`)
  })
} else {
  process.stdout.write(JSON.stringify(items))
}
