document.addEventListener('DOMContentLoaded', () => {
    // --- Blockchain Configuration ---
    // This address and ABI should come from your Remix deployment
    const contractAddress = "0x8584608b394aacd7e59e38ac40e2946638af9ac3"; 
    const contractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "student", "type": "address" }, { "indexed": false, "internalType": "string", "name": "facultyName", "type": "string" }, { "indexed": true, "internalType": "uint8", "name": "semester", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "FeedbackSubmitted", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "allFeedback", "outputs": [ { "internalType": "address", "name": "student", "type": "address" }, { "internalType": "string", "name": "facultyName", "type": "string" }, { "internalType": "uint8", "name": "semester", "type": "uint8" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_facultyName", "type": "string" }, { "internalType": "uint8", "name": "_semester", "type": "uint8" }, { "internalType": "uint8[10]", "name": "_ratings", "type": "uint8[10]" } ], "name": "submitFeedback", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

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

        const form = document.getElementById('feedback-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (Object.keys(ratings).length !== totalQuestions) { alert('Please answer all 10 feedback questions.'); return; }
            const formData = new FormData(e.target);
            if (!formData.get('faculty')) { alert('Please select a faculty.'); return; }

            const reviewTextarea = document.getElementById('additional-review');
            const wordCounter = document.getElementById('word-counter');
            const maxWords = 500;

            reviewTextarea.addEventListener('input', () => {
               const text = reviewTextarea.value.trim();
              const words = text === '' ? 0 : text.split(/\s+/).length;
              wordCounter.textContent = `${words} / ${maxWords} words`;

              if (words > maxWords) {
                   wordCounter.classList.add('limit-exceeded');
               } else {
                   wordCounter.classList.remove('limit-exceeded');
               }
            });

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
                const ratingsArray = Array.from({ length: 10 }, (_, i) => parseInt(ratings[`q${i + 1}`]));

                // ADD THIS LINE to get the review text
                const reviewText = document.getElementById('additional-review').value;

                // UPDATE THE CONTRACT CALL to include reviewText
                // Note: Your contract's ABI in this file must be updated to reflect this new parameter
                const tx = await contract.submitFeedback(facultyName, semester, ratingsArray, reviewText);
                
                const receipt = await tx.wait();

                sessionStorage.setItem('txHash', receipt.transactionHash);
                sessionStorage.setItem('submittedRatings', JSON.stringify(ratingsArray));
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

        // Bar graph logic
        const ratingsArray = JSON.parse(sessionStorage.getItem('submittedRatings') || 'null');
        if (Array.isArray(ratingsArray) && ratingsArray.length === 10) {
            const barGraphDiv = document.getElementById('rating-bar-graph');
            barGraphDiv.style.display = 'block';
            const ctx = document.getElementById('barGraphCanvas').getContext('2d');
            const questions = [
                "Clarity of explanations",
                "Knowledge of subject matter",
                "Pace of teaching",
                "Engagement and interaction",
                "Encouragement of questions",
                "Quality of assignments",
                "Timely feedback on work",
                "Availability outside class hours",
                "Use of practical examples",
                "Overall teaching effectiveness"
            ];
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: questions,
                    datasets: [{
                        label: 'Your Ratings',
                        data: ratingsArray,
                        backgroundColor: 'rgba(75,192,192,0.7)',
                        borderColor: 'rgba(75,192,192,1)',
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
                        title: { display: false }
                    }
                }
            });
        }
    }
});
