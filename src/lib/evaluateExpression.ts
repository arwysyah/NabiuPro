import {create, all} from 'mathjs';

const config = {};

// Create default math (radians)
const mathRad = create(all, config);

// Create degree math by overriding trig functions once
const mathDeg = create(all, config);
mathDeg.import(
  {
    sin: (x: number) => mathRad.sin((x / 180) * Math.PI),
    cos: (x: number) => mathRad.cos((x / 180) * Math.PI),
    tan: (x: number) => mathRad.tan((x / 180) * Math.PI),
    asin: (x: number) => (mathRad.asin(x) * 180) / Math.PI,
    acos: (x: number) => (mathRad.acos(x) * 180) / Math.PI,
    atan: (x: number) => (mathRad.atan(x) * 180) / Math.PI,
  },
  {override: true},
);

const evaluateExpression = (expr: string, degreeMode: boolean): string => {
  try {
    const math = degreeMode ? mathDeg : mathRad;

    // Remove manual factorial replacement — mathjs supports factorial postfix natively
    // Just evaluate expression as is.

    const val = math.evaluate(expr);
    return val.toString();
  } catch {
    return 'Error';
  }
};
export {evaluateExpression};
