import {useState} from 'react';
import {evaluateExpression} from '../lib/evaluateExpression';

type Token = string;

const UI_TO_MATH_OPERATOR: Record<string, string> = {
  '×': '*',
  '÷': '/',
  '^': '^',
  '+': '+',
  '–': '-', // long dash
  '-': '-',
};

const TRIG_FUNCTIONS = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];

export const useCalculatorLogic = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [result, setResult] = useState('');
  const [degreeMode, setDegreeMode] = useState(true);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  // Convert tokens to math expression string for evaluation
  const tokensToExpression = (tokens: Token[]) => {
    return tokens
      .map(t => {
        if (t === 'Ans') return ans;
        if (UI_TO_MATH_OPERATOR[t]) return UI_TO_MATH_OPERATOR[t];
        return t;
      })
      .join('');
  };

  const isOperator = (token: string) => !!UI_TO_MATH_OPERATOR[token];
  const isNumber = (token: string) => /^-?\d*\.?\d+$/.test(token);
  const isFunction = (token: string) =>
    TRIG_FUNCTIONS.includes(token) ||
    ['sqrt', 'cbrt', 'nthRoot', 'exp', 'ln', 'log'].includes(token);

  const insert = (val: string) => {
    setTokens(prevTokens => {
      const last = prevTokens[prevTokens.length - 1] || '';
      const isValOperator =
        !!UI_TO_MATH_OPERATOR[val] ||
        TRIG_FUNCTIONS.includes(val) ||
        val.endsWith('(');
      const isLastOperator =
        !!UI_TO_MATH_OPERATOR[last] ||
        TRIG_FUNCTIONS.includes(last) ||
        last.endsWith('(');

      // If val is a digit or dot, and last token is a number, append to last token (to build multi-digit numbers)
      if (/^\d|\.$/.test(val)) {
        if (prevTokens.length > 0 && /^[\d.]+$/.test(last)) {
          // Append digit/dot to last token number
          const newTokens = [...prevTokens];
          newTokens[newTokens.length - 1] = last + val;
          return newTokens;
        } else {
          // Insert new number token
          return [...prevTokens, val];
        }
      }

      // If val is an operator or function:
      if (isValOperator) {
        if (isLastOperator) {
          // Replace last operator with new operator/function
          return [...prevTokens.slice(0, -1), val];
        } else {
          return [...prevTokens, val];
        }
      }

      // For parentheses or others, just append
      return [...prevTokens, val];
    });
  };

  const handlePress = (btn: string) => {
    switch (btn) {
      case 'AC':
        setTokens([]);
        setResult('');
        setJustEvaluated(false);
        break;

      case 'clear':
        setTokens(prev => prev.slice(0, -1));
        break;

      case '=': {
        const expr = tokensToExpression(tokens);
        const evalResult = evaluateExpression(expr, degreeMode);
        setResult(evalResult);
        if (evalResult !== 'Error') setAns(evalResult);
        setJustEvaluated(true);
        break;
      }

      case 'DegRad':
        setDegreeMode(prev => !prev);
        break;

      case 'Ans':
        insert('Ans');
        break;

      case 'M+':
        setMemory(prev => prev + parseFloat(result || ans));
        break;

      case 'M-':
        setMemory(prev => prev - parseFloat(result || ans));
        break;

      case 'MR':
        insert(memory.toString());
        break;

      case 'π':
        insert('pi');
        break;

      case 'e':
        insert('e');
        break;

      case 'x²':
        insert('^2');
        break;

      case 'x³':
        insert('^3');
        break;

      case '^':
        insert('^');
        break;

      case '√x':
        insert('sqrt(');
        break;

      case '∛x':
        insert('cbrt(');
        break;

      case 'y√x':
        insert('nthRoot(');
        break;

      case 'e^x':
        insert('exp(');
        break;

      case '10^x':
        insert('10^');
        break;

      case '1/x':
        insert('1/(');
        break;

      case 'n!':
        insert('!');
        break;

      case 'ln':
        insert('ln(');
        break;

      case 'log':
        insert('log(');
        break;

      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
        insert(`${btn}(`);
        break;

      case '±': {
        // Flip sign of last number if possible
        setTokens(prevTokens => {
          const newTokens = [...prevTokens];
          for (let i = newTokens.length - 1; i >= 0; i--) {
            const t = newTokens[i];
            if (isNumber(t)) {
              if (t.startsWith('-')) {
                newTokens[i] = t.slice(1);
              } else {
                newTokens[i] = '-' + t;
              }
              break;
            }
          }
          return newTokens;
        });
        break;
      }

      case 'RND':
        insert(Math.random().toFixed(8));
        break;

      case 'EXP':
        insert('e');
        break;

      default:
        insert(btn);
        break;
    }
  };

  return {
    input: tokens.join(' '),
    result,
    degreeMode,
    memory,
    ans,
    handlePress,
  };
};
