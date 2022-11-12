# JavaCodeSetFrontend

This project is a client part of an application that stores small blocks
of Java code, allows you to save them, search by name, description, tags,
content. It was created for the ease and convenience of personal storage
and management of short code demos that you don't want to lose.

## Used modules

The application uses the following submodules:
- Angular 14
- ngx-clipboard
- rainbow-code
- rxjs
- tslib
- zone.js

The app runs on Angular. To be able to copy content to the clipboard, 
use ngx-clipboard. The code on the code block view page is colored with
rainbow-code. Libraries rxjs, tslib and zone.js are required for 
Angular to work.

## How to run

To run the application, you need to run `ng serve` command in the root 
folder of the project. After that, the application is available at 
`http://localhost:4200/`.

## Additional Information

This project is in alpha, so tests and some components are under 
development. The addresses to which requests are sent are part of
[JavaCodeSetBackend](https://github.com/MaksymBalaniuk/JavaCodeSetBackend.git) 
API.
