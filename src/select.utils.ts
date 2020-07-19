import {
  PropertyRead,
  KeyedRead,
  LiteralPrimitive,
  ImplicitReceiver,
  AST,
  MethodCall,
  LiteralArray,
  FunctionCall,
  Lexer,
  IvyParser,
} from '@angular/compiler';

export type PathFn = (context: any, base: any) => any;

const parser = new IvyParser(new Lexer());

export const parsePropertyPath = (path: string) => {
  const { ast } = parser.parseBinding(path, null, 0);

  return constructPathFrom(ast);
};

const basePathFn = (target: any) => target;

const createListFn = (list: AST[]) => {
  const listFns: PathFn[] = list.map((item) => constructPathFrom(item));

  return (context: any, base: any) =>
    listFns.map((itemFn) => itemFn(context, base));
};

export const constructPathFrom = (
  target: AST,
  nextFn: PathFn = basePathFn
): PathFn => {
  switch (Object.getPrototypeOf(target).constructor) {
    case PropertyRead:
      return constructPathFromNamed(target as PropertyRead, nextFn);
    case KeyedRead:
      return constructPathFromKeyed(target as KeyedRead, nextFn);
    case MethodCall:
      return constructPathFromMethodCall(target as MethodCall, nextFn);
    case FunctionCall:
      return constructPathFromFunctionCall(target as FunctionCall, nextFn);
    case LiteralPrimitive:
      const { value } = target as LiteralPrimitive;
      return () => value;
    case LiteralArray:
      const { expressions } = target as LiteralArray;

      return createListFn(expressions);
    case ImplicitReceiver:
      return nextFn;
    default:
      console.error('Could not construct Path from AST:', target);
      throw new Error('Could not construct Path from AST');
  }
};

const constructPathFromNamed = (
  ast: PropertyRead,
  nextFn: PathFn = basePathFn
) => {
  const { name, receiver } = ast;
  const fn = (context: any, base: any) => nextFn(context[name], base);

  if (receiver) {
    return constructPathFrom(receiver, fn);
  }

  return fn;
};

const constructPathFromKeyed = (
  target: KeyedRead,
  nextFn: PathFn = basePathFn
): PathFn => {
  const { key, obj } = target;
  const objFn = constructPathFrom(obj);
  const keyFn = constructPathFrom(key);

  return (context: any, base: any) =>
    nextFn(objFn(context, base)[keyFn(base, base)], base);
};

const constructPathFromMethodCall = (
  target: MethodCall,
  nextFn: PathFn = basePathFn
) => {
  const { receiver, name, args } = target;

  const contextFn = constructPathFrom(receiver);
  const argsFn = createListFn(args);

  return (context: any, base: any) =>
    nextFn(contextFn(context, base)[name](...argsFn(base, base)), base);
};

const constructPathFromFunctionCall = (
  target: FunctionCall,
  nextFn: PathFn = basePathFn
) => {
  const { target: func, args } = target;
  const nameFn = constructPathFrom(func);
  const argsFn = createListFn(args);

  return (context: any, base: any) =>
    nextFn(nameFn(context, base)(...argsFn(base, base)), base);
};
