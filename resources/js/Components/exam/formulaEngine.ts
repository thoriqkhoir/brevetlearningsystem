/**
 * Pure recursive-descent arithmetic evaluator for the Exam Calculator.
 * Avoids eval/Function completely and guards against division by zero.
 */

type Token =
    | { type: "number"; value: number }
    | { type: "op"; value: string }
    | { type: "paren"; value: "(" | ")" };

export function normalizeNumber(n: number): number {
    if (!Number.isFinite(n)) return n;
    const rounded = Number(n.toPrecision(12));
    return Object.is(rounded, -0) ? 0 : rounded;
}

export function formatIndonesianNumber(n: number, useGrouping = true): string {
    if (!Number.isFinite(n)) return "Error";
    const normalized = normalizeNumber(n);
    if (!useGrouping) return String(normalized);
    const parts = String(normalized).split(".");
    const intPart = Number(parts[0]).toLocaleString("id-ID");
    return parts.length > 1 ? `${intPart},${parts[1]}` : intPart;
}

function tokenizeMath(input: string): Token[] {
    const cleaned = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/,/g, ".");
    const tokens: Token[] = [];
    let i = 0;

    while (i < cleaned.length) {
        const ch = cleaned[i];
        if (/\s/.test(ch)) {
            i++;
            continue;
        }
        if (/\d/.test(ch) || (ch === "." && i + 1 < cleaned.length && /\d/.test(cleaned[i + 1]))) {
            let numStr = "";
            let dotCount = 0;
            while (i < cleaned.length && (/\d/.test(cleaned[i]) || cleaned[i] === ".")) {
                if (cleaned[i] === ".") {
                    dotCount++;
                    if (dotCount > 1) throw new Error("Format angka tidak valid");
                }
                numStr += cleaned[i++];
            }
            const value = Number(numStr);
            if (!Number.isFinite(value)) throw new Error("Angka tidak valid");
            tokens.push({ type: "number", value });
            continue;
        }
        if (ch === "(" || ch === ")") {
            tokens.push({ type: "paren", value: ch });
            i++;
            continue;
        }
        if ("+-*/%".includes(ch)) {
            tokens.push({ type: "op", value: ch });
            i++;
            continue;
        }
        throw new Error(`Karakter tidak dikenali: ${ch}`);
    }
    return tokens;
}

export function evaluateMathExpression(input: string): number {
    const trimmed = input.trim();
    if (!trimmed) throw new Error("Ekspresi kosong");

    const tokens = tokenizeMath(trimmed);
    let pos = 0;

    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    function parseExpression(): number {
        let left = parseTerm();
        while (peek()?.type === "op" && ((peek() as any).value === "+" || (peek() as any).value === "-")) {
            const op = (consume() as any).value;
            const right = parseTerm();
            left = op === "+" ? left + right : left - right;
        }
        return left;
    }

    function parseTerm(): number {
        let left = parseUnary();
        while (peek()?.type === "op" && ((peek() as any).value === "*" || (peek() as any).value === "/")) {
            const op = (consume() as any).value;
            const right = parseUnary();
            if (op === "/") {
                if (right === 0) throw new Error("Tidak bisa dibagi 0");
                left = left / right;
            } else {
                left = left * right;
            }
        }
        return left;
    }

    function parseUnary(): number {
        if (peek()?.type === "op" && ((peek() as any).value === "+" || (peek() as any).value === "-")) {
            const op = (consume() as any).value;
            const val = parseUnary();
            return op === "-" ? -val : val;
        }
        return parsePostfix();
    }

    function parsePostfix(): number {
        let val = parsePrimary();
        while (peek()?.type === "op" && (peek() as any).value === "%") {
            consume();
            val = val / 100;
        }
        return val;
    }

    function parsePrimary(): number {
        const tok = peek();
        if (!tok) throw new Error("Ekspresi tidak lengkap");
        if (tok.type === "number") {
            consume();
            return tok.value;
        }
        if (tok.type === "paren" && tok.value === "(") {
            consume();
            const val = parseExpression();
            const closing = peek();
            if (!closing || closing.type !== "paren" || closing.value !== ")") {
                throw new Error("Tanda kurung tidak seimbang");
            }
            consume();
            return val;
        }
        throw new Error("Format rumus tidak valid");
    }

    const result = normalizeNumber(parseExpression());
    if (pos < tokens.length) throw new Error("Ekspresi tidak valid");
    if (!Number.isFinite(result)) throw new Error("Hasil tidak terdefinisi");
    return result;
}
