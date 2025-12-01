// JavaScript específico da página Home - SALVA TUDO
document.addEventListener('DOMContentLoaded', async function() {
    // VERIFICA USUÁRIO LOGADO
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    
    // Carrega as tarefas salvas
    await carregarTarefasSalvas(usuarioLogado.email);
    adicionarBotoesNovaTarefa();
    
    // Configura drag & drop
    configurarArrastarSoltar();
});

// FUNÇÃO PARA CRIAR ITEM DE MATÉRIA COM LIXEIRA
function criarItemMateria(texto, diaSemana = null) {
    const item = document.createElement('div');
    item.className = 'item-materia';
    item.setAttribute('draggable', 'true');
    
    // Texto da matéria
    const spanTexto = document.createElement('span');
    spanTexto.className = 'texto-materia';
    spanTexto.textContent = texto;
    
    // Botão de excluir
    const botaoExcluir = document.createElement('button');
    botaoExcluir.className = 'botao-excluir';
    botaoExcluir.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    `;
    
    botaoExcluir.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede que o drag seja ativado
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            item.remove();
            salvarTarefasAutomaticamente();
        }
    });
    
    item.appendChild(spanTexto);
    item.appendChild(botaoExcluir);
    
    // Eventos de drag
    item.addEventListener('dragstart', () => {
        item.classList.add('arrastando');
    });
    
    item.addEventListener('dragend', () => {
        item.classList.remove('arrastando');
        salvarTarefasAutomaticamente();
    });
    
    // Evento de edição
    spanTexto.addEventListener('click', function() {
        this.contentEditable = true;
        this.focus();
    });
    
    spanTexto.addEventListener('blur', function() {
        this.contentEditable = false;
        salvarTarefasAutomaticamente();
    });
    
    spanTexto.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
    
    return item;
}

// CONFIGURA DRAG AND DROP
function configurarArrastarSoltar() {
    const itensArrastaveis = document.querySelectorAll('.item-materia');
    const colunasDias = document.querySelectorAll('.coluna-dia');
    
    itensArrastaveis.forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', () => {
            item.classList.add('arrastando');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('arrastando');
            salvarTarefasAutomaticamente();
        });
    });
    
    colunasDias.forEach(coluna => {
        coluna.addEventListener('dragover', e => {
            e.preventDefault();
            const elementoPosterior = obterElementoPosterior(coluna, e.clientY);
            const itemArrastando = document.querySelector('.arrastando');
            if (elementoPosterior == null) {
                coluna.appendChild(itemArrastando);
            } else {
                coluna.insertBefore(itemArrastando, elementoPosterior);
            }
        });
    });
}

function obterElementoPosterior(container, y) {
    const elementosArrastaveis = [...container.querySelectorAll('.item-materia:not(.arrastando)')];
    
    return elementosArrastaveis.reduce((maisProximo, filho) => {
        const caixa = filho.getBoundingClientRect();
        const offset = y - caixa.top - caixa.height / 2;
        if (offset < 0 && offset > maisProximo.offset) {
            return { offset: offset, element: filho };
        } else {
            return maisProximo;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ADICIONA BOTÕES NOVAS TAREFAS
function adicionarBotoesNovaTarefa() {
    document.querySelectorAll('.coluna-dia').forEach(coluna => {
        const botaoExistente = coluna.querySelector('.botao-nova-tarefa');
        if (botaoExistente) botaoExistente.remove();
        
        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = '+ Nova Tarefa';
        botaoAdicionar.className = 'botao-nova-tarefa';
        botaoAdicionar.style.cssText = `
            width: 100%; padding: 8px; margin: 10px 0px; 
            background: #28a745; color: white; border: none; 
            border-radius: 5px; cursor: pointer; font-size: 12px;
        `;
        
        botaoAdicionar.addEventListener('click', function() {
            const novaTarefa = criarItemMateria('Nova tarefa...');
            coluna.appendChild(novaTarefa);
            salvarTarefasAutomaticamente();
        });
        
        coluna.appendChild(botaoAdicionar);
    });
}

// CARREGA TAREFAS SALVAS
async function carregarTarefasSalvas(emailUsuario) {
    const resultado = await DB.carregarTarefas(emailUsuario);
    
    if (resultado.sucesso) {
        // LIMPA APENAS AS TAREFAS EXISTENTES (não remove os itens iniciais)
        document.querySelectorAll('.coluna-dia .item-materia').forEach(item => {
            if (!item.classList.contains('botao-nova-tarefa')) {
                item.remove();
            }
        });
        
        // PREENCHE COM TAREFAS SALVAS
        resultado.tarefas.forEach(tarefa => {
            // Encontrar a coluna correta
            const todasColunas = document.querySelectorAll('.coluna-dia');
            const coluna = Array.from(todasColunas).find(col => {
                const titulo = col.querySelector('h3').textContent.toLowerCase();
                return titulo.includes(tarefa.diaSemana.toLowerCase());
            });
            
            if (coluna) {
                const item = criarItemMateria(tarefa.descricao);
                
                // Insere antes do botão "Nova Tarefa"
                const botaoNovaTarefa = coluna.querySelector('.botao-nova-tarefa');
                if (botaoNovaTarefa) {
                    coluna.insertBefore(item, botaoNovaTarefa);
                } else {
                    coluna.appendChild(item);
                }
            }
        });
        
        console.log('✅ Tarefas carregadas:', resultado.tarefas.length);
    }
}

// SALVA TAREFAS AUTOMATICAMENTE
async function salvarTarefasAutomaticamente() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;
    
    const tarefas = [];
    
    // PEGA TODAS AS TAREFAS NA ORDEM ATUAL
    document.querySelectorAll('.coluna-dia').forEach(coluna => {
        const dia = coluna.querySelector('h3').textContent.toLowerCase();
        coluna.querySelectorAll('.item-materia').forEach(item => {
            if (!item.classList.contains('botao-nova-tarefa')) {
                const texto = item.querySelector('.texto-materia').textContent.trim();
                if (texto) {
                    tarefas.push({
                        diaSemana: dia,
                        descricao: texto
                    });
                }
            }
        });
    });
    
    const resultado = await DB.salvarTarefas(usuarioLogado.email, tarefas);
    if (resultado.sucesso) {
        console.log('💾 Tarefas salvas:', tarefas.length);
    }
}