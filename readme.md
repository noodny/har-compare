# HAR comparer
This utility allows you to compare requests two .har files, looking for missing requests and wrong response status codes.

## Commandline usage
```javascript
node index.js file1.har file2.har
```
will compare file1 against file2 (put the files in project directory), output the results and save them to a separate file
