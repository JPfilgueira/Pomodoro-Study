// Database Service - Salva TUDO por usuário no localStorage
class DatabaseService {
    
    // REGISTRAR USUÁRIO
    static async registrarUsuario(email, senha, nome) {
        console.log('📝 Registrando usuário:', email);
        
        try {
            // Busca usuários existentes
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            
            // Verifica se email já existe
            const usuarioExistente = usuarios.find(u => u.email === email);
            if (usuarioExistente) {
                return { sucesso: false, erro: "Email já cadastrado" };
            }
            
            // Adiciona novo usuário
            usuarios.push({
                email: email,
                nome: nome,
                senha: senha,
                dataCadastro: new Date().toISOString()
            });
            
            // Salva usuários
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            // Cria estrutura vazia para o novo usuário
            this.criarEstruturaUsuario(email);
            
            console.log('✅ Usuário registrado!');
            return { 
                sucesso: true,
                usuario: {
                    email: email,
                    nome: nome
                }
            };
            
        } catch (error) {
            console.error('❌ Erro no registro:', error);
            return { sucesso: false, erro: error.message };
        }
    }

    // LOGIN
    static async fazerLogin(email, senha) {
        console.log('🔐 Login:', email);
        
        try {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);
            
            if (usuario) {
                console.log('✅ Login bem-sucedido!');
                return { 
                    sucesso: true, 
                    usuario: {
                        email: usuario.email,
                        nome: usuario.nome
                    }
                };
            } else {
                return { sucesso: false, erro: "Email ou senha incorretos" };
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            return { sucesso: false, erro: error.message };
        }
    }

    // SALVAR TAREFAS - salva POSIÇÕES e TEXTO
    static async salvarTarefas(emailUsuario, tarefas) {
        console.log('💾 Salvando tarefas para:', emailUsuario);
        
        try {
            const chave = `tarefas_${emailUsuario}`;
            localStorage.setItem(chave, JSON.stringify(tarefas));
            console.log('✅ Tarefas salvas! Total:', tarefas.length);
            return { sucesso: true };
        } catch (error) {
            return { sucesso: false, erro: error.message };
        }
    }

    // CARREGAR TAREFAS - carrega POSIÇÕES e TEXTO
    static async carregarTarefas(emailUsuario) {
        console.log('📂 Carregando tarefas para:', emailUsuario);
        
        try {
            const chave = `tarefas_${emailUsuario}`;
            const tarefas = JSON.parse(localStorage.getItem(chave) || '[]');
            console.log('✅ Tarefas carregadas:', tarefas.length);
            return { sucesso: true, tarefas: tarefas };
        } catch (error) {
            return { sucesso: false, tarefas: [], erro: error.message };
        }
    }

    // SALVAR ANOTAÇÕES
    static async salvarAnotacoes(emailUsuario, materia, anotacoes) {
        console.log('📝 Salvando anotações:', materia);
        
        try {
            const chave = `anotacoes_${emailUsuario}_${materia}`;
            localStorage.setItem(chave, JSON.stringify(anotacoes));
            return { sucesso: true };
        } catch (error) {
            return { sucesso: false, erro: error.message };
        }
    }

    // CARREGAR ANOTAÇÕES
    static async carregarAnotacoes(emailUsuario, materia = null) {
        console.log('📖 Carregando anotações:', materia);
        
        try {
            if (materia) {
                const chave = `anotacoes_${emailUsuario}_${materia}`;
                const anotacoes = JSON.parse(localStorage.getItem(chave) || '[]');
                return { sucesso: true, anotacoes: anotacoes };
            } else {
                // Carrega todas as anotações do usuário
                const todasAnotacoes = [];
                for (let key in localStorage) {
                    if (key.startsWith(`anotacoes_${emailUsuario}_`)) {
                        const materia = key.replace(`anotacoes_${emailUsuario}_`, '');
                        const anotacoes = JSON.parse(localStorage.getItem(key) || '[]');
                        anotacoes.forEach(texto => {
                            todasAnotacoes.push({ materia: materia, texto: texto });
                        });
                    }
                }
                return { sucesso: true, anotacoes: todasAnotacoes };
            }
        } catch (error) {
            return { sucesso: false, anotacoes: [], erro: error.message };
        }
    }

    // CRIA ESTRUTURA INICIAL PARA NOVO USUÁRIO
    static criarEstruturaUsuario(emailUsuario) {
        const tarefasIniciais = [
            { diaSemana: 'segunda', descricao: 'Matemática (2 ciclos)' },
            { diaSemana: 'terca', descricao: 'Português (3 ciclos)' },
            { diaSemana: 'quarta', descricao: 'História (2 ciclos)' },
            { diaSemana: 'quinta', descricao: 'Geografia (2 ciclos)' },
            { diaSemana: 'sexta', descricao: 'Biologia (3 ciclos)' },
            { diaSemana: 'sabado', descricao: 'Química (2 ciclos)' },
            { diaSemana: 'domingo', descricao: 'Física (2 ciclos)' }
        ];
        
        localStorage.setItem(`tarefas_${emailUsuario}`, JSON.stringify(tarefasIniciais));
        
        // Anotações iniciais
        const anotacoesMatematica = [
            'Estude geometria espacial com "Sandro Curió"',
            'Estude divisão de números com vírgula',
            'Estude Bhaskara com "Gis com Giz" em suas plataformas digitais'
        ];
        
        localStorage.setItem(`anotacoes_${emailUsuario}_Matemática`, JSON.stringify(anotacoesMatematica));
        localStorage.setItem(`anotacoes_${emailUsuario}_Português`, JSON.stringify([]));
        localStorage.setItem(`anotacoes_${emailUsuario}_História`, JSON.stringify([]));
        localStorage.setItem(`anotacoes_${emailUsuario}_Geografia`, JSON.stringify([]));
    }
}

window.DB = DatabaseService;
console.log('🚀 Database Service carregado!');