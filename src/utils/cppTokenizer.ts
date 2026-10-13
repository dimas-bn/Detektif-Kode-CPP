/**
 * Lightweight C++ Syntax Highlighter for CodeViewer
 */

export interface TokenSpan {
  text: string;
  type: 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'preprocessor' | 'io' | 'operator' | 'plain';
}

const KEYWORDS = new Set([
  'using', 'namespace', 'return', 'if', 'else', 'while', 'for', 'do',
  'break', 'continue', 'switch', 'case', 'default', 'const', 'auto', 'struct', 'class'
]);

const TYPES = new Set([
  'int', 'double', 'float', 'char', 'bool', 'void', 'string', 'long', 'short', 'unsigned'
]);

const IO_STREAM = new Set([
  'cin', 'cout', 'endl', 'iostream', 'string'
]);

export function highlightCppLine(line: string): TokenSpan[] {
  const spans: TokenSpan[] = [];
  let i = 0;

  // Check preprocessor line
  const trimmed = line.trimStart();
  if (trimmed.startsWith('#')) {
    // Whole preprocessor or keyword
    const hashIdx = line.indexOf('#');
    if (hashIdx > 0) {
      spans.push({ text: line.substring(0, hashIdx), type: 'plain' });
    }
    spans.push({ text: line.substring(hashIdx), type: 'preprocessor' });
    return spans;
  }

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      spans.push({ text: line.substring(i), type: 'comment' });
      break;
    }

    // String literal
    if (line[i] === '"') {
      let str = '"';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length && line[i] === '"') {
        str += '"';
        i++;
      }
      spans.push({ text: str, type: 'string' });
      continue;
    }

    // Char literal
    if (line[i] === "'") {
      let chStr = "'";
      i++;
      while (i < line.length && line[i] !== "'") {
        if (line[i] === '\\' && i + 1 < line.length) {
          chStr += line[i] + line[i + 1];
          i += 2;
        } else {
          chStr += line[i];
          i++;
        }
      }
      if (i < line.length && line[i] === "'") {
        chStr += "'";
        i++;
      }
      spans.push({ text: chStr, type: 'string' });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(line[i]) && (i === 0 || /[^a-zA-Z0-9_]/.test(line[i - 1]))) {
      let num = '';
      while (i < line.length && /[0-9.]/.test(line[i])) {
        num += line[i];
        i++;
      }
      spans.push({ text: num, type: 'number' });
      continue;
    }

    // Identifiers and Keywords
    if (/[a-zA-Z_]/.test(line[i])) {
      let word = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i];
        i++;
      }

      if (KEYWORDS.has(word)) {
        spans.push({ text: word, type: 'keyword' });
      } else if (TYPES.has(word)) {
        spans.push({ text: word, type: 'type' });
      } else if (IO_STREAM.has(word)) {
        spans.push({ text: word, type: 'io' });
      } else {
        spans.push({ text: word, type: 'plain' });
      }
      continue;
    }

    // Two-character operators
    const two = line.substring(i, i + 2);
    if (['<<', '>>', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&&', '||', '++'].includes(two)) {
      spans.push({ text: two, type: 'operator' });
      i += 2;
      continue;
    }

    // Single-character punctuation / operators
    if (/[+\-*/%=<>!&|^~?:;.,(){}[\]]/.test(line[i])) {
      spans.push({ text: line[i], type: 'operator' });
      i++;
      continue;
    }

    // Whitespace or plain
    spans.push({ text: line[i], type: 'plain' });
    i++;
  }

  return spans;
}
