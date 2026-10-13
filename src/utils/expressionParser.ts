/**
 * C++ Expression Tokenizer, AST Parser & Evaluator (No eval, strict C++ semantics)
 */

export interface Token {
  type: 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN';
  value: string;
  isFloat?: boolean;
}

export interface EvalResult {
  success: boolean;
  rawResult?: number;
  formattedResult?: string;
  isBoolean?: boolean;
  booleanMeaning?: 'true' | 'false';
  error?: string;
  steps: string[];
}

interface ValueNode {
  type: 'val';
  val: number;
  isFloat: boolean;
  isBool?: boolean;
}

interface UnaryNode {
  type: 'unary';
  op: string; // '!' or '-' or '+'
  operand: ASTNode;
}

interface BinaryNode {
  type: 'binary';
  op: string;
  left: ASTNode;
  right: ASTNode;
}

type ASTNode = ValueNode | UnaryNode | BinaryNode;

export function evaluateCppExpression(input: string): EvalResult {
  const steps: string[] = [];
  const cleanInput = input.trim();

  if (!cleanInput) {
    return {
      success: false,
      error: 'Masukkan ekspresi C++ terlebih dahulu.',
      steps: []
    };
  }

  try {
    const tokens = tokenize(cleanInput);
    if (tokens.length === 0) {
      return { success: false, error: 'Ekspresi kosong.', steps: [] };
    }

    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Evaluate AST and record reduction steps
    const result = evaluateAST(ast, steps);

    let formattedResult = '';
    let isBoolean = false;
    let booleanMeaning: 'true' | 'false' | undefined = undefined;

    if (result.isBool) {
      isBoolean = true;
      const bVal = result.val !== 0;
      booleanMeaning = bVal ? 'true' : 'false';
      formattedResult = `${bVal ? 1 : 0} (${booleanMeaning})`;
    } else if (result.isFloat) {
      // Float formatted nicely, keeping decimals if any
      const str = result.val.toString();
      formattedResult = str.includes('.') ? str : `${str}.0`;
    } else {
      formattedResult = Math.trunc(result.val).toString();
    }

    return {
      success: true,
      rawResult: result.val,
      formattedResult,
      isBoolean,
      booleanMeaning,
      steps
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Kesalahan sintaks ekspresi.',
      steps
    };
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Two-character operators: ==, !=, <=, >=, &&, ||
    const two = input.substring(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(two)) {
      tokens.push({ type: 'OP', value: two });
      i += 2;
      continue;
    }

    // Single-character operators: +, -, *, /, %, <, >, !
    if (['+', '-', '*', '/', '%', '<', '>', '!'].includes(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    // Numbers (integer or float)
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(input[i + 1] || ''))) {
      let numStr = '';
      let hasDot = false;

      while (i < input.length && (/[0-9]/.test(input[i]) || input[i] === '.')) {
        if (input[i] === '.') {
          if (hasDot) break;
          hasDot = true;
        }
        numStr += input[i];
        i++;
      }

      tokens.push({
        type: 'NUMBER',
        value: numStr,
        isFloat: hasDot
      });
      continue;
    }

    // Boolean keywords true / false
    if (input.substring(i, i + 4) === 'true') {
      tokens.push({ type: 'NUMBER', value: '1', isFloat: false });
      i += 4;
      continue;
    }
    if (input.substring(i, i + 5) === 'false') {
      tokens.push({ type: 'NUMBER', value: '0', isFloat: false });
      i += 5;
      continue;
    }

    throw new Error(`Karakter tidak dikenal dalam ekspresi: '${ch}'`);
  }

  return tokens;
}

class Parser {
  private pos = 0;

  constructor(private tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  public parse(): ASTNode {
    const node = this.parseOr();
    if (this.pos < this.tokens.length) {
      throw new Error(`Simbol tak terduga: '${this.tokens[this.pos].value}'`);
    }
    return node;
  }

  // Precedence level 1 (lowest): ||
  private parseOr(): ASTNode {
    let left = this.parseAnd();
    while (this.peek()?.value === '||') {
      const op = this.consume().value;
      const right = this.parseAnd();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 2: &&
  private parseAnd(): ASTNode {
    let left = this.parseEquality();
    while (this.peek()?.value === '&&') {
      const op = this.consume().value;
      const right = this.parseEquality();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 3: ==, !=
  private parseEquality(): ASTNode {
    let left = this.parseRelational();
    while (this.peek()?.value === '==' || this.peek()?.value === '!=') {
      const op = this.consume().value;
      const right = this.parseRelational();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 4: <, <=, >, >=
  private parseRelational(): ASTNode {
    let left = this.parseAdditive();
    while (
      this.peek() &&
      ['<', '<=', '>', '>='].includes(this.peek()!.value)
    ) {
      const op = this.consume().value;
      const right = this.parseAdditive();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 5: +, -
  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    while (this.peek() && ['+', '-'].includes(this.peek()!.value)) {
      const op = this.consume().value;
      const right = this.parseMultiplicative();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 6: *, /, %
  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();
    while (this.peek() && ['*', '/', '%'].includes(this.peek()!.value)) {
      const op = this.consume().value;
      const right = this.parseUnary();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  // Precedence level 7: unary !, -, +
  private parseUnary(): ASTNode {
    const cur = this.peek();
    if (cur && ['!', '-', '+'].includes(cur.value)) {
      const op = this.consume().value;
      const operand = this.parseUnary();
      return { type: 'unary', op, operand };
    }
    return this.parsePrimary();
  }

  // Precedence level 8: primary (number or paren)
  private parsePrimary(): ASTNode {
    const cur = this.peek();
    if (!cur) {
      throw new Error('Ekspresi terpotong atau tidak lengkap.');
    }

    if (cur.type === 'LPAREN') {
      this.consume();
      const node = this.parseOr();
      const close = this.peek();
      if (!close || close.type !== 'RPAREN') {
        throw new Error("Tanda kurung buka '(' tidak memiliki penutup ')'.");
      }
      this.consume();
      return node;
    }

    if (cur.type === 'NUMBER') {
      this.consume();
      const val = parseFloat(cur.value);
      return {
        type: 'val',
        val,
        isFloat: !!cur.isFloat
      };
    }

    throw new Error(`Sintaks salah di dekat '${cur.value}'`);
  }
}

interface EvaluatedValue {
  val: number;
  isFloat: boolean;
  isBool: boolean;
  repr: string;
}

function evaluateAST(node: ASTNode, steps: string[]): EvaluatedValue {
  if (node.type === 'val') {
    const repr = node.isFloat ? (node.val.toString().includes('.') ? node.val.toString() : `${node.val}.0`) : Math.trunc(node.val).toString();
    return {
      val: node.val,
      isFloat: node.isFloat,
      isBool: false,
      repr
    };
  }

  if (node.type === 'unary') {
    const operand = evaluateAST(node.operand, steps);
    let resVal: number;
    let resIsFloat = operand.isFloat;
    let resIsBool = false;

    if (node.op === '!') {
      resIsBool = true;
      resIsFloat = false;
      resVal = operand.val === 0 ? 1 : 0;
      const stepMsg = `!(${operand.repr}) menghasilkan ${resVal} (${resVal ? 'true' : 'false'})`;
      steps.push(stepMsg);
    } else if (node.op === '-') {
      resVal = -operand.val;
      steps.push(`-(${operand.repr}) menghasilkan ${resVal}`);
    } else if (node.op === '+') {
      resVal = operand.val;
    } else {
      throw new Error(`Unary operator '${node.op}' tidak didukung`);
    }

    return {
      val: resVal,
      isFloat: resIsFloat,
      isBool: resIsBool,
      repr: resIsBool ? `${resVal}` : (resIsFloat ? resVal.toString() : Math.trunc(resVal).toString())
    };
  }

  // Binary node
  const left = evaluateAST(node.left, steps);
  const right = evaluateAST(node.right, steps);

  const isEitherFloat = left.isFloat || right.isFloat;
  let resVal = 0;
  let resIsFloat = false;
  let resIsBool = false;

  switch (node.op) {
    case '+': {
      resVal = left.val + right.val;
      resIsFloat = isEitherFloat;
      const stepStr = `${left.repr} + ${right.repr} = ${resIsFloat ? resVal : Math.trunc(resVal)}`;
      steps.push(stepStr);
      break;
    }
    case '-': {
      resVal = left.val - right.val;
      resIsFloat = isEitherFloat;
      const stepStr = `${left.repr} - ${right.repr} = ${resIsFloat ? resVal : Math.trunc(resVal)}`;
      steps.push(stepStr);
      break;
    }
    case '*': {
      resVal = left.val * right.val;
      resIsFloat = isEitherFloat;
      const stepStr = `${left.repr} * ${right.repr} = ${resIsFloat ? resVal : Math.trunc(resVal)}`;
      steps.push(stepStr);
      break;
    }
    case '/': {
      if (right.val === 0) {
        throw new Error('Error C++: Pembagian dengan nol (division by zero) tidak diizinkan!');
      }

      if (isEitherFloat) {
        resVal = left.val / right.val;
        resIsFloat = true;
        steps.push(`${left.repr} / ${right.repr} = ${resVal} (salah satu desimal, hasil bertipe desimal)`);
      } else {
        // Integer division truncates towards zero in C++
        resVal = Math.trunc(left.val / right.val);
        resIsFloat = false;
        steps.push(`${left.repr} / ${right.repr} = ${resVal} (pembagian integer membuang pecahan / truncate)`);
      }
      break;
    }
    case '%': {
      if (left.isFloat || right.isFloat) {
        throw new Error("Error C++: Operator modulo '%' hanya berlaku untuk bilangan bulat (integer), tidak bisa untuk pecahan/desimal!");
      }
      if (right.val === 0) {
        throw new Error('Error C++: Sisa bagi modulo dengan nol (% 0) tidak diizinkan!');
      }
      resVal = Math.trunc(left.val) % Math.trunc(right.val);
      resIsFloat = false;
      steps.push(`${left.repr} % ${right.repr} = ${resVal} (sisa bagi integer)`);
      break;
    }
    case '<':
    case '<=':
    case '>':
    case '>=':
    case '==':
    case '!=': {
      resIsBool = true;
      resIsFloat = false;
      let boolAns = false;
      if (node.op === '<') boolAns = left.val < right.val;
      if (node.op === '<=') boolAns = left.val <= right.val;
      if (node.op === '>') boolAns = left.val > right.val;
      if (node.op === '>=') boolAns = left.val >= right.val;
      if (node.op === '==') boolAns = left.val === right.val;
      if (node.op === '!=') boolAns = left.val !== right.val;
      resVal = boolAns ? 1 : 0;
      steps.push(`${left.repr} ${node.op} ${right.repr} = ${resVal} (${boolAns ? 'true' : 'false'})`);
      break;
    }
    case '&&': {
      resIsBool = true;
      resIsFloat = false;
      const leftBool = left.val !== 0;
      const rightBool = right.val !== 0;
      const boolAns = leftBool && rightBool;
      resVal = boolAns ? 1 : 0;
      steps.push(`${left.repr} && ${right.repr} (${leftBool ? '1' : '0'} DAN ${rightBool ? '1' : '0'}) = ${resVal} (${boolAns ? 'true' : 'false'})`);
      break;
    }
    case '||': {
      resIsBool = true;
      resIsFloat = false;
      const leftBool = left.val !== 0;
      const rightBool = right.val !== 0;
      const boolAns = leftBool || rightBool;
      resVal = boolAns ? 1 : 0;
      steps.push(`${left.repr} || ${right.repr} (${leftBool ? '1' : '0'} ATAU ${rightBool ? '1' : '0'}) = ${resVal} (${boolAns ? 'true' : 'false'})`);
      break;
    }
    default:
      throw new Error(`Operator '${node.op}' tidak dikenali.`);
  }

  const finalRepr = resIsBool
    ? `${resVal}`
    : (resIsFloat ? resVal.toString() : Math.trunc(resVal).toString());

  return {
    val: resVal,
    isFloat: resIsFloat,
    isBool: resIsBool,
    repr: finalRepr
  };
}
