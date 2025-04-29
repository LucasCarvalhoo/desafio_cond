// Configuração simulada do Supabase
const SUPABASE_URL = 'https://hwkzksxqxnbqjfeenvbp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3a3prc3hxeG5icWpmZWVudmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDY4NDQsImV4cCI6MjA2MTUyMjg0NH0.oFlDCK6Xy0KtC8ti_-xV1NZUGvT7IlzEaNxIDS9cbUk';

// Valores base
const RENT_VALUE = 1200.00;
const CONDOMINIUM_VALUE = 350.00;

// Dados simulados do usuário
const mockUserData = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    nome: "João Silva",
    email: "joao.silva@exemplo.com",
    endereco: "Av. Principal, 123 - Apto 302",
    pendencia_condominio: false,
    pendencia_aluguel: true,
    desconto: 50.00, // Valor fixo em reais
    data_registro: "2023-04-15T10:30:00Z"
};

// Elementos DOM
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Elementos do Dashboard
const welcomeName = document.getElementById('welcome-name');
const welcomeRent = document.getElementById('welcome-rent');
const condominiumStatus = document.getElementById('condominium-status');
const rentStatus = document.getElementById('rent-status');
const discountText = document.getElementById('discount-text');

// Função para alternar o tema
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    updateThemeIcon();
});

// Atualizar o ícone do tema
function updateThemeIcon() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Função para simular o login
loginButton.addEventListener('click', () => {
    // Simular carregamento
    loginButton.textContent = 'Carregando...';
    
    // Simular requisição à API
    setTimeout(() => {
        fetchUserData();
        toggleScreens();
        loginButton.textContent = 'Entrar';
    }, 1000);
});

// Função para simular o logout
logoutButton.addEventListener('click', () => {
    toggleScreens();
});

// Alternar entre telas
function toggleScreens() {
    loginScreen.classList.toggle('active');
    dashboardScreen.classList.toggle('active');
}

// Simular busca de dados do usuário via Supabase
function fetchUserData() {
    // Em um cenário real, faríamos uma requisição fetch para o Supabase
    // Exemplo simulado:
    /*
    fetch(`${SUPABASE_URL}/rest/v1/usuarios?email=eq.${email}`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            updateDashboard(data[0]);
        }
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
    */
    
    // Como é uma simulação, usaremos os dados mockados
    updateDashboard(mockUserData);
}

// Atualizar o dashboard com os dados do usuário
function updateDashboard(userData) {
    // Atualizar banner de boas-vindas
    welcomeName.textContent = `Bem-vindo(a), ${userData.nome.split(' ')[0]}!`;
    welcomeRent.textContent = `Aluguel: R$ ${RENT_VALUE.toFixed(2).replace('.', ',')}`;
    
    // Atualizar status de pagamentos
    updatePaymentStatus(condominiumStatus, userData.pendencia_condominio);
    updatePaymentStatus(rentStatus, userData.pendencia_aluguel);
    
    // Atualizar informações de desconto
    updateDiscountInfo(userData.desconto, userData.pendencia_aluguel);
}

// Atualizar o status de pagamento
function updatePaymentStatus(element, hasPendency) {
    const statusBadge = element.querySelector('.status-badge');
    
    if (hasPendency) {
        statusBadge.textContent = 'PENDENTE';
        statusBadge.className = 'status-badge pending';
    } else {
        statusBadge.textContent = 'PAGO';
        statusBadge.className = 'status-badge paid';
    }
}

// Atualizar informações de desconto
function updateDiscountInfo(discountValue, hasPendencyRent) {
    if (discountValue > 0) {
        const targetPayment = hasPendencyRent ? 'aluguel' : 'condomínio';
        discountText.textContent = `R$ ${discountValue.toFixed(2).replace('.', ',')} de desconto no ${targetPayment}`;
    } else {
        discountText.textContent = 'Nenhum desconto aplicado no momento.';
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há um usuário logado (em um cenário real)
    // Por enquanto, apenas garantimos que a tela de login está ativa
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    
    // Inicializar o tema escuro e o ícone
    document.documentElement.classList.add('dark');
    updateThemeIcon();
});