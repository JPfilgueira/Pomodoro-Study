// JavaScript específico da página do Cronômetro

// Variáveis
let intervaloContador;
let minutosContador = 25; // Deixe em 0 para testar o alarme
let segundosContador = 0;
let contadorExecutando = false;
let tempoPausa = false;
let fundoAtual = 0; // 0 = padrão, 1-4 = fundos

// Elementos DOM
const elementoDataAtual = document.getElementById('data-atual');
const elementoHoraAtual = document.getElementById('hora-atual');
const displayContador = document.getElementById('display-cronometro');
const botaoIniciar = document.getElementById('botao-iniciar');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const botaoPausaCurta = document.getElementById('pausa-curta');
const botaoPausaLonga = document.getElementById('pausa-longa');
const circuloContador = document.getElementById('circulo-cronometro');
const botaoTrocarFundo = document.getElementById('trocar-fundo');
const elementoBody = document.body;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe específica para a página do cronômetro
    elementoBody.classList.add('pagina-cronometro');
    
    atualizarDataHora();
    setInterval(atualizarDataHora, 1000);
    
    // Configurar event listeners
    if (botaoIniciar) {
        botaoIniciar.addEventListener('click', alternarContador);
    }
    
    if (botaoReiniciar) {
        botaoReiniciar.addEventListener('click', reiniciarContador);
    }
    
    if (botaoPausaCurta) {
        botaoPausaCurta.addEventListener('click', () => definirTempoPausa(5));
    }
    
    if (botaoPausaLonga) {
        botaoPausaLonga.addEventListener('click', () => definirTempoPausa(15));
    }
    
    if (botaoTrocarFundo) {
        botaoTrocarFundo.addEventListener('click', trocarFundo);
    }
    
    // Carregar fundo salvo se existir
    const fundoSalvo = localStorage.getItem('fundoContador');
    if (fundoSalvo) {
        fundoAtual = parseInt(fundoSalvo);
        aplicarFundo();
    } else {
        // Aplicar fundo padrão inicialmente
        aplicarFundo();
    }
    
    // Inicializar o display do contador
    atualizarDisplayContador();
});

// Função para trocar o fundo
function trocarFundo() {
    fundoAtual++;
    
    // Se chegou ao limite, volta para o fundo padrão
    if (fundoAtual > 4) {
        fundoAtual = 0;
    }
    
    aplicarFundo();
    
    // Salvar preferência
    localStorage.setItem('fundoContador', fundoAtual);
}

// Aplicar o fundo selecionado
function aplicarFundo() {
    // Remover todas as classes de fundo
    elementoBody.classList.remove('fundo-padrao', 'fundo-1', 'fundo-2', 'fundo-3', 'fundo-4');
    
    if (fundoAtual === 0) {
        // Fundo padrão (gradiente)
        elementoBody.classList.add('fundo-padrao');
    } else {
        // Fundo com imagem
        elementoBody.classList.add(`fundo-${fundoAtual}`);
    }
}

// Atualizar data e hora
function atualizarDataHora() {
    const agora = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    if (elementoDataAtual) {
        elementoDataAtual.textContent = agora.toLocaleDateString('pt-BR', opcoes);
    }
    
    if (elementoHoraAtual) {
        elementoHoraAtual.textContent = agora.toLocaleTimeString('pt-BR');
    }
}

// Alternar contador (iniciar/pausar)
function alternarContador() {
    if (!contadorExecutando) {
        iniciarContador();
        botaoIniciar.textContent = 'Pausar';
        contadorExecutando = true;
    } else {
        pausarContador();
        botaoIniciar.textContent = 'Continuar';
        contadorExecutando = false;
    }
}

// Iniciar contador
function iniciarContador() {
    clearInterval(intervaloContador);
    intervaloContador = setInterval(atualizarContador, 1000);
}

// Pausar contador
function pausarContador() {
    clearInterval(intervaloContador);
}

// Reiniciar contador
function reiniciarContador() {
    clearInterval(intervaloContador);
    if (tempoPausa) {
        minutosContador = 5;
        tempoPausa = false;
    } else {
        minutosContador = 25;
    }
    segundosContador = 0;
    atualizarDisplayContador();
    botaoIniciar.textContent = 'Iniciar';
    contadorExecutando = false;
}

// Atualizar contador
function atualizarContador() {
    if (segundosContador === 0) {
        if (minutosContador === 0) {
            // Contador completado
            clearInterval(intervaloContador);
            tocarSomAlarme();
            
            if (!tempoPausa) {
                // Terminou tempo de estudo, iniciar pausa
                tempoPausa = true;
                minutosContador = 5; // Pausa curta padrão
                botaoIniciar.textContent = 'Iniciar';
                contadorExecutando = false;
                alert('Tempo de estudo concluído! Hora de uma pausa.');
            } else {
                // Terminou pausa, reiniciar para estudo
                tempoPausa = false;
                minutosContador = 25;
                botaoIniciar.textContent = 'Iniciar';
                contadorExecutando = false;
                alert('Pausa concluída! Hora de voltar aos estudos.');
            }
            
            atualizarDisplayContador();
            return;
        }
        minutosContador--;
        segundosContador = 59;
    } else {
        segundosContador--;
    }
    
    atualizarDisplayContador();
}

// Atualizar display do contador
function atualizarDisplayContador() {
    const minutosFormatados = minutosContador < 10 ? `0${minutosContador}` : minutosContador;
    const segundosFormatados = segundosContador < 10 ? `0${segundosContador}` : segundosContador;
    displayContador.textContent = `${minutosFormatados}:${segundosFormatados}`;
    
    // Atualizar a cor do círculo com base no tempo restante
    const segundosTotais = tempoPausa ? (minutosContador * 60 + segundosContador) : (25 * 60);
    const segundosRestantes = minutosContador * 60 + segundosContador;
    const porcentagem = (segundosRestantes / segundosTotais) * 100;
    
    if (tempoPausa) {
        circuloContador.style.borderColor = `rgba(0, 255, 0, ${porcentagem / 100})`;
    } else {
        circuloContador.style.borderColor = `rgba(255, 255, 255, ${porcentagem / 100})`;
    }
}

// Definir tempo de pausa
function definirTempoPausa(minutos) {
    clearInterval(intervaloContador);
    tempoPausa = true;
    minutosContador = minutos;
    segundosContador = 0;
    atualizarDisplayContador();
    botaoIniciar.textContent = 'Iniciar';
    contadorExecutando = false;
}

// Tocar som de alarme
function tocarSomAlarme() {
    // Para implementar o som no futuro:
    // 1. Adicione um arquivo de áudio na pasta assets (ex: alarm-sound.mp3)
    // 2. Substitua este código pelo seguinte:
    /*
    const audio = new Audio('assets/alarm-sound.mp3');
    audio.play().catch(error => {
        console.log('Erro ao reproduzir áudio:', error);
    });
    */
    
    console.log('Tempo concluído! Som de alarme seria reproduzido aqui.');
}