import { AST } from '@angular/compiler';
export declare type PathFn = (context: any, base: any) => any;
export declare const parsePropertyPath: (path: string) => (store: any) => any;
export declare const constructPathFrom: (target: AST, nextFn?: PathFn) => PathFn;
