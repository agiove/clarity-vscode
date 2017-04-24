'use strict';

import * as vscode from 'vscode';
import { ClrHoverProvider } from "./clrHoverProvider";

export function activate(context: vscode.ExtensionContext) {

    console.log('vscode-clarity is active!');

    const HTML_MODE: vscode.DocumentFilter = { language: 'html', scheme: 'file' };

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            HTML_MODE, new ClrHoverProvider()));
}
