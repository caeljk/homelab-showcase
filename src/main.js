// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Title Typing Effect ---
    const dynamicTextElement = document.getElementById('dynamic-title-text');
    const words = ["My Homelab", "My Playground", "My Digital Forge", "My Creation"];
    let wordIndex = 0; let charIndex = 0; let isDeleting = false;
    function typeEffect() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        dynamicTextElement.textContent = currentChar;
        dynamicTextElement.classList.add('gradient-text');
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++; setTimeout(typeEffect, 150);
        } else if (isDeleting && charIndex > 0) {
            charIndex--; setTimeout(typeEffect, 100);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) { wordIndex = (wordIndex + 1) % words.length; }
            setTimeout(typeEffect, 1200);
        }
    }
    if (dynamicTextElement) typeEffect();

    // --- Dynamic Background Setup ---
    const canvas = document.getElementById('pcb-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;
        class Particle {
            constructor(x, y, dX, dY, s, c) { this.x=x; this.y=y; this.directionX=dX; this.directionY=dY; this.size=s; this.color=c; }
            draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false); ctx.fillStyle=this.color; ctx.fill(); }
            update() {
                if (this.x>canvas.width||this.x<0) { this.directionX = -this.directionX; }
                if (this.y>canvas.height||this.y<0) { this.directionY = -this.directionY; }
                this.x+=this.directionX; this.y+=this.directionY; this.draw();
            }
        }
        function init() {
            particlesArray = []; let num = (canvas.height * canvas.width) / 15000;
            for (let i=0; i<num; i++) {
                let size=(Math.random()*2)+1; let x=(Math.random()*((innerWidth-size*2)-(size*2))+size*2);
                let y=(Math.random()*((innerHeight-size*2)-(size*2))+size*2);
                let dX=(Math.random()*.4)-.2; let dY=(Math.random()*.4)-.2;
                particlesArray.push(new Particle(x,y,dX,dY,size,'#059669'));
            }
        }
        function connect() {
            let opacity=1;
            for (let a=0; a<particlesArray.length; a++) {
                for (let b=a; b<particlesArray.length; b++) {
                    let dist=((particlesArray[a].x-particlesArray[b].x)*(particlesArray[a].x-particlesArray[b].x))+((particlesArray[a].y-particlesArray[b].y)*(particlesArray[a].y-particlesArray[b].y));
                    if(dist<(canvas.width/7)*(canvas.height/7)) {
                        opacity=1-(dist/20000); ctx.strokeStyle=`rgba(5,150,105,${opacity})`; ctx.lineWidth=1;
                        ctx.beginPath(); ctx.moveTo(particlesArray[a].x,particlesArray[a].y); ctx.lineTo(particlesArray[b].x,particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }
        function animate() {
            requestAnimationFrame(animate); ctx.fillStyle='#111827'; ctx.fillRect(0,0,innerWidth,innerHeight);
            for(let i=0; i<particlesArray.length; i++) { particlesArray[i].update(); } connect();
        }
        window.addEventListener('resize', () => { canvas.width=innerWidth; canvas.height=innerHeight; init(); });
        init(); animate();
    }

    // --- "Who Am I" Section Logic ---
    const whoAmISection = document.getElementById('whoami-section');
    const closeWhoAmIBtn = document.getElementById('whoami-close-btn');
    let isWhoAmIVisible = false; let scrollTriggered = false;
    function showWhoAmI() {
        if (isWhoAmIVisible) return; isWhoAmIVisible = true;
        whoAmISection.classList.add('is-visible'); document.body.classList.add('no-scroll');
    }
    function hideWhoAmI() {
        if (!isWhoAmIVisible) return; isWhoAmIVisible = false;
        whoAmISection.classList.remove('is-visible'); document.body.classList.remove('no-scroll');
        window.scrollTo(0, document.body.scrollHeight - window.innerHeight - 50);
        setTimeout(() => { scrollTriggered = false; }, 1000);
    }
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5 && !isWhoAmIVisible && !scrollTriggered) {
            scrollTriggered = true; showWhoAmI();
        }
    });
    if (closeWhoAmIBtn) closeWhoAmIBtn.addEventListener('click', hideWhoAmI);

    // --- Firebase State & Init ---
    let db, auth;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    async function initFirebase() {
        try {
            const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
            if (!firebaseConfigStr || firebaseConfigStr === '{}') { console.warn("Firebase config not found. Backend features will be disabled."); return; }
            const firebaseConfig = JSON.parse(firebaseConfigStr);
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (initialAuthToken) { await signInWithCustomToken(auth, initialAuthToken); } else { await signInAnonymously(auth); }
        } catch (error) { console.error("Firebase initialization failed:", error); }
    }
    initFirebase();

    // --- Contact Modal Logic ---
    const contactBtn = document.getElementById('contact-btn');
    const contactModalBackdrop = document.getElementById('contact-modal-backdrop');
    const contactModalCloseBtn = document.getElementById('contact-modal-close');
    const contactForm = document.getElementById('contact-form');
    const contactFormContent = document.getElementById('contact-form-content');
    const contactSuccessMessage = document.getElementById('contact-success-message');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    
    function showContactModal() {
        if (contactForm) contactForm.reset();
        if (contactFormContent) contactFormContent.classList.remove('hidden');
        if (contactSuccessMessage) contactSuccessMessage.classList.add('hidden');
        if (contactModalBackdrop) contactModalBackdrop.classList.remove('hidden');
    }
    function hideContactModal() { if (contactModalBackdrop) contactModalBackdrop.classList.add('hidden'); }
    if (contactBtn) contactBtn.addEventListener('click', showContactModal);
    if (contactModalCloseBtn) contactModalCloseBtn.addEventListener('click', hideContactModal);
    if (contactModalBackdrop) contactModalBackdrop.addEventListener('click', (e) => { if (e.target === contactModalBackdrop) hideContactModal(); });
    
    async function saveContactMessage(name, email, message) {
        if (!db) { alert("Database is not connected. Message cannot be sent."); return; }
        try {
            const collectionPath = `artifacts/${appId}/public/data/contact_me`;
            await addDoc(collection(db, collectionPath), { name, email, message, createdAt: serverTimestamp() });
            return true;
        } catch (error) { console.error("Error saving contact message:", error); return false; }
    }
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            contactSubmitBtn.disabled = true; contactSubmitBtn.textContent = 'Sending...';
            const success = await saveContactMessage(contactForm.name.value, contactForm.email.value, contactForm.message.value);
            if (success) {
                contactFormContent.classList.add('hidden');
                contactSuccessMessage.classList.remove('hidden');
            } else { alert('There was an error sending your message. Please try again.'); }
            contactSubmitBtn.disabled = false; contactSubmitBtn.textContent = 'Send Message';
        });
    }

    // --- Info/AI Modal & Gemini API Logic ---
    let conversationContext = [];
    const infoModalBackdrop = document.getElementById('info-modal-backdrop');
    const infoModalCloseBtn = document.getElementById('info-modal-close');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalLoader = document.getElementById('info-modal-loader');
    const infoModalContent = document.getElementById('info-modal-content');
    const aiModalInputContainer = document.getElementById('ai-modal-input-container');
    const followUpInput = document.getElementById('ai-follow-up-input');
    const followUpBtn = document.getElementById('ai-follow-up-btn');
    
    function showInfoModal(title, content) {
        infoModalTitle.textContent = title;
        infoModalContent.innerHTML = content;
        infoModalLoader.classList.add('hidden');
        aiModalInputContainer.classList.add('hidden');
        infoModalBackdrop.classList.remove('hidden');
    }
    function hideInfoModal() {
        infoModalBackdrop.classList.add('hidden');
        if (conversationContext.length > 0) { saveConversation(conversationContext, infoModalTitle.textContent); }
    }
    if (infoModalCloseBtn) infoModalCloseBtn.addEventListener('click', hideInfoModal);
    if (infoModalBackdrop) infoModalBackdrop.addEventListener('click', (event) => { if (event.target === infoModalBackdrop) hideInfoModal(); });
    
    async function saveConversation(history, title) {
        if (!db || !auth.currentUser) { console.warn("Firestore not ready."); return; }
        try {
            const collectionPath = `artifacts/${appId}/public/data/homelab-conversations`;
            await addDoc(collection(db, collectionPath), { title: title, history: history, createdAt: serverTimestamp(), userId: auth.currentUser.uid });
        } catch (error) { console.error("Error saving conversation:", error); }
    }
    function showAiModal(title) {
        infoModalTitle.textContent = title; infoModalContent.innerHTML = '';
        infoModalLoader.classList.remove('hidden'); infoModalBackdrop.classList.remove('hidden');
        aiModalInputContainer.classList.add('hidden'); conversationContext = [];
    }
    async function callGeminiAPI(history, maxRetries = 3) {
        const apiUrl = '/api/ask-gemini'; 
        const payload = { history: history }; 
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const resultText = await response.text();
                return resultText;
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                attempt++;
                if (attempt >= maxRetries) return "Sorry, I couldn't get a response from the AI.";
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    function simpleMarkdownToHtml(text) { return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/## (.*?)\n/g, '<h2>$1</h2>').replace(/# (.*?)\n/g, '<h1>$1</h1>').replace(/^\* (.*?)$/gm, '<ul><li>$1</li></ul>').replace(/<\/ul>\n<ul>/g, '').replace(/\n/g, '<br>'); }
    function appendMessage(text, role) { const d=document.createElement('div'); d.className=`chat-message ${role}`; d.innerHTML=simpleMarkdownToHtml(text); infoModalContent.appendChild(d); infoModalContent.scrollTop=infoModalContent.scrollHeight; }
    
    async function startConversation(initialPrompt, title) {
        showAiModal(title);
        conversationContext.push({ role: "user", parts: [{ text: initialPrompt }] });
        const responseText = await callGeminiAPI(conversationContext);
        conversationContext.push({ role: "model", parts: [{ text: responseText }] });
        infoModalLoader.classList.add('hidden');
        appendMessage(responseText, 'model');
        aiModalInputContainer.classList.remove('hidden');
    }
    async function handleFollowUp() {
        const userText = followUpInput.value.trim(); if (!userText) return;
        appendMessage(userText, 'user'); followUpInput.value = ''; infoModalLoader.classList.remove('hidden');
        conversationContext.push({ role: "user", parts: [{ text: userText }] });
        const responseText = await callGeminiAPI(conversationContext);
        conversationContext.push({ role: "model", parts: [{ text: responseText }] });
        infoModalLoader.classList.add('hidden');
        appendMessage(responseText, 'model');
    }
    if (followUpBtn) followUpBtn.addEventListener('click', handleFollowUp);
    if (followUpInput) followUpInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { handleFollowUp(); } });
    
    const explainBtn = document.getElementById('explain-btn');
    const suggestBtn = document.getElementById('suggest-btn');
    const securityBtn = document.getElementById('security-btn');
    function getServices() {
        const serviceNames = [];
        document.querySelectorAll('#services .flip-card h4').forEach(h4 => serviceNames.push(h4.textContent.trim()));
        return serviceNames;
    }
    if (explainBtn) explainBtn.addEventListener('click', () => {
        let hardwareInfo = "Hardware:\n";
        document.querySelectorAll('#hardware .card').forEach(card => {
            const title = card.querySelector('h3').textContent.trim(); hardwareInfo += `- ${title}:\n`;
            card.querySelectorAll('li').forEach(li => { hardwareInfo += `  - ${li.textContent.trim()}\n`; });
        });
        const serviceInfo = "\nSelf-Hosted Services:\n" + getServices().join(', ') + ".";
        const prompt = `You are a helpful IT expert explaining a homelab setup to a non-technical person... \n\n${hardwareInfo}\n${serviceInfo}`;
        startConversation(prompt, '✨ Explaining The Homelab...');
    });
    if (suggestBtn) suggestBtn.addEventListener('click', () => {
        const prompt = `I am a homelab enthusiast currently self-hosting...: ${getServices().join(', ')}. Please suggest 3 to 5 new projects...`;
        startConversation(prompt, '✨ Suggesting New Projects...');
    });
    if (securityBtn) securityBtn.addEventListener('click', () => {
        const prompt = `Act as a helpful cybersecurity expert... My lab runs: ${getServices().join(', ')}. Please provide a few high-level security best practices...`;
        startConversation(prompt, '✨ Running Quick Security Check...');
    });
    
    // --- Interactive Network Diagram ---
    const diagramToggleBtn = document.getElementById('diagram-toggle-btn');
    const interactiveDiagramView = document.getElementById('network-diagram-container');
    const staticDiagramView = document.getElementById('static-diagram-image');
    const diagramSubtitle = document.getElementById('diagram-subtitle');
    const arrowRightIcon = document.getElementById('arrow-right-icon');
    const arrowLeftIcon = document.getElementById('arrow-left-icon');
    let isStaticDiagramVisible = false;

    if (diagramToggleBtn) {
        diagramToggleBtn.addEventListener('click', () => {
            isStaticDiagramVisible = !isStaticDiagramVisible;
            if (isStaticDiagramVisible) {
                interactiveDiagramView.classList.add('opacity-0', 'pointer-events-none');
                staticDiagramView.classList.remove('opacity-0', 'pointer-events-none');
                diagramSubtitle.textContent = 'A static diagram of the network topology from Draw.io.';
                arrowRightIcon.classList.add('hidden');
                arrowLeftIcon.classList.remove('hidden');
                diagramToggleBtn.title = "Show Interactive Diagram";
            } else {
                interactiveDiagramView.classList.remove('opacity-0', 'pointer-events-none');
                staticDiagramView.classList.add('opacity-0', 'pointer-events-none');
                diagramSubtitle.textContent = 'Click and drag to pan, use the scroll wheel to zoom, and click on any node for more info.';
                arrowRightIcon.classList.remove('hidden');
                arrowLeftIcon.classList.add('hidden');
                diagramToggleBtn.title = "Show Static Diagram";
            }
        });
    }

    function initializeNetworkDiagram() {
        const container = document.getElementById('network-diagram-container');
        if (!container) return;
        const icon = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        const nodes = new vis.DataSet([
            { id: 'internet', label: 'Internet', shape: 'image', image: icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 12H18c-.7 0-1.3-.3-1.7-.8s-.6-1.1-.6-1.7V6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2zM12 12H2.5c.7 0 1.3.3 1.7.8s.6 1.1.6 1.7V18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2z"/></svg>'), description: '<h3>The Internet</h3><p>The source of all external traffic to the homelab. Everything starts here.</p>' },
            { id: 'firewall', label: 'OPNsense\nFirewall', shape: 'box', color: '#c0392b', font: { color: '#fff'}, description: '<h3>OPNsense Firewall</h3><p>Running on a Datto Alto 3, this is the primary security gateway. It inspects all incoming and outgoing traffic, manages network rules, and runs the CrowdSec Intrusion Prevention System.</p>' },
            { id: 'router', label: 'Nighthawk\nMesh WiFi', shape: 'image', image: icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l3 3m-3-3l-3 3M19 12v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3"/><path d="M12 19v-3"/></svg>'), description: '<h3>Nighthawk Mesh WiFi 6</h3><p>The primary access point (MR60) and satellite (MS60) provide high-speed wireless coverage for all devices on the network.</p>' },
            { id: 'gaming-rig', label: 'Gaming & AI Rig', shape: 'image', image: icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'), description: '<h3>Gaming & AI Rig</h3><p>My primary workstation for gaming, development, and running local AI models. It also serves as the Active Directory Controller for the Windows machines on the network.</p>' },
            { id: 'primary-server', label: 'Primary Server', shape: 'image', image: icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>'), description: '<h3>Primary Server (HP ProDesk)</h3><p>A small form factor PC running Ubuntu LTS. This is the main workhorse, hosting the majority of the self-hosted Docker services.</p>' },
            { id: 'headless-node', label: 'Headless Node', shape: 'image', image: icon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l-2 5H6l-2-5"/></svg>'), description: '<h3>Headless Node (Acer Laptop)</h3><p>A converted headless laptop with custom cooling running Ubuntu LTS. It serves as a secondary node for hosting services, providing redundancy and load distribution.</p>' },
            { id: 'services', label: 'Self-Hosted\nServices', shape: 'database', color: '#16a085', font: {color: '#fff'}, description: '<h3>Self-Hosted Services</h3><p>This represents the suite of applications (like Jellyfin, Home Assistant, etc.) running in Docker containers across the Primary Server and Headless Node.</p>' },
        ]);
        const edges = new vis.DataSet([
            { from: 'internet', to: 'firewall', arrows: 'to' },
            { from: 'firewall', to: 'router', arrows: 'to' },
            { from: 'router', to: 'gaming-rig', arrows: 'to, from' },
            { from: 'router', to: 'primary-server', arrows: 'to, from' },
            { from: 'router', to: 'headless-node', arrows: 'to, from' },
            { from: 'primary-server', to: 'services', arrows: 'to' },
            { from: 'headless-node', to: 'services', arrows: 'to' },
        ]);
        const data = { nodes: nodes, edges: edges };
        const options = {
            nodes: { borderWidth: 2, font: { color: '#d1d5db', size: 14 }, shapeProperties: { interpolation: false } },
            edges: { color: { color: '#374151', highlight: '#4f46e5' }, width: 2 },
            physics: { stabilization: false, barnesHut: { gravitationalConstant: -80000, springConstant: 0.001, springLength: 200 } },
            interaction: { tooltipDelay: 200, hideEdgesOnDrag: true },
        };
        const network = new vis.Network(container, data, options);
        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = nodes.get(nodeId);
                showInfoModal(node.label.replace('\n', ' '), node.description);
            }
        });
    }
    initializeNetworkDiagram();
});
