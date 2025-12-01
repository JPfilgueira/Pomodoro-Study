// JavaScript comum a todas as páginas

// Variáveis globais
let temaAtual = 'claro';

// Elementos DOM comuns
const alternadorTema = document.getElementById('alternador-tema');
const botaoHome = document.getElementById('botao-home');
const botaoAnotacoes = document.getElementById('botao-anotacoes');
const botaoCronometro = document.getElementById('botao-cronometro');
const botaoConta = document.getElementById('botao-conta');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script.js carregado - Configurando navegação...');
    
    // Configurar navegação entre páginas - FUNCIONA AGORA!
    if (botaoHome) {
        console.log('Botão home encontrado');
        botaoHome.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou em Home');
            window.location.href = 'index.html';
        });
    } else {
        console.log('Botão home NÃO encontrado');
    }
    
    if (botaoAnotacoes) {
        console.log('Botão anotações encontrado');
        botaoAnotacoes.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou em Anotações');
            window.location.href = 'anotacoes.html';
        });
    } else {
        console.log('Botão anotações NÃO encontrado');
    }
    
    if (botaoCronometro) {
        console.log('Botão cronômetro encontrado');
        botaoCronometro.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou em Cronômetro');
            window.location.href = 'cronometro.html';
        });
    } else {
        console.log('Botão cronômetro NÃO encontrado');
    }
    
    // Configurar botão de conta
    if (botaoConta) {
        console.log('Botão conta encontrado');
        botaoConta.addEventListener('click', function(e) {
            e.preventDefault();
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (usuarioLogado) {
                if (confirm('Deseja sair da sua conta?')) {
                    localStorage.removeItem('usuarioLogado');
                    window.location.href = 'login.html';
                }
            } else {
                console.log('Indo para login...');
                window.location.href = 'login.html';
            }
        });
    } else {
        console.log('Botão conta NÃO encontrado');
    }
    
    // Configurar tema
    if (alternadorTema) {
        alternadorTema.addEventListener('click', alternarTema);
    }
    
    // Verificar e aplicar o tema salvo
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
        temaAtual = temaSalvo;
        aplicarTema();
    }
    
    // Mostrar nome do usuário se estiver logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        mostrarNomeUsuario(usuarioLogado.nome);
    }
});

// Alternar tema
function alternarTema() {
    temaAtual = temaAtual === 'claro' ? 'escuro' : 'claro';
    localStorage.setItem('tema', temaAtual);
    aplicarTema();
}

// Aplicar tema
function aplicarTema() {
    if (temaAtual === 'escuro') {
        document.body.classList.add('tema-escuro');
        if (alternadorTema) alternadorTema.textContent = '☀️';
    } else {
        document.body.classList.remove('tema-escuro');
        if (alternadorTema) alternadorTema.textContent = '🌙';
    }
}

// Mostrar nome do usuário
function mostrarNomeUsuario(nome) {
    const cabecalho = document.querySelector('.cabecalho');
    if (cabecalho && !document.querySelector('.usuario-logado')) {
        const elementoUsuario = document.createElement('div');
        elementoUsuario.className = 'usuario-logado';
        elementoUsuario.textContent = `${nome} está logado`;
        elementoUsuario.style.cssText = `
            color: var(--cor-texto-secundaria);
            font-size: 14px;
            font-weight: 500;
            margin-right: 15px;
            white-space: nowrap;
        `;
        
        const alternadorTema = document.getElementById('alternador-tema');
        if (alternadorTema && alternadorTema.parentNode) {
            alternadorTema.parentNode.insertBefore(elementoUsuario, alternadorTema);
        }
    }
}

// Função para debug - verifica se os botões estão sendo encontrados
function debugBotoes() {
    console.log('=== DEBUG BOTÕES ===');
    console.log('botaoHome:', botaoHome);
    console.log('botaoAnotacoes:', botaoAnotacoes);
    console.log('botaoCronometro:', botaoCronometro);
    console.log('botaoConta:', botaoConta);
    console.log('====================');
}

// Chama o debug para verificar
setTimeout(debugBotoes, 1000);