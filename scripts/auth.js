// Configuração do Supabase
const SUPABASE_URL = 'https://hwkzksxqxnbqjfeenvbp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3a3prc3hxeG5icWpmZWVudmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDY4NDQsImV4cCI6MjA2MTUyMjg0NH0.oFlDCK6Xy0KtC8ti_-xV1NZUGvT7IlzEaNxIDS9cbUk';

// Inicializar o cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos DOM
const loginForm = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');
const togglePasswordButton = document.getElementById('toggle-password');
const rememberMeCheckbox = document.getElementById('remember-me');

// Função para verificar se há um usuário na sessão
async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        // Se houver uma sessão ativa, redirecionar para o dashboard
        window.location.href = 'dashboard.html';
    }
}

// Função para fazer login diretamente no banco (sem auth do Supabase)
async function handleLogin(e) {
    if (e) e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validar entradas
    if (!email || !password) {
        showError('Por favor, preencha todos os campos');
        return;
    }
    
    // Atualizar estado do botão durante o login
    loginButton.textContent = 'Entrando...';
    loginButton.disabled = true;
    
    try {
        // Buscar usuário diretamente da tabela usuarios pelo email
        const { data: users, error: fetchError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();
        
        if (fetchError || !users) {
            console.error('Erro ao buscar usuário:', fetchError);
            showError('Email não encontrado. Verifique suas credenciais.');
            loginButton.textContent = 'Entrar';
            loginButton.disabled = false;
            return;
        }
        
        // Verificar se a senha corresponde
        // IMPORTANTE: Em um sistema real, as senhas devem ser hasheadas.
        // Esta é uma verificação simples para fins de demonstração.
        if (users.senha !== password) {
            showError('Senha incorreta. Tente novamente.');
            loginButton.textContent = 'Entrar';
            loginButton.disabled = false;
            return;
        }
        
        // Se as credenciais estiverem corretas, armazenar o ID do usuário na sessão
        sessionStorage.setItem('userId', users.id);
        
        // Se "lembrar de mim" estiver marcado, salvar o email
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else if (localStorage.getItem('rememberedEmail')) {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Redirecionar para o dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Erro ao processar login:', error);
        showError('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
        loginButton.textContent = 'Entrar';
        loginButton.disabled = false;
    }
}

// Função para exibir mensagens de erro
function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        loginError.classList.add('hidden');
    }, 5000);
}

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordButton.querySelector('.icon').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verificar sessão ao carregar a página
    if (sessionStorage.getItem('userId')) {
        window.location.href = 'dashboard.html';
    }
    
    // Adicionar evento ao botão de login
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
    
    // Adicionar evento para enviar formulário ao pressionar Enter
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Alternar visibilidade da senha
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', togglePasswordVisibility);
    }
    
    // Tentar preencher o email com dados salvos no localStorage
    if (localStorage.getItem('rememberedEmail') && emailInput) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
});