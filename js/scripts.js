// Objeto com todas as unidades de medida
const unidadesMedida = {
    comprimento: {
        nm: 0.000000001,
        μm: 0.000001,
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        pol: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.34
    },
    peso: {
        mg: 0.001,
        g: 1,
        kg: 1000,
        oz: 28.3495,
        lb: 453.592,
        ton: 1000000
    },
    volume: {
        ml: 0.001,
        l: 1,
        m3: 1000,
        gal: 3.78541,
        qt: 0.946353,
        pt: 0.473176,
        fl_oz: 0.0295735
    },
    area: {
        mm2: 0.000001,
        cm2: 0.0001,
        m2: 1,
        ha: 10000,
        km2: 1000000,
        ac: 4046.86,
        ft2: 0.092903
    },
    velocidade: {
        mps: 1,
        kph: 0.277778,
        mph: 0.44704,
        fps: 0.3048,
        knot: 0.514444
    },
    pressao: {
        pa: 1,
        kpa: 1000,
        bar: 100000,
        psi: 6894.76,
        atm: 101325
    }
};

// Objeto com unidades de tempo
const unidadesTempo = {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
    sem: 604800,
    mes: 2592000,
    ano: 31536000
};

// Função para trocar valores entre campos
function trocarValores(tipo) {
    const origem = document.getElementById(`${tipo}-origem`);
    const destino = document.getElementById(`${tipo}-destino`);
    const valor = document.getElementById(`valor-${tipo}`);
    const resultado = document.getElementById(`resultado-${tipo}`);

    [origem.value, destino.value] = [destino.value, origem.value];
    [valor.value, resultado.value] = [resultado.value, valor.value];
}

// Gerenciar as tabs
document.querySelectorAll('.converter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active de todas as tabs
        document.querySelectorAll('.converter-tab').forEach(t => {
            t.classList.remove('active');
        });
        // Adiciona active na tab clicada
        tab.classList.add('active');
        
        // Esconde todos os conversores
        document.querySelectorAll('.converter-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Mostra o conversor selecionado
        const converterId = `${tab.dataset.converter}-converter`;
        document.getElementById(converterId).classList.add('active');
    });
});

// Função principal de conversão
function realizarConversao() {
    const conversorAtivo = document.querySelector('.converter-content.active').id;
    
    switch(conversorAtivo) {
        case 'moedas-converter':
            converterMoeda();
            break;
        case 'medidas-converter':
            converterMedida();
            break;
        case 'tempo-converter':
            converterTempo();
            break;
        case 'temperatura-converter':
            converterTemperatura();
            break;
        case 'dados-converter':
            converterDados();
            break;
    }
}

// Função para converter moedas
async function converterMoeda() {
    const valor = parseFloat(document.getElementById('valor-moeda').value);
    const moedaOrigem = document.getElementById('moeda-origem').value;
    const moedaDestino = document.getElementById('moeda-destino').value;
    
    if (!valor) return;

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${moedaOrigem}`);
        const data = await response.json();
        
        const taxa = data.rates[moedaDestino];
        const resultado = (valor * taxa).toFixed(2);
        
        document.getElementById('resultado-moeda').value = resultado;
    } catch (error) {
        console.error('Erro ao converter:', error);
        alert('Erro ao realizar a conversão. Tente novamente.');
    }
}

// Função para converter medidas
function converterMedida() {
    const tipoMedida = document.getElementById('tipo-medida').value;
    const valor = parseFloat(document.getElementById('valor-medida').value);
    const origem = document.getElementById('medida-origem').value;
    const destino = document.getElementById('medida-destino').value;
    
    const unidades = unidadesMedida[tipoMedida];
    const resultado = (valor * unidades[origem]) / unidades[destino];
    
    document.getElementById('resultado-medida').value = resultado.toFixed(6);
}

// Função para converter tempo
function converterTempo() {
    const valor = parseFloat(document.getElementById('valor-tempo').value);
    const origem = document.getElementById('tempo-origem').value;
    const destino = document.getElementById('tempo-destino').value;
    
    const emSegundos = valor * unidadesTempo[origem];
    const resultado = emSegundos / unidadesTempo[destino];
    
    document.getElementById('resultado-tempo').value = resultado.toFixed(3);
}

// Função para converter temperatura
function converterTemperatura() {
    const valor = parseFloat(document.getElementById('valor-temperatura').value);
    const origem = document.getElementById('temp-origem').value;
    const destino = document.getElementById('temp-destino').value;
    
    if (isNaN(valor)) {
        document.getElementById('resultado-temperatura').value = '';
        return;
    }
    
    let resultado;
    
    // Primeiro converte para Celsius como temperatura base
    let celsius;
    switch(origem) {
        case 'celsius':
            celsius = valor;
            break;
        case 'fahrenheit':
            celsius = (valor - 32) * (5/9);
            break;
        case 'kelvin':
            celsius = valor - 273.15;
            break;
    }
    
    // Depois converte de Celsius para a unidade de destino
    switch(destino) {
        case 'celsius':
            resultado = celsius;
            break;
        case 'fahrenheit':
            resultado = (celsius * (9/5)) + 32;
            break;
        case 'kelvin':
            resultado = celsius + 273.15;
            break;
    }
    
    // Formata o resultado com 2 casas decimais
    const resultadoFormatado = resultado.toFixed(2);
    
    // Adiciona o símbolo da unidade
    let simbolo = '';
    switch(destino) {
        case 'celsius':
            simbolo = '°C';
            break;
        case 'fahrenheit':
            simbolo = '°F';
            break;
        case 'kelvin':
            simbolo = 'K';
            break;
    }
    
    document.getElementById('resultado-temperatura').value = `${resultadoFormatado}${simbolo}`;
}

// Atualizar opções de medida quando o tipo muda
document.getElementById('tipo-medida')?.addEventListener('change', function() {
    const tipo = this.value;
    const unidades = Object.keys(unidadesMedida[tipo]);
    
    const origemSelect = document.getElementById('medida-origem');
    const destinoSelect = document.getElementById('medida-destino');
    
    [origemSelect, destinoSelect].forEach(select => {
        select.innerHTML = unidades.map(u => {
            const label = u.toUpperCase().replace('_', ' ');
            return `<option value="${u}">${label}</option>`;
        }).join('');
    });
});

// Eventos para conversão automática
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar eventos para inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', realizarConversao);
    });

    // Adicionar eventos para selects
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', realizarConversao);
    });

    // Inicializar o tipo de medida se existir
    const tipoMedida = document.getElementById('tipo-medida');
    if (tipoMedida) {
        tipoMedida.dispatchEvent(new Event('change'));
    }

    const tempInputs = ['valor-temperatura', 'temp-origem', 'temp-destino'];
    
    tempInputs.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('input', converterTemperatura);
            elemento.addEventListener('change', converterTemperatura);
        }
    });
});

// Adicionar eventos para botões de troca
document.querySelectorAll('.swap-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const conversorAtivo = document.querySelector('.converter-content.active').id;
        const tipo = conversorAtivo.split('-')[0];
        trocarValores(tipo);
        realizarConversao();
    });
});

// Adicionar evento para o botão de troca na seção de temperatura
document.querySelector('#temperatura-converter .swap-icon')?.addEventListener('click', () => {
    const origem = document.getElementById('temp-origem');
    const destino = document.getElementById('temp-destino');
    const valor = document.getElementById('valor-temperatura');
    const resultado = document.getElementById('resultado-temperatura');
    
    // Troca as unidades
    [origem.value, destino.value] = [destino.value, origem.value];
    
    // Se houver um valor, realiza a conversão
    if (valor.value) {
        converterTemperatura();
    }
});

// Função para converter automaticamente
function setupAutoConvert(tipoConversor) {
    const inputs = document.querySelectorAll(`#${tipoConversor}-converter input, #${tipoConversor}-converter select`);
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            switch(tipoConversor) {
                case 'moedas':
                    converterMoeda();
                    break;
                case 'medidas':
                    converterMedida();
                    break;
                case 'temperatura':
                    converterTemperatura();
                    break;
                case 'tempo':
                    converterTempo();
                    break;
                case 'dados':
                    converterDados();
                    break;
            }
        });
    });
}

// Função para converter dados
function converterDados() {
    const valor = parseFloat(document.getElementById('valor-dados').value);
    const origem = document.getElementById('dados-origem').value;
    const destino = document.getElementById('dados-destino').value;
    
    if (isNaN(valor)) {
        document.getElementById('resultado-dados').value = '';
        return;
    }

    const fatores = {
        bytes: 1,
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024,
        tb: 1024 * 1024 * 1024 * 1024
    };

    const resultado = (valor * fatores[origem]) / fatores[destino];
    document.getElementById('resultado-dados').value = resultado.toFixed(2);
}

// Função para converter tempo
function converterTempo() {
    const valor = parseFloat(document.getElementById('valor-tempo').value);
    const origem = document.getElementById('tempo-origem').value;
    const destino = document.getElementById('tempo-destino').value;
    
    if (isNaN(valor)) {
        document.getElementById('resultado-tempo').value = '';
        return;
    }

    const fatores = {
        ms: 1,
        s: 1000,
        min: 60000,
        h: 3600000,
        d: 86400000,
        sem: 604800000,
        mes: 2592000000,
        ano: 31536000000
    };

    const resultado = (valor * fatores[origem]) / fatores[destino];
    document.getElementById('resultado-tempo').value = resultado.toFixed(2);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Setup das conversões automáticas
    ['moedas', 'medidas', 'temperatura', 'tempo', 'dados'].forEach(tipo => {
        setupAutoConvert(tipo);
    });

    // Setup dos botões de troca
    document.querySelectorAll('.swap-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const conversor = this.closest('.converter-content');
            const tipo = conversor.id.split('-')[0];
            const origem = document.getElementById(`${tipo}-origem`);
            const destino = document.getElementById(`${tipo}-destino`);
            [origem.value, destino.value] = [destino.value, origem.value];
            
            // Disparar conversão após a troca
            const evento = new Event('input');
            origem.dispatchEvent(evento);
        });
    });
});