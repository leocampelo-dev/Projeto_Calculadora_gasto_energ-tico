// ===============================
// VARIÁVEIS DE ESTADO
// ===============================
let selectedSex = null;
let selectedActivity = null;

// ===============================
// SELEÇÃO DE SEXO
// ===============================
const sexButtons = document.querySelectorAll(".option-btn");
sexButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove ativo de todos com animação suave
    sexButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.style.transform = "scale(1)";
    });
    
    // Ativa o clicado com animação
    button.classList.add("active");
    button.style.transform = "scale(1.02)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
    
    selectedSex = button.dataset.option;
    clearError();
  });
});

// ===============================
// SELEÇÃO DE ATIVIDADE
// ===============================
const activityButtons = document.querySelectorAll(".activity-btn");
activityButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove ativo de todos com animação suave
    activityButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.style.transform = "scale(1)";
    });
    
    // Ativa o clicado com animação
    button.classList.add("active");
    button.style.transform = "scale(1.01)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
    
    selectedActivity = button.dataset.activity;
    clearError();
  });
});

// ===============================
// VALIDAÇÃO DOS INPUTS
// ===============================
const inputs = document.querySelectorAll('input[type="number"]');

inputs.forEach(input => {
  // Remove borda vermelha ao digitar
  input.addEventListener('input', () => {
    input.classList.remove('error');
    clearError();
  });

  // Validação em tempo real
  input.addEventListener('blur', () => {
    validateInput(input);
  });
});

function validateInput(input) {
  const value = Number(input.value);
  const id = input.id;
  
  // Remove erro anterior
  input.classList.remove('error');
  
  // Validações específicas
  if (!value || value <= 0) {
    input.classList.add('error');
    return false;
  }
  
  if (id === 'weight' && (value < 20 || value > 200)) {
    input.classList.add('error');
    showError('⚠️ Peso deve estar entre 20 e 200 kg');
    return false;
  }
  
  if (id === 'height' && (value < 50 || value > 250)) {
    input.classList.add('error');
    showError('⚠️ Altura deve estar entre 50 e 250 cm');
    return false;
  }
  
  if (id === 'age' && (value < 10 || value > 90)) {
    input.classList.add('error');
    showError('⚠️ Idade deve estar entre 10 e 90 anos');
    return false;
  }
  
  return true;
}

// ===============================
// FUNÇÕES DE ERRO
// ===============================
const resultCard = document.querySelector('.result-card');
const resultText = document.getElementById("result-text");

function showError(message) {
  resultCard.classList.remove('has-result');
  resultCard.classList.add('error-state');
  resultText.innerHTML = message;
  
  // Animação de shake
  resultCard.style.animation = 'shake 0.4s';
  setTimeout(() => {
    resultCard.style.animation = '';
  }, 400);
}

function clearError() {
  resultCard.classList.remove('error-state');
}

// ===============================
// SUBMIT DO FORM
// ===============================
const form = document.querySelector("form");

form.addEventListener("submit", event => {
  event.preventDefault();
  
  // Captura dos inputs
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value);
  const age = Number(document.getElementById("age").value);
  
  // Array de validações
  const validations = [
    { condition: !selectedSex, message: "⚠️ Selecione seu sexo" },
    { condition: !weight, message: "⚠️ Informe seu peso" },
    { condition: !age, message: "⚠️ Informe sua idade" },
    { condition: !height, message: "⚠️ Informe sua altura" },
    { condition: !selectedActivity, message: "⚠️ Selecione seu nível de atividade física" },
  ];
  
  // Verifica cada validação
  for (let validation of validations) {
    if (validation.condition) {
      showError(validation.message);
      return;
    }
  }
  
  // Validação de ranges
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const ageInput = document.getElementById("age");
  
  if (!validateInput(weightInput) || !validateInput(heightInput) || !validateInput(ageInput)) {
    return;
  }

  // ===============================
  // HARRIS-BENEDICT (BMR)
  // ===============================
  let bmr;
  if (selectedSex === "masculino") {
    bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
  } else {
    bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
  }
  
  // ===============================
  // FATOR DE ATIVIDADE
  // ===============================
  const activityFactor = {
    sedentario: 1.15,
    leve: 1.25,
    moderado: 1.4,
    muito: 1.6,
    extremo: 1.8
  };
  
  const totalCalories = bmr * activityFactor[selectedActivity];

  // ===============================
  // EXIBIÇÃO DO RESULTADO (ANIMADA)
  // ===============================
  resultCard.classList.remove('error-state');
  resultCard.classList.add('has-result');
  
  // Animação de loading
  resultText.innerHTML = '⏳ Calculando...';
  
  setTimeout(() => {
    resultText.innerHTML = `
      <span 
      style="color: #000000; 
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;"> 
      Essa é a quantidade média de calorias <br> que seu corpo gasta por dia:</span>
      <br>
      <strong style="color: var(--main-color); font-size: 28px;">${totalCalories.toFixed(0)} kcal🔥</strong>
    `;
    
    // Animação de fade in
    resultCard.style.animation = 'fadeIn 0.7s ease-out';
  }, 800);
});
