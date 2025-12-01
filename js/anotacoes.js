// JavaScript específico da página de Anotações
let anotacoes = {};

const elementoMateriaAtual = document.getElementById('materia-atual');
const containerAnotacoes = document.getElementById('container-anotacoes');
const inputNovaAnotacao = document.getElementById('nova-anotacao');
const botaoAdicionarAnotacao = document.getElementById('botao-adicionar-anotacao');
const botoesMateria = document.querySelectorAll('.botao-materia');

document.addEventListener('DOMContentLoaded', async function() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    
    await carregarAnotacoesSalvas(usuarioLogado.email, 'Matemática');
    
    if (botaoAdicionarAnotacao) {
        botaoAdicionarAnotacao.addEventListener('click', adicionarNovaAnotacao);
    }
    
    if (inputNovaAnotacao) {
        inputNovaAnotacao.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adicionarNovaAnotacao();
            }
        });
    }
    
    botoesMateria.forEach(botao => {
        botao.addEventListener('click', async function() {
            const materia = this.getAttribute('data-materia');
            elementoMateriaAtual.textContent = materia;
            
            botoesMateria.forEach(btn => btn.classList.remove('ativo'));
            this.classList.add('ativo');
            
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            await carregarAnotacoesSalvas(usuarioLogado.email, materia);
        });
    });
});

async function carregarAnotacoesSalvas(emailUsuario, materia) {
    const resultado = await DB.carregarAnotacoes(emailUsuario, materia);
    
    if (resultado.sucesso) {
        anotacoes[materia] = resultado.anotacoes;
        carregarAnotacoes(materia);
    }
}

function carregarAnotacoes(materia) {
    if (!containerAnotacoes) return;
    
    containerAnotacoes.innerHTML = '';
    
    if (anotacoes[materia] && anotacoes[materia].length > 0) {
        anotacoes[materia].forEach(anotacao => {
            const elementoAnotacao = document.createElement('div');
            elementoAnotacao.className = 'item-anotacao';
            elementoAnotacao.innerHTML = `
                <span class="excluir-anotacao">✕</span>
                <span>${anotacao}</span>
            `;
            containerAnotacoes.appendChild(elementoAnotacao);
        });
    }
    
    const botoesExcluir = document.querySelectorAll('.excluir-anotacao');
    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', function() {
            const textoAnotacao = this.parentElement.querySelector('span:last-child').textContent;
            const materia = elementoMateriaAtual.textContent;
            excluirAnotacao(materia, textoAnotacao);
            this.parentElement.remove();
        });
    });
}

async function adicionarNovaAnotacao() {
    const novaAnotacao = inputNovaAnotacao.value.trim();
    if (novaAnotacao) {
        const materia = elementoMateriaAtual.textContent;
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        
        if (!anotacoes[materia]) anotacoes[materia] = [];
        anotacoes[materia].push(novaAnotacao);
        
        const resultado = await DB.salvarAnotacoes(usuarioLogado.email, materia, anotacoes[materia]);
        
        if (resultado.sucesso) {
            const elementoAnotacao = document.createElement('div');
            elementoAnotacao.className = 'item-anotacao';
            elementoAnotacao.innerHTML = `
                <span class="excluir-anotacao">✕</span>
                <span>${novaAnotacao}</span>
            `;
            containerAnotacoes.appendChild(elementoAnotacao);
            
            elementoAnotacao.querySelector('.excluir-anotacao').addEventListener('click', function() {
                excluirAnotacao(materia, novaAnotacao);
                elementoAnotacao.remove();
            });
            
            inputNovaAnotacao.value = '';
        }
    }
}

async function excluirAnotacao(materia, textoAnotacao) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (anotacoes[materia]) {
        const indice = anotacoes[materia].indexOf(textoAnotacao);
        if (indice > -1) {
            anotacoes[materia].splice(indice, 1);
            await DB.salvarAnotacoes(usuarioLogado.email, materia, anotacoes[materia]);
        }
    }
}