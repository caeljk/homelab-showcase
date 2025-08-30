# My Homelab Showcase

Welcome to **My Homelab Showcase**!  
This project is a personal portfolio and interactive playground for showcasing my home lab hardware, network setup, and self-hosted services. It features a modern UI built with Tailwind CSS, interactive diagrams, and AI-powered insights.

---

## 🚀 Features

- **Dynamic Typing Header:** Animated title with gradient text.
- **Custom PCB Background:** Canvas-based animated background for a techy aesthetic.
- **Hardware Rack Section:** Detailed cards showing the specs and roles of each device in my rack.
- **Homelab Insights (AI):**  
  - **Explain My Setup:** Get a plain-English explanation of the homelab hardware and services.
  - **Suggest New Projects:** AI-powered suggestions for future homelab projects.
  - **Security Check:** Quick security best practices tailored to your setup.
- **Self-Hosted Services:** Flip cards featuring logos and descriptions of each service running in the homelab.
- **Interactive Network Diagram:** Pan, zoom, and click nodes to learn more about the network topology.
- **Contact & About Me:** Modal form to get in touch; scroll-triggered "About Me" section for personal background.
- **Firebase Integration:** Contact form and AI conversation history stored securely (requires backend config).

---

## 🖥️ Demo

You can see a live demo (if hosted): [Demo Link](#)  
Or, clone and run locally:

```bash
git clone https://github.com/caeljk/homelab-showcase.git
cd homelab-showcase
# Open index.html in your browser
```

---

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/caeljk/homelab-showcase.git
   ```

2. **Open `index.html` in your browser.**

3. **Firebase Setup (Optional):**
   - If you want contact form submissions and conversation history to work, set up a Firebase project and configure your API keys.
   - Add your config to the deployment environment or inject via a global JS variable.

4. **AI Backend (Optional):**
   - The AI features use a Gemini API endpoint (`/ask-gemini`).  
   - You’ll need to host a backend that proxies requests to Gemini or your chosen LLM.

---

## 📦 Technologies Used

- [Tailwind CSS](https://tailwindcss.com/)  
- [Vis.js](https://visjs.org/)  
- [Firebase](https://firebase.google.com/) (Firestore, Auth)  
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter)  
- [Gemini API](https://ai.google.dev/) (for AI features)  
- Vanilla JS / ES Modules

---

## 🤖 AI Features

- **Gemini-powered chat** for explanations, suggestions, and security tips.
- Conversation context is stored in Firestore (if enabled).
- Backend endpoint: `/ask-gemini` (see [api.caeljk.duckdns.org](https://api.caeljk.duckdns.org/ask-gemini) in code).

---

## 📡 Network Diagram

- Interactive and static views.
- Click nodes for more info.
- Easily extendable for more devices or services.

---

## 📝 Contact

Use the contact button at the top right or scroll to the bottom and fill out the modal form.

---

## 👨‍💻 About Me

- Lifelong learner, IT enthusiast, and self-hosting geek.
- Currently studying Master of Information Technology (Software Development).
- Certified Azure Developer Associate.

---

## 💡 Contributing

Pull requests, suggestions, or issue reports are very welcome!  
Feel free to submit improvements, new features, or bug fixes.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 👀 Screenshots

| Interactive Network Diagram | Hardware Rack Section | Self-hosted Service Cards |
|----------------------------|----------------------|--------------------------|
| ![Network Diagram](docs/screenshots/network-diagram.png) | ![Hardware Rack](docs/screenshots/hardware-rack.png) | ![Services](docs/screenshots/services.png) |

---

## 🗂️ File Structure

```
homelab-showcase/
├── index.html
├── README.md
├── LICENSE
├── docs/
│   └── screenshots/
│       ├── network-diagram.png
│       ├── hardware-rack.png
│       └── services.png
```

---

## 🙏 Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Vis.js](https://visjs.org/)
- [Google Gemini](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)
- [SVGRepo](https://www.svgrepo.com/) and [WorldVectorLogo](https://worldvectorlogo.com/) for service icons.

---

**Made by [caeljk](https://github.com/caeljk)**
