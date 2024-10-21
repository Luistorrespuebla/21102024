document.getElementById('btn-iniciar').addEventListener('click', () => {
    const operacion = document.getElementById('input-operacion').value.trim();
    const tipo = document.getElementById('select-opcion').value;
    const resultArea = document.getElementById('resultado');

    if (validacionOperadores(operacion)) {
        alert('No se permiten dos operadores consecutivos en la operación.');
        return;
    }

    let resultado;

    if (tipo === 'polaca') {
        resultado = conversionPolaca(operacion);
    } else if (tipo === 'algebraica') {
        resultado = conversionAlgebraica(operacion);
    }

    resultArea.value = resultado;
    resultArea.value += '\nResultado de la operación: ' + obtenerResultado(operacion, tipo);
});

const validacionOperadores = operacion => {
    const consecutivos = /[+\-*/]{2,}/;
    return consecutivos.test(operacion);
};

const conversionPolaca = operacion => {
    const output = [];
    const operador = [];
    const orden = { '+': 1, '-': 1, '*': 2, '/': 2 };

    const tokens = operacion.match(/-?\d+|[+\-*/()]/g);

    for (const token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (token === '(') {
            operador.push(token);
        } else if (token === ')') {
            while (operador.length > 0 && operador[operador.length - 1] !== '(') {
                output.unshift(operador.pop());
            }
            operador.pop();
        } else {
            while (
                operador.length > 0 &&
                orden[operador[operador.length - 1]] >= orden[token]
            ) {
                output.unshift(operador.pop());
            }
            operador.push(token);
        }
    }

    while (operador.length > 0) {
        output.unshift(operador.pop());
    }

    return 'Forma polaca: ' + output.join(' ');
};

const conversionAlgebraica = operacion => {
    const stack = [];
    const tokens = operacion.split(' ').reverse();

    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            const op1 = stack.pop();
            const op2 = stack.pop();
            const newOperacion = `(${op1} ${token} ${op2})`;
            stack.push(newOperacion);
        }
    });

    return 'Forma algebraica: ' + stack.pop();
};

const obtenerResultado = (operacion, tipo) => {
    if (tipo === 'polaca') {
        const polacaExp = conversionPolaca(operacion);
        return eval(polacaExp.replace(/Forma polaca: /, '').trim().split(' ').join(' '));
    } else if (tipo === 'algebraica') {
        const algebraicaExp = conversionAlgebraica(operacion);
        return eval(algebraicaExp.replace(/Forma algebraica: /, '').trim());
    }
    return 'Error en la operación';
};
