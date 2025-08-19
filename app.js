// AI ChatBot Pro - Main Application Logic

class ChatBotApp {
    constructor() {
        this.currentUser = null;
        this.currentConversation = null;
        this.conversations = [];
        this.isTyping = false;
        this.settings = {
            botPersonality: 'professional',
            responseLength: 'medium',
            enableNotifications: true,
            enableSounds: true
        };
        
        // Sample data
        this.sampleUsers = [
            { id: "1", email: "demo@chatbot.com", name: "Demo User", role: "user", password: "demo123" },
            { id: "2", email: "admin@chatbot.com", name: "Admin User", role: "admin", password: "admin123" }
        ];
        
        this.sampleConversations = [
            {
                id: "conv-1",
                title: "Getting Started with AI",
                userId: "1",
                createdAt: new Date(Date.now() - 86400000),
                messages: [
                    { id: "msg-1", role: "user", content: "Hello, can you help me understand AI?", timestamp: new Date(Date.now() - 86400000) },
                    { id: "msg-2", role: "assistant", content: "Hello! I'd be happy to help you understand AI. Artificial Intelligence refers to computer systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, and problem-solving. What specific aspect of AI would you like to explore?", timestamp: new Date(Date.now() - 86400000 + 5000) }
                ]
            },
            {
                id: "conv-2",
                title: "Web Development Tips",
                userId: "1",
                createdAt: new Date(Date.now() - 172800000),
                messages: [
                    { id: "msg-3", role: "user", content: "What are the best practices for React development?", timestamp: new Date(Date.now() - 172800000) },
                    { id: "msg-4", role: "assistant", content: "Here are some key React best practices:\n\n1. Use functional components with hooks\n2. Keep components small and focused\n3. Use proper state management\n4. Implement error boundaries\n5. Optimize performance with React.memo\n6. Follow consistent naming conventions\n\nWould you like me to elaborate on any of these points?", timestamp: new Date(Date.now() - 172800000 + 8000) }
                ]
            }
        ];
        
        this.analytics = {
            totalConversations: 156,
            totalMessages: 1243,
            averageResponseTime: "2.3s",
            userSatisfaction: 4.7,
            monthlyGrowth: 23.5
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing ChatBot App...');
        this.loadStoredData();
        this.setupEventListeners();
        this.checkAuthentication();
    }
    
    loadStoredData() {
        // Load conversations
        try {
            const storedConversations = localStorage.getItem('chatbot_conversations');
            if (storedConversations) {
                this.conversations = JSON.parse(storedConversations).map(conv => ({
                    ...conv,
                    createdAt: new Date(conv.createdAt),
                    messages: conv.messages.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
            } else {
                this.conversations = [...this.sampleConversations];
                this.saveConversations();
            }
        } catch (e) {
            console.warn('Could not load conversations:', e);
            this.conversations = [...this.sampleConversations];
        }
        
        // Load settings
        try {
            const storedSettings = localStorage.getItem('chatbot_settings');
            if (storedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }
    
    saveConversations() {
        try {
            localStorage.setItem('chatbot_conversations', JSON.stringify(this.conversations));
        } catch (e) {
            console.warn('Could not save conversations:', e);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('chatbot_settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        // Auth form events
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuth();
            });
        }
        
        const authSwitch = document.getElementById('authSwitch');
        if (authSwitch) {
            authSwitch.addEventListener('click', () => this.toggleAuthMode());
        }
        
        // Demo buttons
        const demoBtns = document.querySelectorAll('.demo-btn');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = e.target.dataset.email;
                const password = e.target.dataset.password;
                this.loginWithDemo(email, password);
            });
        });
        
        // Navigation events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Header actions
        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.startNewChat());
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Chat events
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        const sendMessage = document.getElementById('sendMessage');
        if (sendMessage) {
            sendMessage.addEventListener('click', () => this.sendMessage());
        }
        
        // Export and delete chat
        const exportChatBtn = document.getElementById('exportChatBtn');
        if (exportChatBtn) {
            exportChatBtn.addEventListener('click', () => this.exportCurrentChat());
        }
        
        const deleteChatBtn = document.getElementById('deleteChatBtn');
        if (deleteChatBtn) {
            deleteChatBtn.addEventListener('click', () => this.deleteCurrentChat());
        }
        
        // Settings events
        const saveSettings = document.getElementById('saveSettings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveUserSettings());
        }
        
        const resetSettings = document.getElementById('resetSettings');
        if (resetSettings) {
            resetSettings.addEventListener('click', () => this.resetUserSettings());
        }
        
        // Quick actions
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleQuickAction(e));
        });
        
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        console.log('Event listeners setup complete');
    }
    
    checkAuthentication() {
        console.log('Checking authentication...');
        try {
            const storedUser = localStorage.getItem('chatbot_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
                console.log('User found in storage:', this.currentUser);
                this.showApp();
            } else {
                console.log('No user found, showing auth');
                this.showAuth();
            }
        } catch (e) {
            console.warn('Error checking authentication:', e);
            this.showAuth();
        }
    }
    
    showAuth() {
        console.log('Showing authentication modal');
        const authModal = document.getElementById('authModal');
        const app = document.getElementById('app');
        
        if (authModal) {
            authModal.classList.remove('hidden');
            authModal.style.display = 'flex';
        }
        if (app) {
            app.classList.add('hidden');
            app.style.display = 'none';
        }
    }
    
    showApp() {
        console.log('Showing main application');
        const authModal = document.getElementById('authModal');
        const app = document.getElementById('app');
        
        if (authModal) {
            authModal.classList.add('hidden');
            authModal.style.display = 'none';
        }
        if (app) {
            app.classList.remove('hidden');
            app.style.display = 'flex';
        }
        
        this.updateUserProfile();
        this.loadDashboard();
        this.showAdminFeatures();
    }
    
    toggleAuthMode() {
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');
        const nameGroup = document.getElementById('nameGroup');
        const submitBtn = document.getElementById('authSubmit');
        const switchText = document.getElementById('authSwitchText');
        const switchBtn = document.getElementById('authSwitch');
        
        const isSignIn = submitBtn && submitBtn.textContent.includes('Sign In');
        
        if (isSignIn) {
            // Switch to Sign Up mode
            if (title) title.textContent = 'Create Account';
            if (subtitle) subtitle.textContent = 'Sign up for AI ChatBot Pro';
            if (nameGroup) nameGroup.style.display = 'block';
            if (submitBtn) submitBtn.textContent = 'Sign Up';
            if (switchText) switchText.textContent = 'Already have an account?';
            if (switchBtn) switchBtn.textContent = 'Sign in';
        } else {
            // Switch to Sign In mode
            if (title) title.textContent = 'Welcome to AI ChatBot Pro';
            if (subtitle) subtitle.textContent = 'Sign in to your account';
            if (nameGroup) nameGroup.style.display = 'none';
            if (submitBtn) submitBtn.textContent = 'Sign In';
            if (switchText) switchText.textContent = "Don't have an account?";
            if (switchBtn) switchBtn.textContent = 'Sign up';
        }
    }
    
    loginWithDemo(email, password) {
        console.log('Demo login attempted:', email);
        this.showLoading(true);
        
        // Simulate a brief delay
        setTimeout(() => {
            const user = this.sampleUsers.find(u => u.email === email && u.password === password);
            if (user) {
                this.currentUser = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };
                
                localStorage.setItem('chatbot_user', JSON.stringify(this.currentUser));
                this.showToast('Welcome! Logged in successfully', 'success');
                console.log('Demo login successful:', this.currentUser);
                this.showApp();
            } else {
                this.showToast('Demo login failed', 'error');
                console.error('Demo user not found');
            }
            this.showLoading(false);
        }, 500);
    }
    
    handleAuth() {
        console.log('Handling authentication form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const nameInput = document.getElementById('name');
        const submitBtn = document.getElementById('authSubmit');
        
        if (!emailInput || !passwordInput || !submitBtn) {
            console.error('Required form elements not found');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput ? nameInput.value.trim() : '';
        const isSignUp = submitBtn.textContent.includes('Sign Up');
        
        if (!email || !password) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        this.showLoading(true);
        
        setTimeout(() => {
            try {
                if (isSignUp) {
                    // Create new user
                    const newUser = {
                        id: Date.now().toString(),
                        email,
                        name: name || email.split('@')[0],
                        role: 'user'
                    };
                    this.currentUser = newUser;
                    localStorage.setItem('chatbot_user', JSON.stringify(this.currentUser));
                    this.showToast('Account created successfully!', 'success');
                    console.log('Sign up successful:', this.currentUser);
                } else {
                    // Login existing user
                    const user = this.sampleUsers.find(u => u.email === email && u.password === password);
                    if (user) {
                        this.currentUser = {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        };
                        localStorage.setItem('chatbot_user', JSON.stringify(this.currentUser));
                        this.showToast('Welcome back!', 'success');
                        console.log('Login successful:', this.currentUser);
                    } else {
                        throw new Error('Invalid email or password');
                    }
                }
                
                this.showApp();
                
            } catch (error) {
                console.error('Authentication error:', error);
                this.showToast(error.message || 'Authentication failed', 'error');
            } finally {
                this.showLoading(false);
            }
        }, 800);
    }
    
    logout() {
        console.log('Logging out user');
        localStorage.removeItem('chatbot_user');
        this.currentUser = null;
        this.currentConversation = null;
        this.showAuth();
        this.showToast('Logged out successfully', 'info');
    }
    
    updateUserProfile() {
        if (!this.currentUser) return;
        
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userInitials = document.getElementById('userInitials');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (userInitials) userInitials.textContent = this.getInitials(this.currentUser.name);
    }
    
    showAdminFeatures() {
        const adminItems = document.querySelectorAll('.admin-only');
        const isAdmin = this.currentUser && this.currentUser.role === 'admin';
        adminItems.forEach(item => {
            item.style.display = isAdmin ? 'block' : 'none';
        });
    }
    
    getInitials(name) {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        if (!page) return;
        
        console.log('Navigating to page:', page);
        this.showPage(page);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update page title
        const navText = e.currentTarget.querySelector('.nav-text');
        const pageTitle = document.getElementById('pageTitle');
        if (navText && pageTitle) {
            pageTitle.textContent = navText.textContent;
        }
    }
    
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        
        // Show selected page
        const targetPage = document.getElementById(`${pageId}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            
            // Load page-specific content
            setTimeout(() => {
                switch (pageId) {
                    case 'dashboard':
                        this.loadDashboard();
                        break;
                    case 'chat':
                        this.loadChatPage();
                        break;
                    case 'conversations':
                        this.loadConversationsPage();
                        break;
                    case 'analytics':
                        this.loadAnalyticsPage();
                        break;
                    case 'settings':
                        this.loadSettingsPage();
                        break;
                    case 'admin':
                        this.loadAdminPage();
                        break;
                }
            }, 50);
        }
    }
    
    loadDashboard() {
        console.log('Loading dashboard');
        
        // Update stats
        const elements = {
            totalConversations: document.getElementById('totalConversations'),
            totalMessages: document.getElementById('totalMessages'),
            avgResponseTime: document.getElementById('avgResponseTime'),
            userSatisfaction: document.getElementById('userSatisfaction')
        };
        
        if (elements.totalConversations) elements.totalConversations.textContent = this.analytics.totalConversations.toLocaleString();
        if (elements.totalMessages) elements.totalMessages.textContent = this.analytics.totalMessages.toLocaleString();
        if (elements.avgResponseTime) elements.avgResponseTime.textContent = this.analytics.averageResponseTime;
        if (elements.userSatisfaction) elements.userSatisfaction.textContent = `${this.analytics.userSatisfaction}/5`;
        
        // Load recent conversations
        this.loadRecentConversations();
    }
    
    loadRecentConversations() {
        const container = document.getElementById('recentConversationsList');
        if (!container || !this.currentUser) return;
        
        const userConversations = this.conversations
            .filter(conv => conv.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        if (userConversations.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 20px;">No conversations yet. Start a new chat!</p>';
            return;
        }
        
        container.innerHTML = userConversations.map(conv => `
            <div class="conversation-item" data-conversation-id="${conv.id}" style="cursor: pointer;">
                <div class="conversation-title">${conv.title}</div>
                <div class="conversation-preview">${this.getLastMessage(conv)}</div>
                <div class="conversation-meta">
                    <span>${conv.messages.length} messages</span>
                    <span>${this.formatRelativeTime(conv.createdAt)}</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const convId = item.dataset.conversationId;
                this.openConversation(convId);
            });
        });
    }
    
    getLastMessage(conversation) {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
            return 'No messages';
        }
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const content = lastMessage.content || '';
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    }
    
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    handleQuickAction(e) {
        const action = e.currentTarget.dataset.action;
        console.log('Quick action:', action);
        
        switch (action) {
            case 'new-chat':
                this.startNewChat();
                break;
            case 'view-analytics':
                this.showPage('analytics');
                this.updateNavigation('analytics', 'Analytics');
                break;
            case 'settings':
                this.showPage('settings');
                this.updateNavigation('settings', 'Settings');
                break;
            case 'export-data':
                this.exportAllData();
                break;
        }
    }
    
    updateNavigation(page, title) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const navItem = document.querySelector(`[data-page="${page}"]`);
        if (navItem) navItem.classList.add('active');
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = title;
    }
    
    startNewChat() {
        console.log('Starting new chat');
        this.currentConversation = null;
        
        this.showPage('chat');
        this.updateNavigation('chat', 'Chat');
        this.loadChatPage();
    }
    
    openConversation(conversationId) {
        console.log('Opening conversation:', conversationId);
        this.currentConversation = this.conversations.find(conv => conv.id === conversationId);
        if (this.currentConversation) {
            this.showPage('chat');
            this.updateNavigation('chat', 'Chat');
            this.loadChatPage();
        }
    }
    
    loadChatPage() {
        console.log('Loading chat page');
        const chatTitle = document.getElementById('chatTitle');
        
        if (this.currentConversation) {
            if (chatTitle) chatTitle.textContent = this.currentConversation.title;
            this.renderMessages();
        } else {
            if (chatTitle) chatTitle.textContent = 'New Conversation';
            this.renderWelcomeMessage();
        }
        
        // Focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            setTimeout(() => messageInput.focus(), 100);
        }
    }
    
    renderWelcomeMessage() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🤖</div>
                <h3>Hello! I'm your AI assistant.</h3>
                <p>How can I help you today?</p>
            </div>
        `;
    }
    
    renderMessages() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;
        
        if (!this.currentConversation || this.currentConversation.messages.length === 0) {
            this.renderWelcomeMessage();
            return;
        }
        
        container.innerHTML = this.currentConversation.messages.map(message => `
            <div class="message ${message.role}">
                <div class="message-bubble">
                    <div class="message-content">${this.formatMessageContent(message.content)}</div>
                    <div class="message-timestamp">${this.formatTime(message.timestamp)}</div>
                </div>
            </div>
        `).join('');
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    formatMessageContent(content) {
        return content.replace(/\n/g, '<br>');
    }
    
    formatTime(timestamp) {
        try {
            return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Now';
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const content = input.value.trim();
        if (!content) return;
        
        console.log('Sending message:', content);
        
        // Create conversation if it doesn't exist
        if (!this.currentConversation) {
            this.currentConversation = {
                id: `conv-${Date.now()}`,
                title: content.length > 50 ? content.substring(0, 50) + '...' : content,
                userId: this.currentUser.id,
                createdAt: new Date(),
                messages: []
            };
        }
        
        // Add user message
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date()
        };
        
        this.currentConversation.messages.push(userMessage);
        input.value = '';
        this.renderMessages();
        
        // Show typing indicator
        this.showTypingIndicator(true);
        
        try {
            // Generate AI response
            const aiResponse = await this.generateAIResponse(content);
            
            // Hide typing indicator
            this.showTypingIndicator(false);
            
            // Add AI message
            const aiMessage = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };
            
            this.currentConversation.messages.push(aiMessage);
            this.renderMessages();
            
            // Update chat title
            const chatTitle = document.getElementById('chatTitle');
            if (chatTitle) chatTitle.textContent = this.currentConversation.title;
            
            // Save conversation
            this.saveConversation();
            
            console.log('Message exchange complete');
        } catch (error) {
            console.error('Error sending message:', error);
            this.showTypingIndicator(false);
            this.showToast('Error generating response', 'error');
        }
    }
    
    showTypingIndicator(show) {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            if (show) {
                indicator.classList.remove('hidden');
                indicator.style.display = 'flex';
            } else {
                indicator.classList.add('hidden');
                indicator.style.display = 'none';
            }
        }
    }
    
    async generateAIResponse(userMessage) {
        // Simulate API delay
        await this.delay(1200 + Math.random() * 1800);
        
        const responses = this.getContextualResponses(userMessage);
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getContextualResponses(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return [
                "Hello! I'm here to help you with any questions you might have. What would you like to know?",
                "Hi there! It's great to meet you. How can I assist you today?",
                "Hey! Welcome to our conversation. What's on your mind?"
            ];
        }
        
        if (lowerMessage.includes('react') || lowerMessage.includes('javascript') || lowerMessage.includes('web development')) {
            return [
                "React is a powerful JavaScript library for building user interfaces. Here are some key concepts:\n\n• Components: Reusable UI building blocks\n• State: Data that changes over time\n• Props: Data passed between components\n• Hooks: Functions that let you use state and other React features\n\nWhat specific aspect of React would you like to explore?",
                "Web development with React involves creating dynamic, interactive applications. Some best practices include:\n\n1. Keep components small and focused\n2. Use functional components with hooks\n3. Implement proper state management\n4. Follow naming conventions\n5. Write tests for your components\n\nWould you like me to elaborate on any of these points?"
            ];
        }
        
        if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning')) {
            return [
                "Artificial Intelligence is a fascinating field that encompasses:\n\n• Machine Learning: Algorithms that learn from data\n• Natural Language Processing: Understanding human language\n• Computer Vision: Interpreting visual information\n• Robotics: Intelligent physical systems\n• Expert Systems: Knowledge-based decision making\n\nWhich area interests you most?",
                "AI has revolutionized many industries through automation, pattern recognition, predictive analytics, and personalized experiences. Would you like to explore any specific applications?"
            ];
        }
        
        // Default responses
        return [
            "That's an interesting topic! Could you provide more details about what you'd like to know?",
            "I'd be happy to help you with that. Can you give me more context about your specific question?",
            "Thank you for your question! Let me provide you with some helpful information about that topic.",
            "That's a great point to explore. Here's what I can tell you about that subject."
        ];
    }
    
    saveConversation() {
        if (!this.currentConversation) return;
        
        const existingIndex = this.conversations.findIndex(conv => conv.id === this.currentConversation.id);
        if (existingIndex >= 0) {
            this.conversations[existingIndex] = this.currentConversation;
        } else {
            this.conversations.push(this.currentConversation);
        }
        this.saveConversations();
    }
    
    loadConversationsPage() {
        console.log('Loading conversations page');
        this.renderConversationsGrid();
    }
    
    renderConversationsGrid() {
        const grid = document.getElementById('conversationsGrid');
        if (!grid || !this.currentUser) return;
        
        const userConversations = this.conversations.filter(conv => conv.userId === this.currentUser.id);
        
        if (userConversations.length === 0) {
            grid.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 40px;">No conversations yet. Start a new chat to get going!</p>';
            return;
        }
        
        grid.innerHTML = userConversations.map(conv => `
            <div class="conversation-item" data-conversation-id="${conv.id}" style="cursor: pointer;">
                <div class="conversation-title">${conv.title}</div>
                <div class="conversation-preview">${this.getLastMessage(conv)}</div>
                <div class="conversation-meta">
                    <span>${conv.messages.length} messages</span>
                    <span>${this.formatRelativeTime(conv.createdAt)}</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        grid.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const convId = item.dataset.conversationId;
                this.openConversation(convId);
            });
        });
    }
    
    loadAnalyticsPage() {
        console.log('Loading analytics page');
        setTimeout(() => {
            this.createConversationChart();
            this.createResponseTimeChart();
        }, 100);
    }
    
    createConversationChart() {
        const canvas = document.getElementById('conversationChart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear any existing chart
        Chart.getChart(canvas)?.destroy();
        
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 20) + 5);
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Conversations',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    createResponseTimeChart() {
        const canvas = document.getElementById('responseTimeChart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        
        // Clear any existing chart
        Chart.getChart(canvas)?.destroy();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['< 1s', '1-2s', '2-3s', '> 3s'],
                datasets: [{
                    data: [25, 45, 20, 10],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    loadSettingsPage() {
        console.log('Loading settings page');
        const elements = {
            botPersonality: document.getElementById('botPersonality'),
            responseLength: document.getElementById('responseLength'),
            enableNotifications: document.getElementById('enableNotifications'),
            enableSounds: document.getElementById('enableSounds')
        };
        
        if (elements.botPersonality) elements.botPersonality.value = this.settings.botPersonality;
        if (elements.responseLength) elements.responseLength.value = this.settings.responseLength;
        if (elements.enableNotifications) elements.enableNotifications.checked = this.settings.enableNotifications;
        if (elements.enableSounds) elements.enableSounds.checked = this.settings.enableSounds;
    }
    
    saveUserSettings() {
        const elements = {
            botPersonality: document.getElementById('botPersonality'),
            responseLength: document.getElementById('responseLength'),
            enableNotifications: document.getElementById('enableNotifications'),
            enableSounds: document.getElementById('enableSounds')
        };
        
        this.settings = {
            botPersonality: elements.botPersonality ? elements.botPersonality.value : 'professional',
            responseLength: elements.responseLength ? elements.responseLength.value : 'medium',
            enableNotifications: elements.enableNotifications ? elements.enableNotifications.checked : true,
            enableSounds: elements.enableSounds ? elements.enableSounds.checked : true
        };
        
        this.saveSettings();
        this.showToast('Settings saved successfully!', 'success');
    }
    
    resetUserSettings() {
        this.settings = {
            botPersonality: 'professional',
            responseLength: 'medium',
            enableNotifications: true,
            enableSounds: true
        };
        
        this.loadSettingsPage();
        this.saveSettings();
        this.showToast('Settings reset to default', 'info');
    }
    
    loadAdminPage() {
        console.log('Loading admin page');
        // Admin page content is already static
    }
    
    exportCurrentChat() {
        if (!this.currentConversation) {
            this.showToast('No conversation to export', 'error');
            return;
        }
        
        const chatData = {
            title: this.currentConversation.title,
            createdAt: this.currentConversation.createdAt,
            messages: this.currentConversation.messages
        };
        
        this.downloadJSON(chatData, `${this.currentConversation.title.replace(/[^a-z0-9]/gi, '_')}.json`);
        this.showToast('Chat exported successfully!', 'success');
    }
    
    exportAllData() {
        if (!this.currentUser) return;
        
        const exportData = {
            user: this.currentUser,
            conversations: this.conversations.filter(conv => conv.userId === this.currentUser.id),
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        this.downloadJSON(exportData, `chatbot_data_${new Date().toISOString().split('T')[0]}.json`);
        this.showToast('Data exported successfully!', 'success');
    }
    
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    deleteCurrentChat() {
        if (!this.currentConversation) {
            this.showToast('No conversation to delete', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this conversation?')) {
            this.conversations = this.conversations.filter(conv => conv.id !== this.currentConversation.id);
            this.saveConversations();
            this.currentConversation = null;
            this.showToast('Conversation deleted', 'success');
            this.startNewChat();
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.remove('hidden');
                overlay.style.display = 'flex';
            } else {
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new ChatBotApp();
    });
} else {
    app = new ChatBotApp();
}