// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('length-enforcer.checkLength', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            let document = editor.document;
			var foundStringNames = [];
			var noSizeStringNames = [];
            const documentText = document.getText();
			var stringCount = 0;
			var currentChar = 0;
			currentChar = documentText.indexOf("string", currentChar);
			var stringName = "";
			while (currentChar !== -1){
				var pointingAt = currentChar;
				 pointingAt+=6;
				 var incrementedAtAll=false;
				 while(documentText.charAt(pointingAt)===' '){
					 incrementedAtAll=true;
					 pointingAt+=1;
				 } //now we're at string s ("hello");   string s = "hello"; notastringtrick;
				   //                    ^                     ^                      ^
				 
				 if (incrementedAtAll===true){
					 stringName = documentText.charAt(pointingAt);
					 while((documentText.charAt(pointingAt)!==' ' && documentText.charAt(pointingAt)!=='(') && documentText.charAt(pointingAt)!=='=' ){
						 pointingAt+=1;
						 if (documentText.charAt(pointingAt)===';' || documentText.charAt(pointingAt)==='(' || documentText.charAt(pointingAt)===' ' || documentText.charAt(pointingAt)==='='){
							break;
						 }
						 else {
						 	stringName += documentText.charAt(pointingAt);
						 }
					 }
					 foundStringNames.push(stringName);
				 }
 
				 //set up for next case.
				 currentChar = documentText.indexOf("string", currentChar + 1);
				 stringCount++;
			 }
			 
			 //foundStringNames now has all of the names of the strings. find out if their length is checked.
			 for (var s in foundStringNames){
				var nameWithSize = foundStringNames[s] + ".size()";
				var nameWithLength = foundStringNames[s] + ".length()";
				var sizeDeclared = documentText.indexOf(nameWithSize);
				var lengthDeclared = documentText.indexOf(nameWithLength);
				if (sizeDeclared===-1 && lengthDeclared===-1){
					noSizeStringNames.push(foundStringNames[s]);
				}
			 }

			 // Prepare Message
			 var message = "String names with no length check: ";
			 for (var s in noSizeStringNames){
				vscode.window.showInformationMessage("Warning: String \"" + noSizeStringNames[s] + "\" does not have its size or length explicitly used.");
			 }
			 if (noSizeStringNames.length===0){
				vscode.window.showInformationMessage("All string variables have their size and length method used.");
			 }
			 //vscode.window.showInformationMessage(message);
		 }
		else {
			vscode.window.showInformationMessage("No document open.");
		}
    });

    context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}
