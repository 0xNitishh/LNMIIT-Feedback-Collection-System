document.addEventListener('DOMContentLoaded', () => {
    // Clear all stored ratings when new session starts
    const sessionStartTime = sessionStorage.getItem('sessionStartTime');
    const currentTime = Date.now();
    
    // If no session start time or session is older than 24 hours, clear all ratings
    if (!sessionStartTime || (currentTime - parseInt(sessionStartTime)) > 24 * 60 * 60 * 1000) {
        // Clear all localStorage keys that start with 'avg_q_'
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('avg_q_')) {
                localStorage.removeItem(key);
            }
        });
        sessionStorage.setItem('sessionStartTime', currentTime.toString());
    }

    // --- Blockchain Configuration ---
    // This address and ABI should come from your Remix deployment
    // --- Blockchain Configuration ---
    // This address and ABI should come from your Remix deployment
    const contractAddress = "0xf71d5ae8ba816c75cb2016ff4c4c59e079f38f7d"; 
    //const contractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "student", "type": "address" }, { "indexed": false, "internalType": "string", "name": "facultyName", "type": "string" }, { "indexed": true, "internalType": "uint8", "name": "semester", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "FeedbackSubmitted", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "allFeedback", "outputs": [ { "internalType": "address", "name": "student", "type": "address" }, { "internalType": "string", "name": "facultyName", "type": "string" }, { "internalType": "uint8", "name": "semester", "type": "uint8" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_facultyName", "type": "string" }, { "internalType": "uint8", "name": "_semester", "type": "uint8" }, { "internalType": "uint8[10]", "name": "_ratings", "type": "uint8[10]" } ], "name": "submitFeedback", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
    const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "facultyName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "semester",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "averageRatingx10",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string[10]",
				"name": "feedbackEntries",
				"type": "string[10]"
			}
		],
		"name": "FeedbackSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allFeedback",
		"outputs": [
			{
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "facultyName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "semester",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "averageRatingX10",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getQuestions",
		"outputs": [
			{
				"internalType": "string[10]",
				"name": "",
				"type": "string[10]"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_student",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_facultyName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_semester",
				"type": "uint8"
			}
		],
		"name": "hasSubmitted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_facultyName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_semester",
				"type": "uint8"
			},
			{
				"internalType": "uint8[10]",
				"name": "_ratings",
				"type": "uint8[10]"
			},
			{
				"internalType": "string",
				"name": "_reviewText",
				"type": "string"
			}
		],
		"name": "submitFeedback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
    // Page detection logic
    const isIndexPage = document.querySelector('.main-content') !== null;
    const isFeedbackPage = document.querySelector('.feedback-container') !== null;
    const isSuccessPage = document.querySelector('.success-container') !== null;

    let connectedAccount = sessionStorage.getItem('walletAddress');

    // --- LOGIC FOR INDEX PAGE (index.html) ---
    if (isIndexPage) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const feedbackBtn = document.getElementById('provide-feedback-btn');
        const updateConnectButton = () => { if (connectedAccount) { connectBtn.textContent = `Disconnect ${connectedAccount.substring(0, 6)}...${connectedAccount.substring(connectedAccount.length - 4)}`; } else { connectBtn.textContent = 'Connect Wallet'; } };
        const handleConnectWallet = async () => { if (connectedAccount) { connectedAccount = null; sessionStorage.removeItem('walletAddress'); alert('Wallet disconnected.'); updateConnectButton(); } else { if (typeof window.ethereum !== 'undefined') { try { const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); connectedAccount = accounts[0]; sessionStorage.setItem('walletAddress', connectedAccount); alert(`Wallet connected: ${connectedAccount}`); updateConnectButton(); } catch (error) { console.error('User rejected request:', error); alert('You rejected the connection request.'); } } else { alert('MetaMask is not installed.'); } } };
        const handleProvideFeedback = () => { if (connectedAccount) { window.location.href = 'feedback.html'; } else { alert('Please connect your wallet first.'); } };
        connectBtn.addEventListener('click', handleConnectWallet);
        feedbackBtn.addEventListener('click', handleProvideFeedback);
        updateConnectButton();
    }

    // --- LOGIC FOR FEEDBACK PAGE (feedback.html) ---
    if (isFeedbackPage) {
        if (!connectedAccount) { alert('No wallet connected. Redirecting home.'); window.location.href = 'index.html'; return; }
        document.getElementById('wallet-display').textContent = `${connectedAccount.substring(0, 6)}...${connectedAccount.substring(connectedAccount.length - 4)}`;
        
        const semesterSelect = document.getElementById('semester-select');
        const facultySelect = document.getElementById('faculty-select');
        const facultyData = { "1": ["Dr. Sandeep Saini", "Dr. Amit Neogi", "Dr. Anukriti Bansal", "Dr. Ajit Patel", "Dr. Usha Kanoongo"], "2": ["Prof. Mukesh Jadon", "Dr. Anugrah Jain", "Dr. Indra Deep Mastan", "Dr. Sandeep Singh Shekhawat", "Dr. Ratan Kumar Giri", "Dr. Karni Pal Bhati", "Dr. Payel Pal"], "3": ["Dr. Nirmal Kumar Sivaraman", "Dr. Preety Singh", "Dr. Ajit Patel", "Dr. Divya Bairathi"], "4": ["Dr. Rajbir Kaur", "Dr. Ashish Kumar Dwivedi", "Dr. Poulami Dalapati", "Dr. Ashish Mishra", "Dr. Anu Malik", "Dr. Poonam Gera"], "5": ["Dr. Saurabh Kumar", "Dr. Mohit Gupta", "Dr. Ashish Kumar Dwivedi", "Dr. Subrat Kumar Dash", "Dr. Vikas Bajpai", "Dr. Md. Imran Alam", "Dr. Aloke Dutta"], "6": ["Dr. Mohit Gupta", "Dr. Saurabh Kumar", "Dr. Raghuveer Singh Charan", "Dr. Nirmal Sivaraman", "Dr. Aloke Dutta"], "7": ["Dr. Vikas Bajpai", "Dr. Atika Srivastava", "Dr. Vikram Sharma", "Dr. Mohit Gupta"] };
        semesterSelect.addEventListener('change', (e) => { const semester = e.target.value; facultySelect.innerHTML = '<option value="" disabled selected>Select faculty</option>'; const faculties = facultyData[semester] || []; faculties.forEach(name => { facultySelect.innerHTML += `<option value="${name}">${name}</option>`; }); });

        const questionsContainer = document.querySelector('.form-questions');
        const averageRatingInput = document.getElementById('average-rating');
        const totalQuestions = 10;
        const questions = ["Clarity of explanations", "Knowledge of subject matter", "Pace of teaching", "Engagement and interaction", "Encouragement of questions", "Quality of assignments", "Timely feedback on work", "Availability outside class hours", "Use of practical examples", "Overall teaching effectiveness"];
        let ratings = {};

        const calculateAverage = () => {
            const filledRatings = Object.values(ratings);
            if (filledRatings.length === 0) {
                averageRatingInput.value = '0.0/5.0';
                return;
            }
            const sum = filledRatings.reduce((total, current) => total + parseInt(current, 10), 0);
            const average = sum / totalQuestions;
            averageRatingInput.value = `${average.toFixed(1)}/5.0`;
        };

        for (let i = 1; i <= totalQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            let ratingHTML = '';
            for (let j = 1; j <= 5; j++) {
                ratingHTML += `<input type="radio" id="q${i}-r${j}" name="q${i}" value="${j}" required><label for="q${i}-r${j}">${j}</label>`;
            }
            questionDiv.innerHTML = `<p>${i}. ${questions[i-1]}</p><div class="rating-group">${ratingHTML}</div>`;
            questionsContainer.appendChild(questionDiv);
        }
        
        questionsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                ratings[e.target.name] = e.target.value;
                calculateAverage();
            }
        });

        const reviewTextarea = document.getElementById('additional-review');
        const wordCounter = document.getElementById('word-counter');
        const maxWords = 500;
        reviewTextarea.addEventListener('input', () => {
            const text = reviewTextarea.value.trim();
            const words = text === '' ? 0 : text.split(/\s+/).length;
            wordCounter.textContent = `${words} / ${maxWords} words`;
            if (words > maxWords) { wordCounter.classList.add('limit-exceeded'); } else { wordCounter.classList.remove('limit-exceeded'); }
        });

        const form = document.getElementById('feedback-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (Object.keys(ratings).length !== totalQuestions) { alert('Please answer all 10 feedback questions.'); return; }
            const formData = new FormData(e.target);
            if (!formData.get('faculty')) { alert('Please select a faculty.'); return; }

            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const network = await provider.getNetwork();
                if (network.chainId !== 11155111) { throw new Error("Please switch to the Sepolia testnet in MetaMask."); }

                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                const facultyName = formData.get('faculty');
                const semester = parseInt(formData.get('semester'));
                const reviewText = document.getElementById('additional-review').value;
                const averageString = averageRatingInput.value.split('/')[0];
                const average = parseFloat(averageString);
                const averageRatingX10 = Math.round(average * 10);
                const ratingsArray = Array.from({ length: 10 }, (_, i) => parseInt(ratings[`q${i + 1}`]));
                
                // Pre-check duplicate submission for same (student, faculty, semester)
                const studentAddr = await signer.getAddress();
                const already = await contract.hasSubmitted(studentAddr, facultyName, semester);
                if (already) {
                    throw new Error('You have already submitted feedback for this faculty and semester.');
                }
                

                const tx = await contract.submitFeedback(facultyName, semester, ratingsArray, reviewText);
                const receipt = await tx.wait();

                sessionStorage.setItem('txHash', receipt.transactionHash);
                
                sessionStorage.setItem('submittedRatings', JSON.stringify(ratingsArray));
                sessionStorage.setItem('submittedFaculty', String(facultyName));
                sessionStorage.setItem('submittedSemester', String(semester));
                window.location.href = 'success.html';

            } catch (error) {
                console.error("Transaction failed:", error);
                alert(`Submission failed: ${error.message || "User rejected the transaction."}`);
                submitBtn.textContent = 'Submit';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    // --- LOGIC FOR SUCCESS PAGE (success.html) ---
    if (isSuccessPage) {
        const txHash = sessionStorage.getItem('txHash');
        if (!txHash) { window.location.href = 'index.html'; return; }
        const txHashText = document.getElementById('tx-hash-text');
        const txHashLink = document.getElementById('tx-hash-link');
        txHashText.textContent = txHash;
        txHashLink.href = `https://sepolia.etherscan.io/tx/${txHash}`;

        // Per-question average graph logic (previous + current) per faculty & semester
        const ratingsArray = JSON.parse(sessionStorage.getItem('submittedRatings') || 'null');
        const facultyName = sessionStorage.getItem('submittedFaculty') || '';
        const semesterStr = sessionStorage.getItem('submittedSemester') || '';
        if (Array.isArray(ratingsArray) && ratingsArray.length === 10 && facultyName && semesterStr) {
            const key = `avg_q_${semesterStr}_${facultyName}`;
            const previousData = JSON.parse(localStorage.getItem(key) || 'null');

            // current ratings are per question already
            let blendedPerQuestion = ratingsArray.map(n => Number(n || 0));
            let newCount = 1;

            if (previousData && Array.isArray(previousData.averages) && previousData.averages.length === 10 && typeof previousData.count === 'number' && previousData.count > 0) {
                newCount = previousData.count + 1;
                blendedPerQuestion = blendedPerQuestion.map((current, idx) => {
                    const prevAvg = Number(previousData.averages[idx] || 0);
                    return ((prevAvg * previousData.count) + current) / newCount;
                });
            }

            localStorage.setItem(key, JSON.stringify({ averages: blendedPerQuestion, count: newCount }));

            const barGraphDiv = document.getElementById('rating-bar-graph');
            barGraphDiv.style.display = 'block';
            const ctx = document.getElementById('barGraphCanvas').getContext('2d');
            const questions = [
                "Clarity",
                "Knowledge",
                "Pace",
                "Engagement",
                "Encourage Qs",
                "Assignments",
                "Timely feedback",
                "Availability",
                "Practical examples",
                "Overall"
            ];
            const title = `Average rating per question for ${facultyName} (Sem ${semesterStr})`;
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: questions,
                    datasets: [{
                        label: 'Average (1-5)',
                        data: blendedPerQuestion.map(v => Number(v.toFixed(2))),
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            title: { display: true, text: 'Rating (1-5)' }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: title }
                    }
                }
            });
        }

        // Logout button functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Clear session storage
                sessionStorage.removeItem('walletAddress');
                sessionStorage.removeItem('txHash');
                sessionStorage.removeItem('submittedRatings');
                sessionStorage.removeItem('submittedFaculty');
                sessionStorage.removeItem('submittedSemester');
                
                // Redirect to home page
                window.location.href = 'index.html';
            });
        }
    }
});
