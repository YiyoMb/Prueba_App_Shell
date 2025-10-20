// ============================================
// APP.JS - Lógica de la Aplicación PWA
// ============================================

// Estado de la aplicación
let tasks = [];
let installPromptEvent;

// Elementos del DOM
const elements = {
    taskInput: document.getElementById('taskInput'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    tasksList: document.getElementById('tasksList'),
    completedList: document.getElementById('completedList'),
    emptyState: document.getElementById('emptyState'),
    emptyCompleted: document.getElementById('emptyCompleted'),
    connectionStatus: document.getElementById('connectionStatus'),
    navLinks: document.querySelectorAll('.app-nav a'),
    views: document.querySelectorAll('.view'),
    installPrompt: document.getElementById('installPrompt'),
    installBtn: document.getElementById('installBtn')
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicación iniciada');

    // Cargar tareas desde localStorage
    loadTasks();

    // Renderizar tareas
    renderTasks();

    // Configurar event listeners
    setupEventListeners();

    // Monitorear conexión
    monitorConnection();

    // Configurar instalación de PWA
    setupInstallPrompt();
});

// ============================================
// GESTIÓN DE TAREAS (Contenido Dinámico)
// ============================================

// Cargar tareas desde localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('pwa-tasks');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        console.log(`📦 Cargadas ${tasks.length} tareas desde localStorage`);
    } else {
        // Tareas de ejemplo si no hay datos guardados
        tasks = [
            { id: 1, text: 'Completar práctica de PWA', completed: false },
            { id: 2, text: 'Estudiar Service Workers', completed: false },
            { id: 3, text: 'Probar modo offline', completed: false }
        ];
        saveTasks();
        console.log('📝 Tareas de ejemplo creadas');
    }
}

// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('pwa-tasks', JSON.stringify(tasks));
    console.log('💾 Tareas guardadas');
}

// Agregar nueva tarea
function addTask() {
    const taskText = elements.taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor escribe una tarea');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Limpiar input
    elements.taskInput.value = '';
    elements.taskInput.focus();

    console.log('✅ Tarea agregada:', taskText);
}

// Alternar estado de tarea (completada/pendiente)
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        console.log(`🔄 Tarea ${task.completed ? 'completada' : 'reactivada'}:`, task.text);
    }
}

// Eliminar tarea
function deleteTask(id) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        console.log('🗑️ Tarea eliminada');
    }
}

// Renderizar tareas en el DOM
function renderTasks() {
    // Filtrar tareas pendientes y completadas
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    // Renderizar tareas pendientes
    elements.tasksList.innerHTML = '';
    if (pendingTasks.length === 0) {
        elements.emptyState.style.display = 'block';
    } else {
        elements.emptyState.style.display = 'none';
        pendingTasks.forEach(task => {
            elements.tasksList.appendChild(createTaskElement(task));
        });
    }

    // Renderizar tareas completadas
    elements.completedList.innerHTML = '';
    if (completedTasks.length === 0) {
        elements.emptyCompleted.style.display = 'block';
    } else {
        elements.emptyCompleted.style.display = 'none';
        completedTasks.forEach(task => {
            elements.completedList.appendChild(createTaskElement(task));
        });
    }
}

// Crear elemento HTML de tarea
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="toggleTask(${task.id})"
        >
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="task-delete" onclick="deleteTask(${task.id})">
            Eliminar
        </button>
    `;

    return li;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// NAVEGACIÓN ENTRE VISTAS
// ============================================
function setupEventListeners() {
    // Agregar tarea con botón
    elements.addTaskBtn.addEventListener('click', addTask);

    // Agregar tarea con Enter
    elements.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Navegación entre vistas
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToView(page);

            // Actualizar link activo
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function navigateToView(viewName) {
    elements.views.forEach(view => {
        view.classList.remove('active');
    });

    const viewMap = {
        'tasks': 'tasksView',
        'completed': 'completedView',
        'about': 'aboutView'
    };

    const targetView = document.getElementById(viewMap[viewName]);
    if (targetView) {
        targetView.classList.add('active');
        console.log(`📄 Vista cambiada a: ${viewName}`);
    }
}

// ============================================
// MONITOREO DE CONEXIÓN
// ============================================
function monitorConnection() {
    updateConnectionStatus();

    window.addEventListener('online', () => {
        updateConnectionStatus();
        console.log('🌐 Conexión restaurada');
    });

    window.addEventListener('offline', () => {
        updateConnectionStatus();
        console.log('📴 Sin conexión - Modo offline');
    });
}

function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    const indicator = elements.connectionStatus.querySelector('.status-indicator');
    const statusText = elements.connectionStatus.querySelector('.status-text');

    if (isOnline) {
        indicator.classList.remove('offline');
        statusText.textContent = 'En línea';
    } else {
        indicator.classList.add('offline');
        statusText.textContent = 'Sin conexión';
    }
}

// ============================================
// INSTALACIÓN DE PWA
// ============================================
function setupInstallPrompt() {
    // Capturar el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💾 PWA instalable detectada');
        e.preventDefault();
        installPromptEvent = e;

        // Mostrar el botón de instalación
        elements.installPrompt.style.display = 'block';
    });

    // Manejar clic en el botón de instalación
    elements.installBtn.addEventListener('click', async () => {
        if (!installPromptEvent) {
            return;
        }

        // Mostrar el prompt de instalación
        installPromptEvent.prompt();

        // Esperar la respuesta del usuario
        const result = await installPromptEvent.userChoice;

        if (result.outcome === 'accepted') {
            console.log('✅ Usuario aceptó instalar la PWA');
        } else {
            console.log('❌ Usuario rechazó instalar la PWA');
        }

        // Limpiar el prompt
        installPromptEvent = null;
        elements.installPrompt.style.display = 'none';
    });

    // Detectar cuando la PWA fue instalada
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA instalada exitosamente');
        elements.installPrompt.style.display = 'none';
    });
}

// ============================================
// EXPONER FUNCIONES GLOBALMENTE
// (necesario para los onclick en el HTML)
// ============================================
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;