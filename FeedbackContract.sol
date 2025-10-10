// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeedbackContract {

    // CHANGE: The struct now stores a single pre-formatted string array.
    struct Feedback {
        address student;
        string facultyName;
        uint8 semester;
        string[10] feedbackEntries; // Will store "Question -> Rating" strings
        string reviewText;
        uint8 averageRatingX10;
        uint256 timestamp;
    }

    function getQuestions() public pure returns (string[10] memory) {
        return [
            "Clarity of explanations", "Knowledge of subject matter", "Pace of teaching",
            "Engagement and interaction", "Encouragement of questions", "Quality of assignments",
            "Timely feedback on work", "Availability outside class hours",
            "Use of practical examples", "Overall teaching effectiveness"
        ];
    }

    Feedback[] public allFeedback;
    mapping (bytes32 => bool) private submitted;
    
    // CHANGE: The event now emits the single formatted string array.
    event FeedbackSubmitted(
        address indexed student,
        uint256 timestamp,
        string facultyName,
        uint8 semester,
        uint8 averageRatingx10,
        string reviewText,
        string[10] feedbackEntries
    );

    function submitFeedback(
        string calldata _facultyName,
        uint8 _semester,
        uint8[10] calldata _ratings,
        string calldata _reviewText
    ) public {
        // Validation for inputs
        require(_semester > 0 && _semester <= 8, "Invalid semester");
        for (uint i = 0; i < _ratings.length; i++) {
            require(_ratings[i] >= 1 && _ratings[i] <= 5, "Invalid rating");
        }
        
        // On-chain average calculation
        uint sum = 0;
        for (uint i2 = 0; i2 < _ratings.length; i2++) {
            sum += _ratings[i2];
        }
        uint8 avgX10 = uint8((sum * 10) / _ratings.length);

        // Duplicate submission check
        bytes32 key = keccak256(abi.encodePacked(msg.sender, _facultyName, _semester));
        require(!submitted[key], "Student has already submitted Feedback before.");
        submitted[key] = true;  

        // CHANGE: Build the formatted string array on-chain
        string[10] memory questions = getQuestions();
        string[10] memory feedbackEntries;
        for (uint i3 = 0; i3 < questions.length; i3++) {
            feedbackEntries[i3] = string(abi.encodePacked(
                questions[i3],
                " -> ",
                uintToString(_ratings[i3])
            ));
        }

        // Store the newly created formatted array
        allFeedback.push(Feedback({
            student: msg.sender,
            facultyName: _facultyName,
            semester: _semester,
            feedbackEntries: feedbackEntries,
            reviewText: _reviewText,
            averageRatingX10: avgX10,
            timestamp: block.timestamp
        }));

        // Emit the formatted array in the event log
        emit FeedbackSubmitted(msg.sender, block.timestamp, _facultyName, _semester, avgX10, _reviewText, feedbackEntries);
    }
    
    // Helper function to convert a uint (1-5) to a string.
    function uintToString(uint8 value) private pure returns (string memory) {
        if (value == 1) return "1";
        if (value == 2) return "2";
        if (value == 3) return "3";
        if (value == 4) return "4";
        if (value == 5) return "5";
        return "";
    }

    function hasSubmitted(address _student, string calldata _facultyName, uint8 _semester) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(_student, _facultyName, _semester));
        return submitted[key];
    }
}
